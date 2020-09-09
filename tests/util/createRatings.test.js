const glicko2 = require("glicko2");
const EloRank = require("elo-rank");
const createRatings = require("../../src/util/createRatings");

const settings = {
	tau: 0.5,
	rating: 1500,
	rd: 200,
	vol: 0.06,
};
let glicko;
let elo;
beforeEach(() => {
	glicko = new glicko2.Glicko2(settings);
	elo = new EloRank();
});

describe("createRatings", () => {
	it("returns the correct data", () => {
		expect.assertions(7);
		const entries = [{
			steam_id_old_recordholder: "123",
			steam_id_new_recordholder: "456",
		}, {
			steam_id_old_recordholder: "123",
			steam_id_new_recordholder: "456",
		}];
		const data = createRatings({
			glicko,
			elo,
		}, entries, 2);
		expect(data.length).toBe(2);
		expect(data[0].steamID).toBe("123");
		expect(data[1].steamID).toBe("456");
		for (const d of data) {
			expect(d.glicko.constructor.name).toBe("Player");
			expect(d.elo).toBeDefined();
		}
	});
});
