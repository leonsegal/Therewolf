# To run

`nodemon server.js`

Then navigate to localhost:3000

# Game

## Start

Randomly allocate roles

## Night-phase

Set dark theme
Werewolf chooses victim/Warlock and Seer choose target to check
Kill werewolf target if not protected/Reveal warlock/seer target

## Day-phase

Set light theme
Show/mute werewolf victim
30s chat
30s voting
Work out if a lynching happens (>50% of players, tie means no lynching)
Show/mute lynching victim

Repeat night and day phases until winner:

- Werewolves match villagers in numbers to win, at which point they will openly rise up and kill everyone
- The villagers win if there are no werewolves left

# Roles

## Werewolf

The game is over when the werewolf dies, or if only 1 werewolf and 1 other player remain.

## Warlock

The warlock is on the werewolf team and wins if the werewolf wins.

They will resurrect themselves if the werewolf wins and they're dead.

The warlock looks like a villager to the seer.

During the night-phase, the warlock can look at one player to see if they are the seer.

The werewolf and warlock do NOT know each other's identity.

# Seer

During the night, the seer checks a player to see if that player is a werewolf.

# Hunter

The hunter is a villager with the following ability:
If at the end of the game, the only 2 remaining players are the hunter and the werewolf, then the hunter kills the werewolf and the village wins.

# Villager/s

The villager is a common or garden villager. Hobbies include lynching and being eaten by werewolves.
5 players = 1 villager, 6 players = 2 villagers.
