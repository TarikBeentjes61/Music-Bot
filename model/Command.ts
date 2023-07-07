import { Message } from "discord.js";

export interface Command
{
    prefix : string;
    name : string;
    execute(interaction: Message | null) : any;
}