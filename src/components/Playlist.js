import React, {useState} from 'react';
import Tracklist from './Tracklist';
import './Playlist.css';

const Playlist = ({ playlistName, playlistTracks, onNameChange, onRemove, onSave }) => {

    const [isEditing, setIsEditing] = useState(false); // styling based on the mode
    const [tempName, setTempName] = useState(playlistName);
    
    // Set to edit mode when user clicks on the playlist name text
    const handleNameClick = () => {
        setIsEditing(true);
    };

    // Updates local state as user types in the input field
    const handleInputChange = (e) => {
        setTempName(e.target.value);
    };

    // Handles exiting edit mode: blur or pressing Enter
    const handleBlurOrEnter = () => {
        setIsEditing(false);
        onNameChange(tempName.trim() || 'New Playlist'); // fallback to default if empty
    };

    // User press Enter to cofirm playlist name changes
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleBlurOrEnter();
        }
    };

    return (
        <div className="playlist">
            {isEditing ? (
                <input
                    type="text"
                    value={tempName}
                    onChange={handleInputChange}
                    onBlur={handleBlurOrEnter}
                    onKeyDown={handleKeyPress}
                    autoFocus
                />
            ) : (
                <h2 onClick={handleNameClick} className='playlist-name'>
                    {playlistName} <span>Click to edit</span>
                </h2>
            )}
        <Tracklist tracks={playlistTracks} onRemove={onRemove} isRemoval={true} />
        <button onClick={onSave} className='playlist-save-button'>SAVE TO SPOTIFY</button>
        </div>
    );
};

export default Playlist;
