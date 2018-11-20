import { IRoute } from "./interface";

export class Route implements IRoute {
    public controllerName:string;
    public actionName:string;
    public args:any[];

    constructor(controllerName:string, actionName:string, args:any[]) {
        this.controllerName = controllerName;
        this.actionName = actionName;
        this.args = args;
    }

    public serialize():string {
        const svar = this.args.map((a) => a.toString()).join('/');
        return `${this.controllerName}/${this.actionName}/${svar}`;
    }
}
