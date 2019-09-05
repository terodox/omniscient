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

    test('should update property if specifier is provided', () => {
        const expectedState = { once: 'upon a midnight dreary...' };
        const initialState = { the: 'most expected state' };
        const omniscient = new Omniscient<TestInterface>(initialState);

        omniscient.setState({
            property: 'the',
            newValue: expectedState
        });

        expect(omniscient.getState('the')).toBe(expectedState);
    });
});