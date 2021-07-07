import axios from "axios";
import { Dispatch } from "react";
import { MUSIC_APP_API } from "../../api/musicAppApi";
import { IPlaylist, IUserLoginForm, IUserRegisterForm, IUserStorage } from "../../interfaces/types";
import { STORAGE_ACTIONS, userActionsWithStore } from "../../localStorage/User/storage";
import { getPlaylist } from "../playlist/actions";
import { USER_ACTIONS } from "./actionTypes";
const uri = `${MUSIC_APP_API}/auth`;

export const RegisterUser = (user: IUserRegisterForm) => {
    return (dispatch: Dispatch<any>) => {
        return axios.post(`${uri}/register`, user).then(
            ({ data }) => {
                dispatch({ type: USER_ACTIONS.LOGIN_USER, payload: data });
                return data;
            })
            .then((data) => {
                const userStorage: IUserStorage = {
                    _id: data._id,
                    token: data.token
                }
                userActionsWithStore(userStorage, STORAGE_ACTIONS.ADD_USER_TO_STORAGE);
            })
    };
};

export const LoginUser = (user: IUserLoginForm) => {
    return (dispatch: Dispatch<any>) => {
        return axios.post(`${uri}/login`, user).then(
            ({ data }) => {
                dispatch({ type: USER_ACTIONS.LOGIN_USER, payload: data });
                return data;
            })
            .then((data) => {
                const userStorage: IUserStorage = {
                    _id: data._id,
                    token: data.token
                }
                userActionsWithStore(userStorage, STORAGE_ACTIONS.ADD_USER_TO_STORAGE);
                return data;
            })
            .then(() => getPlaylist())
    };
};

export const getUser = () => {
    return (dispatch: Dispatch<any>) => {
        const userInStorage: IUserStorage = userActionsWithStore(undefined, STORAGE_ACTIONS.GET_USER_FROM_STORAGE);
        return axios.get(`${uri}/${userInStorage._id}`, {
            headers: {
                Authorization: `Beraer ${userInStorage.token}`
            }
        }).then(
            ({ data }) => {
                dispatch({ type: USER_ACTIONS.LOGIN_USER, payload: data });
                return data;
            })
    };
};



export const LogOutUser = () => {
    return (dispatch: Dispatch<any>) => {
        dispatch({ type: USER_ACTIONS.LOGOUT_USER })
        userActionsWithStore(undefined, STORAGE_ACTIONS.DELETE_USER_FROM_STORAGE);
    }
};

export const PlaylistByUser = (playlists: Array<IPlaylist>, userPlaylistIds: Array<string>) => {
    let array: Array<IPlaylist> = [];

    const result = playlists.reduce((total, cur) => {
        const isValidPlist = userPlaylistIds.some(id => id === cur._id);
        if (isValidPlist) {
            total.push(cur);
        }
        return total;
    }, array);

    return result;
}