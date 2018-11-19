import * as Frameworks from '../framework';
import { IAppSettings } from '../framework/interface';

const appSetting:IAppSettings = {
    isDebug: true,
    defaultController: 'market',
    defaultAction: 'nasdaq',
    controllers: [
        {controllerName:'market', controller:},
        {controllerName: 'symbol', controller:}
    ],
    onErrorHandler: (e) => {
        console.log(e.toString());
    }
}

const app = new Frameworks.App(appSetting);
app.initialize();