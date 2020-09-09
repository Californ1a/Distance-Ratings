require("dotenv").config();

const glicko2 = require("glicko2");
const EloRank = require("elo-rank");
const path = require("path");

const {
	filterEntries,
	createRatings,
	printRatings,
} = require("./base");

const settings = {
	tau: parseInt(process.env.DEFAULT_GLICKO_TAU, 10) || 0.5,
	rating: parseInt(process.env.DEFAULT_GLICKO_RATING, 10) || 1500,
	rd: parseInt(process.env.DEFAULT_GLICKO_RATING_DEVIATION, 10) || 200,
	vol: parseInt(process.env.DEFAULT_GLICKO_VOLATILITY, 10) || 0.06,
};
const glicko = new glicko2.Glicko2(settings);
const elo = new EloRank();

const minMatchesPerPlayer = parseInt(process.env.MIN_MATCHES_PER_PLAYER, 10) || 10;
const matchCountBeforeRankUp = parseInt(process.env.MATCH_COUNT_BEFORE_RANKING_UPDATE, 10) || 20;
const includeLink = parseInt(process.env.INCLUDE_LINK, 10) || 0;

const url = "http://seekr.pw/distance-log/changelist.json";

async function main() {
	const entries = await filterEntries(url, minMatchesPerPlayer);
	const players = createRatings({
		glicko,
		elo,
	}, entries, matchCountBeforeRankUp);
	await printRatings(players, includeLink);
	console.log(`Success - Wrote to ${path.join(__dirname, "../ratings.csv")}`);
}

main();
