import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message } from "discord.js";
import { Command } from "../../model/Command";
import { QueueManager } from '../../logic/QueueManager'
import { Queue } from "../../logic/Queue";

export class QueueCommand implements Command
{
    requireArguments : boolean = false;
    description : string = 'Displays the current queue'

    async execute(message: Message): Promise<void>
    {
        if(message.guildId == null) return;
        const queue = QueueManager.GetInstance().GetQueueByGuildId(message.guildId);
        if(queue == undefined) return;
        if(queue.IsEmpty()) {
            message.channel.send('Queue is currently empty');
            return;
        } 
        const embeds = this.CreateEmbedsFromQueue(queue);
        if (embeds.length === 1) {
            message.channel.send({embeds: [embeds[0]]});
            return;
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

    private CreateEmbedsFromQueue(queue : Queue) : EmbedBuilder[]
    {
        const songs = queue.GetSongArray();
        const songTitles : string[] = [];
        songs.forEach(song => {
            songTitles.push(song.title);
        });
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
                songTitles.slice(startIndex,endIndex).join("\n") //-------------------------------
            )
            .setFooter({text: `Page ${i+1} | Total ${songTitles.length} songs`
        });
            embeds.push(embed);
        }
        return embeds;
    }
}