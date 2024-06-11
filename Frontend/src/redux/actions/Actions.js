import { ActionTypes } from '../constants/ActionTypes';

export const setAuthenticateToken = (token) => {
    return {
        type: ActionTypes.SET_AUTHENTICATE_TOKEN,
        payload: token,
    };
};

export const setUser = (user) => {
    return {
        type: ActionTypes.SET_USER,
        payload: user,
    };
};