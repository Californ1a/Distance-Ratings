const glicko2 = require("glicko2");
const createRatings = require("../../src/util/createRatings");

const settings = {
	tau: 0.5,
	rating: 1500,
	rd: 200,
	vol: 0.06,
};
let ranking;
beforeEach(() => {
	ranking = new glicko2.Glicko2(settings);
});

describe("createRatings", () => {
	it("returns the correct data", () => {
		expect.assertions(5);
		const entries = [{
			steam_id_old_recordholder: "123",
			steam_id_new_recordholder: "456",
		}, {
			steam_id_old_recordholder: "123",
			steam_id_new_recordholder: "456",
		}];
		const data = createRatings(ranking, entries, 2);
		expect(data.length).toBe(2);
		expect(data[0].steamID).toBe("123");
		expect(data[1].steamID).toBe("456");
		expect(data[0].player.constructor.name).toBe("Player");
		expect(data[1].player.constructor.name).toBe("Player");
	});
});
