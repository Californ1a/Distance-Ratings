function createRatings({
	glicko,
	elo,
}, entries, matchCountBeforeRankUp = 20) {
	// make players
	const players = [];
	const playerIDs = [];
	const matches = [];
	for (let i = 0; i < entries.length; i += 1) {
		const entry = entries[i];
		if (entry.steam_id_old_recordholder && !playerIDs.includes(entry.steam_id_old_recordholder)) {
			playerIDs.push(entry.steam_id_old_recordholder);
			const glickoPlayer = glicko.makePlayer();
			const eloPlayer = 1500;
			players.push({
				steamID: entry.steam_id_old_recordholder,
				glicko: glickoPlayer,
				elo: eloPlayer,
			});
		}
		if (entry.steam_id_new_recordholder && !playerIDs.includes(entry.steam_id_new_recordholder)) {
			playerIDs.push(entry.steam_id_new_recordholder);
			const glickoPlayer = glicko.makePlayer();
			const eloPlayer = 1500;
			players.push({
				steamID: entry.steam_id_new_recordholder,
				glicko: glickoPlayer,
				elo: eloPlayer,
			});
		}
		if (entry.steam_id_old_recordholder && entry.steam_id_new_recordholder) {
			const oldWRHolder = players.find(p => p.steamID === entry.steam_id_old_recordholder);
			const newWRHolder = players.find(p => p.steamID === entry.steam_id_new_recordholder);
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
