import { Message } from "discord.js";
import { Command } from "../../model/Command";
import { Queue } from '../../logic/Queue'

export class PauseCommand implements Command
{
    requireArguments : boolean = false;
    description : string = 'Pauses the current song'

    execute(message: Message): void
    {
        const state = Queue.GetInstance().Pause();
        message.channel.send(`Player succesfully ${state}`)
    }
}