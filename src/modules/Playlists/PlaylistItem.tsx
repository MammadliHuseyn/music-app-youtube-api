import React from 'react';
import { IPlaylist } from '../../interfaces/types';
import hipHopLogo from './../../img/hiphop.png';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { useDispatch } from 'react-redux';
import { deletePlaylist } from '../../store/playlist/actions';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

interface IProps {
    plist: IPlaylist
}

export const PlaylistItem: React.FC<IProps> = ({ plist }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const playlistDeleteHandler = React.useCallback((e: any) => {
        e.stopPropagation();
        Swal.fire({
            title: `Are you sure to delete ${plist?.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            iconColor: '#e97236',
            confirmButtonColor: '#e97236',
            cancelButtonColor: '#16181C',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                deletePlaylist(plist?._id!)(dispatch);
            }
        })
    }, [dispatch, plist?._id, plist?.name])
    const goToSongs = React.useCallback(() => {
        history.push(`/${plist?._id!}`);
    }, [history, plist?._id])
    return (
        <div className="browse-playlist col-xs-6 col-sm-4 col-md-3 col-lg-2">
            <div className="browse-playlist-inner" onClick={goToSongs}>
                <div className="browse-playlist-link" id="hiphop" style={{ backgroundImage: `url(${hipHopLogo})` }}>
                    <button className="btn-delete" onClick={playlistDeleteHandler}><HighlightOffIcon /></button>
                    <span>{plist?.name}</span>
                </div>
            </div>
        </div>
    )
}
