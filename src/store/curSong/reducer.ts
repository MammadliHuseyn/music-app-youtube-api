import { ICurPlaying, TSongAction } from "../../interfaces/types";
import { CUR_SONG_ACTIONS } from "./actionTypes";

const initialValues = {
    plistId: '',
    title: '',
    artist: '',
    img: '',
    id: '',
    duration: ''
}

export const initialState: ICurPlaying = {
    prev: { ...initialValues },
    cur: { ...initialValues },
    next: { ...initialValues }
}

export const reducer = (state = initialState, action: TSongAction) => {
    switch (action.type) {
        case CUR_SONG_ACTIONS.SET_SONG:
            return {
                ...state,
                cur: action.payload
            };
        case CUR_SONG_ACTIONS.SET_PREV_SONG:
            return {
                ...state,
                prev: action.payload
            };
        case CUR_SONG_ACTIONS.SET_NEXT_SONG:
            return {
                ...state,
                next: action.payload
            };
        default:
            return state;
    }
}