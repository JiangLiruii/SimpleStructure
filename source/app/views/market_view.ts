import * as $ from 'jquery';
import { AppEvent, Route, View } from "../../framework";
import { IMediator, IView } from '../../framework/interface';
export class MarketView extends View implements IView {
    constructor(mediator:IMediator) {
        super(mediator);
    }

    // SECTION 开始监听render事件
    public initialize():void {
        this.subscribeToEvents([
            new AppEvent(
                'app.view.market.render',
                null,
                (e, args:any) => {
                    this.renderAsync(args)
                    .then((model) => {
                        // 设置DOM事件
                        this.bindDomEvents(model);
                    });
                },
            ),
        ]);
    }

    // SECTION dispose app 和 DOM事件
    public dispose():void {
        this.unbindDomEvents();
        this.unsubscribeToEvents();
    }
    // SECTION  初始化DOM事件
    protected bindDomEvents(model:any) {
        const scope = this._container;
        // 处理点击事件
        $('.getQuote').on('click', scope, (e) => {
            const symbol = $(e.currentTarget).data('symbol');
            // 让列表变得可排序和可搜索
            this.getStockQuote(symbol);
        });
        $(scope).find('table').DataTable();
    }
    // 销毁dom监听器
    protected unbindDomEvents() {
        const scope = this._container;
        $('.getQuote').off('click', scope);
        const table = $(scope).find('table').DataTable();
        table.destroy();
    }

    private getStockQuote(symbol:string) {
        // 使用路由事件导航, 将路由切换为symbol
        this.triggerEvent(new AppEvent('app.route', new Route('symbol', 'quote', [symbol]), null));
    }
}
