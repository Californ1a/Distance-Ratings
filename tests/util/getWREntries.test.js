const getEntriesFactory = require("../../src/util/getWREntries");

const mockFetch = jest.fn(() => Promise.resolve({
	json: () => Promise.resolve({
		some: {
			json: "data",
		},
	}),
}));
const getEntries = getEntriesFactory({
	fetch: mockFetch,
});

describe("getEntries", () => {
	it("returns json for given url", async () => {
		const url = "http://seekr.pw/distance-log/changelist.json";
		const data = await getEntries(url);
		expect(data).toEqual({
			some: {
				json: "data",
			},
		});
	});
});
