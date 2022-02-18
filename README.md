# nhl-player-statistics
Simple CLI for checking single game statistics for pre-determined group of NHL players via [SportRadar API](https://developer.sportradar.com/docs/read/hockey/NHL_v7).

## How it works?
The application first asks the user for date, after which it makes multiple API calls to fetch player data. Players and their teams are given on top of the program as a static constant (constant is named 'PLAYER_POOL'). In order to change players for which the statistics are fetched, this constant needs to be changed.

## How to run it?
Install dependencies with npm
```javascript
npm install
```
Load environment variables by creating .env file and including the following
```javascript
SPORTRADAR_API_KEY=your-sportradar-api-key
```
Run the program
```javascript
npm run index.js
```
