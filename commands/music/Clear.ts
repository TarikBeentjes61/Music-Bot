import { Message } from "discord.js";
import { Command } from "../../model/Command";
import { Queue } from '../../logic/Queue'

export class ClearCommand implements Command
{
    requireArguments : boolean = false;
    description : string = 'Clears the queue'

    execute(message: Message): void
    {
        const queue = Queue.GetInstance()
        const songAmount = queue.GetSongArray().length;
        queue.Clear();
        message.channel.send(`Removed ${songAmount} songs from the queue`);
    }
}