import React, { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Funksjon for å hente sanger basert på søket
  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim() === '') return;

    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSongs(data.results);
    } catch (error) {
      console.error('Feil ved henting av sanger:', error);
    }
  };

  // Legg til en sang i favorittlisten
  const addFavorite = (song) => {
    if (!favorites.find((fav) => fav.trackId === song.trackId)) {
      setFavorites([...favorites, song]);
    }
  };

  // Fjern en sang fra favorittlisten
  const removeFavorite = (song) => {
    setFavorites(favorites.filter((fav) => fav.trackId !== song.trackId));
  };

  // Hjemknappfunksjon: tilbakestill søk og søkeresultater
  const handleHome = () => {
    setQuery('');
    setSongs([]);
  };

  return (
    <div className="container">
      {/* Overskriften fungerer som hjemknapp */}
      <h1 onClick={handleHome} style={{ cursor: 'pointer' }}>
        Song Search App
      </h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Søk etter sanger..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Søk
        </button>
      </form>

      {/* Favoritter vises øverst */}
      <section className="favorites-section">
        <h2>Favoritter</h2>
        {favorites.length === 0 ? (
          <p>Ingen favoritter enda.</p>
        ) : (
          <div className="song-grid">
            {favorites.map((song) => (
              <div key={song.trackId} className="song-box">
                <img
                  src={song.artworkUrl100}
                  alt={song.trackName}
                  className="song-image"
                />
                <p>
                  <strong>{song.trackName}</strong>
                </p>
                <p>{song.artistName}</p>
                <button
                  onClick={() => removeFavorite(song)}
                  className="box-button"
                >
                  Fjern fra favoritt
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Søkeresultater vises under */}
      <section className="results-section">
        <h2>Søkeresultater</h2>
        {songs.length === 0 ? (
          <p>Ingen sanger funnet. Søk etter noe!</p>
        ) : (
          <div className="song-grid">
            {songs.map((song) => {
              const isFavorite = favorites.some(
                (fav) => fav.trackId === song.trackId
              );
              return (
                <div key={song.trackId} className="song-box">
                  <img
                    src={song.artworkUrl100}
                    alt={song.trackName}
                    className="song-image"
                  />
                  <p>
                    <strong>{song.trackName}</strong>
                  </p>
                  <p>{song.artistName}</p>
                  <button
                    onClick={() =>
                      isFavorite ? removeFavorite(song) : addFavorite(song)
                    }
                    className="box-button"
                  >
                    {isFavorite ? 'Fjern fra favoritt' : 'Legg til favoritt'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
