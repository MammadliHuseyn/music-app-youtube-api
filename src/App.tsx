import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { AuthRoute } from './authRoute';
import { Playlist } from './modules/Playlists';
import { Sidebar } from './modules/Sidebar';
import { CurrentPlaying } from './modules/CurrentPlaying';
import { Songs } from './modules/Songs';
import { Register } from './modules/Register';
import { Login } from './modules/Login';
import { Search } from './modules/Search';
import { getUser } from './store/user/actions';
import { useDispatch } from 'react-redux';
import { STORAGE_ACTIONS, userActionsWithStore } from './localStorage/User/storage';
import { getPlaylist } from './store/playlist/actions';

const App = () => {
  const history = useHistory();
  const user = React.useMemo(() => {
    return userActionsWithStore(undefined, STORAGE_ACTIONS.GET_USER_FROM_STORAGE);
  }, [])
  const dispatch = useDispatch();
  if (user) {
    getUser()(dispatch)
      .then(() => getPlaylist()(dispatch))
      .catch(() => {
        userActionsWithStore(undefined, STORAGE_ACTIONS.DELETE_USER_FROM_STORAGE);
        history.push('/login');
      });
  }
  return (
    <Router>
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
    </Router>
  );
}

export default App;
