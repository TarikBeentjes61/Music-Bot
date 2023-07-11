import { Message } from "discord.js";

export interface Command
{
    requireArguments : boolean;
    description : string;
    execute(interaction: Message | null) : any;
}