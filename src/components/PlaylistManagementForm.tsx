import React, { useState, useEffect } from "react";
import PlaylistForm from "./PlaylistForm"; // Importiere die PlaylistForm
import { Playlist } from "../models/Playlist"; // Importiere das Playlist-Interface
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const PlaylistManagementForm: React.FC = () => {
  const { t } = useTranslation();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);

  useEffect(() => {
    const savedPlaylists = JSON.parse(
      localStorage.getItem("playlists") || "[]"
    );
    console.log(savedPlaylists);
    setPlaylists(savedPlaylists);
  }, []);

  const createPlaylist = () => {
    setPlaylists([]);
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: "Playlist",
      date: new Date().toISOString(),
      songs: [],
    };
    setEditingPlaylist(newPlaylist);
  };

  const loadPlaylist = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      if (e.target?.result) {
        try {
          const importedPlaylist: Playlist = JSON.parse(
            e.target.result as string
          ); // Parse die JSON-Datei und weise den Typ Playlist zu
          //setPlaylistName(importedPlaylist.name); // Setze den Namen der Playlist
          //setPlaylist(importedPlaylist.songs); // Setze die Songs in den State
          //setPlaylistDate(importedPlaylist.date); // Setze das Datum der Playlist
          alert("Playlist " + importedPlaylist.name + " imported!");
          setEditingPlaylist(importedPlaylist);
        } catch (error) {
          alert(
            "Fehler beim Import der Playlist. Bitte stelle sicher, dass die Datei korrekt formatiert ist."
          );
        }
      }
    };

    if (event.target.files?.length) {
      try {
        fileReader.readAsText(event.target.files[0]);
      } catch (error) {
        console.log("An error occured: ", error);
      }
    }
  };

  const handleFileUpload = () => {
    document.getElementById("fileInput")?.click(); // Trigger den Klick auf das unsichtbare File-Input-Element
  };

  return (
    <div>
      <PlaylistManagement>
        <Button type="submit" onClick={createPlaylist}>
          {t("create_playlist_placeholder")}
        </Button>
        <Button type="submit" onClick={handleFileUpload}>
          {t("load_playlist_placeholder")}
        </Button>
        <input
          type="file"
          id="fileInput"
          accept="application/json"
          style={{ display: "none" }}
          onChange={loadPlaylist}
        />
      </PlaylistManagement>
      {!editingPlaylist ? (
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              {playlist.name}
              <button onClick={() => setEditingPlaylist(playlist)}>
                {t("edit_playlist_placeholder")}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <PlaylistForm
          name={editingPlaylist.name}
          songs={editingPlaylist?.songs || []}
          date={editingPlaylist.date || Date.now.toString()}
          id={editingPlaylist.id || Date.now.toString()}
        />
      )}
    </div>
  );
};

export default PlaylistManagementForm;

const Button = styled.button`
  background-color: #3b3b3b;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 10px;
  margin: 10px;
  &:hover {
    background-color: #2b2b2b;
  }
`;

const PlaylistManagement = styled.div`
  @media print {
    * {
      display: none; /* Versteckt beim Drucken */
    }
  }
`;
