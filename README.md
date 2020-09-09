# Distance Ratings

Read more on Glicko2 [here](https://en.wikipedia.org/wiki/Glicko_rating_system) & [here](http://glicko.net/glicko.html).

Read more on ELO [here](https://en.wikipedia.org/wiki/Elo_rating_system).

Matches are based on [WR Log](https://seekr.pw/distance-log/), using the new record holder as the match winner, and the old record holder as the match loser. The following are filtered out of the entry list to get fairer ratings:

* Non-Sprint maps.
* Entries where a person beat their own time (not against someone else).
* Entries including people who have a small number of total occurrances (configurable, default minimum 10 WR Log entries).

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

// Default rating used for Glicko.
DEFAULT_GLICKO_RATING=1500

// Read more on Glicko 2 at the link above for more detail on the next 4.
// Generally between 0.3 and 1.2.
DEFAULT_GLICKO_TAU=0.5

// Smaller rating deviation correlates to more confidence in the rating accuracy.
DEFAULT_GLICKO_RATING_DEVIATION=200

// Expected fluctuation on player ratings (speed of rating evolution).
DEFAULT_GLICKO_VOLATILITY=0.06

// Default rating used for ELO.
DEFAULT_ELO_RATING=1500

// Max amount each match can change a player's ELO rating.
DEFAULT_ELO_KFACTOR=32
```

Run `npm install`,  `npm start`, and get the output `ratings.csv`.

## Sample Output

[Google Sheet](https://docs.google.com/spreadsheets/d/1TRuOWLBee6tS87g48fsZBisVINV81Q0r_Ayqz17fsGg/edit?usp=sharing) - [pubhtml](https://docs.google.com/spreadsheets/d/e/2PACX-1vQcypGn_chsOinj2Ab72hv6IqrSs7mQ_Obev8QVIFUXCCoX4yllZ3ojq44UJKAQ4bRoHxp1FruxTTpg/pubhtml)

![](https://i.imgur.com/ZkTNlHE.png)
