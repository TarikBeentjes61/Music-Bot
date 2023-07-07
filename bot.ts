import { Client, GatewayIntentBits } from 'discord.js';
import { AudioStream } from './logic/AudioStream';
import { YoutubeData } from './logic/YoutubeData';
import { ClientEventHandler } from './events/ClientEventHandler';
import { Config } from './config';

class Bot 
{
    config : Config;
    client : Client;
    constructor() 
    {
        this.config = new Config();
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
        let clientEventHandler = new ClientEventHandler(this.client, this.config.prefix);
        clientEventHandler.Start();
        this.client.login(this.config.botToken);
    }
    public Start() 
    {
        //this.CreateStreamFromKeyWord('Toto - Africa');
    }
    public CreateConnection() 
    {

    }
    public ConnectToChannel(channel : any) 
    {

    }
    private async CreateStreamFromKeyWord(keyWord: string) 
    {
        /*
        let youtubeData = new YoutubeData();
        youtubeData.FetchSongByKeyWord(keyWord)
        .then(song => {
            let audioStream = new AudioStream(this.config.filter);
            if(song.videoId != undefined) {
                audioStream.GetAudioStreamFromSong(song)
                .then(() => {
                    console.log('Video downloaded successfully.');
                })
                .catch((error) => {
                    console.error('Error downloading video:', error);
                  });
            }
        })
        */
    }

}
let main = new Bot();
main.Start();
