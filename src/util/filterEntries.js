async function filterEntries({
	getEntries,
	removePlayersWithFewMatches,
}, url, minMatchesPerPlayer = 10) {
	const allEntries = await getEntries(url);
	const filteredEntries = allEntries.filter(e => e.mode === "Sprint" && e.steam_id_old_recordholder !== e.steam_id_new_recordholder);
	return removePlayersWithFewMatches(filteredEntries, minMatchesPerPlayer);
}

module.exports = deps => (url, minMatchPerPlayer) => filterEntries(deps, url, minMatchPerPlayer);
