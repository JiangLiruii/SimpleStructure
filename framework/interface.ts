export interface IAppEvent {
    topic:string;
    data:any;
    handler:(e:any, data?:any) => void
}

export interface IMediator {
    publish(e:IAppEvent):void;
    subscribe(e:IAppEvent):void
    unsubscribe(e:IAppEvent):void;
}

export interface IControllerDetails {
    controllerName:string;
    controller:{ new(...args:any[]):IController};
}

export interface IController {
    initialize():void;
    dispose():void;
}

// 指明可用的程序设置
export interface IAppSettings {
    isDebug:boolean;
    defaultContrutctor:string;
    defaultAction:string;
    controller:IControllerDetails[];
    onErrorHandler:(o:Object) => void;
}

// 事件发射, 每个组件都需要依赖这个类
export interface IEventEmitter {
    triggerEvent(event:IAppEvent);
    subscribeToEvents(events:IAppEvent[]);
    unsubscribeToEvents(events:IAppEvent[]);
}

// 创建与销毁controller
export interface IDispatcher {
    initialize():void;
}

export interface IRoute {
    controllerName:string;
    actionName:string;
    args:any[];
    // 将Route类实例化成一个url
    serialize():string;
}

export interface IRouter {
    initialize():void;
}
