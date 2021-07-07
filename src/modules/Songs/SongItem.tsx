import axios from 'axios';
import React from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import { useDispatch, useSelector } from 'react-redux';
import { API_KEY } from '../../api';
import { IUseSelector } from '../../interfaces/useSelectorType';
import { setNextSong, setPrevSong, setSong } from '../../store/curSong/actions';
import Swal from 'sweetalert2';
import { deleteSong } from '../../store/playlist/actions';
import { LogOutUser } from '../../store/user/actions';
import { useHistory } from 'react-router-dom';

interface IProps {
    songId: string;
    plistId: string;
}

interface ISongYT {
    id?: string;
    title: string;
    channelTitle: string;
    viewCount: string;
    duration: string;
    thumbnail: string;
}

export const SongItem: React.FC<IProps> = ({ songId, plistId }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const curPlaying = useSelector((state: IUseSelector) => state.CurPlaying);
    const playlists = useSelector((state: IUseSelector) => state.Playlists);
    const [youtubeRes, setYoutubeRes] = React.useState<ISongYT>();
    const [youtubeResPrev, setYoutubeResPrev] = React.useState<ISongYT>();
    const [youtubeResNext, setYoutubeResNext] = React.useState<ISongYT>();
    React.useEffect(() => {
        const curPlist = playlists.find(pl => pl._id === plistId)!;
        const curSongIdx = curPlist.songs.findIndex(id => id === songId);
        const prevSongId = curPlist.songs[curSongIdx - 1];
        const nextSongId = curPlist.songs[curSongIdx + 1];
        axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${songId}&key=${API_KEY}`)
            .then(({ data: { items } }) => setYoutubeRes({
                channelTitle: items[0].snippet.channelTitle,
                duration: items[0].contentDetails.duration,
                title: items[0].snippet.title,
                viewCount: items[0].statistics.viewCount,
                thumbnail: items[0].snippet.thumbnails.default.url
            }));
        if (prevSongId) {
            axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${prevSongId}&key=${API_KEY}`)
                .then(({ data: { items } }) => setYoutubeResPrev({
                    id: prevSongId,
                    channelTitle: items[0].snippet.channelTitle,
                    duration: items[0].contentDetails.duration,
                    title: items[0].snippet.title,
                    viewCount: items[0].statistics.viewCount,
                    thumbnail: items[0].snippet.thumbnails.default.url
                }));
        }
        if (nextSongId) {
            axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${nextSongId}&key=${API_KEY}`)
                .then(({ data: { items } }) => setYoutubeResNext({
                    id: nextSongId,
                    channelTitle: items[0].snippet.channelTitle,
                    duration: items[0].contentDetails.duration,
                    title: items[0].snippet.title,
                    viewCount: items[0].statistics.viewCount,
                    thumbnail: items[0].snippet.thumbnails.default.url
                }));
        }
    }, [songId, playlists, plistId]);
    const setCurMusic = React.useCallback(() => {
        dispatch(setSong({
            plistId: plistId,
            id: songId,
            artist: youtubeRes?.channelTitle!,
            img: youtubeRes?.thumbnail!,
            title: youtubeRes?.title!,
            duration: youtubeRes?.duration!
        }));
        dispatch(setPrevSong({
            plistId: plistId,
            id: youtubeResPrev?.id!,
            artist: youtubeResPrev?.channelTitle!,
            img: youtubeResPrev?.thumbnail!,
            title: youtubeResPrev?.title!,
            duration: youtubeResPrev?.duration!
        }));
        dispatch(setNextSong({
            plistId: plistId,
            id: youtubeResNext?.id!,
            artist: youtubeResNext?.channelTitle!,
            img: youtubeResNext?.thumbnail!,
            title: youtubeResNext?.title!,
            duration: youtubeResNext?.duration!
        }));
    }, [dispatch, songId, youtubeRes, youtubeResNext, youtubeResPrev, plistId])
    const deleteSongHandler = React.useCallback((e: any) => {
        e.stopPropagation();
        Swal.fire({
            title: `Are you sure to delete ${youtubeRes?.title}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            iconColor: '#e97236',
            confirmButtonColor: '#e97236',
            cancelButtonColor: '#16181C',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteSong(songId, plistId)(dispatch)
                    .catch(() => {
                        LogOutUser()(dispatch);
                        history.push('/login');
                    });
            }
        })
    }, [dispatch, plistId, songId, youtubeRes?.title, history])
    return (
        <tr className={`list-item ${curPlaying?.cur.id === songId ? 'selected' : ''}`} onClick={setCurMusic}>
            <td className="list-delete-song" onClick={deleteSongHandler}><ClearIcon /></td>
            <td className="list-track">
                {youtubeRes?.title}
            </td>
            <td className="list-artist">{youtubeRes?.channelTitle}</td>
            <td className="list-duration">{youtubeRes?.duration.slice(2, youtubeRes?.duration.length).replace("M", ":").replace("S", "")}</td>
            <td className="list-play-count">{parseInt(youtubeRes?.viewCount!).toLocaleString()}</td>
        </tr>
    )
}
