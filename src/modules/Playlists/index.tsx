import React from 'react';
import './../../sass/layout/playlist.scss';
import { Row } from 'react-bootstrap';
import { PlaylistItem } from './PlaylistItem';
import { useSelector } from 'react-redux';
import { IUseSelector } from '../../interfaces/useSelectorType';
import { PlaylistByUser } from '../../store/user/actions';
import { IPlaylist } from '../../interfaces/types';
import { AddPlaylistDialog } from './AddPlaylist';

export const Playlist = () => {
    const playlists = useSelector((state: IUseSelector) => state.Playlists);
    const user = useSelector((state: IUseSelector) => state.User);
    let userPlaylist: IPlaylist[] = [];
    if (user && playlists) {
        userPlaylist = PlaylistByUser(playlists, user.playlists);
    }
    return (
        <div className="outer-container">
            <div className="browse-container">
                <div className="d-flex align-items-center justify-content-between">
                    <h1>Playlists</h1>
                    <AddPlaylistDialog />
                </div>
                <Row>
                    {userPlaylist.map(plist =>
                        <PlaylistItem plist={plist} key={plist?._id} />
                    )}
                </Row>
            </div>
        </div>
    )
}
