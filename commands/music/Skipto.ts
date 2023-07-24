import { Message } from "discord.js";
import { Command } from "../../model/Command";
import { QueueManager } from '../../logic/QueueManager'

export class SkipToCommand implements Command
{
    requireArguments : boolean = false;
    description : string = 'Skips to specified index'

    execute(message: Message): void
    {
        if(message.guildId == null) return;
        const queue = QueueManager.GetInstance().GetQueueByGuildId(message.guildId);
        if(queue == undefined) return;
        const index = parseInt(message.content);
        if(index > queue.GetSongArray().length) {
            message.reply('Given number is too big for the queue');
            return
        }
        const song = queue.GetSongArray()[index];
        queue.SkipTo(index);
        message.channel.send(`Succesfully skipped to ${song.title}`);
    }
}