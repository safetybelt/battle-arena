import { ADD_RAY } from 'actions';

const initialState = {
    rays: {},
};

function handleAddRay(state, id, ray) {
    const copy = JSON.parse(JSON.stringify(state));
    copy.rays[id] = ray;
    return copy;
}

export function game(state = initialState, action) {
    switch (action.type) {
        case ADD_RAY:
            return handleAddRay(state, action.id, action.ray);
        default:
            return state;
    }
}
