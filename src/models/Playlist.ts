import { Song } from "./Song";

export interface Playlist {
  id: string;
  name: string;
  date: string;
  songs: Song[];
}

export { Song };
