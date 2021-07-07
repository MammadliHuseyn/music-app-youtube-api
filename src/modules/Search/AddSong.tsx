import React from 'react';
import Button from '@material-ui/core/Button';
import { Select, MenuItem } from '@material-ui/core/';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import { IPlaylist, ISongAddForm } from '../../interfaces/types';
import { addSong } from '../../store/playlist/actions';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

interface IProps {
    songId: string;
    plist: IPlaylist[];
    songName: string;
}

export const AddSongDialog: React.FC<IProps> = ({ songId, plist, songName }) => {
    const [open, setOpen] = React.useState(false);
    const [newSong, setNewSong] = React.useState<ISongAddForm>({ songId: songId, playlistId: '' });
    const dispatch = useDispatch();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const plistChangeHandler = React.useCallback((e: any) => {
        const { target: { value } } = e;
        setNewSong(prevState => {
            return {
                ...prevState,
                playlistId: value
            }
        });
    }, [])

    const addSongToPlayListHandler = React.useCallback(() => {
        if (newSong.playlistId) {
            addSong(newSong)(dispatch)
                .then(() => {
                    Swal.fire({
                        title: `${songName} added succesfully!`,
                        icon: 'success',
                        iconColor: '#e97236',
                        confirmButtonColor: '#e97236'
                    })
                    handleClose();
                })
                .catch(err => {
                    Swal.fire({
                        title: err.response.data,
                        icon: 'error',
                        iconColor: '#e97236',
                        confirmButtonColor: '#e97236'
                    })
                });
        } else {
            Swal.fire({
                title: "Choose a playlist please!",
                icon: 'info',
                iconColor: '#e97236',
                confirmButtonColor: '#e97236'
            })
        }
    }, [dispatch, newSong, songName])

    return (
        <div>
            <Button
                variant="outlined"
                color="inherit"
                onClick={handleClickOpen}
                style={{ position: "absolute", width: "80%", height: "100%", opacity: "0" }}>
                <PlaylistAddIcon /> Add song
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{songName}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Add song to playlist
                    </DialogContentText>
                    <Select
                        fullWidth
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={newSong.playlistId}
                        onChange={plistChangeHandler}>
                        <MenuItem value="" selected>None</MenuItem>
                        {plist?.map(pl =>
                            <MenuItem value={pl?._id}>{pl?.name}</MenuItem>
                        )}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={addSongToPlayListHandler} color="primary">
                        Add to playlist
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
