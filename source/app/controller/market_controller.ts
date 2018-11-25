import { AppEvent, Controller } from "../../framework";
import { IController, IMediator, IModel, IView } from "../../framework/interface";
import { NasdaqModel } from "../models/nasdaq_model";
import { NyseModel } from "../models/nyse_model";
import { MarketView } from "../views/market_view";

export class MarketController extends Controller implements IController {
    // NOTE 将view和model设置为controller的属性
    private _markeView:IView;
    private _nasdaqModel:IModel;
    private _nyseModel:IModel;
    constructor(mediator:IMediator) {
        super(mediator);
        this._markeView = new MarketView(mediator);
        this._nasdaqModel = new NasdaqModel(mediator);
        this._nyseModel = new NyseModel(mediator);
    }

    public initialize() {
        this.subscribeToEvents([
            new AppEvent('app.controller.market.nasdaq', null, (e, data) => this.nasdaq(data)),
            new AppEvent('app.controller.market.nyse', null, (e, data) => this.nyse(data)),
        ]);
        this._markeView.initialize();
        this._nasdaqModel.initialize();
        this._nyseModel.initialize();

    }

    public dispose() {
        this.unsubscribeToEvents();
        this._markeView.dispose();
        this._nasdaqModel.dispose();
        this._nyseModel.dispose();
    }

    private nasdaq(data) {
        this._mediator.publish(new AppEvent('app.model.nasdaq.change', null, null));
    }

    private nyse(data) {
        this._mediator.publish(new AppEvent('app.model.nyse.change', null, null));
    }
}
