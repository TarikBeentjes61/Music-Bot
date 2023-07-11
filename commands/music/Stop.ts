import { Message } from "discord.js";
import { Command } from "../../model/Command";
import { Queue } from '../../logic/Queue'

export class StopCommand implements Command
{
    requireArguments : boolean = false;
    description : string = 'Stops the player'

    execute(message: Message): void
    {
        Queue.GetInstance().Stop();
        message.channel.send('Player stopped');
    }
}