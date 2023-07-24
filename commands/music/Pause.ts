import { Message } from "discord.js";
import { Command } from "../../model/Command";
import { QueueManager } from '../../logic/QueueManager'

export class PauseCommand implements Command
{
    requireArguments : boolean = false;
    description : string = 'Pauses the current song'

    execute(message: Message): void
    {
        if(message.guildId == null) return;
        const queue = QueueManager.GetInstance().GetQueueByGuildId(message.guildId);
        if(queue == undefined) return;
        const state = queue.Pause();
        message.channel.send(`Player succesfully ${state}`)
    }
}