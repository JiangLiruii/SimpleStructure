import { AppEvent } from './app_event';
import { EventEmitter } from './event_emitter';
import { IMediator, IRoute, IRouter } from './interface';
import { Route } from './route';

export class Router extends EventEmitter implements IRouter {
    private _defaultController:string;
    private _defaultAction:string;

    constructor(mediator:IMediator, defaultController:string, defaultAction:string) {
        super(mediator);
        this._defaultController = defaultController;
        this._defaultAction = defaultAction;
    }

    public initialize() {
        $(window).on('hashchange', () => {
            const r = this.getRoute();
            this.onRouteChange(r);

        });
        this.subscribeToEvents([new AppEvent(
            'app.initialize',
            null,
            (e:any, data?:Route) => {
                this.onRouteChange(data);
            },
        )]);
    }

    private getRoute() {
        const h = window.location.hash;
        return this.parseRoute(h);
    }

    private parseRoute(hash:string) {
        let comp:string[], controller, action, args;
        if (hash[hash.length - 1] === '/') {
            hash = hash.substring(0, hash.length - 1);
        }
        comp = hash.replace('#', '').split('/');
        controller = comp[0] || this._defaultController;
        action = comp[1] || this._defaultAction;
        args = comp.slice(2, comp.length - 1);
        return new Route(controller, action, args);
    }

    // 通过controller将控制权交给dispatcher
    private onRouteChange(route:Route) {
        this.triggerEvent(new AppEvent(
            'app.dispatch',
            route,
            null,
        ));
    }
}
