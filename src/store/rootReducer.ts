import { combineReducers } from "redux";
import { reducer as userReducer } from "./user/reducer";
import { reducer as playlistReducer } from "./playlist/reducer";
import { reducer as curSongReducer } from "./curSong/reducer";

export const rootReducer = combineReducers({
    User: userReducer,
    Playlists: playlistReducer,
    CurPlaying: curSongReducer
})