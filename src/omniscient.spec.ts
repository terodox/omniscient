import { Omniscient } from './omniscient';

interface TestInterface {
    the: string;
}

test('should exist', () => {
    expect(Omniscient).toEqual(jasmine.any(Function));
});

test('should throw if starting state is not an object', () => {
    expect(() => new Omniscient<any>(1234)).toThrowError('starting');
    expect(() => new Omniscient<any>('abcd')).toThrowError('starting');
    expect(() => new Omniscient<any>(() => {})).toThrowError('starting');
});

test('should not throw if starting state is an object', () => {
    expect(() => new Omniscient<any>({})).not.toThrow();;
});
describe('getState', () => {

    test('should return the full state if no specifier is passed', () => {
        const expectedState = { the: 'most expected state' };

        const omniscient = new Omniscient<TestInterface>(expectedState);

        expect(omniscient.getState()).toBe(expectedState);
    });

    test('should throw if property is not s string', () => {
        const omniscient = new Omniscient<any>({});

        expect(() => omniscient.getState<any>(<any>{})).toThrowError('property');
    });

    test('should return requested property', () => {
        const expectedState = { the: 'most expected state' };

        const omniscient = new Omniscient<TestInterface>(expectedState);

        expect(omniscient.getState<string>('the')).toBe(expectedState.the);
    });

    test('should throw if requesting a property that does not exist', () => {
        const expectedState = { the: 'most expected state' };

        const omniscient = new Omniscient<TestInterface>(expectedState);

        expect(() => omniscient.getState<string>('otherProperty')).toThrowError(/exist/);
    });
});

describe('setState', () => {
    test('should update entire state if no specifier is passed', () => {
        const expectedState = { the: 'upon a midnight dreary...' };
        const initialState = { the: 'most expected state' };
        const omniscient = new Omniscient<TestInterface>(initialState);

        omniscient.setState(expectedState);

        expect(omniscient.getState()).toBe(expectedState);
    });

    test('should throw if property is not s string', () => {
        const omniscient = new Omniscient<any>({});

        expect(() => omniscient.setState({ property: {}, value: 'yay'})).toThrowError('property');
    });

    test('should update property if specifier is provided', () => {
        const expectedState = { once: 'upon a midnight dreary...' };
        const initialState = { the: 'most expected state' };
        const omniscient = new Omniscient<TestInterface>(initialState);

        omniscient.setState({
            property: 'the',
            value: expectedState
        });

        expect(omniscient.getState('the')).toBe(expectedState);
    });

    test('should not throw if callback throws', () => {
        const omniscient = new Omniscient<TestInterface>({ the: 'best' });
        const expectedValue = 'yup';
        const callback = jest.fn().mockImplementation(() => { throw new Error('Booooooooom'); });
        omniscient.registerCallback({ property: 'the', callback });

        expect(() => omniscient.setState({ property: 'the', value: expectedValue})).not.toThrow();
    });

    test('should invoke all callbacks even if one throws', () => {
        const omniscient = new Omniscient<TestInterface>({ the: 'best' });
        const expectedValue = 'yup';
        const callbackOne = jest.fn().mockImplementation(() => { throw new Error('Booooooooom'); });
        const callbackTwo = jest.fn().mockImplementation(() => { throw new Error('Booooooooom'); });
        omniscient.registerCallback({ property: 'the', callback: callbackOne });
        omniscient.registerCallback({ property: 'the', callback: callbackTwo });

        omniscient.setState({ property: 'the', value: expectedValue});

        expect(callbackOne).toHaveBeenCalledWith(expectedValue);
        expect(callbackTwo).toHaveBeenCalledWith(expectedValue);
    });
});

describe('register callback', () => {
    test('should throw if callback is not a function', () => {
        const omniscient = new Omniscient<any>({});

        expect(() => omniscient.registerCallback({ property: 'yay', callback: <any>{} })).toThrowError('callback');
    });

    test('should throw if property is not a string', () => {
        const omniscient = new Omniscient<any>({});

        expect(() => omniscient.registerCallback({ property: <any>{}, callback: () => {} })).toThrowError('property');
    });

    test('should throw if property does not exist in state', () => {
        const omniscient = new Omniscient<any>({});

        expect(() => omniscient.registerCallback({ property: 'yay', callback: () => {} })).toThrowError('state');
    });

    test('should return a registrationId', () => {
        const omniscient = new Omniscient<TestInterface>({ the: 'best' });

        const result = omniscient.registerCallback({ property: 'the', callback: () => {} });

        expect(result).toEqual(expect.any(Number));
    });

    test('should invoke callback after property change', () => {
        const omniscient = new Omniscient<TestInterface>({ the: 'best' });
        const expectedValue = 'yup';
        const callback = jest.fn();
        omniscient.registerCallback({ property: 'the', callback });

        omniscient.setState({ property: 'the', value: expectedValue});

        expect(callback).toHaveBeenCalledWith(expectedValue);
    });
});

describe('unregister', () => {
    test('should throw if property is not a string', () => {
        const omniscient = new Omniscient<any>({});

        expect(() => omniscient.unregister({ property: <any>{}, registrationId: 1234 })).toThrowError('property');
    });

    test('should throw if registrationId is not a number', () => {
        const omniscient = new Omniscient<any>({});

        expect(() => omniscient.unregister({ property: 'the', registrationId: <any>'abcd' })).toThrowError('registrationId');
    });

    test('if should not throw if registration id is no longer valid', () => {
        const omniscient = new Omniscient<TestInterface>({ the: 'best' });
        const callback = jest.fn();
        const registrationId = omniscient.registerCallback({ property: 'the', callback });
        omniscient.setState({ property: 'the', value: 'once'});

        omniscient.unregister({ property: 'the', registrationId });

        expect(() => omniscient.setState({ property: 'the', value: 'again'})).not.toThrow();
    });

    test('if should not throw if registration id is no longer valid', () => {
        const omniscient = new Omniscient<TestInterface>({ the: 'best' });
        const callback = jest.fn();
        const registrationId = omniscient.registerCallback({ property: 'the', callback });
        omniscient.setState({ property: 'the', value: 'once'});

        expect(callback).toHaveBeenCalledTimes(1);

        omniscient.unregister({ property: 'the', registrationId });

        omniscient.setState({ property: 'the', value: 'again'});

        expect(callback).toHaveBeenCalledTimes(1);
    });
});