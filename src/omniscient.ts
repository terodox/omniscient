type Callback = (value: any) => void;

interface CallbackEntry {
    [key: string]: Callback;
}

interface CallbackMap {
    [key: string]: CallbackEntry;
}

type RegistrationId = number;

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

    setState(propertyOrValue: string | T, value?: any) {
        if(propertyOrValue && value) {
            const property = propertyOrValue;
            if(typeof property !== 'string') {
                throw new TypeError('property must be a string');
            }
            (<any>this._state)[property] = value;
            this._invokeCallbacks(property, value);
            return;
        }
        this._state = <T>propertyOrValue;
    }

    _invokeCallbacks(property: string, value: any) {
        if(this._callbackMap[property]) {
            for(const [_, callback] of Object.entries(this._callbackMap[property])) { // eslint-disable-line no-unused-vars
                try {
                    callback(value);
                } catch(err) {} // eslint-disable-line
            }
        }
    }

    registerCallback(property: string, callback: (newValue: any) => void): RegistrationId {
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

    unregister(property: string, registrationId: RegistrationId): void {
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