import React from 'react';

import { reducer, initialState } from "./../reducer";
import { USER_ACTIONS } from './../actionTypes';
import { IUserDeletePlist, TUserAction } from './../../../interfaces/types';

describe('testing user reducer', () => {

    test('test user login state', () => {
        let action: TUserAction = {
            type: USER_ACTIONS.LOGIN_USER,
            payload: {
                createdAt: '01.03.2020',
                email: 'email@email.com',
                img: 'path.img',
                name: 'name',
                surname: 'surname',
                playlists: ['12345', '1234', '123']
            }
        }
        let expected = reducer(initialState, action);

        expect(expected).toStrictEqual(
            action.payload
        );
    })

    test('test user logout state', () => {
        let action: TUserAction = {
            type: USER_ACTIONS.LOGOUT_USER
        }
        let expected = reducer(initialState, action);

        expect(expected).toStrictEqual(
            initialState
        );
    })

    test('test add playlist to user state', () => {
        let action: TUserAction = {
            type: USER_ACTIONS.ADD_PLIST_TO_USER,
            payload: '123'
        }
        let expected = reducer(initialState, action);

        expect(expected).toStrictEqual({
            ...initialState,
            playlists: [
                ...initialState.playlists, action.payload
            ]
        });
    })

    test('test delete playlist from user state', () => {
        let action: IUserDeletePlist = {
            type: USER_ACTIONS.DELETE_PLIST_FROM_USER,
            payload: '123'
        }
        let expected = reducer(initialState, action);

        expect(expected).toStrictEqual({
            ...initialState,
            playlists: initialState.playlists.filter(id => id !== action.payload)
        });
    })
})