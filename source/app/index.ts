import * as Frameworks from '../framework';
import { IAppSettings } from '../framework/interface';
import { MarketController } from './controller/market_controller';
import { SymbolController } from './controller/symbol';
const appSetting:IAppSettings = {
    // NOTE 设置中最重要的字段
    controllers: [
        {controllerName: 'market', controller: MarketController},
        {controllerName: 'symbol', controller: SymbolController},
    ],
    defaultAction: 'nasdaq',
    defaultController: 'market',
    isDebug: true,
    onErrorHandler: (e) => {
        console.log(e.toString());
    },
};

const app = new Frameworks.App(appSetting);
app.initialize();
