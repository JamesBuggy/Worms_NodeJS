# NodeJS Worms Clone

## Dublin Institute of Technology Web Architecture Project

Note: view "./Architecture.png" to see the high level architecture.

This project is comprised of four parts:

1. Angular client
2. Game server
3. Master server
4. Rest API

## Angular client
Web app used to connect to a game server, play the game, view match results and manage user profiles and teams.

## Game Server
Hosts the worms game.
Exposes http endpoint to retrieve information about this server.
Accepts socket io connections from authenticated users of the angular client.
Establishes a socket io connection with the master server to register itself.
Calls enpoints of the rest api to load a users team and save the result of a match.

## Master Server
Basicly a directory of game servers.
Accepts socket io connections from game servers to monitor their status and serve their info to the angular client.
Exposes http endpoints to retrieve information regarding active game servers.
Endpoints for:
1. A list of all active game server
2. Information regarding a specific game server

## Rest API
Used to communicate with MongoDB.
Exposes endpoints for:
1. User profiles
2. User profile images
3. User teams
4. Match results
5. Login/Registration
