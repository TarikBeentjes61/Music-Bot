
export class AudioStream 
{
    private ytdlOptions : any;
    private ytdl : any;
    private fs : any;
    constructor(url : string, ytdl : any, ytdlOptions : any) 
    {
        this.fs = require('fs');
        this.ytdl = ytdl;
        this.ytdlOptions = ytdlOptions;
    }

    public GetAudioStreamFromVideoId(videoId : string)
     {
        let url = this.UrlFromVideoId(videoId);
        if(this.ValidateUrl(url))
            this.ytdl(url, this.ytdlOptions).pipe(this.fs.createWriteStream('audio.mp3'));
        return;
    }
    private UrlFromVideoId(videoId : string) {
        return `https://www.youtube.com/watch?v=${videoId}`
    }
    private ValidateUrl(url : string) {
        return this.ytdl.validateURL(url);
    }
}

