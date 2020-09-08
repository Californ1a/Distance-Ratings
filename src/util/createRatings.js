async function createRatings(ranking, entries, matchCountBeforeRankUp = 20) {
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

module.exports = createRatings;
