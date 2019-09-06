type Callback = (value: any) => void;

interface CallbackEntry {
    [key: string]: Callback;
}

interface CallbackMap {
    [key: string]: CallbackEntry;
}

interface GetUpdatesOptions {
    property: string;
    callback: (value: any) => void;
}

interface SetStateOptions {
    property: string;
    value: any;
}

type RegistrationId = number;

interface UnregisterOptions {
    property: string;
    registrationId: RegistrationId;
}

export class Omniscient<T> {
    private _state: T;
    private _callbackMap: CallbackMap = {};
    private _callbackCounter: number = 0;

    constructor(startingState: T) {
        if(!startingState || typeof startingState !== 'object') {
            throw new TypeError(`The starting state must be an object. Provided value: ${startingState}`);
        }
        this._state = startingState;
    }

    getState<PropT>(property?: string): PropT {
        if(property) {
            if(typeof property !== 'string') {
                throw new TypeError('property must be a string');
            }
            if(!this._state.hasOwnProperty(property)) {
                throw new Error(`The requested property (${property}) does not exist in the current state.`);
            }
            return (<any>this._state)[property];
        }
        return (<PropT>(<unknown>this._state));
    }

    setState(options: SetStateOptions | T) {
        const setStateOptions: SetStateOptions = (<any>options);
        if(setStateOptions.property && setStateOptions.value) {
            if(typeof setStateOptions.property !== 'string') {
                throw new TypeError('property must be a string');
            }
            (<any>this._state)[setStateOptions.property] = setStateOptions.value;
            this._invokeCallbacks(setStateOptions);
            return;
        }
        this._state = <T>options;
    }

    _invokeCallbacks({ property, value } : SetStateOptions) {
        if(this._callbackMap[property]) {
            for(const [_, callback] of Object.entries(this._callbackMap[property])) { // eslint-disable-line no-unused-vars
                try {
                    callback(value);
                } catch(err) {} // eslint-disable-line
            }
        }
    }

    registerCallback({ callback, property }: GetUpdatesOptions): RegistrationId {
        if(typeof callback !== 'function') {
            throw new TypeError('callback must be a function');
        }
        if(typeof property !== 'string') {
            throw new TypeError('property must be a string');
        }
        if(!(<any>this._state)[property]) {
            throw new Error('The property must exist in the current state');
        }

        const registrationId = this._callbackCounter++;

        if(!this._callbackMap[property]) {
            this._callbackMap[property] = {};
        }
        this._callbackMap[property][registrationId] = callback;

        return registrationId;
    }

    unregister({ property, registrationId }: UnregisterOptions): void {
        if(typeof property !== 'string') {
            throw new TypeError('property must be a string');
        }
        if(typeof registrationId !== 'number') {
            throw new TypeError('registrationId must be a number');
        }
        if(this._callbackMap[property]) {
            delete this._callbackMap[property][registrationId];
        }
    }
}