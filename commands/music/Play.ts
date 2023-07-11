import { Message } from "discord.js";
import { Command } from "../../model/Command";
import { Queue } from '../../logic/Queue'
import { YoutubeData } from "../../logic/YoutubeData";

export class PlayCommand implements Command
{
    requireArguments : boolean = true;
    description : string = 'Play a song : play [args]'
    execute(message: Message): void
    {
        if(message.member?.voice.channelId == null) {
            message.reply("U are not currently in a voice channel");
            return;
        }
        let queue = Queue.GetInstance();
        queue.CreateConnectionFromMessage(message);
        new YoutubeData().FetchSongByKeyWord(`${message.content}`)
        .then(song => {
            if(song == undefined) {
                message.reply('Song could not be found');
            }
            else {
                message.channel.send(`Added ${song.title} to the queue`);
                queue.AddSong(song);
            }
        })
    }
}