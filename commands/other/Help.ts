import { Message } from "discord.js";
import { Command } from "../../model/Command";

export class HelpCommand implements Command
{
    requireArguments : boolean = false;
    description : string = '';

    execute(message: Message): void
    {
        
    }
}