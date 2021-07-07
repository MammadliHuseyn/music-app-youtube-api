import React from 'react';
import './../../sass/layout/sidebar.scss';
import { Link, useHistory } from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { LogOutUser } from '../../store/user/actions';
import { useDispatch, useSelector } from 'react-redux';
import { IUseSelector } from '../../interfaces/useSelectorType';
import userLogo from './../../img/user-logo.png';
import Swal from 'sweetalert2';

export const Sidebar = () => {
    const { push } = useHistory();
    const dispatch = useDispatch();
    const user = useSelector((state: IUseSelector) => state.User);
    const logOutHandler = React.useCallback(() => {
        Swal.fire({
            title: 'Are you sure to log out?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            iconColor: '#e97236',
            confirmButtonColor: '#e97236',
            cancelButtonColor:'#16181C',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                LogOutUser()(dispatch);
                push('/login');
            }
        })
    }, [dispatch, push]);
    return (
        <ul className="sidebar">
            <li className="playlist-item large"><Link to="/search">Search</Link></li>
            <li className="playlist-item large large-selected"><Link to="/" className="">Playlists</Link></li>
            {!user.email && <>
                <span className="playlist-heading"><Link to="/login">Login to save playlists</Link></span>
                <span className="playlist-heading"><Link to="/register">Register</Link> </span>
            </>}
            {user.email &&
                <div className="text-center mt-3">
                    <img src={user.img || userLogo} alt="user logo" className="rounded-circle" width="40" height="40" />
                    <p>{user.name} {user.surname}</p>
                    <p
                        style={{ cursor: "pointer" }}
                        onClick={logOutHandler} >
                        <ExitToAppIcon />
                        Logout</p>
                </div>
            }
        </ul>
    )
}
