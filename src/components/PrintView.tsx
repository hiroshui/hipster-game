import React from "react";
import styled from "styled-components";
import { Song } from "../models/Song";
import QRCode from "react-qr-code";

interface PrintViewProps {
  songs: Song[];
  name: string;
  isGap?: boolean;
  isBorder?: boolean;
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

const PrintView: React.FC<PrintViewProps> = ({
  songs,
  name,
  isGap = false,
  isBorder = false,
}) => {
  return (
    <PrintContainer
      style={{
        gridTemplateColumns: isGap ? "repeat(2, 12.25cm)" : "repeat(2, 12cm)",
      }}
    >
      {songs.map((song) => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        return (
          <CardWrapper
            key={song.id}
            style={{
              gap: isGap
                ? "0.25cm"
                : "0cm" /* Abstand zwischen Vorder- und Rückseite */,
            }}
          >
            {/* Vorderseite der Karte */}
            <CardFront
              style={{
                backgroundColor: randomColor,
                border: isBorder ? "1px dashed black" : "0",
              }}
            >
              <Artist>{song.artist}</Artist>
              <Year>{song.year}</Year>
              <Title>{song.title}</Title>
              <Popularity>{song.popularity}</Popularity>
            </CardFront>

            {/* Rückseite der Karte (QR-Code) */}
            <CardBack style={{ border: isBorder ? "1px dashed black" : "0" }}>
              <QRCodeTitle>{name}</QRCodeTitle>
              <QRCodeWrapper>
                <QRCode
                  style={{
                    borderRadius: "10px",
                    zIndex: 5,
                    marginTop: -30,
                  }}
                  value={song.spotifyUrl}
                  size={128}
                />
              </QRCodeWrapper>
            </CardBack>
          </CardWrapper>
        );
      })}
    </PrintContainer>
  );
};

export default PrintView;

// Styles
const PrintContainer = styled.div`
  display: grid;
  /* Jeweils 6cm für Vorder- und Rückseite */
  gap: 0.25cm;
  justify-content: center;
  padding: 0.5cm;
  margin: 0 auto;
  width: 100%;
  @media print {
    page-break-inside: avoid;
    break-inside: avoid;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 0.25cm; /* Abstand zwischen den Zeilen */
  @media print {
    page-break-inside: avoid;
    break-inside: avoid;
  }
`;

const CardFront = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 6cm;
  height: 6cm;
  position: relative;
  @media print {
    page-break-inside: avoid;
    break-inside: avoid;
  }
`;

const CardBack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 6cm;
  height: 6cm;
  background: linear-gradient(135deg, #32cd32, #ffd700);
  border: 1px dashed black;
  position: relative;
  @media print {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  /* Geometrische Formen oder Linienmuster */
  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0.2) 10px,
      transparent 10px,
      transparent 20px
    );
    z-index: 1;
  }
`;

const QRCodeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  z-index: 2;
`;

const QRCodeTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  width: 100%;
  color: black;
  margin-top: 10px;
  text-align: center;
  z-index: 1;
`;

const Artist = styled.h2`
  font-size: 20px;
  color: black;
`;

const Year = styled.h1`
  font-size: 42px;
  color: black;
`;

const Title = styled.p`
  font-size: 18px;
  font-style: italic;
  color: black;
  margin-top: 10px;
`;

const Popularity = styled.p`
  font-size: 10px;
  position: absolute;
  bottom: 10px;
  right: 10px;
  margin: 0;
  color: black;
`;
