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
const mockFetchErr = jest.fn(() => Promise.reject());
const getEntriesErr = getEntriesFactory({
	fetch: mockFetchErr,
});

describe("getEntries", () => {
	it("calls fetch", async () => {
		expect.assertions(2);
		const url = "http://seekr.pw/distance-log/changelist.json";
		await getEntries(url);
		expect(mockFetch).toHaveBeenCalled();
		expect(mockFetch).toHaveBeenCalledWith(url);
	});
	it("returns json for given url", async () => {
		expect.assertions(1);
		const url = "http://seekr.pw/distance-log/changelist.json";
		const data = await getEntries(url);
		expect(data).toEqual({
			some: {
				json: "data",
			},
		});
	});
	it("throws if fetch errors", async () => {
		expect.assertions(1);
		const url = "http://seekr.pw/distance-log/changelist.json";
		await expect(getEntriesErr(url)).rejects.toThrow("");
	});
});
