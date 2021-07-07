import axios from "axios";
import { Dispatch } from "react";
import { MUSIC_APP_API } from "../../api/musicAppApi";
import { IPlaylistAddForm, ISongAddForm, IUserStorage } from "../../interfaces/types";
import { STORAGE_ACTIONS, userActionsWithStore } from "../../localStorage/User/storage";
import { USER_ACTIONS } from "../user/actionTypes";
import { PLIST_ACTIONS } from "./actionTypes";
const uri = `${MUSIC_APP_API}/playlist`;
const uriSong = `${MUSIC_APP_API}/song`;

export const getPlaylist = () => {
    return (dispatch: Dispatch<any>) => {
        const userInStorage: IUserStorage = userActionsWithStore(undefined, STORAGE_ACTIONS.GET_USER_FROM_STORAGE);
        return axios.get(`${uri}/`, {
            headers: {
                Authorization: `Beraer ${userInStorage?.token}`
            }
        }).then(
            ({ data }) => {
                dispatch({ type: PLIST_ACTIONS.GET_PLIST, payload: data.plist });
                return data;
            })
    };
};

export const addPlaylist = (playlist: IPlaylistAddForm) => {
    return (dispatch: Dispatch<any>) => {
        const userInStorage: IUserStorage = userActionsWithStore(undefined, STORAGE_ACTIONS.GET_USER_FROM_STORAGE);
        return axios.post(`${uri}/${userInStorage._id}`, playlist, {
            headers: {
                Authorization: `Beraer ${userInStorage.token}`
            }
        }).then(
            ({ data }) => {
                dispatch({ type: PLIST_ACTIONS.ADD_PLIST, payload: data });
                dispatch({ type: USER_ACTIONS.ADD_PLIST_TO_USER, payload: data._id })
                return data;
            })
    };
};

export const addSong = (song: ISongAddForm) => {
    return (dispatch: Dispatch<any>) => {
        const userInStorage: IUserStorage = userActionsWithStore(undefined, STORAGE_ACTIONS.GET_USER_FROM_STORAGE);
        return axios.post(`${uriSong}/addSong`, song, {
            headers: {
                Authorization: `Beraer ${userInStorage.token}`
            }
        }).then(
            ({ data }) => {
                dispatch({ type: PLIST_ACTIONS.ADD_SONG_TO_PLIST, payload: data });
            })
    };
};

export const deletePlaylist = (plId: string) => {
    return (dispatch: Dispatch<any>) => {
        const userInStorage: IUserStorage = userActionsWithStore(undefined, STORAGE_ACTIONS.GET_USER_FROM_STORAGE);
        return axios.delete(`${uri}/?plId=${plId}&userId=${userInStorage._id}`, {
            headers: {
                Authorization: `Beraer ${userInStorage.token}`
            }
        }).then(
            ({ data }) => {
                dispatch({ type: PLIST_ACTIONS.DELETE_PLIST, payload: data });
                dispatch({ type: USER_ACTIONS.DELETE_PLIST_FROM_USER, payload: data })
                return data;
            })
    };
};

export const deleteSong = (songId: string, playlistId: string) => {
    return (dispatch: Dispatch<any>) => {
        const userInStorage: IUserStorage = userActionsWithStore(undefined, STORAGE_ACTIONS.GET_USER_FROM_STORAGE);
        return axios.put(`${uriSong}/deleteSong`, { songId, playlistId }, {
            headers: {
                Authorization: `Beraer ${userInStorage.token}`
            }
        }).then(
            ({ data }) => {
                dispatch({ type: PLIST_ACTIONS.DELETE_SONG_FROM_PLIST, payload: data });
                return data;
            })
    };
};

