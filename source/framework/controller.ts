import { EventEmitter } from "./event_emitter";
import { IController } from "./interface";

export class Controller extends EventEmitter implements IController {
    constructor(mediator) {
        super(mediator);
    }

    public initialize():void {
        throw new Error('Controller.prototype.initialize() is abstract, you must implement it.');
    }

    public dispose():void {
        throw new Error('Controller.prototype.dispose() is abstruct, you must implement it.');
    }
}
