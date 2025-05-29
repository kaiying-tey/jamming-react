import React, {useState} from 'react';
import './SearchBar.css';

const SearchBar = ( {onSearch} ) => {

    const [term, setTerm] = useState('');

    const handleTermChange = (e) => {
        setTerm(e.target.value);
    };

    const search = () => {
        onSearch(term);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            search();
        }
    };

    return (
        <div className='search-bar'>
            <input placeholder='Enter a Song, Album or Artist...' onChange={handleTermChange} onKeyDown={handleKeyPress} value={term}/>
            <button onClick={search}>SEARCH</button>
        </div>
    );
};

export default SearchBar;