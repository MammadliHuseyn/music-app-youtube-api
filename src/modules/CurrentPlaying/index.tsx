import React from 'react';
import './../../sass/layout/currentPlaying.scss';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeMutedIcon from '@material-ui/icons/VolumeOff';
import { CircularProgress } from '@material-ui/core';
import { Container, Row } from 'react-bootstrap/';
import { Slider } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { IUseSelector } from '../../interfaces/useSelectorType';
import YouTube from 'react-youtube';
import { setNextSong, setPrevSong, setSong } from '../../store/curSong/actions';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { API_KEY } from '../../api';

export const CurrentPlaying = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const curPlistId = history.location.pathname.replace('/', '');
    const playlists = useSelector((state: IUseSelector) => state.Playlists);
    const [isPaused, setIsPaused] = React.useState<boolean>(false);
    const [isMuted, setIsMuted] = React.useState(false);
    const [curTime, setCurTime] = React.useState(`00:00`);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [curTimeSliderVal, setCurTimeSliderVal] = React.useState(0);
    const [prevSongIdx, setPrevSongIdx] = React.useState<number>(0);
    const [nextSongIdx, setNextSongIdx] = React.useState<number>(0);
    const opts: any = {
        height: '1',
        width: '1',
        playerVars: {
            autoplay: 1,
            vq: 'small'
        },
    };
    const iframeRef = React.useRef<any>();
    const curPlaying = useSelector((state: IUseSelector) => state.CurPlaying);
    const handlePlayPause = React.useCallback(() => {
        const { pauseVideo, playVideo } = iframeRef.current.internalPlayer;
        if (isPaused) {
            playVideo();
            setIsPaused(false);
        } else {
            pauseVideo();
            setIsPaused(true);
        }
    }, [isPaused]);
    const handleMute = React.useCallback(() => {
        const { mute, unMute } = iframeRef.current.internalPlayer;
        if (isMuted) {
            unMute();
            setIsMuted(false);
        } else {
            mute();
            setIsMuted(true);
        }
    }, [isMuted]);
    const handleVolume = React.useCallback((e: any, newValue: number | number[]) => {
        const { setVolume } = iframeRef.current.internalPlayer;
        setVolume(newValue);
    }, []);
    const durationOfVideo = React.useCallback(() => {
        if (iframeRef.current) {
            const { duration } = curPlaying.cur;
            const dur = duration.slice(2, duration.length).replace("M", ":").replace("S", "");
            let [minutes, seconds] = dur.split(':');
            if (+minutes < 10) {
                minutes = '0' + minutes;
            }
            if (+seconds < 10) {
                seconds = '0' + seconds;
            }
            return `${minutes}:${seconds}`;
        }
        return `00:00`;
    }, [curPlaying]);
    const durationSecondsOfVideo = React.useCallback(() => {
        let { duration } = curPlaying.cur;
        const dur = duration.slice(2, duration.length).replace("M", ":").replace("S", "");
        const [minutes, seconds] = dur.split(':');
        const allSeconds = (+minutes * 60) + +seconds;
        return allSeconds;
    }, [curPlaying])
    const handleSeek = React.useCallback((e: any, newValue: number | number[]) => {
        const { seekTo } = iframeRef.current.internalPlayer;
        seekTo(newValue);
    }, [])
    React.useEffect(() => {
        if (curPlaying?.cur.id) {
            const curPlist = playlists.find(pl => pl._id === curPlaying.cur.plistId)!;
            const curSongIdx = curPlist.songs.findIndex(id => id === curPlaying.cur.id);
            if ((curSongIdx - 1 >= 0) && (curSongIdx + 1 < curPlist.songs.length)) {
                if (curSongIdx - 1 >= 0) {
                    setPrevSongIdx(curSongIdx - 1);
                    console.log("setprevsong")
                }
                if (curSongIdx + 1 < curPlist.songs.length) {
                    setNextSongIdx(curSongIdx + 1);
                    console.log("setnextsong")
                }
            }
            console.log("useffect handled");
        }
    }, [playlists, curPlaying.cur.id, curPlistId, curPlaying.cur.plistId]);
    React.useEffect(() => {
        let interval: any;
        if (iframeRef.current) {
            interval = setInterval(() => {
                const { getCurrentTime } = iframeRef.current.internalPlayer;
                getCurrentTime().then((time: number) => {
                    setCurTimeSliderVal(time);
                    if (time < 60) {
                        let seconds = Math.round(time);
                        setCurTime(`00:${seconds < 10 ? '0' : ''}${seconds}`)
                    }
                    else {
                        let minutes = Math.round((Math.ceil(time)) / 60);
                        let seconds = Math.ceil(time) - (minutes * 60);
                        if (seconds < 0) {
                            seconds = 60 - Math.abs(seconds);
                            minutes--;
                        }
                        setCurTime(`${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`)
                    }
                });
            }, 1000)
        }
        return () => {
            clearInterval(interval);
        }
    }, [durationSecondsOfVideo])
    const nextVideoHandler = React.useCallback(() => {
        if (curPlaying.next.id) {
            dispatch(setPrevSong({ ...curPlaying.cur }));
            dispatch(setSong({ ...curPlaying.next }));
            const curPlist = playlists.find(pl => pl._id === curPlaying.cur.plistId)!;
            const nextSongId = curPlist.songs[nextSongIdx + 1];
            if (nextSongId) {
                axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${nextSongId}&key=${API_KEY}`)
                    .then(({ data: { items } }) => {
                        dispatch(setNextSong({
                            plistId: curPlaying.cur.plistId,
                            id: nextSongId,
                            artist: items[0].snippet.channelTitle,
                            img: items[0].snippet.thumbnails.default.url,
                            title: items[0].snippet.title,
                            duration: items[0].contentDetails.duration
                        }));
                    });
                console.log("next video handled");
            }
        }
    }, [curPlaying.next, curPlaying.cur, dispatch, nextSongIdx, playlists])
    const prevVideoHandler = React.useCallback(() => {
        if (curPlaying.prev.id) {
            dispatch(setNextSong({ ...curPlaying.cur }))
            dispatch(setSong({ ...curPlaying.prev }))
            const curPlist = playlists.find(pl => pl._id === curPlaying.cur.plistId)!;
            const prevSongId = curPlist.songs[prevSongIdx - 1];
            if (prevSongId) {
                axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${prevSongId}&key=${API_KEY}`)
                    .then(({ data: { items } }) => {
                        dispatch(setPrevSong({
                            plistId: curPlaying.cur.plistId,
                            id: prevSongId,
                            artist: items[0].snippet.channelTitle,
                            img: items[0].snippet.thumbnails.default.url,
                            title: items[0].snippet.title,
                            duration: items[0].contentDetails.duration
                        }));
                    });
            }
            console.log("prev video handled");
        }
    }, [curPlaying.prev, curPlaying.cur, dispatch, prevSongIdx, playlists])
    const changeLoadingState = React.useCallback((e) => {
        if (e.data !== 2 && e.data !== 1) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [])
    return curPlaying?.cur.id ? (
        <div className="song-controller">
            <Container fluid>
                <Row>
                    <div className="details col-lg-3">
                        <div className="song-controller-thumbnail">
                            <img src={curPlaying.cur.img} alt={curPlaying.cur.title} />
                        </div>
                        <div className="track">{curPlaying.cur.title}</div>
                        <div className="artist"> {curPlaying.cur.artist}</div>
                    </div>
                    <div className="controls col-lg-6 text-center">
                        <div className="buttons">
                            <button
                                id="prev"
                                className="controller-buttons"
                                onClick={prevVideoHandler}
                                disabled={isLoading || curPlaying.prev.id === curPlaying.cur.id || curPlaying.prev.id === undefined}
                                title={curPlaying.prev.title}>
                                <SkipPreviousIcon />
                            </button>
                            <button id="play-pause" className="controller-buttons" onClick={handlePlayPause} disabled={isLoading}>
                                {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
                            </button>
                            <button
                                id="next"
                                className="controller-buttons"
                                onClick={nextVideoHandler}
                                disabled={isLoading || curPlaying.next.id === curPlaying.cur.id || curPlaying.next.id === undefined}
                                title={curPlaying.next.title}>
                                <SkipNextIcon />
                            </button>
                            <button
                                id="mute"
                                className="controller-buttons"
                                onClick={handleMute}
                                title={isMuted ? "Unmute" : "Mute"}>
                                {isMuted ? <VolumeMutedIcon /> : <VolumeUpIcon />}
                            </button>
                        </div>
                        <div id="volume-div">
                            <Slider
                                onChange={handleVolume}
                                aria-labelledby="continuous-slider"
                                disabled={isMuted}
                                defaultValue={100} />
                        </div>
                    </div>
                    {isLoading
                        ?
                        <div className="col-lg-3 d-flex justify-content-center align-items-center">
                            <CircularProgress />
                        </div>
                        :
                        <div className="seek-video col-lg-3 d-flex justify-content-between align-items-center text-white">
                            <span>{curTime}</span>
                            <Slider
                                onChange={handleSeek}
                                aria-labelledby="continuous-slider"
                                defaultValue={0}
                                max={durationSecondsOfVideo()}
                                style={{ width: "250px" }}
                                value={curTimeSliderVal} />
                            <span>{durationOfVideo()}</span>
                        </div>
                    }
                </Row>
            </Container>
            <div className="video-detail">
                <YouTube
                    videoId={curPlaying.cur?.id}
                    opts={opts}
                    onEnd={nextVideoHandler}
                    onStateChange={changeLoadingState}
                    ref={iframeRef} />
            </div>
        </div>
    ) : <div className="song-controller"></div>
}
