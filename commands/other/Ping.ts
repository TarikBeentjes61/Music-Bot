import { Message } from "discord.js";
import { Command } from "../../model/Command";

export class PingCommand implements Command
{
    requireArguments : boolean = false;
    description : string = 'Pings to check the connection'

    execute(message: Message): void
    {

    }
}