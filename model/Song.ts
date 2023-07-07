export class Song 
{
    title : string | undefined;
    videoId : string | undefined;
    constructor()
    constructor(title : string, videoId : string)
    constructor(title? : string, videoId? : string) {
        this.title = title;
        this.videoId = videoId;
    }
}