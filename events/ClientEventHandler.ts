import { Client, Message, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { Command } from '../model/Command';
import { PlayCommand, PingCommand } from '../commands/index';

export class ClientEventHandler
{
    private prefix : string;
    private commands: Map<string, Command>;

    constructor(client : Client, prefix : string) 
    {
        this.commands = new Map<string, Command>
        ([
            ["play", new PlayCommand()],
            ["ping", new PingCommand()]
        ]);
        this.prefix = prefix;
        this.SetupEventListeners(client);
    }
    private SetupEventListeners(client : Client) 
    {
        client.once('ready', () => 
        {
            console.log('Bot succesfully logged in!');
        })
        client.on('messageCreate', (message : Message) => 
        {
            if(this.IsMessageValid(message)) 
            {
                const args = message.content.slice(this.prefix.length).trim().split(/ +/g);
                let commandName = args[0].toLowerCase();
                let command : Command | undefined = this.commands.get(commandName);
                if(command?.requireArguments && args[1] == null) message.reply('Please provide valid arguments');

                message.content = message.content.substring(this.prefix.length+commandName.length);
                if(command != undefined) command.execute(message);
            }
        })
    }
    private IsMessageValid(message : Message) : boolean 
    {
        if (message.author.bot) return false;
        if (!message.content.startsWith(this.prefix)) return false;

        return true;
    }
}