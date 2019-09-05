interface SetStateOptions {
    property: string;
    newValue: any;
}

export class Omniscient<T> {
    private _internalState: T;

    constructor(startingState: T) {
        if(!startingState || typeof startingState !== 'object') {
            throw new TypeError(`The starting state must be an object. Provided value: ${startingState}`);
        }
        this._internalState = startingState;
    }

    getState<PropT>(property?: string): PropT {
        if(property) {
            if(!this._internalState.hasOwnProperty(property)) {
                throw new Error(`The requested property (${property}) does not exist in the current state.`);
            }
            return (<any>this._internalState)[property];
        }
        return (<PropT>(<unknown>this._internalState));
    }

    setState(options: SetStateOptions | T) {
        const setStateOptions: SetStateOptions = (<any>options);
        if(setStateOptions.property && setStateOptions.newValue) {
            (<any>this._internalState)[setStateOptions.property] = setStateOptions.newValue;
            return;
        }
        this._internalState = <T>options;
    }
}