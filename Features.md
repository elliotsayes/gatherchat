## Features

### 1-User customisable worlds

Since the last hackathon, Gather Chat has built in support for multiple worlds. However, there are currently only three fixed worlds. The next level of this will be having user-created worlds, with the ability to customise them to their liking, and then meet with other players there. Be sure to show off some beautiful examples of what can be done with the world editor!

### 2-User 1-1 Chat

It would be nice if when players are nearby they could have the ability to filter the chat stream to just those players. So when looking at the activity tab, we could have an option to filter stream by the players you are next to. You can also allow direct messaging between individual participants, and for bonus points encrypt the messages, or even add livestream audio/video!

### 3-Social-like Feed

This feature request is to make the chat panel look more like a social feed than a chat room. If users share media or images, embed in the feed via a timeline. Also, maybe list the feed with the newest at at the top. Emojis are a standard in a social experience, it would be great to have the ability to add reactions via the activity feed quickly when making a post, e.g. a "like" button. Also, maybe consider having a chat stream tab for the whole chat and a filtered version based on which world the player is in.

### 4-Mobile/Accessibility

Gather Chat currently requires ArConnect on desktop in order to play. However, it would be great to allow users to play without a wallet, or even when on mobile. One way of doing this is with Othent -- an Arweave wallet that uses Google OAuth to allow users to connect to AO/Arweave. You could also allow using a temporary wallet as a backup. Also, Gather Chat needs to have its interface overhauled to work on mobile, including an suitable layout and touch controls for movement.

### 5-Autonomous Characters

Add non-player characters (NPCs) to the world, which can interact with the player. This could be as simple as a character that moves around the world, or more advanced like character that can give the player quests. These characters might only activate on user interaction, but could even via run in the background via cron jobs. For something extra sepcial, you could power the bot using an LLM, e.g. [ao-llama](https://github.com/samcamwilliams/aos-llama).

## Bonus features:

### 6-Notifications

Support notifications via the browser, so if the chat is running in the background users can receive a ping if their name is mentioned. You could also send a notification to the user's personal process, so they could be notified even if they don't have Gather Chat open.

### 7-Embedded Images

AO should support attaching data to a message up to 10 MB, it would be nice to enable the image upload to use AO messages if the image is less than 10 MB. Then give the user the option to use turbo or something else to upload larger images/media.

### 8-Real Time Experience
Gather Chat currently works by periodically polling the MU, using the `aoconnect` client. However, this takes some time for the state of the world to update, especially when it comes to movement. Use your hacking skills to make the real time experience as smooth as possible, by whatever means necessary!
