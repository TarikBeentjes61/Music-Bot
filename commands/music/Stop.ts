import { Message } from "discord.js";
import { Command } from "../../model/Command";
import { QueueManager } from '../../logic/QueueManager'

export class StopCommand implements Command
{
    requireArguments : boolean = false;
    description : string = 'Stops the player'

    execute(message: Message): void
    {
        if(message.guildId == null) return;
        const queue = QueueManager.GetInstance().GetQueueByGuildId(message.guildId);
        if(queue == undefined) return;
        queue.Stop();
        message.channel.send('Player stopped');
    }
}