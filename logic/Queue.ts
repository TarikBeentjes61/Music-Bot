import { createAudioResource, AudioResource, createAudioPlayer, VoiceConnection, joinVoiceChannel,
    DiscordGatewayAdapterCreator, AudioPlayer, generateDependencyReport, AudioPlayerState, AudioPlayerStatus  } from "@discordjs/voice";
import { Song } from "../model/Song";
import { AudioStream } from "./AudioStream";

export class Queue
{
    private static instance : Queue;
    private songs : Song[];
    private voiceConnection : VoiceConnection | null
    private audioPlayer : AudioPlayer;
    private config : any;
    private state : AudioPlayerStatus

    constructor() 
    {
        this.audioPlayer = createAudioPlayer();
        this.config = null;
        this.voiceConnection = null;
        this.songs = [];
        this.state = AudioPlayerStatus.Idle;
        this.CreatePlayerEvents();
    }
    public SetConfig(config : any) : void 
    {
        this.config = config;
    }
    public static GetInstance() : Queue
    {
        if(!Queue.instance) { Queue.instance = new Queue(); }
        return Queue.instance;
    }
    public CreateConnection(channelId : string, guildId : string, adapterCreator : DiscordGatewayAdapterCreator) : void 
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
    }
    public PlayNextSong() : void 
    {
        const song = this.songs.shift();
        if(song == undefined) return;
        const audioStream = new AudioStream(this.config.ytdlOptions);
        audioStream.GetAudioStreamFromSong(song)
        .then(() => {
            this.PlayStream(createAudioResource('./stream.mp3'));
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
        });
        this.audioPlayer.on(AudioPlayerStatus.Paused, () => {
            this.state = AudioPlayerStatus.Paused;
            console.log('Audio player is in the paused state!');
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
        this.PlayNextSong();
    }
    public GetSongArray() : Song[]
    {
        return this.songs;
    }
    public AddSongAtIndex() : void
    {
        
    }
    public Shuffle() : void
    {

    }
    public RemoveAtIndex() : void
    {

    }
}
    