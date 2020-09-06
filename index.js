require("dotenv").config();

const fetch = require("node-fetch");
const colors = require("colors");
const glicko2 = require("glicko2");
const {
	Parser,
} = require("json2csv");
const fs = require("fs");

const minMatchesPerPlayer = parseInt(process.env.MIN_MATCHES_PER_PLAYER, 10) || 10;
const matchCountBeforeRankUp = parseInt(process.env.MATCH_COUNT_BEFORE_RANKING_UPDATE, 10) || 20;
const includeLink = parseInt(process.env.INCLUDE_LINK, 10) || 0;

const url = "http://seekr.pw/distance-log/changelist.json";
const settings = {
	tau: parseInt(process.env.DEFAULT_GLICKO_TAU, 10) || 0.5,
	rating: parseInt(process.env.DEFAULT_GLICKO_RATING, 10) || 1500,
	rd: parseInt(process.env.DEFAULT_GLICKO_RATING_DEVIATION, 10) || 200,
	vol: parseInt(process.env.DEFAULT_GLICKO_VOLATILITY, 10) || 0.06,
};
const ranking = new glicko2.Glicko2(settings);

async function getSteamUsers(steamids) {
	if (!process.env.STEAM_API_KEY) {
		throw new Error("No Steam API key provided.");
	}
	const params = new URLSearchParams({
		steamids: steamids.join(","),
	});
	const options = {
		headers: {
			"cache-control": "no-cache",
			"Content-Type": "application/x-www-form-urlencoded",
			"x-webapi-key": process.env.STEAM_API_KEY,
		},
		form: false,
	};
	try {
		const getPlayerSummaries = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?${params}`;
		console.log(`Fetching Steam users: ${colors.green(getPlayerSummaries)}`);
		const res = await fetch(getPlayerSummaries, options);
		const data = await res.json();
		return data.response.players;
	} catch (e) {
		throw Error(e);
	}
}

async function getEntries() {
	try {
		return await fetch(url).then(async res => res.json());
	} catch (e) {
		throw Error(e);
	}
}

function removePlayersWithFewMatches(entries, minAmount = minMatchesPerPlayer) {
	const {
		length,
	} = entries;

	// get toal amount of matches for each steamid
	const numMatchesPerPlayer = {};
	for (const entry of entries) {
		if (entry.steam_id_old_recordholder && !numMatchesPerPlayer[entry.steam_id_old_recordholder]) {
			numMatchesPerPlayer[entry.steam_id_old_recordholder] = 1;
		} else {
			numMatchesPerPlayer[entry.steam_id_old_recordholder] += 1;
		}
		if (entry.steam_id_new_recordholder && !numMatchesPerPlayer[entry.steam_id_new_recordholder]) {
			numMatchesPerPlayer[entry.steam_id_new_recordholder] = 1;
		} else {
			numMatchesPerPlayer[entry.steam_id_new_recordholder] += 1;
		}
	}

	// filter out results where players have < `minAmount` matches
	for (let i = entries.length - 1; i >= 0; i -= 1) {
		const entry = entries[i];
		const oldMatches = numMatchesPerPlayer[entry.steam_id_old_recordholder];
		const newMatches = numMatchesPerPlayer[entry.steam_id_new_recordholder];
		if (oldMatches < minAmount || newMatches < minAmount) {
			entries.splice(i, 1);
		}
	}

	if (length > entries.length) {
		return removePlayersWithFewMatches(entries, minAmount);
	}
	return entries;
}

async function createRatings(entries) {
	// make players
	const players = [];
	const playerIDs = [];
	const matches = [];
	for (let i = 0; i < entries.length; i += 1) {
		const entry = entries[i];
		if (entry.steam_id_old_recordholder && !playerIDs.includes(entry.steam_id_old_recordholder)) {
			playerIDs.push(entry.steam_id_old_recordholder);
			const player = ranking.makePlayer();
			players.push({
				steamID: entry.steam_id_old_recordholder,
				player,
			});
		}
		if (entry.steam_id_new_recordholder && !playerIDs.includes(entry.steam_id_new_recordholder)) {
			playerIDs.push(entry.steam_id_new_recordholder);
			const player = ranking.makePlayer();
			players.push({
				steamID: entry.steam_id_new_recordholder,
				player,
			});
		}
		if (entry.steam_id_old_recordholder && entry.steam_id_new_recordholder) {
			const oldWRHolder = players.find(p => p.steamID === entry.steam_id_old_recordholder).player;
			const newWRHolder = players.find(p => p.steamID === entry.steam_id_new_recordholder).player;
			matches.push([newWRHolder, oldWRHolder, 1]);
		}
		if (i % matchCountBeforeRankUp === 0) {
			ranking.updateRatings(matches);
		}
	}
	ranking.updateRatings(matches);
	return players;
}

async function printRatings(players) {
	console.log(players.length);
	const sortedPlayers = players.sort((a, b) => b.player.getRating() - a.player.getRating());
	const ratingLines = [];
	while (sortedPlayers.length > 0) {
		const top100 = sortedPlayers.splice(0, 100);
		const steamIDs = top100.map(player => player.steamID);
		const steamUsers = await getSteamUsers(steamIDs);
		for (const player of top100) {
			const steamUser = steamUsers.find(user => user.steamid === player.steamID);
			const steamName = steamUser.personaname;
			const link = `=HYPERLINK("https://steamcommunity.com/profiles/${player.steamID}", "${steamName}")`;
			const name = (includeLink === 1) ? link : steamName;
			ratingLines.push({
				name,
				steamID: player.steamID,
				rating: player.player.getRating(),
			});
		}
	}
	// console.table(ratingLines);

	const fields = [{
		label: "Steam Name",
		value: "name",
	}, {
		label: "SteamID",
		value: "steamID",
	}, {
		label: "Glicko2 Rating",
		value: "rating",
	}];

	const json2csvParser = new Parser({
		fields,
	});
	const csv = json2csvParser.parse(ratingLines);
	await new Promise((resolve, reject) => {
		fs.writeFile("ratings.csv", csv, (err) => {
			if (err) {
				reject(err);
			}
			console.log("wrote file");
			resolve();
		});
	});
}

async function filterEntries() {
	const allEntries = await getEntries();
	allEntries.filter(e => e.mode === "Sprint" && e.steam_id_old_recordholder !== e.steam_id_new_recordholder);
	return removePlayersWithFewMatches(allEntries, minMatchesPerPlayer);
}

async function main() {
	const entries = await filterEntries();
	const players = await createRatings(entries);
	await printRatings(players);
}

main();
