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
    public Start() 
    {

    }
    private SetupEventListeners(client : Client) 
    {
        client.once('ready', () => 
        {
            console.log('Bot succesfully logged in!');
        })
        client.on('messageCreate', (message : Message) => 
        {
            if (message.author.bot) return;
            if (!message.content.startsWith(this.prefix)) return;
            const args = message.content.slice(this.prefix.length).trim().split(/ +/g);
            if(this.commands.get(args[0]) == undefined) return;
            let command : Command | undefined = this.commands.get(args[0].toLowerCase());
            if(command != undefined) {
                command.execute(message);
            }
        })
    }
}