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

    public async GetAudioStreamFromSong(song : Song) : Promise<void>
     {
        let url = this.UrlFromSong(song);
        if(this.ValidateUrl(url)) {

            const audioInfo = await ytdl.getInfo(url);
            const audioFormat = ytdl.chooseFormat(audioInfo.formats, { quality: 'highestaudio' });
            const audioStream = ytdl(url, { filter: 'audioonly', format: audioFormat });
            const fileStream = fs.createWriteStream('./stream.ffmpeg');
        
            return new Promise<void>((resolve, reject) => {
                audioStream.pipe(fileStream);
                audioStream.on('end', () => {
                    resolve();
                });
                audioStream.on('error', (error : any) => {
                    reject(error);
                });
            });
        }
     }
    private UrlFromSong(song : Song) {
        return `https://www.youtube.com/watch?v=${song.videoId}`
    }
    private ValidateUrl(url : string) {
        return ytdl.validateURL(url);
    }
}

