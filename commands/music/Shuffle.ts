import { Message } from "discord.js";
import { Command } from "../../model/Command";
import { QueueManager } from '../../logic/QueueManager'

export class ShuffleCommand implements Command
{
    requireArguments : boolean = false;
    description : string = 'Shuffles the queue'

    execute(message: Message): void
    {
        if(message.guildId == undefined) return;
        const queue = QueueManager.GetInstance().GetQueueByGuildId(message.guildId);
        if(queue == undefined) return;
        if(queue?.GetSongArray().length  <= 1) {
            message.channel.send('Not enough items in the queue to shuffle');
        } else {
            queue.Shuffle();
            message.channel.send(`Succesfully shuffled the queue`);
        }
    }
}