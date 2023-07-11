import { Message } from "discord.js";
import { Command } from "../../model/Command";

export class SkipToCommand implements Command
{
    requireArguments : boolean = false;
    description : string = 'Skips to specified index'

    execute(message: Message): void
    {

    }
}