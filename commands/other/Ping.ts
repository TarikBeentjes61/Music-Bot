import { Message } from "discord.js";
import { Command } from "../../model/Command";

export class PingCommand implements Command
{
    prefix : string;
    name : string;
    constructor() 
    {
        this.name = 'Play';
        this.prefix = '#';
    }
    execute(message: Message | null): void
    {

    }
}