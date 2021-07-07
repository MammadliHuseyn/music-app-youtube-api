import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import { IPlaylistAddForm } from '../../interfaces/types';
import { addPlaylist } from '../../store/playlist/actions';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

export const AddPlaylistDialog = () => {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');
    const dispatch = useDispatch();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const nameChangeHandler = React.useCallback((e: any) => {
        setName(e.target.value);
    }, [])

    const createNewPlaylistHandler = React.useCallback(() => {
        if (name) {
            const newPlaylist: IPlaylistAddForm = {
                name,
                songs: []
            }
            addPlaylist(newPlaylist)(dispatch).then(handleClose);
        } else {
            Swal.fire({
                title: "Enter a name please!",
                icon:'warning',
                iconColor:'#e97236',
                confirmButtonColor:'#e97236'
            })
        }
    }, [name, dispatch])

    return (
        <div>
            <Button variant="outlined" color="inherit" onClick={handleClickOpen}>
                <PlaylistAddIcon /> New Playlist
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Playlist</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Create new playlist!
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={nameChangeHandler} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={createNewPlaylistHandler} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
