import { SET_ERROR } from 'actions';

const initialState = [];

function handleAddError(state, type) {
    if (state.indexOf(type) >= 0) {
        return state;
    }
    return state.concat(type);
}

function handleRemoveError(state, type) {
    const idx = state.indexOf(type);
    if (idx < 0) {
        return state;
    }
    const list = [...state];
    list.splice(idx, 1);
    return list;
}

export function errors(state = initialState, action) {
    switch (action.type) {
        case SET_ERROR:
            return action.isError ? handleAddError(state, action.error) : handleRemoveError(state, action.error);
        default:
            return state;
    }
}
