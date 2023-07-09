import { Message } from "discord.js";
import { Command } from "../../model/Command";
import { Queue } from '../../logic/Queue'
import { DiscordGatewayAdapterCreator } from "@discordjs/voice";
import { YoutubeData } from "../../logic/YoutubeData";

export class PlayCommand implements Command
{
    prefix : string = 'Play';
    name : string = '#';
    requireArguments : boolean = true;
    async execute(message: Message): Promise<any>
    {
        if(message.guildId == null) return;
        if(message.guild?.voiceAdapterCreator == null) return;
        if(message.member?.voice.channelId == null) return message.reply("U are not currently in a voice channel");

        let queue = Queue.GetInstance();
        queue.CreateConnection
        (
            message.member.voice.channelId,
            message.guildId,
            message.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
        );
        const youtubeData = new YoutubeData();
        const args = message.content.substring(this.prefix.length+this.name.length);
        youtubeData.FetchSongByKeyWord(`${args}`)
        .then(song => {
            queue.AddSong(song);
        })
    }

}