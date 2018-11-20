import { EventEmitter} from './event_emitter';
import { IMediator, IModel } from "./interface";

// 需要为model提供网络服务的URL, 使用一个叫做ModelSettings的装饰器

// 可以通过构造函数注入URL, 但注入数据(与行为相反)到构造函数中被认为是不好的实践方式.

export function ModelSetting(serviceUrl:string) {
    return function(target:any) {
        const origin = target;
        // 生成类实例工具
        function construct(constructor, args) {
            const c:any = function() {
                return constructor.apply(this, args);
            };
            c.prototype = constructor.prototype;
            const instance = new c();
            instance._serviceUrl = serviceUrl;
            return instance;
        }
        // 新建构造函数行为
        const f:any = function(...args) {
            return construct(origin, args);
        };
        // 为了使instance可用.
        f.prototype = origin.prototype;

        return f;
    };
}

export class Model extends EventEmitter implements IModel {
    private _serviceUrl:string;
    constructor(mediator:IMediator) {
        super(mediator);
    }

    public initialize() {
        throw new Error('Model.prototype.initialize() is abstruct and must be implemented');
    }

    public dispose() {
        throw new Error('Model.prototype.dispose() is abstruct and must be implemented');
    }

    protected requestAsync(method:string, dataType:string, data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method,
                url: this._serviceUrl,
                data:data || {},
                dataType,
                success: (response) => resolve(response),
                error: (...args) => reject(args),
            });
        });
    }

    protected getAsync(dataType:string, data:any) {
        return this.requestAsync('GET', dataType, data);
    }

    protected postAsync(dataType, data) {
        return this.requestAsync('POST', dataType, data);
    }

    protected putAsync(dataType, data) {
        return this.requestAsync('PUT', dataType, data);
    }

    protected deleteAsync(dataType, data) {
        return this.requestAsync('DELETE', dataType, data);
    }
}
