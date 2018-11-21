import { AppEvent, Model } from "../../framework";
import { IMediator, IModel } from "../../framework/interface";

export class NasdaqModel extends Model implements IModel {

    constructor(mediator:IMediator) {
        super(mediator);
    }

    // 监听model事件
    public initialize() {
        this.subscribeToEvents([new AppEvent(
            'app.model.nasdaq.change',
            null,
            (e:any, data?:any) => {
                this.onChange(data);
            },
        )]);
    }

    public dispose() {
        this.unsubscribeToEvents();
    }

    private onChange(data) {
        this.getAsync('json', data)
        .then((json_data) => {
            // 格式化数据
            const stock = {item: json_data, market: 'nasdaq'};

            // 传给controller, 然后给到market view
            this.triggerEvent(new AppEvent(
                'app.view.market.render',
                stock,
                null,
            ));
        })
        .catch((e) => {
            // 传给全局错误处理的controller
            this.triggerEvent(new AppEvent('app.error', e, null));
        });
    }

}
