const Omniscient = require('../cjs/omniscient').Omniscient;

console.log('\n\n\n\n\n');
console.log('************* DEMO ***************');
console.log('\n\n');

/**** getState Demo ****/
const getStateInitialState = {
    user: {
        id: 1234,
        name: 'Boba Fett'
    },
    lastAction: {
        name: 'Being awesome',
        time: 'May 25, 1983'
    }
};
const omniscientGetState = new Omniscient(getStateInitialState);

const allState = omniscientGetState.getState();
console.log('allState === getStateInitialState', allState === getStateInitialState); // true

const user = omniscientGetState.getState('user');
console.log('user === getStateInitialState.user', user === getStateInitialState.user); // true

/**** setState Demo ****/
const setStateInitialState = {
    user: {
        id: 1234,
        name: 'Boba Fett'
    },
    lastAction: {
        name: 'Being awesome',
        time: 'May 25, 1983'
    }
};
const omniscientSetState = new Omniscient(setStateInitialState);

const currentUser = omniscientSetState.getState('user');
omniscientSetState.setState('user', {
    ...currentUser,
    name: 'The Fett'
});
const { name } = omniscientSetState.getState('user');
console.log('name === "The Fett"', name === 'The Fett'); // true

const newState = {
    completely: 'different'
};
omniscientSetState.setState(newState);
const currentState = omniscientSetState.getState();
console.log('currentState === newState', currentState === newState); // true

/**** registerCallback/unregister Demo ****/
const callbackInitialState = {
    user: {
        id: 1234,
        name: 'Boba Fett'
    },
    lastAction: {
        name: 'Being awesome',
        time: 'May 25, 1983'
    }
};
const callbackOmniscient = new Omniscient(callbackInitialState);

const callback = (value) => console.log('Called from the callback:', JSON.stringify(value));
const registrationId = callbackOmniscient.registerCallback('user', callback);

const callbackUserOne = callbackOmniscient.getState('user');
callbackOmniscient.setState('user', {
    ...callbackUserOne,
    name: 'The Fett'
});

callbackOmniscient.unregister('user', registrationId);
console.log('Callback will not be called again.');
const callbackUserTwo = callbackOmniscient.getState('user');
callbackOmniscient.setState('user', {
    ...callbackUserTwo,
    name: 'The Fett'
});