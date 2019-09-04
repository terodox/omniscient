export class Omniscient<T> {
    private _internalState: T;

    constructor(startingState: T) {
        if(!startingState || typeof startingState !== 'object') {
            throw new TypeError(`The starting state must be an object. Provided value: ${startingState}`);
        }
        this._internalState = startingState;
    }

    getState() {
        return this._internalState;
    }
}