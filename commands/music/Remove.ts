import { Message } from "discord.js";
import { Command } from "../../model/Command";
import { Queue } from '../../logic/Queue'

export class RemoveCommand implements Command
{
    requireArguments : boolean = false;
    description : string = 'Remove a song of the specified index'

    execute(message: Message): void
    {
        const index = parseInt(message.content);
        const queue = Queue.GetInstance();
        const song = queue.GetSongArray()[index-1];
        queue.RemoveAtIndex(index);
        if(song != undefined) {
            message.channel.send(`${song} succesfully removed from the queue`);
        }
        else {
            message.channel.send('No song is at the given index');
        }
    }
}