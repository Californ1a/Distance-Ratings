async function printRatings({
	getSteamUsers,
	fs,
	Parser,
}, players, includeLink = 0) {
	console.log(players.length);
	const sortedPlayers = players.sort((a, b) => b.player.getRating() - a.player.getRating());
	const ratingLines = [];
	while (sortedPlayers.length > 0) {
		const top100 = sortedPlayers.splice(0, 100);
		const steamIDs = top100.map(player => player.steamID);
		const steamUsers = await getSteamUsers(steamIDs); // eslint-disable-line no-await-in-loop
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
	try {
		await fs.writeFile("ratings.csv", csv);
	} catch (e) {
		throw Error(e);
	}
}

module.exports = deps => (players, includeLink) => printRatings(deps, players, includeLink);
