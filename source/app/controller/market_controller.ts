import { Controller } from "../../framework";
import { IController, IMediator, IModel, IView } from "../../framework/interface";
import { MarketView } from "../views/market_view";

class MarketController extends Controller implements IController {
    // NOTE 将view和model设置为controller的属性
    private _markeView:IView;
    private _nasdaqModel:IModel;
    private _nyseModel:IModel;
    constructor(mediator:IMediator) {
        super(mediator);
        this._markeView = new MarketView(mediator);
    }
}
