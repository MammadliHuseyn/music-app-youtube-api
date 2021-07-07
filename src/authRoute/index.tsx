import React from 'react'
import { Redirect, Route } from 'react-router-dom';
import { STORAGE_ACTIONS, userActionsWithStore } from '../localStorage/User/storage';
import { IUserStorage } from './../interfaces/types';

interface IProps {
    children: any;
    exact: boolean;
    path: string;
}

export const AuthRoute: React.FC<IProps> = ({ children, ...rest }) => {
    const user: IUserStorage = React.useMemo(() => {
        return userActionsWithStore(undefined, STORAGE_ACTIONS.GET_USER_FROM_STORAGE);
    }, [])

    return (user && user.token) ? (
        <Route {...rest}>
            {children}
        </Route>
    ) : <Redirect to="/login" />
}
