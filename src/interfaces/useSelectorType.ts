import { ICurPlaying, IPlaylist, IUser } from "./types";

export interface IUseSelector {
    User: IUser;
    Playlists: Array<IPlaylist>;
    CurPlaying: ICurPlaying;
}