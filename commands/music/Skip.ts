import { Message } from "discord.js";
import { Command } from "../../model/Command";
import { Queue } from "../../logic/Queue";
import { AudioPlayerStatus } from "@discordjs/voice";

export class SkipCommand implements Command
{
    requireArguments : boolean = false;
    description : string = 'Skip a song'

    execute(message: Message): void
    {
        let queue = Queue.GetInstance();
        if(queue.state != AudioPlayerStatus.Playing) {
            message.reply('There is no song currently playing');
            return;
        }
        queue.Skip();
    }
}