/** 
 * This application utilizes SportRadar API to find out NHL statistics for pre-determined group
 * of players. First, application makes an API call to retreive all the NHL games played on a
 * certain date. These games are then looped through so that on each iteration, a game is compared 
 * to a pre-determined group of teams in order to identify games that are in our interest.
 * 
 * Next, the application uses game id and makes new API call to retreive a detailed game summary. 
 * The summary contains all the players and their statistics for that spesific game. Finally, 
 * the application loops through these players and compares them to a pre-determined group of 
 * players in order to find statistics for the players in our interest.
 * 
 * PLAYER_POOL constant contains the players and their teams that we are interested in.
 **
 */

require('dotenv').config()
const axios = require('axios')

const SPORTRADAR_API_KEY = process.env.SPORTRADAR_API_KEY
const TODAY = new Date()
const CUR_YEAR = TODAY.getFullYear();
const CUR_MONTH = TODAY.getMonth()+1; // JS counts months from 0
const CUR_DAY = TODAY.getDate()-1; // Yesterday
const URL_DAILY_GAMES = `https://api.sportradar.us/nhl/trial/v7/en/games/${CUR_YEAR}/${CUR_MONTH}/${CUR_DAY}/schedule.json?api_key=${SPORTRADAR_API_KEY}`

const PLAYER_POOL = [
  { 
    name: "Mikko Rantanen",
    team: "Colorado Avalanche"
  },
  {
    name: "Sebastian Aho",
    team: "Carolina Hurricanes"
  },
  {
    name: "Teuvo Teravainen",
    team: "Carolina Hurricanes"
  },
  {
    name: "Aleksander Barkov",
    team: "Florida Panthers"
  },
  {
    name: "Roope Hintz",
    team: "Dallas Stars"
  },
  {
    name: "Mikael Granlund",
    team: "Nashville Predators"
  }
]

// Basic API subscription limits queries per seconds => delay is implemeted as a work around
const delay = _ => new Promise(resolve => setTimeout(resolve, 800))

const fetchGames = async() => {
  try {
    const response = await axios.get(URL_DAILY_GAMES)
    await delay();
    return response.data
  } catch(e) {
    console.log("Something went wrong with API call, please try again")
  }
}

const fetchGameSummary = async(gameId) => {
  const URL_GAME_SUMMARY = `https://api.sportradar.us/nhl/trial/v7/en/games/${gameId}/summary.json?api_key=${SPORTRADAR_API_KEY}`

  try {
    const response = await axios.get(URL_GAME_SUMMARY)
    await delay();
    return response.data
  } catch(e) {
    console.log("Something went wrong with API call, please try again")
  }
}

const main = async() => {
  // Fetch all NHL games from yesterday via SportRadar API
  const gameData = await fetchGames();
  if(!gameData) return

  const games = gameData.games
  
  for(var i=0; i<PLAYER_POOL.length; i++){
    var player = PLAYER_POOL[i]
    var teamPlayedYesterday = false;
    var playerPlayedYesterday = false;

    // Check if the team of currently chosen player played yesterday
    for(var j=0; j<games.length; j++){
      var game = games[j]

      if(game.home.name === player.team || game.away.name === player.team) {
        teamPlayedYesterday = true;

        // If a game is found, fetch detailed game information
        const gameSummary = await fetchGameSummary(game.id);
        if(!gameSummary) return


        var players = null

        // Check if the team of currently chosen player was home or away, and choose the player list of that team
        if(game.home.name === player.team) {
          console.log(`${player.team} played against ${game.away.name} in ${CUR_YEAR}/${CUR_DAY}/${CUR_MONTH}`)
          players = gameSummary.home.players
        }
        else {
          console.log(`${player.team} played against ${game.home.name} in ${CUR_YEAR}/${CUR_DAY}/${CUR_MONTH}`)
          players = gameSummary.away.players
        } 
        
        // Loop through each player in a detailed game information to gather statistics of our player
        players.forEach(loopedPlayer => {
          if(loopedPlayer.full_name === player.name){
            playerPlayedYesterday = true

            var goals = loopedPlayer.statistics.total.goals
            var assists = loopedPlayer.statistics.total.assists
            var points = loopedPlayer.statistics.total.points
            var shots = loopedPlayer.statistics.total.shots
            var penalties = loopedPlayer.statistics.total.penalties

            console.log(`${player.name}`)
            console.log(`Goals: ${goals}`)
            console.log(`Assists: ${assists}`)  
            console.log(`Points: ${points}`)  
            console.log(`Shots: ${shots}`)  
            console.log(`Penalties: ${penalties} \n`)
          }
        })
      }
    } 
    if(!teamPlayedYesterday) console.log(`${player.team} did not play in ${CUR_YEAR}/${CUR_DAY}/${CUR_MONTH} \n`);
    if(teamPlayedYesterday && !playerPlayedYesterday) console.log(`${player.name} was not on ice \n`);
  }

  
}

main()