import { Message } from "discord.js";
import { Command } from "../../model/Command";
import { QueueManager } from '../../logic/QueueManager'
import { YoutubeData } from "../../logic/YoutubeData";
import { Queue } from "../../logic/Queue";

export class PlayCommand implements Command
{
    requireArguments : boolean = true;
    description : string = 'Play a song : play [args]'

    execute(message: Message): void
    {
        const queueManager = QueueManager.GetInstance();
        if(message.guildId == null) return;
        if(!queueManager.HasQueueByGuildId(message.guildId)) {
            queueManager.AddNewQueueByGuildId(message.guildId);
        }
        const queue = queueManager.GetQueueByGuildId(message.guildId);
        if(queue == undefined) return;
        queue.SetMessageChannel(message.channel);
        if(message.member?.voice.channelId == null) {
            message.reply("U are not currently in a voice channel");
            return;
        }
        switch(this.GetArgumentType(message.content)) 
        {
            case 'youtube' : 
                this.PlaySongFromMessageAndQueue(message, queue);
                break;
            case 'spotify' : 
                 break;
            case 'default' :
                this.PlaySongFromMessageAndQueue(message, queue);
                break;
        }
    }
    private PlaySongFromMessageAndQueue(message : Message, queue : Queue) 
    {
        if(queue == undefined) return;
        new YoutubeData().FetchSongByKeyWord(`${message.content}`)
        .then(song => {
            if(song == undefined) {
                message.reply('Song could not be found');
            }
            else {
                queue.CreateConnectionFromMessage(message);
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