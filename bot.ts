import { Client, GatewayIntentBits } from 'discord.js';
import { ClientEventHandler } from './events/ClientEventHandler';
import { QueueManager } from './logic/QueueManager';

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
        new ClientEventHandler(this.client, this.config.BotOptions.prefix);
        this.client.login(this.config.BotOptions.token);
        QueueManager.GetInstance();
    }
}
const bot = new Bot();
