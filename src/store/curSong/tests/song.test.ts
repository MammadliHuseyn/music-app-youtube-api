import React from 'react';

import { reducer, initialState } from "../reducer";
import { CUR_SONG_ACTIONS } from './../actionTypes';
import { TSongAction } from './../../../interfaces/types';

describe('testing song reducer', () => {

    test('test set song state', () => {
        let action: TSongAction = {
            type: CUR_SONG_ACTIONS.SET_SONG,
            payload: {
                artist: 'artist',
                duration: '150',
                id: 'id',
                img: 'path.img',
                plistId: 'plistId',
                title: 'title'
            }
        }
        let expected = reducer(initialState, action);

        expect(expected).toStrictEqual({
            ...initialState,
            cur: action.payload
        });
    })

    test('test set prev song state', () => {
        let action: TSongAction = {
            type: CUR_SONG_ACTIONS.SET_PREV_SONG,
            payload: {
                artist: 'prev_artist',
                duration: '160',
                id: 'prev_id',
                img: 'prev_path.img',
                plistId: 'prev_plistId',
                title: 'prev_title'
            }
        }
        let expected = reducer(initialState, action);

        expect(expected).toStrictEqual({
            ...initialState,
            prev: action.payload
        });
    })

    test('test set next song state', () => {
        let action: TSongAction = {
            type: CUR_SONG_ACTIONS.SET_NEXT_SONG,
            payload: {
                artist: 'next_artist',
                duration: '160',
                id: 'next_id',
                img: 'next_path.img',
                plistId: 'next_plistId',
                title: 'next_title'
            }
        }
        let expected = reducer(initialState, action);

        expect(expected).toStrictEqual({
            ...initialState,
            next: action.payload
        });
    })
})