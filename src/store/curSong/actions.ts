import { ICurSong, INextSong, IPrevSong } from "../../interfaces/types";
import { CUR_SONG_ACTIONS } from "./actionTypes";

export const setSong = (song: ICurSong) => {
    return {
        type: CUR_SONG_ACTIONS.SET_SONG,
        payload: song
    }
};

export const setPrevSong = (song: IPrevSong) => {
    return {
        type: CUR_SONG_ACTIONS.SET_PREV_SONG,
        payload: song
    }
};

export const setNextSong = (song: INextSong) => {
    return {
        type: CUR_SONG_ACTIONS.SET_NEXT_SONG,
        payload: song
    }
};
