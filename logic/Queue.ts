import { createAudioResource, AudioResource, createAudioPlayer, VoiceConnection, joinVoiceChannel,
     JoinVoiceChannelOptions, CreateVoiceConnectionOptions, DiscordGatewayAdapterCreator, AudioPlayer } from "@discordjs/voice";
import { Song } from "../model/Song";
import { AudioStream } from "./AudioStream";
import { Config } from "../config";
export class Queue {

    private static instance : Queue;
    private songs : Song[];
    private voiceConnection : VoiceConnection | null
    private audioStream : AudioStream | null;
    private currentSong : Song[] | null
    private currentAudioResource : AudioResource | null;
    private audioPlayer : AudioPlayer;
    private config : Config;

    constructor() 
    {
        this.audioPlayer = createAudioPlayer();
        this.config = new Config();
        this.voiceConnection = null;
        this.audioStream = null;
        this.currentSong = null;
        this.currentAudioResource = null;
        this.songs = [];
    }
    public static GetInstance() : Queue
    {
        if(!Queue.instance) { Queue.instance = new Queue(); }
        return Queue.instance;
    }
    public CreateConnection(channelId : string, guildId : string, adapterCreator : DiscordGatewayAdapterCreator) 
    {
        if(!this.voiceConnection) {
            this.voiceConnection = joinVoiceChannel
            ({
                channelId: channelId,
                guildId: guildId,
                adapterCreator : adapterCreator
            });
        }
    }
    public PlayNextSong() 
    {
        this.audioStream = new AudioStream(this.config.filter);
        this.audioStream.GetAudioStreamFromSong(this.songs[0])
        .then(() => {
            let audioResource = createAudioResource('./stream.ffmpeg');
            this.audioPlayer.play(audioResource);
        }); 
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
    