import { Message } from "discord.js";

export interface Command
{
    prefix : string;
    name : string;
    requireArguments : boolean;
    execute(interaction: Message | null) : any;
}