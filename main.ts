import { Client, GatewayIntentBits } from 'discord.js';
import { createAudioPlayer } from '@discordjs/voice';
import { AudioStream } from './logic/AudioStream';
import { YoutubeData } from './logic/YoutubeData';
import { Config } from './config';
import * as ytdl from 'ytdl-core';
import { Song } from './model/Song';

let config = new Config();
var client = new Client
({
    intents: 
    [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildWebhooks, 
    ]
})
var player = createAudioPlayer();

let youtubeData = new YoutubeData(config.youtubeKey);
let songs = youtubeData.FetchSongsByKeyWord("Toto - Africa");
console.log(songs);
let stream = new AudioStream(songs[0].videoId, ytdl, config.filter);
client.login(config.botToken);