# End Project Overview

The final form of the project is a plugin to play an RPG call Phoenix: Dawn Command for my preferred virtual tabletop Owlbear Rodeo. 

A virtual tabletop is an application that is intended to be used to run tabletop games such as boardgames or Tabletop RPG's (such as Dungeons and Dragon) in a digital environment to allow play over the internet.

Owlbear Rodeo is a fairly stripped down option that give the use the ability to generate random numbers to simulate dice and a scene where the user can load in assets to act as game components. Owlbear Rodeo is fairly simple but it does allow users to create plugins that can extend the capabilities of the application.
There is currently a plugin that adds decks of cards to the application however It doesn't support individual player hands and Its exceptionally buggy as each card is loaded in as an asset in the scene. This can lead to issues with actually using this decks plugin.

My application is broken down into three major components
- Server
- Database
- Frontend Client Application

The various logical components needed to play and load a game of Phoenix: Dawnguard on tabletop sim are stored In a MongoDB database and the server contains all logic to pass this data to the Clientside application through the Serverside logic

The Database Stores:
- Game: a document representing an Owlbear room running the plugin
- Player: a document representing a particular user logged into a particular Game
- Deck: a document representing the cards available to a Player in a Particular Game
- Cards: a document representing the cards themselves

The Client:
- Handles user inputs and game logic to allow users to play the game 

The Server:
- Handles routing and server logic needed to interact with the database to facilitate whatever game actions the user is enacting


# How to use it

- 'npm run start' in the main appplication dir will start the server going
- in the terminal output you will see regular messages that say "🔗 add to Owkbear Rodeo extension with:" use that url to add the extention to owlbear and load it into a room like normal
- if you're just running it locally than you can ignore the tunnul and just use http://localhost:5173/manifest.json
- up in the top left you will see a bar wiht a few symbols in it, click on the one that looks like a triangle and it will open a panel
- click draw and it will give you a hand of cards click then to add them to the current spread, click them again to remove them from the spread. 