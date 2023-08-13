import ytdl = require('ytdl-core');
import * as fs from 'fs';
import { Song } from '../model/Song';

export class AudioStream 
{
    private audioStream : any;
    private writeStream : any;
    private guildId : any;

    constructor(guildId : string) 
    {
        this.audioStream = undefined;
        this.writeStream = undefined;
        this.guildId = guildId;
    }
    public async GetAudioStreamFromSong(song : Song) : Promise<boolean>
     {
        let url = this.UrlFromSong(song);
        this.CancelStream();
        this.audioStream = ytdl(url, {filter: 'audioonly'});        
        this.writeStream = fs.createWriteStream(`./activestreams/stream${this.guildId}.mp3`);
        let chunks = 0;
        if(this.ValidateUrl(url)) {
            return new Promise<boolean>((resolve, reject) => {
                this.audioStream.pipe(this.writeStream);
                this.audioStream.on('data', () => {
                    if(chunks > 20) {
                        resolve(true);
                    } else {
                        chunks++;
                    }
                });
                this.audioStream.on('error', (error : any) => {
                    reject(error);
                });
            });
        } else {
            return false;
        }
     }
    private UrlFromSong(song : Song) {
        return `https://www.youtube.com/watch?v=${song.videoId}`
    }
    private ValidateUrl(url : string) {
        return ytdl.validateURL(url);
    }
    public CancelStream() 
    {
        if(this.audioStream != undefined && this.writeStream != undefined) {
            this.audioStream.destroy();
            this.writeStream.destroy();
        }
    }
}

