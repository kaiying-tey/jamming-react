import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';
import Spotify from './utils/Spotify';
import Callback from './components/Callback';
import spotifyLogo from './spotify_logo.svg';

function MainApp() {

  const [searchResults, setSearchResults] = useState([]);

  const [playlistName, setPlaylistName] = useState('My Playlist Name');
  const [playlistTracks, setPlaylistTracks] = useState([]);

  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);

  // Initial load
  useEffect(() => {

    // Get access token from Spotify
    const accessToken = localStorage.getItem('spotify_access_token');
    if (accessToken) {
      console.log("token", accessToken);
      setAuthToken(accessToken);
      Spotify.getUserProfile(accessToken).then(response => {
        setUser(response);
      }).catch(error => {
        console.error('Error fetching user profile:', error);
      });
    }

    // Random search results
    Spotify.search('Top hits 2024').then(results => {
      setSearchResults(results); // Update your state with fetched results
    });

  }, []);

  const addTrack = (track) => {
    console.log('Adding track:', track); // Check what adding
    const trackExists = playlistTracks.find(savedTrack => savedTrack.id === track.id);
    if (!trackExists) {
      setPlaylistTracks(prev => [...prev, track]);
    }
  };

  const removeTrack = (track) => {
    console.log('Removing track:', track); // Check what removing
    setPlaylistTracks(prev => prev.filter(t => t.id !== track.id));
  };

  const savePlaylist = () => {

    if(!authToken){
      alert('Please login with Spotify first!');
      return;
    }

    if(!playlistTracks || !playlistTracks.length){
      alert('Playlist is currently empty, unable to create!');
      return;
    }

    // Extract all URIs from the current playlist tracks
    const trackURIs = playlistTracks.map(track => track.uri);

    // Sample: Simulate saving by logging the result
    // console.log('Saving playlist to Spotify with name:', playlistName);
    // console.log('Saving playlist to Spotify with URIs:', trackURIs);

    // Use Spotify api
    Spotify.createPlaylist(authToken, user.id, playlistName).then((response) => {
      const playlistId = response.id;
      console.log('Playlist created successfully!', response);

      return Spotify.addTracksToPlaylist(authToken, playlistId, trackURIs);
    }).then((response) => {
      console.log('Playlist saved successfully!', response);
      // Reset after saving
      setPlaylistName('New Playlist');
      setPlaylistTracks([]);
      alert('Playlist saved to your Spotify account!');
    }).catch(error => {
      console.error('Error saving playlist:', error);
    });
  };

  // Search tracks with Spotify 
  const searchSpotify = (term) => {

    console.log('Searching with:', term)
    Spotify.search(term).then(results => {
      setSearchResults(results); // Update your state with fetched results
    });
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('spotify_access_token');
    alert('Successfully log out!');
  }


  return (
    <div className="App">
      <div className='app-header'>
        <h1>Jamming</h1>
        {!authToken ? (
          <div className="spotify-login">
            <a href={Spotify.loginUrl()}> Login with Spotify <img src={spotifyLogo}/> </a>
          </div>
          
        ) : (
          <div className='app-user-details'>
              <h2>Welcome, {user && user.display_name}</h2>
              <button className='app-logout' onClick={logout}>Log Out</button>
            </div>
        )}
      </div>
      <SearchBar onSearch={searchSpotify} />
      <div className='app-playlist'>
        <SearchResults searchResults={searchResults} onAdd={addTrack} />
        <Playlist playlistName={playlistName}
          playlistTracks={playlistTracks}
          onNameChange={setPlaylistName} 
          onRemove={removeTrack}
          onSave={savePlaylist}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/callback" element={<Callback />} />
        <Route path="/" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

export default App;
