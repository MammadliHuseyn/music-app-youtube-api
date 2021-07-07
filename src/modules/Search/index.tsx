import React from 'react';
import './../../sass/layout/search.scss';
import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { API_KEY } from '../../api';
import { Row } from 'react-bootstrap';
import { SearchItem } from './SearchItem';
import { IYoutubeSearchRes } from '../../interfaces/types';

export const Search = () => {
    const [query, setQuery] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState<Boolean>(false);
    const [searchItems, setSearchItems] = React.useState<Array<IYoutubeSearchRes>>([]);
    const queryChangeHandler = React.useCallback((e: any) => {
        const { target: { value } } = e;
        setQuery(value);
    }, []);
    const searchItemAcc = React.useCallback((items: []) => {
        setSearchItems(items);
    }, []);
    const searchSubmitHandler = React.useCallback((e: any) => {
        e.preventDefault();
        if (query) {
            setIsLoading(true);
            axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${API_KEY}`)
                .then(({ data: { items } }) => searchItemAcc(items))
                .then(() => setIsLoading(false));
        }
    }, [query, searchItemAcc])
    return (
        <div className="outer-container">
            <div className="browse-container p-5">
                <form onSubmit={searchSubmitHandler} id="search-form">
                    <label htmlFor="search"></label>
                    <input type="search" id="search" onChange={queryChangeHandler} value={query} />
                    <button type="submit">
                        Search
                    </button>
                </form>
                {isLoading
                    ?
                    <div className="d-flex justify-content-center align-items-center">
                        <CircularProgress />
                    </div>
                    :
                    <>
                        <Row>
                            {searchItems.map(item =>
                                <SearchItem
                                    searchItem={item}
                                    key={item.id.videoId} />
                            )}
                        </Row>
                        {searchItems.length < 1 &&
                            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh", fontSize: "3rem" }}>
                                Search on Youtube for musics!
                            </div>
                        }
                    </>
                }

            </div>
        </div>
    )
}