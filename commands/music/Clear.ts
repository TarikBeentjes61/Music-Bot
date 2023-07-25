import { Message } from "discord.js";
import { Command } from "../../model/Command";
import { QueueManager } from '../../logic/QueueManager'

export class ClearCommand implements Command
{
    requireArguments : boolean = false;
    description : string = 'Clears the queue'

    execute(message: Message): void
    {
        if(message.guildId == null) return;
        const queue = QueueManager.GetInstance().GetQueueByGuildId(message.guildId);
        if(queue == undefined) return;
        const songAmount = queue.GetSongArray().length;
        if(songAmount == 0) {
            message.channel.send('Queue is currently empty');
        }
        else {
            queue.Clear();
            message.channel.send(`Removed ${songAmount} songs from the queue`);
        }
    }
}