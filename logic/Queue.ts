import { createAudioResource, AudioResource, createAudioPlayer, VoiceConnection, joinVoiceChannel,
    DiscordGatewayAdapterCreator, AudioPlayer, AudioPlayerStatus } from "@discordjs/voice";
import { Song } from "../model/Song";
import { AudioStream } from "./AudioStream";
import { Message } from "discord.js";

export class Queue
{
    private static instance : Queue;
    private songs : Song[];
    private currentSong : Song | undefined
    private voiceConnection : VoiceConnection | null
    private audioPlayer : AudioPlayer;
    private audioStream : AudioStream;
    public state : AudioPlayerStatus

    constructor() 
    {
        this.audioPlayer = createAudioPlayer();
        this.audioStream = new AudioStream();
        this.voiceConnection = null;
        this.songs = [];
        this.currentSong = undefined;
        this.CreatePlayerEvents();
        this.state = AudioPlayerStatus.Idle;
    }

    public static GetInstance() : Queue
    {
        if(!Queue.instance) { Queue.instance = new Queue(); }
        return Queue.instance;
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
                this.PlayStream(createAudioResource('./stream.mp3'));
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
    private CreatePlayerEvents() : void
    {
        this.audioPlayer.on(AudioPlayerStatus.Playing, () => {
            this.state = AudioPlayerStatus.Playing;
            console.log('Audio player is in the playing state!');
        });
        this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
            this.state = AudioPlayerStatus.Idle;
            console.log('Audio player is in the idle state!');
            this.PlayNextSong();
        });
        this.audioPlayer.on(AudioPlayerStatus.Paused, () => {
            this.state = AudioPlayerStatus.Paused;
            console.log('Audio player is in the paused state!');
        });
        this.audioPlayer.on("error", error => {
            console.log(error);
        })
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
        this.PlayNextSong();
    }
    public SkipTo(index : number) : void
    {
        const firstSong = this.songs[0];
        const nextSong = this.songs[index];

        this.songs[0] = nextSong;
        this.songs[index] = firstSong;
        this.PlayNextSong();

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
        let copySongs : Song[] = [];
        let length = copySongs.length;
        while(length)
        {
            const i = Math.floor((Math.random() * this.songs.length));

            if(i in copySongs) {
                copySongs.push(this.songs[i]);
                delete this.songs[i];
                length--;
            }
        }
        this.songs = copySongs;
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
    