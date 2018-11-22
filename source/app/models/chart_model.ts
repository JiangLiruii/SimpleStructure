import { App, AppEvent, Model } from "../../framework";
import { IMediator, IModel } from "../../framework/interface";

export class ChartModel extends Model implements IModel {
    constructor(mediator:IMediator) {
        super(mediator);
    }

    public initialize() {
        this.subscribeToEvents([
            new AppEvent('app.model.chart.change', null, (e, data) => {
                this.onChange(data);
            }),
        ]);
    }

    public dispose() {
        this.unsubscribeToEvents();
    }

    // 格式化请求和响应部分
    private onChange(data) {
        const p = {
            DataPeriod: 'Day',
            Elements: [
                {Symbol: data, Type: 'price', Params: ['ohlc']},
            ],
            Normalized: false,
            NumberOfDays: 365,
        };
        const queryString = `parameters=${encodeURIComponent(JSON.stringify(p))}`;
        this.getAsync('jsonp', queryString)
        .then((jsonp_data) => {
            // 格式化数据
            const chartData = this.formatModel(data, jsonp_data);

            // 将控制权转移给market view
            this.triggerEvent(new AppEvent(
                'app.view.chart.render',
                chartData,
                null,
            ));
        })
        .catch((e) => this.triggerEvent(new AppEvent('app.error', e, null)));
    }

    private formatModel(symbol, data) {
        const chartData = {
            series : [],
            title : symbol,
          };

        const series = [
            { name : "open", data : data.Elements[0].DataSeries.open.values },
            { name : "close", data : data.Elements[0].DataSeries.close.values },
            { name : "high", data : data.Elements[0].DataSeries.high.values },
            { name : "low", data : data.Elements[0].DataSeries.low.values },
          ];

        for(let i = 0; i < series.length; i++) {
            const serie = {
                data: [],
                name: series[i].name,
            };

            for(let j = 0; j < series[i].data.length; j++) {
              const val = series[i].data[j];
              const d = new Date(data.Dates[j]).getTime();
              serie.data.push([d, val]);
            }

            chartData.series.push(serie);
          }
        return chartData;
    }
}
