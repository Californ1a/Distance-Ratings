const fetch = require("node-fetch");
const colors = require("colors");
const {
	Parser,
} = require("json2csv");
const fs = require("fs").promises;

const removePlayersWithFewMatches = require("./util/removePlayersWithFewMatches");
const getSteamUsers = require("./util/getSteamUsers")({
	fetch,
	colors,
});
const getEntries = require("./util/getWREntries")({
	fetch,
});

const printRatings = require("./util/printRatings")({
	getSteamUsers,
	fs,
	Parser,
});
const filterEntries = require("./util/filterEntries")({
	getEntries,
	removePlayersWithFewMatches,
});
const createRatings = require("./util/createRatings");

module.exports = {
	filterEntries,
	createRatings,
	printRatings,
};
