import { IPlaylist, TPlaylistAction } from "../../interfaces/types";
import { PLIST_ACTIONS } from "./actionTypes";

export const initialState: Array<IPlaylist> = [];

export const reducer = (state = initialState, action: TPlaylistAction) => {
    switch (action.type) {
        case PLIST_ACTIONS.GET_PLIST:
            return action.payload;
        case PLIST_ACTIONS.ADD_PLIST:
            return [
                ...state,
                action.payload
            ]
        case PLIST_ACTIONS.DELETE_PLIST:
            return state.filter(pl => pl._id !== action.payload);
        case PLIST_ACTIONS.ADD_SONG_TO_PLIST:
            return state.map(pl => {
                if (pl._id === action.payload.playlistId) {
                    pl.songs.push(action.payload.songId);
                }
                return pl;
            })
        case PLIST_ACTIONS.DELETE_SONG_FROM_PLIST:
            return state.map(pl => {
                if (pl._id === action.payload.playlistId) {
                    pl.songs = pl.songs.filter(id => id !== action.payload.songId)
                }
                return pl;
            })
        default:
            return state;
    }
}