import { Message } from "discord.js";
import { Command } from "../../model/Command";
import { QueueManager } from '../../logic/QueueManager'

export class RemoveCommand implements Command
{
    requireArguments : boolean = false;
    description : string = 'Remove a song of the specified index'

    execute(message: Message): void
    {
        const index = parseInt(message.content);
        if(message.guildId == null) return;
        const queue = QueueManager.GetInstance().GetQueueByGuildId(message.guildId);
        if(queue == undefined) return;
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