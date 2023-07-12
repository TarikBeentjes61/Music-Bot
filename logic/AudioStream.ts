import ytdl = require('ytdl-core');
import * as fs from 'fs';
import { Song } from '../model/Song';

export class AudioStream 
{
    private ytdlOptions : any;
    private audioStream : any;

    constructor() 
    {
        let  fs = require('fs');
        const config = JSON.parse(fs.readFileSync('./config.json'));
        this.audioStream = undefined;
        this.ytdlOptions = config.ytdlOptions;
    }
    public async GetAudioStreamFromSong(song : Song) : Promise<boolean>
     {
        let url = this.UrlFromSong(song);
        if(this.ValidateUrl(url)) {
            this.audioStream = ytdl(url, { filter: this.ytdlOptions.filter});
            let chunks = 0;
            return new Promise<boolean>((resolve, reject) => {
                this.audioStream.pipe(fs.createWriteStream('./stream.mp3'));
                this.audioStream.on('data', () => {
                    chunks++;
                    console.log(chunks);
                    if(chunks > 20) {
                        resolve(true);
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
}

