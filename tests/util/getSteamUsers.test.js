const getSteamUsersFactory = require("../../src/util/getSteamUsers");

const mockFetch = jest.fn(() => Promise.resolve({
	json: () => Promise.resolve({
		response: {
			players: [{
				steamid: "123",
			}, {
				steamid: "456",
			}],
		},
	}),
}));
const saveLog = console.log;
const colorsMock = {
	green: jest.fn(a => a),
};
const getSteamUsers = getSteamUsersFactory({
	fetch: mockFetch,
	colors: colorsMock,
});

beforeEach(() => {
	console.log = saveLog;
	process.env = Object.assign(process.env, {
		STEAM_API_KEY: "",
	});
});

describe("getSteamUsers", () => {
	it("throws when API key isn't set", async () => {
		expect.assertions(1);
		const steamids = ["123", "456"];
		await expect(getSteamUsers(steamids)).rejects.toThrow("No Steam API key provided.");
	});
	it("returns data for given steamids", async () => {
		expect.assertions(4);
		console.log = jest.fn(() => {});
		const key = "test_key";
		process.env = Object.assign(process.env, {
			STEAM_API_KEY: key,
		});
		const steamids = ["123", "456"];
		const data = await getSteamUsers(steamids);
		const params = new URLSearchParams({
			steamids: steamids.join(","),
		});
		const options = {
			headers: {
				"cache-control": "no-cache",
				"Content-Type": "application/x-www-form-urlencoded",
				"x-webapi-key": key,
			},
			form: false,
		};
		const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?${params}`;
		expect(console.log).toHaveBeenCalledWith(`Fetching Steam users: ${url}`);
		expect(mockFetch).toHaveBeenCalledWith(url, options);
		expect(data).toHaveLength(2);
		expect(data).toEqual([{
			steamid: "123",
		}, {
			steamid: "456",
		}]);
	});
});
