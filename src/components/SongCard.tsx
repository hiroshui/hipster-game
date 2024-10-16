import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import QRCode from "react-qr-code";
import { useSwipeable } from "react-swipeable";

interface SongCardProps {
  id: string;
  popularity: string;
  title: string;
  artist: string;
  year: string;
  spotifyUrl: string;
  albumcoverUrl: string;
  previewUrl: string;
  onDelete: () => void;
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

const SongCard: React.FC<SongCardProps> = ({
  id,
  popularity,
  title,
  artist,
  year,
  spotifyUrl,
  albumcoverUrl,
  previewUrl,
  onDelete,
}) => {
  const [flipped, setFlipped] = useState(true);
  const [cardcolor, setCardColor] = useState<string>(""); // Speichert die Farbe der Karte
  const [isRemoving, setIsRemoving] = useState(false);
  const [translateX, setTranslateX] = useState(0); // Zustand für die Swipe-Bewegung

  // Zufällige Farbe beim ersten Rendern setzen
  useEffect(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setCardColor(randomColor);
  }, []);

  const flipCard = () => {
    setFlipped(!flipped);
  };

  // Swipe-Handler initialisieren
  const swipeHandler = useSwipeable({
    onSwipedLeft: (eventData) => {
      eventData.event.stopPropagation();
      if (!isRemoving) {
        // Verhindere mehrfaches Auslösen
        setIsRemoving(true); // Setze den Zustand auf Entfernen
        setTimeout(() => {
          onDelete(); // Entferne die Karte nach der Animation
        }, 300); // Warte 300ms, um die Animation abzuspielen
      }
    },
    onSwiping: (eventData) => {
      setTranslateX(eventData.deltaX); // Aktualisiere die Position während des Swipes
    },
    onSwipedRight: () => {
      setTranslateX(0); // Setze die Karte zurück, wenn der Swipe abgebrochen wird
    },
    trackMouse: true, // Ermöglicht auch Swipen mit der Maus
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null); // Ref für das Audio-Element

  const handlePlayPause = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause(); // Song pausieren
      } else {
        audioRef.current.play(); // Song abspielen
      }
      setIsPlaying(!isPlaying); // Zustand umschalten
    }
  };

  return (
    <CardContainer
      {...swipeHandler}
      style={{
        backgroundColor: cardcolor,
        transform: `translateX(${translateX}px)`,
        pointerEvents: isRemoving ? "none" : "auto",
        padding: "10px", // Padding im Container für den Rand um das Bild
        boxSizing: "border-box", // Stellt sicher, dass das Padding berücksichtigt wird
      }} // Karte behält ihre Farbe
      onClick={flipCard}
    >
      <audio ref={audioRef} src={previewUrl} preload="auto" />
      {!flipped ? (
        <CardBack
          style={{
            backgroundImage:
              albumcoverUrl && albumcoverUrl.trim()
                ? `url(${albumcoverUrl})`
                : undefined,
            backgroundSize: "cover", // Albumcover deckt die gesamte Fläche ab
            backgroundPosition: "center", // Albumcover wird zentriert
            backgroundRepeat: "no-repeat", // Keine Wiederholung des Albumcovers
            width: "100%", // Füllt die gesamte Breite des Containers aus
            height: "100%", // Füllt die gesamte Höhe des Containers aus
            border: "none", // Entfernt eventuelle Ränder
            boxShadow: "none", // Entfernt eventuelle Schatten
            margin: "0", // Kein zusätzlicher Rand
            padding: "0", // Kein Padding
            borderRadius: "10px", // Beibehaltung der Kachel-Abrundung
          }}
        >
          {albumcoverUrl && albumcoverUrl.trim() ? ( //Falls kein albumcover vorhanden, brauchen wir das overlay auch nicht.
            <Overlay />
          ) : (
            <div></div>
          )}
          {/* Fügt ein halbtransparentes Overlay hinzu */}
          <Artist>{artist}</Artist>
          <Year>{year}</Year>
          <Title>{title}</Title>
          <Popularity>{popularity}</Popularity>
        </CardBack>
      ) : (
        <CardFront>
          <QRCode value={spotifyUrl} size={128} />
          {previewUrl && previewUrl.trim() ? (
            <PlayButton onClick={handlePlayPause}>
              {isPlaying ? "Pause" : "Pre-Play"}
            </PlayButton>
          ) : (
            <div></div>
          )}
        </CardFront>
      )}
    </CardContainer>
  );
};

export default SongCard;

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

const CardBack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const CardFront = styled.div`
  display: flex;
  flex-direction: column; /* Stack items vertically */
  justify-content: center;
  align-items: center;
  width: 100%; /* Stellt sicher, dass es die volle Breite ausfüllt */
  height: 100%; /* Stellt sicher, dass es die volle Höhe ausfüllt */
  padding: 10px; /* Optionales Padding, um den QR-Code ein wenig von den Rändern zu entfernen */
`;

const Artist = styled.h2`
  font-size: 20px;
  font-weight: bold;
  z-index: 2;
  color: white;
`;

const Year = styled.h1`
  font-size: 48px;
  margin: 20px 0;
  color: white;
  z-index: 2;
`;

const Title = styled.p`
  font-style: italic;
  font-size: 14px;
  color: white;
  z-index: 2;
`;

//Can be used for popularity infos
const Popularity = styled.p`
  font-style: italic;
  font-size: 8px;
  position: absolute; /* Position absolut setzen */
  bottom: 20px; /* Abstand vom unteren Rand */
  right: 20px; /* Abstand vom rechten Rand */
  margin: 0; /* Entfernt jegliche externe Abstände */
  color: white;
  z-index: 2;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 0.15% schwarzes Overlay */
  border-radius: 10px; /* Gleiche Abrundung wie die Kachel */
  z-index: 1; /* Setzt das Overlay unter den Text, aber über das Bild */
`;

const PlayButton = styled.button`
  background-color: #1db954; /* Spotify Green */
  color: white;
  border: none;
  border-radius: 50px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px; /* Abstand über dem Button */

  &:hover {
    background-color: #1ed760; /* Helleres Grün bei Hover */
  }
`;
