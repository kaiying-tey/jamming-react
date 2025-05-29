import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spotify from '../utils/Spotify';

const Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {

        const codeMatch = window.location.href.match(/[?&]code=([^&]+)/);
        const authCode = codeMatch ? decodeURIComponent(codeMatch[1]) : '';
        console.log('Extracted auth code:', authCode);

        const accessTokenMatch = window.location.href.match(/[?&]access_token=([^&]+)/);
        const accessToken = accessTokenMatch ? decodeURIComponent( accessTokenMatch[1]) : '';
        console.log('Extracted access token:', accessToken);


        if (accessToken) {
            localStorage.setItem('spotify_access_token', accessToken);
            navigate('/');
        } else if (authCode) {
            Spotify.getTokenByCode(authCode);
            console.log("Here storage: ", localStorage.getItem('spotify_access_token'));
            navigate('/');
        } else {
            navigate('/');
        }
    }, [navigate]);

    return <div>Loading...</div>;
};

export default Callback;