import * as Handlebars from "handlebars";
import { reject, resolve } from "q";
import { EventEmitter } from "./event_emitter";
import { IMediator, IView } from "./interface";
// 为view提供一个模板的地址

export function ViewSetting(templateUrl:string, container:string) {
    return function(target:any) {
        const origin = target;
        function construct(constructor, args) {
            const c:any = function() {
                return constructor.apply(this,args);
            };
            c.prototype = constructor.prototype;
            return new c();
        }

        const f = function(...args) {
            return construct(origin, args);
        };

        f.prototype = origin.prototype;
        return f;
    };
}

export class View extends EventEmitter implements IView {
    private _templateUrl:string;
    private _container:string;
    private _templateDelegate:Handlebars.TemplateDelegate;

    constructor(mediator:IMediator) {
        super(mediator);
    }

    public initialize() {
        throw new Error('View.prototype.initialize() is abstruct and must be implemented');
    }

    public dispose() {
        throw new Error('View.prototype.dispose() is abstruct and must be implemented');
    }
    // View包含了两个新方法(bindDomEvents 和 unbindDomEvents), 也必须由其子类实现
    protected bindDomEvents(model:any) {
        throw new Error('View.prototype.bindDomEvents() is abstruct and must be implemented');
    }
    protected unbindDomEvents(model:any) {
        throw new Error('View.prototype.unbindDomEvents() is abstruct and must be implemented');
    }

    protected renderAsync(model) {
        return new Promise((res, rej) => {
            this.getTemplateAync().then((templateDelegate:Handlebars.TemplateDelegate) => {
                // 生成HTML再DOM中
                const html = templateDelegate(model);
                $(this._container).html(html);

                // 将model作为参数传给model. 让子视图和DOM实践初始化
                res(model);
            }).catch((e) => rej(e));
        });
    }

    private loadTemplateAsync() {
        return new Promise((res, rej) => {
            $.ajax({
                dataType: 'text',
                error: (...args) => rej(args),
                method: 'GET',
                success: (response) => res(response),
                url: this._templateUrl,
            });
        });
    }

    // 异步编译模块
    private compileTemplateAsync(source:string) {
        return new Promise((res, rej) => {
            try {
                const template = Handlebars.compile(source);
                res(template);
            } catch (e) {
                rej(e);
            }
        });
    }

    // 若操作仍未完成, 异步加载和编译模板
    private getTemplateAync() {
        return new Promise((res, rej) => {
            if (this._templateDelegate === undefined || this._templateDelegate === null) {
                this.loadTemplateAsync()
                .then((souce:string) => this.compileTemplateAsync(souce))
                .then((templateDelegate:Handlebars.TemplateDelegate) => {
                    this._templateDelegate = templateDelegate;
                    res(this._templateDelegate);
                })
                .catch((e) => rej(e));
            } else {
                res(this._templateDelegate);
            }
        });
    }
}
