import { AppEvent, Model } from "../../framework";
import { IMediator, IModel } from "../../framework/interface";

export class NyseModel extends Model implements IModel {
    constructor(mediator:IMediator) {
        super(mediator);
    }

    public initialize() {
        this.subscribeToEvents([new AppEvent(
            'app.model.nyse.change',
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
            const stocks = {items: json_data, market: 'Nyse'};
            this.triggerEvent(new AppEvent(
                'app.view.market.render',
                stocks,
                null,
            ));
        }).catch((e) => {
            this.triggerEvent(new AppEvent(
                'app.error',
                e,
                null,
            ));
        });
    }
}
