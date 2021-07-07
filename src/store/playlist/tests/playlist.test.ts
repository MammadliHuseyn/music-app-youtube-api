import React from 'react';

import { reducer, initialState } from "./../reducer";
import { PLIST_ACTIONS } from './../actionTypes';
import { IAddSongToPlaylistAction, IDeleteSongFromPlaylistAction, TPlaylistAction } from './../../../interfaces/types';

describe('testing playlist reducer', () => {

    test('test get playlist state', () => {
        let action: TPlaylistAction = {
            type: PLIST_ACTIONS.GET_PLIST,
            payload: [
                {
                    _id: 'id',
                    name: 'name',
                    songs: ['first_song', 'second_song', 'third_song']
                }
            ]
        }
        let expected = reducer(initialState, action);

        expect(expected).toStrictEqual(
            action.payload
        );
    })

    test('test add playlist state', () => {
        let action: TPlaylistAction = {
            type: PLIST_ACTIONS.ADD_PLIST,
            payload: {
                _id: 'id',
                name: 'name',
                songs: ['first_song', 'second_song', 'third_song']
            }
        }
        let expected = reducer(initialState, action);

        expect(expected).toStrictEqual([
            ...initialState,
            action.payload
        ]);
    })

    test('test delete playlist state', () => {
        let action: TPlaylistAction = {
            type: PLIST_ACTIONS.DELETE_PLIST,
            payload: 'songId'
        }
        let expected = reducer(initialState, action);

        expect(expected).toStrictEqual(
            initialState.filter(pl => pl._id !== action.payload)
        );
    })

    test('test add song to playlist state', () => {
        let action: IAddSongToPlaylistAction = {
            type: PLIST_ACTIONS.ADD_SONG_TO_PLIST,
            payload: {
                songId: 'songId',
                playlistId: 'playlistId'
            }
        }
        let expected = reducer(initialState, action);

        expect(expected).toStrictEqual(
            initialState.map(pl => {
                if (pl._id === action.payload.playlistId) {
                    pl.songs.push(action.payload.songId);
                }
                return pl;
            })
        );
    })

    test('test delete song from playlist state', () => {
        let action: IDeleteSongFromPlaylistAction = {
            type: PLIST_ACTIONS.DELETE_SONG_FROM_PLIST,
            payload: {
                songId: 'songId',
                playlistId: 'playlistId'
            }
        }
        let expected = reducer(initialState, action);

        expect(expected).toStrictEqual(
            initialState.map(pl => {
                if (pl._id === action.payload.playlistId) {
                    pl.songs = pl.songs.filter(id => id !== action.payload.songId)
                }
                return pl;
            })
        );
    })
})