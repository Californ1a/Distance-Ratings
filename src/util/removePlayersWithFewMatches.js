function removePlayersWithFewMatches(entries, minAmount = 10) {
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

module.exports = removePlayersWithFewMatches;
