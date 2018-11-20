import { IAppEvent, IEventEmitter, IMediator } from "./interface";

export class EventEmitter implements IEventEmitter {
    protected _mediator:IMediator;
    protected _events:IAppEvent[];

    constructor(mediator:IMediator) {
        this._mediator = mediator;
    }

    public triggerEvent(event:IAppEvent) {
        this._mediator.publish(event);
    }

    public subscribeToEvents(events:IAppEvent[]) {
        this._events = events;
        for (const event of this._events) {
            this._mediator.subscribe(event);
        }
    }

    public unsubscribeToEvents(events:IAppEvent[]) {
        this._events = events;
        for (const event of this._events) {
            this._mediator.unsubscribe(event);
        }
    }
}
