import { Queue } from "./Queue";

export class QueueManager
{
    private static instance : QueueManager;
    private queues : Map<string, Queue>;

    constructor() 
    {
        this.queues = new Map<string, Queue>;
    }
    public static GetInstance() 
    {
        if(!QueueManager.instance) { QueueManager.instance = new QueueManager(); }
        return QueueManager.instance;
    }

    public GetQueueByGuildId(guildId : string) : Queue | undefined
    {
        return this.queues.get(guildId);
    }
    public AddNewQueueByGuildId(guildId : string) 
    {
        this.queues.set(guildId, new Queue(guildId));
    }
    public DeleteQueueByGuildId(guildId : string) 
    {
        this.queues.delete(guildId);
    }
    public HasQueueByGuildId(guildId : string) : boolean 
    {
        if(this.queues.has(guildId)) return true;
        return false;
    }
}