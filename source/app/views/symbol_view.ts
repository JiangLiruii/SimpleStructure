import { AppEvent, View } from "../../framework";
import { IMediator, IView } from "../../framework/interface";

// 通过app.view.symbol.render来渲染view

export class SymbolView extends View implements IView {
    constructor(mediator:IMediator) {
        super(mediator);
    }

    public initialize() {
        this.subscribeToEvents([new AppEvent('app.symbol.view.render', null, (e, data) => {
            this.renderAsync(data)
            .then((model:any) => {
                // 设置和dom事件
                this.bindDomEvents(model);

                // 将控制权转移到chart_view
                this.triggerEvent(new AppEvent('app.model.chart.change', model.quote.Symbol, null));
            })
            .catch((err) => this.triggerEvent(new AppEvent('app.error', err, null)));

        })]);
    }

    public dispose() {
        this.unbindDomEvents();
        this.unsubscribeToEvents();
    }

    protected bindDomEvents(model:any) {
        const scope = $(this._container);
        // 设置DOM事件监听
    }

    protected unbindDomEvents() {
        const scope = $(this._container);
        // 释放DOM事件
    }
}
