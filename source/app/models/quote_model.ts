import { AppEvent, Model, ModelSetting } from "../../framework";
import { IMediator, IModel } from "../../framework/interface";

@ModelSetting('http://dev.markitondemand.com/Api/v2/Quote/jsonp')
export class QuoteModel extends Model implements IModel {
    constructor(mediator:IMediator) {
        super(mediator);
    }

    public initialize() {
        this.subscribeToEvents([new AppEvent('app.model.quote.change', null, (e, data) => {
            this.onChange(data);
        })]);
    }

    public dispose() {
        this.unsubscribeToEvents();
    }

    private onChange(data) : void {
        const s = { symbol : data};
        this.getAsync('jsonp',s)
        .then((jsonp_data) =>  {
            // 格式化数据
            const quote = this.formatModel(data);
            // 转移给marketView
            this.triggerEvent(new AppEvent('app.view.symbol.render', quote, null));

        })
        .catch((e) => this.triggerEvent(new AppEvent('app.error', e, null)));
    }

    private formatModel(data) {
        data.Change = data.Change.toFixed(2);
        data.ChangePercent = data.ChangePercent.toFixed(2);
        data.timestamp = new Date(data.timestamp).toLocaleDateString();
        data.marketCap = (data.marketCap / 10000000 ).toFixed(2) + 'M';
        data.ChangePercentYTD = data.ChangePercentYTD.toFixed(2);
        return {quote: data};
    }

}
