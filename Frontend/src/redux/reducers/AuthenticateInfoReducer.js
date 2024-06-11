import { ActionTypes } from '../constants/ActionTypes';

const initialState = {
    authenticateInfo: {},
};

export const AuthenticateInfoReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case ActionTypes.SET_AUTHENTICATE_TOKEN:
            return {...state, authenticateInfo: payload};
        default:
            return state;
    };
};