import { SET_ERROR } from 'actions';

export const setError = (error, isError) => ({
    type: SET_ERROR,
    error,
    isError,
});
