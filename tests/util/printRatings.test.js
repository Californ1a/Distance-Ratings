const printRatingsFactory = require("../../src/util/printRatings");

const mockGetSteamUsers = jest.fn(() => [{
	steamid: "123",
	personaname: "Test",
}]);
const mockfs = {
	writeFile: jest.fn(() => {}),
};
const mockfsErr = {
	writeFile: jest.fn(() => Promise.reject()),
};
const mockParse = jest.fn(() => []);
const mockParser = jest.fn(() => ({
	parse: mockParse,
}));

const printRatings = printRatingsFactory({
	getSteamUsers: mockGetSteamUsers,
	fs: mockfs,
	Parser: mockParser,
});
const printRatingsErr = printRatingsFactory({
	getSteamUsers: mockGetSteamUsers,
	fs: mockfsErr,
	Parser: mockParser,
});

const saveLog = console.log;

beforeEach(() => {
	console.log = saveLog;
});

describe("printRatings", () => {
	it("resolves correctly", async () => {
		console.log = jest.fn(() => {});
		const players = [{
			steamID: "123",
			glicko: {
				getRating: () => 1,
			},
			elo: 1,
			winCount: 1,
			loseCount: 1,
			totalMatches: 1,
			winPercent: 1,
		}];
		const data = printRatings(players);
		await expect(data).resolves.toBeUndefined();
		expect(mockGetSteamUsers).toHaveBeenCalledWith(["123"]);
		expect(console.log).toHaveBeenCalled();
		expect(mockParser).toHaveBeenCalled();
		expect(mockParse).toHaveBeenCalledWith([{
			name: "Test",
			steamID: "123",
			glicko: 1,
			elo: 1,
			winCount: 1,
			loseCount: 1,
			totalMatches: 1,
			winPercent: "1.00%",
		}]);
		expect(mockfs.writeFile).toHaveBeenCalledWith("ratings.csv", []);
	});
	it("throws if fs errors", async () => {
		console.log = jest.fn(() => {});
		const players = [{
			steamID: "123",
			glicko: {
				getRating: () => 1,
			},
			elo: 1,
			winCount: 1,
			loseCount: 1,
			totalMatches: 1,
			winPercent: 1,
		}];
		const data = printRatingsErr(players);
		await expect(data).rejects.toThrow("");
	});
});
