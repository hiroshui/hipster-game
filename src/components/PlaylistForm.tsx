import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import SongCard from "./SongCard";
import { getSpotifyToken } from "../helpers/getSpotifyToken";
import { Song } from "../models/Song";
import PlaylistCard from "./PlaylistCard";
import PrintView from "./PrintView";

interface PlaylistFormProps {
  name: string;
  songs: Song[]; // Prop für die Liste der Songs
  date: string;
  id: string;
}

const PlaylistForm: React.FC<PlaylistFormProps> = ({
  name,
  songs,
  date,
  id,
}) => {
  const { t } = useTranslation();
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>(songs);
  const [playlistName, setPlaylistName] = useState<string>(name);
  const [playlistDate, setPlaylistDate] = useState<string>(date);
  const playlistId = id;
  const [input, setInput] = useState<Song>({
    id: "",
    popularity: "",
    title: "",
    artist: "",
    year: "",
    spotifyUrl: "",
    albumcoverUrl: "",
    previewUrl: "",
  });
  const [spotifyUrl, setSpotifyUrl] = useState<string>("");
  const [maxCount, setMaxCount] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isPrintMode, setIsPrintMode] = useState<boolean>(false);
  const [isGap, setIsGap] = useState<boolean>(false);
  const [isBorder, setIsBorder] = useState<boolean>(true);

  // Hole das Spotify Access Token beim App-Start
  useEffect(() => {
    const fetchToken = async () => {
      const token = await getSpotifyToken();
      if (token) {
        setAccessToken(token);
      } else {
        console.error("Failed to fetch Spotify token");
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    setPlaylistName(name); // Update playlist name when props change
    setPlaylistSongs(songs); // Update songs when props change
  }, [name, songs]);

  const addSong = (e: React.FormEvent) => {
    e.preventDefault();
    setPlaylistSongs([...playlistSongs, input]);
    setInput({
      id: Date.now().toString(),
      popularity: "",
      title: "",
      artist: "",
      year: "",
      spotifyUrl: "",
      albumcoverUrl: "",
      previewUrl: "",
    });
  };

  const deleteSong = (id: string) => {
    setPlaylistSongs(playlistSongs.filter((song) => song.id !== id));
    console.log("deleted song ", id, "of currently ", playlistSongs.length);
  };

  const switchPrintMode = () => {
    setIsPrintMode((prev) => !prev); // Zustand umkehren
  };

  // Funktion zum Umschalten des Modus
  const toggleGapMode = () => setIsGap((prev) => !prev);

  // Funktion zum Umschalten des Modus
  const toggleBorderMode = () => setIsBorder((prev) => !prev);

  const printPage = () => {
    console.log("about to print " + playlistSongs.length + " songs.");
    window.print();
  };

  const importSpotifyPlaylist = async () => {
    try {
      const playlistIdMatch = spotifyUrl.match(/playlist\/([^?]+)/);
      const playlistId = playlistIdMatch ? playlistIdMatch[1] : null;
      const userMaxCount = Number(maxCount) || 500;

      if (!playlistId) {
        alert(t("invalid_url"));
        return;
      }

      let nextUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
      let importedSongs: any[] = [];
      let totalLoadedSongs = 0;
      let countDublicateSongs = 0;

      while (nextUrl && totalLoadedSongs < userMaxCount) {
        const response = await fetch(nextUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          data.items.forEach((item: any) => {
            if (item.track === null) {
              console.warn("Track is null and will be skipped:", item);
            }
          });

          data.items.forEach((item: any) => {
            if (item.track.album.images[0].url === null) {
              console.warn(
                "Image URL of track " + item.track.name + " is null"
              );
            }
          });

          data.items.forEach((item: any) => {
            const trackAlreadyExists = playlistSongs.some(
              (song: any) => song.id === item.track.id
            );
            if (trackAlreadyExists) {
              countDublicateSongs++;
            }
          });

          const newSongs = data.items
            .filter((item: any) => item.track !== null)
            .filter(
              (item: any) =>
                !playlistSongs.some((song: any) => song.id === item.track.id)
            )
            .map((item: any) => ({
              id: item.track.id,
              popularity: item.track.popularity,
              title: item.track.name,
              artist: item.track.artists[0].name,
              year: item.track.album.release_date.split("-")[0],
              spotifyUrl: item.track.external_urls.spotify,
              albumcoverUrl: item.track.album.images[0].url,
              previewUrl: item.track.preview_url,
            }));

          const remainingSongsToAdd = userMaxCount - totalLoadedSongs;
          const songsToAdd = newSongs.slice(0, remainingSongsToAdd);

          importedSongs = [...importedSongs, ...songsToAdd];
          totalLoadedSongs += songsToAdd.length;

          // Wenn maxCount erreicht wurde, breche die Schleife ab
          if (totalLoadedSongs >= userMaxCount) {
            break;
          }

          nextUrl = data.next;
        } else {
          console.error("Error fetching playlist from Spotify");
          break;
        }
      }

      setPlaylistSongs([...playlistSongs, ...importedSongs]);

      console.log(
        `Loaded ${totalLoadedSongs} new songs from playlist ${spotifyUrl}`
      );

      if (countDublicateSongs > 0) {
        alert(
          countDublicateSongs +
            " songs were already there. Wont be imported. Each song can be only once in this playlist."
        );
      }
    } catch (error) {
      console.error("Error importing playlist:", error);
    }
  };

  const moveCard = (currentIndex: number, direction: "up" | "down") => {
    const newPlaylist = [...playlistSongs];
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= newPlaylist.length) return;

    [newPlaylist[currentIndex], newPlaylist[targetIndex]] = [
      newPlaylist[targetIndex],
      newPlaylist[currentIndex],
    ];

    setPlaylistSongs(newPlaylist);
  };

  const exportPlaylist = () => {
    const fileName = playlistName + ".json";
    const realPlaylist = {
      id: playlistId,
      name: playlistName,
      songs: playlistSongs,
      date: playlistDate,
    };
    const json = JSON.stringify(realPlaylist, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };

  return (
    <FormContainer>
      <InputContainer>
        <CenteredContainer>
          <PlaylistCard
            id={playlistId}
            date={playlistDate}
            name={playlistName}
            songs={playlistSongs}
          />
        </CenteredContainer>
        <Input
          type="text"
          placeholder={playlistName}
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          required
        />
        <Button type="button" onClick={switchPrintMode}>
          {isPrintMode ? "Exit Print Mode" : "Enter Print Mode"}
        </Button>
        {isPrintMode && (
          <div>
            {
              <div>
                <ToggleButton onClick={toggleBorderMode}>
                  {isBorder
                    ? t("show_no_border_placeholder")
                    : t("show_border_placeholder")}
                </ToggleButton>
                <ToggleButton onClick={toggleGapMode}>
                  {isGap
                    ? t("show_no_gap_placeholder")
                    : t("show_gap_placeholder")}
                </ToggleButton>
              </div>
            }
            <Button type="button" onClick={printPage}>
              {t("print_placeholder")}
            </Button>
          </div>
        )}
      </InputContainer>
      {isPrintMode ? (
        <PrintView
          songs={playlistSongs}
          name={playlistName}
          isGap={isGap}
          isBorder={isBorder}
        />
      ) : (
        <div>
          <Form onSubmit={addSong}>
            <Button type="submit" onClick={exportPlaylist}>
              {t("export_playlist_placeholder")}
            </Button>
            <Input
              type="text"
              placeholder={t("song_title_placeholder")}
              value={input.title}
              onChange={(e) => setInput({ ...input, title: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder={t("artist_placeholder")}
              value={input.artist}
              onChange={(e) => setInput({ ...input, artist: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder={t("year_placeholder")}
              value={input.year}
              onChange={(e) => setInput({ ...input, year: e.target.value })}
            />
            <Input
              type="text"
              placeholder={t("spotify_url_placeholder")}
              value={input.spotifyUrl}
              onChange={(e) =>
                setInput({ ...input, spotifyUrl: e.target.value })
              }
              required
            />
            <Button type="submit">{t("add_song")}</Button>
          </Form>

          <Input
            type="text"
            placeholder={t("spotify_playlist_url_placeholder")}
            value={spotifyUrl}
            onChange={(e) => setSpotifyUrl(e.target.value)}
          />
          <Input
            type="text"
            placeholder={t("spotify_playlist_maxCount_placeholder")}
            value={maxCount}
            onChange={(e) => setMaxCount(e.target.value)}
          />
          <Button onClick={importSpotifyPlaylist}>
            {t("import_playlist")}
          </Button>

          <PlaylistCardsContainer>
            <h1>
              {t("playlist_count_placeholder")}: {playlistSongs.length}
            </h1>
            <h5>Info: {t("deletion_info")}</h5>
            {playlistSongs.map((song, index) => (
              <div key={song.id}>
                <SongCard {...song} onDelete={() => deleteSong(song.id)} />
                <ButtonUpDown onClick={() => moveCard(index, "up")}>
                  ⬆️
                </ButtonUpDown>
                <ButtonUpDown onClick={() => moveCard(index, "down")}>
                  ⬇️
                </ButtonUpDown>
              </div>
            ))}
          </PlaylistCardsContainer>
        </div>
      )}
    </FormContainer>
  );
};
export default PlaylistForm;

const ToggleButton = styled.button`
  background-color: #3b3b3b;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  margin: 10px;
  &:hover {
    background-color: #2b2b2b;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%; /* Optional: Passt die Breite an */
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 80%;
`;

const Button = styled.button`
  background-color: #3b3b3b;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 10px;
  margin-right: 10px;
  &:hover {
    background-color: #2b2b2b;
  }
`;

const ButtonUpDown = styled.button`
  background-color: #3b3b3b;
  color: white;
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 10px;
  &:hover {
    background-color: #2b2b2b;
  }
`;

const PlaylistCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; /* Optional */
  justify-content: center;
  @media print {
    * {
      display: none; /* Versteckt beim Drucken */
    }
  }
`;
