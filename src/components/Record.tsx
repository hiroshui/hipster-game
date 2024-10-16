import React from "react";
import styled, { keyframes } from "styled-components";

const Record: React.FC = () => {
  return (
    <Container>
      <svg viewBox="0 0 100 100" width="100" height="100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="black"
          stroke="gray"
          strokeWidth="3"
        />
        <circle cx="50" cy="50" r="5" fill="gray" />
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke="gray"
          strokeWidth="1"
          strokeDasharray="5, 5"
        />
        <circle
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke="gray"
          strokeWidth="1"
          strokeDasharray="3, 5"
        />
      </svg>
    </Container>
  );
};

export default Record;

// Styled Components

// Ändern der Animation für die horizontale Rotation (Schallplatten-Look)
const rotateHorizontal = keyframes`
  from {
    transform: rotateX(0deg);
  }
  to {
    transform: rotateX(360deg);
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 20px;
  width: 100px;
  height: 100px;

  svg {
    animation: ${rotateHorizontal} 5s linear infinite; /* Schallplatte dreht sich horizontal */
  }

  // Anpassungen für Mobilgeräte
  @media (max-width: 768px) {
    top: 10px; // Mehr Platz für den Titel auf mobilen Bildschirmen
    width: 60px;
    height: 60px;

    svg {
      width: 60px;
      height: 60px;
    }
  }
`;
