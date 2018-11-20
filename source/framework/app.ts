import { AppEvent } from "./app_event";
import { Dispatcher } from "./dispatcher";
import { IAppSettings, IControllerDetails, IDispatcher, IMediator, IRouter } from "./interface";
import { Mediator } from "./mediator";
import { Router } from "./router";

export class App {
    private _dispatcher:IDispatcher;
    private _mediator:IMediator;
    private _router:IRouter;
    private _controllers:IControllerDetails[];
    private _onErrorHandler:(o:object) => void;
    constructor(appSettings:IAppSettings) {
        this._controllers = appSettings.controllers;
        this._onErrorHandler = appSettings.onErrorHandler;
        this._mediator = new Mediator(appSettings.isDebug);
        this._dispatcher = new Dispatcher(this._mediator, this._controllers);
        this._router = new Router(this._mediator, appSettings.defaultController, appSettings.defaultAction);
    }

    public initialize() {
        this._router.initialize();
        this._dispatcher.initialize();
        this._mediator.subscribe(new AppEvent(
            'app.error',
            null,
            (e:any, data?:any) => {
                this._onErrorHandler(data);
            },
        ));
        this._mediator.publish(new AppEvent(
            'app.initialize',
            null,
            null,
        ));
    }
}
