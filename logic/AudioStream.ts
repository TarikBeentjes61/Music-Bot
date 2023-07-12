import ytdl = require('ytdl-core');
import * as fs from 'fs';
import { Song } from '../model/Song';

export class AudioStream 
{
    private audioStream : any;
    private writeStream : any;

    constructor() 
    {
        this.audioStream = undefined;
        this.writeStream = undefined;
    }
    public async GetAudioStreamFromSong(song : Song) : Promise<boolean>
     {
        let url = this.UrlFromSong(song);
        this.CancelStream();
        this.audioStream = ytdl(url, {filter: 'audioonly'});        
        this.writeStream = fs.createWriteStream('./stream.mp3');
        let chunks = 0;
        if(this.ValidateUrl(url)) {
            return new Promise<boolean>((resolve, reject) => {
                let startTime : number;
                this.audioStream.pipe(this.writeStream);
                this.audioStream.on('data', () => {
                    if(chunks > 15) {
                        resolve(true);
                    } else {
                        chunks++;
                        console.log(chunks);
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
    private CancelStream() 
    {
        if(this.audioStream != undefined && this.writeStream != undefined) {
            this.audioStream.destroy();
            this.writeStream.destroy();
        }
    }
}

