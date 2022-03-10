# multiplayer_pacman
React Web Application (Pac - Man game)
General Architecture:
  Backend:
    Utilizing Express to handle API endpoints and communication between the client and the backend’s internal and external services including the database and Google OAuth service
    Game logic, object spawning and handling of multiplayer functionality such as the communication of player and ghost positions is handled using a multiplayer game server framework Colyseus
  Frontend:
    Front-end UI implemented using React
    Communication for game logic is sent over websockets using Colyseus’s client-side library
    Communication with the backend is handled using Axios to facilitate HTTP requests to send and receive data
    Authentication is handled with Google OAuth2 sending a request to their servers in order to verify the user
  Database:
    PostgreSQL hosted using Google Cloud SQL service
    Handles user data and statistics from games
    
Implemented Features:
  Front-end:
    Custom CSS, fonts, and images to all pages of the application
    Proper routing between pages
  Database:
    Hosting of the Postgres database is handled using GCP representing one of the application’s external service 
    The database is queried through the backend server hosted internally utilizing Express to provide endpoints. 
    Tracked using Flyway for version control of SQL scripts applied to database
  Authentification:
    Authentication is handled using google OAuth2. Upon visiting the application the user will be prompted to “Log in with Google”. After logging in through Google’s services the user will provide a username for the application to record on the database and use. 
    Authentication checks are conducted on each page to ensure that a non authenticated user cannot navigate the application without signing in.
  Lobby functionality:
    A player can create a new lobby room to invite friends to play. Creating a new lobby will assign admin/host to that player
    Other players can join via a generated room ID from the homepage or through the corresponding room URL
    Players can change the color of their pacman by clicking on their player card
    Players also have the ability to chat to each using the lobby messaging system
    Disconnecting and joining the lobby within the reconnection time (10 seconds) will reconnect the player to the lobby (assuming the game has not started)
  Game:
    Once the lobby is created, the admin user has the ability to start the game once there are >= 2 users in the lobby, users that are not admins must press the “Ready” button to be ready to start the game and all users have ability to press on their card and change their sprite to a random color. Once all users that are not admins are ready, admin user can press the “Start Game” button and game commences. Each player gets their own pacman sprite and a ghost that chases them, they use arrow keys to control their pacman sprite. To win the game, user needs to be the last surviving pacman. During the game Pacmans collect pellets and collect power-ups. There are 3 power-ups in the game: Cherry pellet, Strawberry pellet and Orange pellet. Cherry pellet makes pacman super fast for 3 seconds, Strawberry pellet sizes up pacman for 5 seconds and gives ability to eat other players and eliminate them from the round or eat ghosts, but ghosts respawn after 5 seconds if the corresponding player is still alive, when Orange pellet is picked up by pacman any ghost or other pacman in the area around that spot become very slow for 4 seconds. The round ends at any point when there is only one pacman alive.
    When a user controls their pacman they have the ability to queue up to one move so that the movement of the pacman is smooth and non-stopping. If the user does not queue up the move then when pacman hits the wall they will stop moving as in the original pacman game.
    Ghost AI algorithm where each ghost follows their corresponding user and tries to catch and kill them. The algorithm is performed through a simple Euclidean distance heuristic where at every point in time the ghost checks available movements and chooses one that is not opposite to the current direction (as in the original pacman game) and the one that will move the ghost closer to the corresponding user. 

  Multiplayer functionality:
    The game is intended to be multiplayer so the game can only be started once there are >=2 and the maximum number of players is 4.
    Most of the game logic remains on the backend, state of the game constantly being changed and the clients of the game can access the game state on the front-end and that is how the front-end is constantly updated. Phaser 3 specific animation stuff is implemented on the front-end.
  Testing:	
    Performed code reviews before each merge request and push to master.
    Performed regression testing after major merge to master branch.
    Performed end-to-end testing at the end of the final iteration to make sure that all the features work as expected.
