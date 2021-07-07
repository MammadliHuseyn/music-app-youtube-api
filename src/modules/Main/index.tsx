import React from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { AuthRoute } from './../../authRoute';
import { Playlist } from './../Playlists';
import { Sidebar } from './../Sidebar';
import { CurrentPlaying } from './../CurrentPlaying';
import { Songs } from './../Songs';
import { Register } from './../Register';
import { Login } from './../Login';
import { Search } from './../Search';
import { useDispatch } from 'react-redux';
import { STORAGE_ACTIONS, userActionsWithStore } from '../../localStorage/User/storage';
import { getPlaylist } from '../../store/playlist/actions';
import { getUser } from '../../store/user/actions';

export const Main = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = React.useMemo(() => {
        return userActionsWithStore(undefined, STORAGE_ACTIONS.GET_USER_FROM_STORAGE);
    }, [])
    if (user) {
        getUser()(dispatch)
            .then(() => getPlaylist()(dispatch))
            .catch(() => {
                userActionsWithStore(undefined, STORAGE_ACTIONS.DELETE_USER_FROM_STORAGE);
                history.push('/login');
            });
    }
    return (
        <>
            <Sidebar />
            <CurrentPlaying />
            <Switch>
                <AuthRoute exact path="/search">
                    <Search />
                </AuthRoute>
                <Route exact path="/Register" component={Register} />
                <Route exact path="/Login" component={Login} />
                <AuthRoute exact path="/">
                    <Playlist />
                </AuthRoute>
                <AuthRoute exact path="/:id">
                    <Songs />
                </AuthRoute>
                <Redirect to="/" />
            </Switch>
        </>
    )
}
