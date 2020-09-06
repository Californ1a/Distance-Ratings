# Distance Glicko2 Ratings

Read more on glicko2 [here](http://glicko.net/glicko.html).

## Usage

Rename `.env.sample` to `.env`, supply a Steam web API key (from [here](https://steamcommunity.com/dev)) and change the various inputs as you need.

Sample `.env` explained:
```js
// Steam API key you can obtain from the link above.
STEAM_API_KEY=12345

// Filter out players who don't appear more than this number of times.
MIN_MATCHES_PER_PLAYER=10

// Glicko2 matches are processed in batches
// This changes how many matches before the next batch
MATCH_COUNT_BEFORE_RANKING_UPDATE=20

// Whether the csv should include hyperlinks to Steam profiles or not.
// 1 = Include links, 0 = No links.
INCLUDE_LINK=1

// Read more on Glicko 2 at the link above for more detail on the next 4.
// Generally between 0.3 and 1.2.
DEFAULT_GLICKO_TAU=0.5

// Default rating.
DEFAULT_GLICKO_RATING=1500

// Smaller rating deviation correlates to more confidence in the rating accuracy.
DEFAULT_GLICKO_RATING_DEVIATION=200

// Expected fluctuation on player ratings (speed of rating evolution).
DEFAULT_GLICKO_VOLATILITY=0.06
```

Run `npm start` and get the output `ratings.csv`.
