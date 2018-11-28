import { AppEvent, Controller } from "../../framework";
import { IController, IMediator, IModel, IView } from "../../framework/interface";
import { ChartModel } from "../models/chart_model";
import { QuoteModel } from "../models/quote_model";
import { ChartView } from "../views/chart_view";
import { SymbolView } from "../views/symbol_view";

export class SymbolController extends Controller implements IController {
    private _quoteModel:IModel;
    private _chartModel:IModel;
    private _symbolView:IView;
    private _chartView:IView;

    constructor(mediator:IMediator) {
        super(mediator);
        this._quoteModel = new QuoteModel(mediator);
        this._chartModel = new ChartModel(mediator);
        this._symbolView = new SymbolView(mediator);
        this._chartView = new ChartView(mediator);
    }

    public initialize() {
        this.subscribeToEvents([
            new AppEvent('app.controller.symbol.quote', null, (e, symbol:string) => {
                this.quote(symbol);
            }),
        ]);
        this._chartModel.initialize();
        this._chartView.initialize();
        this._quoteModel.initialize();
        this._symbolView.initialize();
    }

    public dispose() {
        this.unsubscribeToEvents();
        this._chartModel.dispose();
        this._chartView.dispose();
        this._quoteModel.dispose();
        this._symbolView.dispose();
    }

    private quote(symbol) {
        this.triggerEvent(new AppEvent('app.model.quote.change', symbol, null));
    }
}
