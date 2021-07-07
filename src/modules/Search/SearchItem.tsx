import React from 'react';
import { useSelector } from 'react-redux';
import { IPlaylist, IYoutubeSearchRes } from '../../interfaces/types';
import { IUseSelector } from '../../interfaces/useSelectorType';
import { PlaylistByUser } from '../../store/user/actions';
import { AddSongDialog } from './AddSong';

interface IProps {
    searchItem: IYoutubeSearchRes;
}

export const SearchItem: React.FC<IProps> = ({ searchItem }) => {
    const playlists = useSelector((state: IUseSelector) => state.Playlists);
    const user = useSelector((state: IUseSelector) => state.User);
    let userPlaylist: IPlaylist[] = [];
    if (user && playlists) {
        userPlaylist = PlaylistByUser(playlists, user.playlists);
    }
    return (
        <div className="col-lg-4">
            <div className="search-item">
                <AddSongDialog
                    plist={userPlaylist}
                    songId={searchItem.id.videoId}
                    songName={searchItem.snippet.title} />
                <img src={searchItem.snippet.thumbnails.medium.url} alt={searchItem.snippet.title} />
                <p>{searchItem.snippet.title}</p>
            </div >
        </div>
    )
}
