import { Buffer } from 'buffer';

const clientId = 'd1a6554d099d45b8aaa30743792438f2'; // Replace with your Spotify App's client ID
const clientSecret = '29e6b751633747f796217ab55a683a30';
const redirectUri = 'http://127.0.0.1:3000/callback';
let accessToken;

const Spotify = {

    async getToken() {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64')),
            },
        });

        return await response.json();
    },

    async search(term) {
        const accessToken = await this.getToken();
        // console.log('Access token: ', accessToken.access_token);
        const endpoint = `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`;
        console.log('Searching endpoint: ', endpoint);

        return fetch(endpoint, {
            headers: {
                Authorization: `Bearer ${accessToken.access_token}`
            }
            }).then(response => {
                return response.json();
            }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },

    getAuthCode() {
        if (accessToken) {
            return accessToken;
        }

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
            return accessToken;

        } else {
            const scope = 'user-library-read user-read-email playlist-modify-public';
            // var state = generateRandomString(16);
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&scope=${scope}&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    async getTokenByCode(code) {

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            body: new URLSearchParams({
                'code': code,
                'redirect_uri': redirectUri,
                'grant_type': 'authorization_code',
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64')),
            },
        });
        
        const responseJson = await response.json();
        console.log('Token response 2: ', responseJson);
        // console.log('Token response: ', responseJson.access_token);
        localStorage.setItem('spotify_access_token', responseJson.access_token);
    },

    async getUserProfile (accessToken) {
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        }).catch(error => {
            console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
        });
        return response.json();
    },

    async createPlaylist(accessToken, userId, name) {
        console.log('Creating playlist for : ', userId, 'with name ', name);
        const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: 'POST',
            body: JSON.stringify({
                'name': name,
                'description': 'New playlist from Jammming app',
                'public': false
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        return response.json();
    },

    async addTracksToPlaylist (accessToken, playlistId, tracks) {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'POST',
            body: JSON.stringify({
                'uris': tracks
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        return response.json();
    },

    loginUrl() {
        const scopes = [
            'user-read-private',
            'user-read-email',
            'playlist-read-private',
            'playlist-modify-private',
            'playlist-modify-public',
            'playlist-read-collaborative',
        ];

        const authEndpoint = 'https://accounts.spotify.com/authorize';

        return `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=code&show_dialog=true`;
    } 

};

export default Spotify;
