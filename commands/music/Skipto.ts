import { Message } from "discord.js";
import { Command } from "../../model/Command";
import { Queue } from '../../logic/Queue'

export class SkipToCommand implements Command
{
    requireArguments : boolean = false;
    description : string = 'Skips to specified index'

    execute(message: Message): void
    {
        const queue = Queue.GetInstance();
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