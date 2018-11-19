import { IMediator, IAppEvent } from "./interface";
import $ from 'jquery';
export class Mediator implements IMediator {
    private _isDebug;
    private _$:JQuery;

    constructor(isDebug:boolean = false) {
        this._isDebug = isDebug;
        // 创建一个内存中空的jQuery对象
        this._$ = $({}) as JQuery;
    }

    /**
     * 发布信息
     * publish
     */
    public publish(e:IAppEvent):void {
        if (this._isDebug) {
            console.log(new Date().getTime(), 'PUBLISH', e.topic, e.data);
        }
        this._$.trigger(e.topic, e.data)
    }
    /**
     * 监听信息
     * subscribe
     */
    public subscribe(e:IAppEvent):void {
        if (this._isDebug) {
            console.log(new Date().getTime(), 'SUBSCRIBE', e.topic, e.data);
        }
        this._$.on(e.topic, e.handler);
    }

    /**
     * 移除监听信息
     * unsubscribe
     */
    public unsubscribe(e:IAppEvent):void {
        if (this._isDebug) {
            console.log(new Date().getTime(), 'UNSUBSCRIBE', e.topic, e.data);
        }
        this._$.off(e.topic);
    }
}

