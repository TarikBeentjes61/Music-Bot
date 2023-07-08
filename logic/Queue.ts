import { createAudioResource, AudioResource, createAudioPlayer, VoiceConnection, joinVoiceChannel,
     JoinVoiceChannelOptions, CreateVoiceConnectionOptions, DiscordGatewayAdapterCreator, AudioPlayer, generateDependencyReport, StreamType } from "@discordjs/voice";
import { Song } from "../model/Song";
import { AudioStream } from "./AudioStream";
import { Config } from "../config";
import * as fs from 'fs';

export class Queue
{

    private static instance : Queue;
    private songs : Song[];
    private voiceConnection : VoiceConnection | null
    private audioStream : AudioStream | null;
    private currentSong : Song[] | null
    private audioPlayer : AudioPlayer;
    private config : any;

    constructor() 
    {
        this.audioPlayer = createAudioPlayer();
        this.config = null;
        this.voiceConnection = null;
        this.audioStream = null;
        this.currentSong = null;
        this.songs = [];
    }
    public SetConfig(config : any) 
    {
        this.config = config;
    }
    public static GetInstance() : Queue
    {
        if(!Queue.instance) { Queue.instance = new Queue(); }
        return Queue.instance;
    }
    public CreateConnection(channelId : string, guildId : string, adapterCreator : DiscordGatewayAdapterCreator) 
    {
        if(!this.voiceConnection)
         {
            this.voiceConnection = joinVoiceChannel
            ({
                channelId: channelId,
                guildId: guildId,
                adapterCreator : adapterCreator
            });
        }
        this.voiceConnection.subscribe(this.audioPlayer);
        this.voiceConnection.playOpusPacket
    }
    public PlayNextSong() 
    {
        console.log(generateDependencyReport());
        this.audioStream = new AudioStream(this.config.ytdlOptions);
        this.audioStream.GetAudioStreamFromSong(this.songs[0])
        .then(() => {
            
            this.PlayStream(createAudioResource(fs.createReadStream(this.config.streamPath), {
                inputType : StreamType.Arbitrary
            }));
        })
    }
    private CreatePlayerEvents() 
    {
    }
    private async PlayStream(resource : AudioResource) 
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
    public AddSong(song : Song) 
    {
        this.songs.push(song);
    }
    public AddSongs(songs: Song[]) 
    {
        songs.forEach(song => {
            this.songs.push(song);
        });
    }
    public Skip() 
    {

    }
    public AddSongAtIndex() {
        
    }

    public Shuffle() {

    }
    public RemoveAtIndex() {

    }
}
    