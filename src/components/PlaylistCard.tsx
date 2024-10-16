import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Song } from "../models/Song";

interface PlaylistCardProps {
  id: string;
  name: string;
  date: string;
  songs: Song[];
  //  onDelete: () => void;
}
const colors = [
  "#FF6F61",
  "#6B5B95",
  "#88B04B",
  "#FFA500",
  "#92A8D1",
  "#955251",
  "#009688",
  "#FFB6C1",
  "#8A2BE2",
  "#FFD700",
  "#00CED1",
  "#FF4500",
  "#32CD32",
  "#4682B4",
];

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  id,
  name,
  date,
  songs,
}) => {
  const { t } = useTranslation();
  const [cardcolor, setCardColor] = useState<string>(""); // Speichert die Farbe der Karte

  // Zufällige Farbe beim ersten Rendern setzen
  useEffect(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setCardColor(randomColor);
  }, []);

  return (
    <CardContainer
      style={{
        backgroundColor: cardcolor,
      }}
    >
      <Card>
        <Name>Playlist: {name}</Name>
        <Songs>
          {t("playlist_count_placeholder")}: {songs.length}
        </Songs>
        <Date>Date: {date}</Date>
      </Card>
    </CardContainer>
  );
};

export default PlaylistCard;

const CardContainer = styled.div`
  position: relative;
  width: 250px;
  height: 250px; /* Quadratische Form */
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out; /* Übergänge für sanftes Entfernen */
  margin: 10px; /* Abstand zwischen den Karten */
  &:hover {
    transform: scale(1.05);
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Artist = styled.h2`
  font-size: 20px;
  font-weight: bold;
  z-index: 2;
  color: white;
`;

const Name = styled.h1`
  font-size: 32px;
  margin: 20px 0;
  color: white;
  z-index: 2;
`;

const Songs = styled.p`
  font-style: italic;
  font-size: 14px;
  color: white;
  z-index: 2;
`;

//Can be used for popularity infos
const Date = styled.p`
  font-style: italic;
  font-size: 8px;
  position: absolute; /* Position absolut setzen */
  bottom: 20px; /* Abstand vom unteren Rand */
  right: 20px; /* Abstand vom rechten Rand */
  margin: 0; /* Entfernt jegliche externe Abstände */
  color: white;
  z-index: 2;
`;
