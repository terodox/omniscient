# omniscient

[![Build Status](https://cloud.drone.io/api/badges/terodox/omniscient/status.svg)](https://cloud.drone.io/terodox/omniscient)

The simplest usable global state management.

## Usage

The goal is extremely simple state management. There are only 4 methods to learn!

### Constructing a new instance

The constructor allows you to set the initial state of the store, or just leave it empty!

```javascript
const omniscient = new Omniscient(); // Empty state
const omniscient = new Omniscient({
    todos: [
        {
            id: 1,
            value: 'Get some wicked kicks at the shoe store'
        }
    ]
}); // Initial state
```

### getState

You can either get the entire state, or a specific property of the state.

```javascript
const initialState = {
    user: {
        id: 1234,
        name: 'Boba Fett'
    },
    lastAction: {
        name: 'Being awesome',
        time: 'May 25, 1983'
    }
};
const omniscient = new Omniscient(initialState);

const allState = omniscient.getState();
console.log(allState === initialState); // true

const user = omniscient.getState('user');
console.log(user === initialState.user); // true
```

### setState

Similar to getState you can either set the entire state, or a specific property of the state.

```javascript
const initialState = {
    user: {
        id: 1234,
        name: 'Boba Fett'
    },
    lastAction: {
        name: 'Being awesome',
        time: 'May 25, 1983'
    }
};
const omniscient = new Omniscient(initialState);


const currentUser = omniscient.getState('user');
omniscient.setState('user', {
    ...currentUser,
    name: 'The Fett'
});
const { name } = omniscient.getState('user');
console.log(name === 'The Fett'); // true

const newState = {
    completely: 'different'
};
omniscient.setState(newState);
const allState = omniscient.getState();
console.log(allState === newState); // true
```

### registerCallback and unregister

These are the callback management methods.  If you want to know when a property changes, you'll call `registerCallback`. If you stop caring about that property, you'll call `unregister`.

```javascript
const initialState = {
    user: {
        id: 1234,
        name: 'Boba Fett'
    },
    lastAction: {
        name: 'Being awesome',
        time: 'May 25, 1983'
    }
};
const omniscient = new Omniscient(initialState);

const callback = (value) => console.log('Called from the callback:', JSON.stringify(value));

// Call this method any time the 'user' property changes
const registrationId = omniscient.registerCallback('user', callback);

const callbackUserOne = omniscient.getState('user');

// This will trigger the call back
omniscient.setState('user', {
    ...callbackUserOne,
    name: 'The Fett'
});

// When you no longer want to be called for a property change
omniscient.unregister('user', registrationId);

console.log('Callback will not be called again.');
const callbackUserTwo = omniscient.getState('user');
omniscient.setState('user', {
    ...callbackUserTwo,
    name: 'The Fett'
});
```
