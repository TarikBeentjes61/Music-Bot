import { Song } from "../model/Song";

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
        console.log(`URL: ${url}`);
        return this.GetSongsFromDataItems(await this.FetchVideoDataByUrl(url));
    }
    public async FetchSongByKeyWord(keyWord : string) : Promise<Song>
    {
        let url = this.BuildUrl(keyWord);
        console.log(`URL: ${url}`);
        return this.GetSongFromDataItems(await this.FetchVideoDataByUrl(url));
    }    
    public async FetchVideoDataByUrl(url : string) : Promise<any>
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
    private GetSongFromDataItems(data: any) : Song
    {
        if(!this.CheckIfDataIsValid(data)) return new Song();
        return new Song(data.items[0].snippet.title, data.items[0].id.videoId);
    }
    private CheckIfDataIsValid(data : any) : boolean
    {
        if(data != undefined || data.items.length > 0) return true;
        return false;
    }
}