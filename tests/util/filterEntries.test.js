const filterEntriesFactory = require("../../src/util/filterEntries");

const mockRemovePlayersWithFewMatches = jest.fn(entries => entries);

describe("filterEntries", () => {
	it("removes non-sprint entries", async () => {
		expect.assertions(1);
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
		}];
		const mockEntries = jest.fn(() => Promise.resolve(baseData));
		const filterEntries = filterEntriesFactory({
			getEntries: mockEntries,
			removePlayersWithFewMatches: mockRemovePlayersWithFewMatches,
		});

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
	it("removes entries with same name for old and new", async () => {
		expect.assertions(1);
		const baseData = [{
			mode: "Sprint",
			steam_id_old_recordholder: "Name",
			steam_id_new_recordholder: "Name2",
		}, {
			mode: "Sprint",
			steam_id_old_recordholder: "Name",
			steam_id_new_recordholder: "Name",
		}, {
			mode: "Sprint",
			steam_id_old_recordholder: "Name",
			steam_id_new_recordholder: "Name2",
		}];
		const mockEntries = jest.fn(() => Promise.resolve(baseData));
		const filterEntries = filterEntriesFactory({
			getEntries: mockEntries,
			removePlayersWithFewMatches: mockRemovePlayersWithFewMatches,
		});

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
	it("calls getEntries and removePlayersWithFewMatches correctly", async () => {
		expect.assertions(4);
		const baseData = [{
			mode: "Sprint",
			steam_id_old_recordholder: "Name",
			steam_id_new_recordholder: "Name2",
		}, {
			mode: "Sprint",
			steam_id_old_recordholder: "Name",
			steam_id_new_recordholder: "Name",
		}, {
			mode: "Sprint",
			steam_id_old_recordholder: "Name",
			steam_id_new_recordholder: "Name2",
		}];
		const mockEntries = jest.fn(() => Promise.resolve(baseData));
		const filterEntries = filterEntriesFactory({
			getEntries: mockEntries,
			removePlayersWithFewMatches: mockRemovePlayersWithFewMatches,
		});

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
		await filterEntries(url, minMatches);
		expect(mockEntries).toHaveBeenCalled();
		expect(mockEntries).toHaveBeenCalledWith(url);
		expect(mockRemovePlayersWithFewMatches).toHaveBeenCalled();
		expect(mockRemovePlayersWithFewMatches).toHaveBeenCalledWith(testData, minMatches);
	});
});
