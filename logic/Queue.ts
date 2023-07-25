import { createAudioResource, AudioResource, createAudioPlayer, VoiceConnection, joinVoiceChannel,
    DiscordGatewayAdapterCreator, AudioPlayer, AudioPlayerStatus } from "@discordjs/voice";
import { Song } from "../model/Song";
import { AudioStream } from "./AudioStream";
import { Message } from "discord.js";
import { QueueManager } from "./QueueManager";
import * as fs from 'fs';

export class Queue
{
    private guildId : string;
    private guildChannel : any;
    private songs : Song[];
    private currentSong : Song | undefined
    private voiceConnection : VoiceConnection | undefined
    private audioPlayer : AudioPlayer;
    private audioStream : AudioStream;
    public state : AudioPlayerStatus

    constructor(guildId : string) 
    {
        this.guildId = guildId;
        this.guildChannel = undefined;
        this.audioPlayer = createAudioPlayer();
        this.audioStream = new AudioStream(guildId);
        this.voiceConnection = undefined;
        this.songs = [];
        this.currentSong = undefined;
        this.CreatePlayerEvents();
        this.state = AudioPlayerStatus.Idle;
    }
    public SetMessageChannel(channel : any) {
        this.guildChannel = channel;
    }
    public CreateConnectionFromMessage(message : Message) : void 
    {
        if(!this.voiceConnection)
         {
            if(message.guildId == null) return;
            if(message.guild?.voiceAdapterCreator == null) return;
            if(message.member?.voice.channelId == null) return;

            this.voiceConnection = joinVoiceChannel
            ({
                channelId: message.member.voice.channelId,
                guildId: message.guildId,
                adapterCreator : message.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
            });
        }
        this.voiceConnection.subscribe(this.audioPlayer);
    }
    public PlayNextSong() : void
    {
        this.currentSong = this.songs.shift();
        if(this.currentSong == undefined) return;
        this.audioStream.GetAudioStreamFromSong(this.currentSong)
        .then((streamResult) => {
            if(streamResult)
            {
                this.PlayStream(createAudioResource(`./activestreams/stream${this.guildId}.mp3`));
                this.SendStartedPlayingMessage();
            }
            else 
            {
                console.log('Something went wrong with the stream');
            }
        })
        .catch(exception => {
            console.log(exception);
        });
    }
    private SendStartedPlayingMessage() {
        if(this.guildChannel != undefined && this.currentSong != undefined) {
            this.guildChannel.send(`Started playing ${this.currentSong.title}`);
        }
    }
    public DestroyQueue() 
    {
        this.voiceConnection?.disconnect();
        this.voiceConnection?.destroy();
        this.audioStream.CancelStream();
        QueueManager.GetInstance().DeleteQueueByGuildId(this.guildId);
    }
    private DestroyStreamFile() {
        const guildId = this.guildId;
        fs.stat(`./activestreams/stream${guildId}.mp3`, function (err, stats) {
            if (err) {
                return console.error(err);
            }
            fs.unlink(`./activestreams/stream${guildId}.mp3`,function(err){
                 if(err) return console.log(err);
            });  
         });
    }
    private CreatePlayerEvents() : void
    {
        this.audioPlayer.on(AudioPlayerStatus.Playing, () => {
            this.state = AudioPlayerStatus.Playing;
        });
        this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
            this.state = AudioPlayerStatus.Idle;
            this.PlayNextSong();
            if(this.currentSong == undefined && this.IsEmpty()) {
                this.DestroyQueue();
            }
        });
        this.audioPlayer.on(AudioPlayerStatus.Paused, () => {
            this.state = AudioPlayerStatus.Paused;
        });
        this.audioPlayer.on("error", error => {
            console.log(error);
        });
    }
    private PlayStream(resource : AudioResource) 
    {
        try 
        {
            this.audioPlayer.play(resource);
        } 
        catch (error : any) 
        {
            console.log(error);
        }
    }
    public AddSong(song : Song) : void 
    {
        this.songs.push(song);
        if(this.state != AudioPlayerStatus.Playing) this.PlayNextSong();
    }
    public AddSongs(songs: Song[]) : void 
    {
        songs.forEach(song => {
            this.songs.push(song);
        });
    }
    public Skip() : void 
    {
        this.audioPlayer.stop();
    }
    public SkipTo(index : number) : void
    {
        const firstSong = this.songs[0];
        const nextSong = this.songs[index];

        this.songs[0] = nextSong;
        this.songs[index] = firstSong;
        this.audioPlayer.stop();
    }
    public Stop() : void 
    {
        if(this.state == AudioPlayerStatus.Playing) this.audioPlayer.stop();
    }
    public GetSongArray() : Song[]
    {
        return this.songs;
    }
    public Shuffle() : void
    {
        let songs = this.songs;
        let length = this.songs.length;
        let index : number;
        let storedElement : Song;

        while(length) {
            index = Math.floor(Math.random() * length--);
            storedElement = songs[length];
            songs[length] = songs[index];
            songs[index] = storedElement;
        }
        this.songs = songs;
    }
    public Clear() : void
    {
        this.songs = [];
    }
    public Playing() : Song | undefined
    {
        return this.currentSong;
    }
    public Pause() : AudioPlayerStatus 
    {
        if(this.state == AudioPlayerStatus.Paused) {
            this.audioPlayer.unpause();
        }
        else if(this.state == AudioPlayerStatus.Playing){
            this.audioPlayer.pause();
        }
        return this.state;
    }
    public RemoveAtIndex(index : number) : void
    {
        index--;
        if(index < this.songs.length) {
            this.songs = this.songs.slice(0, index).concat(this.songs.slice(index+1));
        }
    }
    public IsEmpty() : boolean
    {
        if(this.songs.length > 0) return false;
        return true;
    }
}
    