import { Message } from "discord.js";
import { Command } from "../../model/Command";
import { QueueManager } from "../../logic/QueueManager";
import { AudioPlayerStatus } from "@discordjs/voice";

export class SkipCommand implements Command
{
    requireArguments : boolean = false;
    description : string = 'Skip a song'

    execute(message: Message): void
    {
        if(message.guildId == null) return;
        const queue = QueueManager.GetInstance().GetQueueByGuildId(message.guildId);
        if(queue == undefined) return;
        if(queue.state != AudioPlayerStatus.Playing) {
            message.reply('There is no song currently playing');
            return;
        }
        queue.Skip();
    }
}