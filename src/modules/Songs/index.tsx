import React from 'react';
import './../../sass/layout/song.scss';
import { SongItem } from './SongItem';
import PlayIcon from '@material-ui/icons/PlayArrow';
import { useParams } from 'react-router-dom';
import { IPlaylist } from '../../interfaces/types';
import { useSelector } from 'react-redux';
import { IUseSelector } from '../../interfaces/useSelectorType';

export const Songs = () => {
    const { id } = useParams<{ id: string }>();
    const [plist, setPlist] = React.useState<IPlaylist>();
    const playlists = useSelector((state: IUseSelector) => state.Playlists);
    const curPlaying = useSelector((state: IUseSelector) => state.CurPlaying);
    React.useEffect(() => {
        const plist = playlists.find(pl => pl._id === id)!;
        setPlist(plist);
    }, [id, playlists])
    return (
        <div className="outer-container">
            <div className="browse-container p-0"
                style={{ "backgroundImage": `${curPlaying?.cur.id ? `url(https://img.youtube.com/vi/${curPlaying?.cur.id}/maxresdefault.jpg)` : ''}` }}>
                <div
                    className="song-list-container">
                    <div className="song-list-title-block">
                        <div className="song-list-thumbnail row p-0 m-0 overflow-hidden">
                            {plist?.songs.slice(0, 6).map(song =>
                                <div className="col-6 m-0 p-0">
                                    <img src={`https://img.youtube.com/vi/${song}/default.jpg`} alt={song} style={{ width: "100%" }} />
                                </div>
                            )}
                        </div>
                        <div className="song-list-details">
                            <h1>{plist?.name}</h1>
                            <span>{plist?.songs.length} song(s)</span>
                            <br />
                            <br />
                            <button className="song-list-play d-flex align-items-center"><PlayIcon /> Play All</button>
                            <button className="song-list-save">Favourite</button>
                        </div>
                    </div>
                    <table
                        className="list-group"
                        style={{ "backgroundColor": `${curPlaying?.cur.id ? `rgba(0,0,0,.8)` : ''}` }}>
                        <tbody>
                            <tr>
                                <th></th>
                                <th>Title</th>
                                <th>Artist</th>
                                <th>Dur</th>
                                <th>Plays</th>
                            </tr>
                            {plist?.songs.map(songId =>
                                <SongItem songId={songId} key={songId} plistId={plist._id} />
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
