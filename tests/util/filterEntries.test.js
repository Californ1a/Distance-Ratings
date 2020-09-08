const filterEntriesFactory = require("../../src/util/filterEntries");

const baseData = [{
	mode: "Sprint",
	steam_id_old_recordholder: "Name",
	steam_id_new_recordholder: "Name2",
}, {
	mode: "Challenge",
	steam_id_old_recordholder: "Name",
	steam_id_new_recordholder: "Name2",
}, {
	mode: "Sprint",
	steam_id_old_recordholder: "Name",
	steam_id_new_recordholder: "Name2",
}, {
	mode: "Sprint",
	steam_id_old_recordholder: "Name",
	steam_id_new_recordholder: "Name",
}];

const mockEntries = jest.fn(() => Promise.resolve(baseData));
const mockRemovePlayersWithFewMatches = jest.fn(entries => entries);
const filterEntries = filterEntriesFactory({
	getEntries: mockEntries,
	removePlayersWithFewMatches: mockRemovePlayersWithFewMatches,
});

describe("filterEntries", () => {
	it("removes non-sprint entries & entries with same name for old and new", async () => {
		const testData = [{
			mode: "Sprint",
			steam_id_old_recordholder: "Name",
			steam_id_new_recordholder: "Name2",
		}, {
			mode: "Sprint",
			steam_id_old_recordholder: "Name",
			steam_id_new_recordholder: "Name2",
		}];
		const url = "http://seekr.pw/distance-log/changelist.json";
		const minMatches = 2;
		const data = await filterEntries(url, minMatches);
		expect(data).toEqual(testData);
	});
});
