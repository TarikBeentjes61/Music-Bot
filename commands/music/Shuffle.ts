import { Message } from "discord.js";
import { Command } from "../../model/Command";

export class ShuffleCommand implements Command
{
    requireArguments : boolean = false;
    description : string = 'Shuffles the queue'

    execute(message: Message): void
    {

    }
}