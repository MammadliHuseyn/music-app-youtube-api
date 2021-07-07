import { IUser, TUserAction } from "../../interfaces/types";
import { USER_ACTIONS } from "./actionTypes";

export const initialState: IUser = {
    createdAt: '',
    email: '',
    img: '',
    name: '',
    playlists: [],
    surname: ''
}

export const reducer = (state = initialState, action: TUserAction) => {
    switch (action.type) {
        case USER_ACTIONS.LOGIN_USER:
            return action.payload;
        case USER_ACTIONS.LOGOUT_USER:
            return initialState;
        case USER_ACTIONS.ADD_PLIST_TO_USER:
            return {
                ...state,
                playlists: [
                    ...state.playlists, action.payload
                ]
            }
        case USER_ACTIONS.DELETE_PLIST_FROM_USER:
            return {
                ...state,
                playlists: state.playlists.filter(id => id !== action.payload)
            }
        default:
            return state;
    }
}