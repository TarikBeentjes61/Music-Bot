import { Client, GatewayIntentBits } from 'discord.js';
import { AudioStream } from './logic/AudioStream';
import { YoutubeData } from './logic/YoutubeData';
import { ClientEventHandler } from './events/ClientEventHandler';
import { Config } from './config';
import { Queue } from './logic/Queue';

class Bot 
{
    config : any;
    client : Client;
    constructor() 
    {
        let  fs = require('fs');
        const jsonData = JSON.parse(fs.readFileSync('./config.json'));
        this.config = jsonData;
        this.client = new Client
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
        let clientEventHandler = new ClientEventHandler(this.client, this.config.BotOptions.prefix);
        this.client.login(this.config.BotOptions.token);
        let queue = Queue.GetInstance();
        queue.SetConfig(this.config);
    }
    public Start() 
    {

    }
}
let main = new Bot();
main.Start();
