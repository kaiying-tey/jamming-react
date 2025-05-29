import React from 'react';
import './Track.css';

const Track = ({ track, onAdd, onRemove, isRemoval=false }) => {

    // use the function from parent: App
    const addTrack = () => {
        onAdd(track);
    };

    const removeTrack = () => {
        onRemove(track);
    };

    return (
        <div className="track">
        <div className="track-information">
            <h3>{track.name}</h3>
            <p>{track.artist} | {track.album}</p>
        </div>
        <button className="track-action" onClick={isRemoval ? removeTrack : addTrack}>
            {isRemoval ? '-' : '+'}
        </button>
        </div>
    );
};

export default Track;
