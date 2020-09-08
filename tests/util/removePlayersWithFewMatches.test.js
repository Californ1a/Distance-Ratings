const removePlayersWithFewMatches = require("../../src/util/removePlayersWithFewMatches");

describe("removePlayersWithFewMatches", () => {
	it("removes entires containing players who have < min matches amount", () => {
		const baseData = [{
			mode: "Sprint",
			steam_id_old_recordholder: "Name",
			steam_id_new_recordholder: "Name2",
		}, {
			mode: "Sprint",
			steam_id_old_recordholder: "Name",
			steam_id_new_recordholder: "Name3",
		}, {
			mode: "Sprint",
			steam_id_old_recordholder: "Name",
			steam_id_new_recordholder: "Name2",
		}];
		const testData = [{
			mode: "Sprint",
			steam_id_old_recordholder: "Name",
			steam_id_new_recordholder: "Name2",
		}, {
			mode: "Sprint",
			steam_id_old_recordholder: "Name",
			steam_id_new_recordholder: "Name2",
		}];
		const minMatches = 2;
		const data = removePlayersWithFewMatches(baseData, minMatches);
		expect(data).toEqual(testData);
	});
	it("recursively removes entries", () => {
		const baseData = [{
			mode: "Sprint",
			steam_id_old_recordholder: "Name",
			steam_id_new_recordholder: "Name2",
		}, {
			mode: "Sprint",
			steam_id_old_recordholder: "Name",
			steam_id_new_recordholder: "Name2",
		}, {
			mode: "Sprint",
			steam_id_old_recordholder: "Name2",
			steam_id_new_recordholder: "Name3",
		}, {
			mode: "Sprint",
			steam_id_old_recordholder: "Name3",
			steam_id_new_recordholder: "Name4",
		}, {
			mode: "Sprint",
			steam_id_old_recordholder: "Name4",
			steam_id_new_recordholder: "Name5",
		}];
		const testData = [{
			mode: "Sprint",
			steam_id_old_recordholder: "Name",
			steam_id_new_recordholder: "Name2",
		}, {
			mode: "Sprint",
			steam_id_old_recordholder: "Name",
			steam_id_new_recordholder: "Name2",
		}];
		const minMatches = 2;
		const data = removePlayersWithFewMatches(baseData, minMatches);
		expect(data).toEqual(testData);
	});
});
