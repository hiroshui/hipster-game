import json
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from datetime import datetime
import uuid
import pandas as pd

# Deine Spotify API-Credentials
CLIENT_ID = ''
CLIENT_SECRET = ''

#args
csv_file="callme.csv"
out_file= "test.json"
playlist_name="Test Edition"

# Verwende Cache für den Token
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=CLIENT_ID,
                                                           client_secret=CLIENT_SECRET))

def search_track(track_name, artist_name):
    """Suche nach einem Track auf Spotify und gebe ihn im JSON-Format zurück."""
    query = f'track:{track_name} artist:{artist_name}'
    results = sp.search(q=query, type='track', limit=1)
    tracks = results['tracks']['items']
    
    if tracks:
        item = tracks[0]
        track_info = {
            "id": item['id'],
            "popularity": item['popularity'],
            "title": item['name'],
            "artist": item['artists'][0]['name'],
            "year": item['album']['release_date'].split("-")[0],
            "spotifyUrl": item['external_urls']['spotify'],
            "albumcoverUrl": item['album']['images'][0]['url'],
            "previewUrl": item['preview_url']
        }
        return track_info
    return None

# CSV-Datei laden
csv_path = csv_file
df = pd.read_csv(csv_path, sep=';')  # Falls das Trennzeichen ';' ist, ändere sep=';' 

# Grundstruktur für die JSON-Playlist
playlist = {
    "id": str(uuid.uuid4()),  # Eindeutige ID für die Playlist (kann angepasst werden)
    "name": playlist_name,
    "date": datetime.now().isoformat(),  # Aktuelles Datum in ISO-Format
    "songs": []  # Hier kommen die Songs rein
}

# Tracks suchen und zur Playlist hinzufügen
for index, row in df.iterrows():
    for song in ['Song 1', 'Song 2', 'Song 3']:
        track_info = search_track(row[song].split(' - ')[0], row[song].split(' - ')[1])
        if track_info:
            playlist["songs"].append(track_info)

# Speichere die Playlist als JSON-Datei
with open(out_file, 'w') as f:
    json.dump(playlist, f, indent=4)

print(f'Die Playlist wurde erfolgreich in {out_file} gespeichert.')
