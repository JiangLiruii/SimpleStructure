import {IAppEvent} from './interface'

export class AppEvent implements IAppEvent {
    public guid:string;
    public topic:string;
    public data:any;
    public handler:(e:Object, data?:any) => void;
    constructor(topic:string, data:any, handler:(e:any,data?:any) => void) {
        this.topic = topic;
        this.data = data;
        this.handler = handler;
    }
}
