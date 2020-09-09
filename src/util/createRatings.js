function addPlayer(players, playerIDs, steamID, glicko, defaultRating) {
	playerIDs.push(steamID);
	const glickoPlayer = glicko.makePlayer();
	const eloPlayer = defaultRating || 1500;
	players.push({
		steamID,
		glicko: glickoPlayer,
		elo: eloPlayer,
	});
	return [players, playerIDs];
}

function createRatings({
	glicko,
	elo,
	defaultRating,
}, entries, matchCountBeforeRankUp = 20) {
	// make players
	let players = [];
	let playerIDs = [];
	const matches = [];
	for (let i = 0; i < entries.length; i += 1) {
		const entry = entries[i];
		let addPlayers = [];
		const oldHolderID = entry.steam_id_old_recordholder;
		const newHolderID = entry.steam_id_new_recordholder;
		if (oldHolderID && !playerIDs.includes(oldHolderID)) {
			addPlayers.push(oldHolderID);
		}
		if (newHolderID && !playerIDs.includes(newHolderID)) {
			addPlayers.push(newHolderID);
		}
		if (addPlayers.length > 0) {
			for (const player of addPlayers) {
				[players, playerIDs] = addPlayer(players, playerIDs, player, glicko, defaultRating);
			}
			addPlayers = [];
		}
		if (oldHolderID && newHolderID) {
			const oldWRHolder = players.find(p => p.steamID === oldHolderID);
			const newWRHolder = players.find(p => p.steamID === newHolderID);
			const eloExpectedScoreA = elo.getExpected(oldWRHolder.elo, newWRHolder.elo);
			const eloExpectedScoreB = elo.getExpected(newWRHolder.elo, oldWRHolder.elo);
			oldWRHolder.elo = elo.updateRating(eloExpectedScoreA, 0, oldWRHolder.elo);
			newWRHolder.elo = elo.updateRating(eloExpectedScoreB, 1, newWRHolder.elo);
			matches.push([newWRHolder.glicko, oldWRHolder.glicko, 1]);
		}
		if (i % matchCountBeforeRankUp === 0) {
			glicko.updateRatings(matches);
		}
	}
	for (let i = 0; i < players.length; i += 1) {
		const win = entries.filter(e => e.steam_id_new_recordholder === players[i].steamID).length;
		const lose = entries.filter(e => e.steam_id_old_recordholder === players[i].steamID).length;
		players[i].winCount = win;
		players[i].loseCount = lose;
		const totalMatches = win + lose;
		players[i].totalMatches = totalMatches;
		const winPercent = (win / totalMatches) * 100;
		players[i].winPercent = winPercent;
	}
	// console.log(players);
	glicko.updateRatings(matches);
	return players;
}

module.exports = createRatings;
