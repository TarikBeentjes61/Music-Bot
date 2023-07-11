import { Song } from "../model/Song";
import ytdl = require('ytdl-core');

export class YoutubeData 
{
    key: string;
    maxResults : number;
    constructor()
    {
        this.key = 'AIzaSyAFrusHdVHWJMhYesAvJGLfe_3u9a4OXQo';
        this.maxResults = 25;
    }
    private BuildUrl(keyWord : string) 
    {
        return `https://www.googleapis.com/youtube/v3/search?key=${this.key}&q=${encodeURIComponent(keyWord)}&part=snippet,id&chart=mostPopular&maxResults=${this.maxResults}`;
    }
    public async FetchSongsByKeyWord(keyWord : string) : Promise<Song[]>
    {
        let url = this.BuildUrl(keyWord);
        return this.GetSongsFromDataItems(await this.FetchVideoDataByYTDataUrl(url));
    }
    public async FetchSongByKeyWord(keyWord : string) : Promise<any>
    {
        const url = this.BuildUrl(keyWord);
        const song = this.GetSongFromDataItems(await this.FetchVideoDataByYTDataUrl(url));
        if(song == undefined) return undefined;
        return song;
    }    
    private async FetchVideoDataByYTDataUrl(url : string) : Promise<any>
    {
        let promise = new Promise<any>((resolve, reject) => {
            fetch(url)
            .then(response => {
                if(response.ok) resolve(response.json());
                reject("Something went wrong");
            })
            .catch(error => {
                reject(error);
            })
        })
        return await promise;
    }
    private GetSongsFromDataItems(data : any) : Song[]
    {
        let songs: Song[] = new Array(this.maxResults);
        if(!this.CheckIfDataIsValid(data)) return songs;
        for (let i = 0; i < data.items.length; i++) 
        {
            songs[i] = new Song(data.items[i].snippet.title, data.items[i].id.videoId);
        }
        return songs;
    }
    private GetSongFromDataItems(data: any) : Song | undefined
    {
        if(!this.CheckIfDataIsValid(data)) return undefined;
        return new Song(data.items[0].snippet.title, data.items[0].id.videoId);
    }
    private CheckIfDataIsValid(data : any) : boolean
    {
        if(data != undefined || data.items.length > 0) return true;
        return false;
    }
}