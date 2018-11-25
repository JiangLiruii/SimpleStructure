import * as chai from 'chai';
import { describe } from 'mocha';
import { AppEvent } from '../../source/framework';
import { Mediator } from '../../source/framework/mediator';

const expect = chai.expect;

describe('App mediator spec \n', () => {
    it('validate its functional', () => {
        const mediator = new Mediator();
        mediator.subscribe(new AppEvent('test', null, () => test));
        expect(mediator.publish(new AppEvent('test', null, () => console.log('publish test')))).to.equal('test');
    });
});
