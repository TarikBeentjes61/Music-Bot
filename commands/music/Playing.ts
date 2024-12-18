import { Message } from "discord.js";
import { Command } from "../../model/Command";
import { QueueManager } from '../../logic/QueueManager'

export class PlayingCommand implements Command
{
    requireArguments : boolean = false;
    description : string = 'Gives the title of the current song'

    execute(message: Message): void
    {
        if(message.guildId == null) return;
        const queue = QueueManager.GetInstance().GetQueueByGuildId(message.guildId);
        if(queue == undefined) return;
        const songId = queue.Playing()?.videoId;
        const youtubeUrl = `https://www.youtube.com/watch?v=${songId}`
        if(songId != undefined) {
            message.channel.send(youtubeUrl);
        }
        else {
            message.channel.send('No song is currently playing');
        }
    }
}