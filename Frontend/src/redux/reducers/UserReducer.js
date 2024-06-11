import { ActionTypes } from '../constants/ActionTypes';

const initialState = {
    user: {},
    scoringUser: {},
};

export const UserReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case ActionTypes.SET_USER:
            return {...state, user: payload};
        default:
            return state;
    };
};