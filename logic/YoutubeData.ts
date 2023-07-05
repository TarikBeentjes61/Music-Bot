import { Song } from "../model/Song";

export class YoutubeData 
{
    key: string;
    maxResults : number;
    constructor(key: string)
    {
        this.key = key;
        this.maxResults = 25;
    }

    private BuildUrl(keyWord : string) 
    {
        return `https://www.googleapis.com/youtube/v3/search?key=${this.key}&q=${encodeURIComponent(keyWord)}&part=snippet,id&chart=mostPopular&maxResults=${this.maxResults}`;
    }

    public async FetchSongsByKeyWord(keyWord : string){
        let data = this.FetchVideoData(this.BuildUrl(keyWord));
        let songs: Song[] = new Array(this.maxResults);

        return this.GetSongsFromDataItems(songs, data);
    }
    private async FetchVideoData(url : string) : Promise<any>
    {
        const response = await fetch(url);
        return await response.json();
    }

    private GetSongsFromDataItems(songs : Song[], items : any) : Song[]{
        for (let i = 0; i < items.length-1; i++) 
        {
            songs[i] = new Song(items[i].snippet.title, items[i].id.videoId);
        }
        return songs;
    }
}