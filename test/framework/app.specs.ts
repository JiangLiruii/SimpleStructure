import * as chai from 'chai';
import { describe } from 'mocha';
import { App } from '../../source/framework/app';
import { IAppSettings, IController, IControllerDetails } from '../../source/framework/interface';
import { View } from '../../source/framework/view';
const expect = chai.expect;

describe('App class spec \n', () => {
    it('it should set its own properties correctly \n', () => {
        const appSetting: IAppSettings = {
            controllers: new Array<IControllerDetails>(),
            defaultAction: 'index',
            defaultController: 'home',
        };
        const app = new App(appSetting);
        expect(app.initialize).to.be.a('function');
    });
});
