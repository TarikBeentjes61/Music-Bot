import ytdl = require('ytdl-core');
import * as fs from 'fs';
import { Song } from '../model/Song';

export class AudioStream 
{
    private ytdlOptions : any;
    constructor(ytdlOptions : any) 
    {
        this.ytdlOptions = ytdlOptions;
    }

    public async GetAudioStreamFromSong(song : Song) : Promise<boolean>
     {
        let url = this.UrlFromSong(song);
        if(this.ValidateUrl(url)) {

            const audioStream = ytdl(url, { filter: this.ytdlOptions.filter});
            const fileStream = fs.createWriteStream('./stream.mp3');
            return new Promise<boolean>((resolve, reject) => {
                audioStream.pipe(fileStream);
                audioStream.once('data', () => {
                    resolve(true);
                });
                audioStream.on('error', (error : any) => {
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

