import { EventEmitter } from "./event_emitter";
import { IDispatcher, IControllerDetails, IMediator, IEventEmitter, IRoute, IController } from "./interface";
import { AppEvent } from "./app_event";

export class Dispatcher extends EventEmitter implements IDispatcher {
    private _controllersHashMap:{};
    private _currentController:IController;
    private _currentControllerName:string;

    constructor(mediator:IMediator, controllers:IControllerDetails[]) {
        super(mediator);
        this._controllersHashMap = this.getController(controllers);
        this._currentController = null;
        this._currentControllerName = null;
    }
    
    // 监听app.dispatch
    public initialize() {
        this.subscribeToEvents([
            new AppEvent(
                'app.dispatch',
                null,
                (e:any, data?:any) => this.dispatch(data)
            )
            ])
    }

    
    // 获取controller的hash表, controller的name为键, controller.controller为值
    private getController(controllers:IControllerDetails[]):Object {
        let hashMap:{};
        const l = controllers.length;
        if (l <= 0) {
            this.triggerEvent(new AppEvent("app.error", "Cannot create an application without at least one controller", null))
        }
        for (let i = 0; i < l; i ++) {
            const controller = controllers[i]
            const name = controller.controllerName
            const hashMapEntry = hashMap[name];
            if (hashMapEntry !== null && hashMapEntry !== undefined) {
                this.triggerEvent(new AppEvent(
                    'app.error',
                    'Two controllers cannot have same name',
                    null
                ))
            }
            hashMap[name] = controller.controller;
        }
        return hashMap;
    }

    // 创建和销毁controller
    private dispatch(route:IRoute) {
        const Controller = this._controllersHashMap[route.controllerName]
        if (Controller === null || Controller === undefined) {
            this.triggerEvent(new AppEvent(
                'app.error',
                'Controller not Found',
                null
            ))
        } else {
            // 创建一个controller实例
            const controller:IController = new Controller(this._mediator);
            const a = controller[route.actionName];
            if (a === null || a === undefined) {
                this.triggerEvent(new AppEvent(
                    'app.error',
                    `Action ${route.actionName} not found in ${route.controllerName}`,
                    null
                ));
            } else {
                if (this._currentController === null) {
                    // 初始化_currentController
                    this._currentController = controller;
                    this._currentControllerName = route.controllerName;
                    this._currentController.initialize;
                } else {
                    // 如果之前的controller不再需要
                    if (this._currentControllerName !== route.controllerName) {
                        this._currentController.dispose();
                        this._currentControllerName = route.controllerName;
                        this._currentController = controller;
                        this._currentController.initialize();
                    }
                }
                // 传递给controller
                this.triggerEvent(new AppEvent(
                    `app.controller.${this._currentControllerName}.${route.actionName}`,
                    route.args,
                    null
                ))
            }
        }
    }
}