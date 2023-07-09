import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message } from "discord.js";
import { Command } from "../../model/Command";
import { Queue } from '../../logic/Queue'
import { Song } from "../../model/Song";

export class QueueCommand implements Command
{
    prefix : string;
    name : string;
    requireArguments : boolean = false;

    constructor() 
    {
        this.name = 'Play';
        this.prefix = '#';
    }
    async execute(message: Message | null): Promise<void>
    {
        if(message == null) return;
        const songs = Queue.GetInstance().GetSongArray();
        const chunkSize = 10;
        const pages = Math.ceil(songs.length / chunkSize);
        const embeds : EmbedBuilder[]= [];

        for(let i =0; i < pages; i++) 
        {
            const startIndex = i*chunkSize;
            const endIndex = startIndex+chunkSize;
            const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Queue")
            .setDescription
            (
                songs.slice(startIndex,endIndex).join("\n")
            )
            .setFooter({text: `Page ${i+1} | Total ${songs.length} songs`
        });
            embeds.push(embed);
        }

        if (embeds.length === 1) {
            message.channel.send({embeds: [embeds[0]]});
        }

        const prevButton = new ButtonBuilder()
            .setCustomId("Previous")
            .setLabel("Previous")
            .setStyle(ButtonStyle.Secondary);

        const nextButton = new ButtonBuilder()
            .setCustomId("Next")
            .setLabel("Next")
            .setStyle(ButtonStyle.Secondary);

        let row : any = new ActionRowBuilder()
        .addComponents(prevButton, nextButton);
        //Send first embed and save the message data
        const sendMessage = await message.reply({
            embeds: [embeds[0]],
            components: [row],
        });

        let currentIndex = 0;
        //Create collector to listen for events from message
        const collector = sendMessage.createMessageComponentCollector({
            idle: 60000,
        });

        //Event for when a button is pressed
        collector.on("collect", (clickedButton) => {
        clickedButton.deferUpdate();

        switch (clickedButton.customId) {
            case "Previous":
                currentIndex = currentIndex === 0 ? embeds.length - 1 : currentIndex - 1;
            break;
            case "Next":
                currentIndex = currentIndex === embeds.length - 1 ? 0 : currentIndex + 1;
            break;
            default:
            break;
        }

        //Edit message with new embed
        sendMessage.edit({
            embeds: [embeds[currentIndex]],
            components: [row]
        });
    });
    //Gets called on idle end
    collector.on("end", () => {
        sendMessage.edit({
            components: []
        });
    });
    }
}