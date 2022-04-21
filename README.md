# To run

`nodemon server.js`

Then navigate to localhost:3000

# Game

## Start

Randomly allocate roles

## Night-phase 1st

Set dark theme
Medium can contact the dead if any dead
Get targets of werewolf/seer/doc/medium
Work out if werewolf target and serial killer target can be killed (protected etc.)

## Day-phase next

Set light theme
Medium and the dead can no longer message each other
Show/mute werewolf victim
30s chat
30s voting
Work out if a lynching happens (>50% of players, tie means no lynching)
Show/mute lynching victim

Repeat night and day phases until winner - werewolves need to match villagers in numbers to win, at which point they will openly rise up and kill everyone

# To do

- Decide roles to be used in game e.g. werewolf, seer, doctor, medium etc
- Indicate player's own messages
- Add private messaging e.g. medium and the dead, the dead to each other or wws

# Roles

## Werewolf

The game is over when the werewolf dies, or if only 1 werewolf and 1 other player remain.

## Warlock

The warlock is on the werewolf team and wins if the werewolf wins. The warlock looks like a villager to the seer.
During the night-phase, the warlock can look at one player to see if they are the seer.

The werewolf and warlock do NOT know each other's identity.

# Seer

During the night, the seer looks at one player and the moderator tells them if that player is the werewolf.

# Hunter

The hunter is a villager with the following ability:
If at the end of the game, the only 2 remaining players are the hunter and the werewolf, then the hunter kills the werewolf and the village wins.

# Villager/s

The villager is a common or garden villager. Hobbies include lynching and being eaten by werewolves.
5 players = 1 villager, 6 players = 2 villagers.
