const printRatingsFactory = require("../../src/util/printRatings");

const mockGetSteamUsers = jest.fn(() => [{
	steamid: "123",
	personaname: "Test",
}]);
const mockfs = {
	writeFile: jest.fn(() => {}),
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

const saveLog = console.log;

beforeEach(() => {
	console.log = saveLog;
});

describe("printRatings", () => {
	it("resolves correctly", async () => {
		console.log = jest.fn(() => {});
		const players = [{
			steamID: "123",
			player: {
				getRating: () => 1,
			},
		}];
		const data = printRatings(players);
		await expect(data).resolves.toBeUndefined();
		expect(mockGetSteamUsers).toHaveBeenCalledWith(["123"]);
		expect(mockParser).toHaveBeenCalled();
		expect(mockParse).toHaveBeenCalledWith([{
			name: "Test",
			steamID: "123",
			rating: 1,
		}]);
		expect(mockfs.writeFile).toHaveBeenCalledWith("ratings.csv", []);
	});
});
