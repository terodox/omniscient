import { Omniscient } from './omniscient';

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

        const omniscient = new Omniscient<any>(expectedState);

        expect(omniscient.getState()).toBe(expectedState);
    });
});