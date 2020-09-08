async function getEntries({
	fetch,
}, url) {
	try {
		const res = await fetch(url);
		const json = await res.json();
		return json;
	} catch (e) {
		throw Error(e);
	}
}

module.exports = deps => url => getEntries(deps, url);
