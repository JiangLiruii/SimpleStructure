import * as Highcharts from 'highcharts';
import * as $ from 'jquery';
import { AppEvent, View, ViewSetting } from "../../framework";
import { IMediator, IView } from "../../framework/interface";

@ViewSetting(null, '#chart_container')
export class ChartView extends View implements IView {
    constructor(mediator:IMediator) {
        super(mediator);
    }
    public initialize() {
        this.subscribeToEvents([new AppEvent('app.view.chart.render', null, (e, model:any) => {
            this.renderChart(model);
            this.bindDomEvents(model);
        })]);
    }

    public dispose() {
        this.unbindDomEvents();
        this.unsubscribeToEvents();
    }

    protected bindDomEvents(model) {
        const scope = $(this._container);
        // DOM manipulate to bind
    }

    protected unbindDomEvents() {
        const scope = $(this._container);
        // DOM manipulate to unbind
    }

    private renderChart(model) {
        $(this._container).highcharts({
            chart: {
                zoomType: 'x',
            },
            legend: {
                enabled: true,
            },
            plotOptions: {
                area: {
                    lineWidth: 0.1,
                    marker: {
                        radius: 0,
                    },
                    threshold: null,
                },
                series: model.series,
            },
            subtitle: {
                text: 'click and drag in the plot area to zoom in',
            },
            title: {
                text: model.title,
            },
            tooltip: {
                crosshairs: true,
                shared: true,
            },
            xAxis: {
                type: 'datetime',
            },
            yAxis: {
                title: {
                    text: 'Price',
                },
            },
        });
    }
}
