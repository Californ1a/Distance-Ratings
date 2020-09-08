async function getSteamUsers({
	fetch,
	colors,
}, steamids) {
	if (!process.env.STEAM_API_KEY) {
		throw new Error("No Steam API key provided.");
	}
	const params = new URLSearchParams({
		steamids: steamids.join(","),
	});
	const options = {
		headers: {
			"cache-control": "no-cache",
			"Content-Type": "application/x-www-form-urlencoded",
			"x-webapi-key": process.env.STEAM_API_KEY,
		},
		form: false,
	};
	try {
		const getPlayerSummaries = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?${params}`;
		console.log(`Fetching Steam users: ${colors.green(getPlayerSummaries)}`);
		const res = await fetch(getPlayerSummaries, options);
		const data = await res.json();
		return data.response.players;
	} catch (e) {
		throw Error(e);
	}
}

module.exports = deps => steamids => getSteamUsers(deps, steamids);
