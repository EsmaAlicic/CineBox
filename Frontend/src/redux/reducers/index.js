import { combineReducers } from "redux";
import {AuthenticateInfoReducer} from "./AuthenticateInfoReducer";
import {UserReducer} from "./UserReducer";

const RootState = combineReducers({
    authenticateToken: AuthenticateInfoReducer,
    user: UserReducer
});

export default RootState;