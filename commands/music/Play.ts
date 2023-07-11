import { Message } from "discord.js";
import { Command } from "../../model/Command";
import { Queue } from '../../logic/Queue'
import { YoutubeData } from "../../logic/YoutubeData";

export class PlayCommand implements Command
{
    requireArguments : boolean = true;
    description : string = 'Play a song : play [args]'

    execute(message: Message): void
    {
        if(message.member?.voice.channelId == null) {
            message.reply("U are not currently in a voice channel");
            return;
        }
        switch(this.GetArgumentType(message.content)) 
        {
            case 'youtube' : 
                this.PlaySongFromMessage(message);
                break;
            case 'spotify' : 
                 break;
            case 'default' :
                this.PlaySongFromMessage(message);
                break;
        }
    }
    private PlaySongFromMessage(message : Message) 
    {
        let queue = Queue.GetInstance();
        queue.CreateConnectionFromMessage(message);
        new YoutubeData().FetchSongByKeyWord(`${message.content}`)
        .then(song => {
            if(song == undefined) {
                message.reply('Song could not be found');
            }
            else {
                message.channel.send(`Added ${song.title} to the queue`);
                queue.AddSong(song);
            }
        })
    }
    private GetArgumentType(url : string) : string
    {
        if(/\.spotify\.com/.test(url))
        {
            console.log('spotify link');
            return 'spotify' ;            
        }
        if(/\.youtube\com/.test(url))
        {
            console.log('youtube link');
            return 'youtube'; 
        }
        return 'default';
    }
}