import { CUR_SONG_ACTIONS } from "../store/curSong/actionTypes";
import { PLIST_ACTIONS } from "../store/playlist/actionTypes";
import { USER_ACTIONS } from "../store/user/actionTypes";

export interface IPlaylist {
    _id: string;
    name: string;
    songs: Array<string>;
}
export interface IPlaylistAddForm {
    name: string;
    songs: Array<string>;
}
export interface ISongAddForm {
    playlistId: string;
    songId: string;
}

export interface IGetPlaylistAction {
    type: PLIST_ACTIONS.GET_PLIST,
    payload: Array<IPlaylist>
}
export interface IAddPlaylistAction {
    type: PLIST_ACTIONS.ADD_PLIST,
    payload: IPlaylist
}
export interface IDeletePlayListAction {
    type: PLIST_ACTIONS.DELETE_PLIST,
    payload: string
}
export interface IAddSongToPlaylistAction {
    type: PLIST_ACTIONS.ADD_SONG_TO_PLIST,
    payload: ISongAddForm
}
export interface IDeleteSongFromPlaylistAction {
    type: PLIST_ACTIONS.DELETE_SONG_FROM_PLIST,
    payload: { playlistId: string, songId: string }
}

export type TPlaylistAction =
    IGetPlaylistAction
    | IAddPlaylistAction
    | IDeletePlayListAction
    | IAddSongToPlaylistAction
    | IDeleteSongFromPlaylistAction

export interface IUserLoginForm {
    username: string;
    password: string;
    googleId?: string;
}

export interface IUserRegisterForm {
    name: string;
    surname: string;
    username: string;
    email: string;
    password: string;
    googleId: string;
    img: string;
}

export interface IUser {
    email: string;
    name: string;
    surname: string;
    createdAt: string;
    playlists: Array<string>;
    img: string;
}
export interface IUserStorage {
    _id: string;
    token: string;
}

export interface IUserLoginAction {
    type: USER_ACTIONS.LOGIN_USER;
    payload: IUser;
}
export interface IUserLogoutAction {
    type: USER_ACTIONS.LOGOUT_USER;
}
export interface IUserAddPlist {
    type: USER_ACTIONS.ADD_PLIST_TO_USER;
    payload: string;
}
export interface IUserDeletePlist {
    type: USER_ACTIONS.DELETE_PLIST_FROM_USER;
    payload: string;
}

export type TUserAction =
    IUserLoginAction
    | IUserLogoutAction
    | IUserAddPlist
    | IUserDeletePlist;

export interface IYoutubeSearchRes {
    etag: string;
    id: IYoutubeSearchId;
    snippet: IYoutubeSearchSnippet;
}
export interface IYoutubeSearchId {
    kind: string;
    videoId: string;
}
export interface IYoutubeSearchSnippet {
    channelId: string;
    channelTitle: string;
    description: string;
    publishTime: string;
    publishedAt: string;
    thumbnails: { default: IThumbnail, medium: IThumbnail, high: IThumbnail }
    title: string;
}
export interface IThumbnail {
    url: string;
    width: number;
    height: number;
}

export interface ICurSong {
    id: string;
    plistId: string;
    title: string;
    artist: string;
    img: string;
    duration: string;
}

export interface ICurPlaying {
    prev: IPrevSong;
    cur: ICurSong;
    next: INextSong;
}

export interface INextSong extends ICurSong { }
export interface IPrevSong extends ICurSong { }

export interface ICurSongSetAction {
    type: CUR_SONG_ACTIONS.SET_SONG,
    payload: ICurSong;
}

export interface IPrevSongSetAction {
    type: CUR_SONG_ACTIONS.SET_PREV_SONG,
    payload: IPrevSong;
}

export interface INextSongSetAction {
    type: CUR_SONG_ACTIONS.SET_NEXT_SONG,
    payload: INextSong;
}

export type TSongAction = ICurSongSetAction | INextSongSetAction | IPrevSongSetAction;