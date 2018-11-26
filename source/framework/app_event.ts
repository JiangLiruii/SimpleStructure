import {IAppEvent} from './interface';

export class AppEvent implements IAppEvent {
    public guid:string;
    public topic:string;
    public data:any;
    public handler:(e:object, data?:any) => void;
    constructor(topic:string, data:any, handler:(e:any,data?:any) => void) {
        this.guid = this.generateGuid();
        this.topic = topic;
        this.data = data;
        this.handler = handler;
    }
    // 生成一个二进制, 128位的数字标识符, 16进制即为32位数字标识符, 最大限度确保标识符唯一.
    private generateGuid() : string {
        return this.s4() + this.s4() + '-' +
            this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }

    // 生成这个数字标识符中的一部分.
    private s4() : string {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
}
