import React from "react";
import { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import PlaylistManagementForm from "./components/PlaylistManagementForm";
import i18n from "./helpers/i18n";
import Record from "./components/Record";
import FlagIcon from "react-flagkit";

const App: React.FC = () => {
  const { t } = useTranslation();
  const [isEnglish, setIsEnglish] = useState<boolean>(true);

  const changeLanguage = (lng: string) => {
    if (lng === "en") {
      setIsEnglish(true);
    } else if (lng === "de") {
      setIsEnglish(false);
    } else {
      alert("Unknown language. What did you do?");
    }
    i18n.changeLanguage(lng);
  };

  return (
    <AppContainer>
      <Header>
        <div>
          <Record />
        </div>
        <h1>{t("title_placeholder")}</h1>
        <p>{t("description_placeholder")}</p>
        <LanguageSwitch>
          <FlagWrapper onClick={() => changeLanguage("en")}>
            <FlagIcon country="US" size={isEnglish ? 32 : 24} />
          </FlagWrapper>
          <FlagWrapper onClick={() => changeLanguage("de")}>
            <FlagIcon country="DE" size={isEnglish ? 24 : 32} />
          </FlagWrapper>
        </LanguageSwitch>
      </Header>
      <Main>
        <PlaylistManagementForm />
        {/* <PlaylistForm name="" songs={[]} /> */}
      </Main>
      <Footer>
        <p>{t("footer_placeholder")}</p>
      </Footer>
    </AppContainer>
  );
};

export default App;
const AppContainer = styled.div`
  font-family: "Raleway", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #1e1e1e;
  min-height: 100vh;
  color: white;
  overflow-x: hidden; /* Verhindert horizontales Scrollen */
  max-width: 100vw; /* Maximal die Breite des Viewports */
  @media print {
    * {
      -webkit-print-color-adjust: exact; /* Farben für den Druck genau beibehalten */
    }
    body {
      background-color: white; /* Gesamtseitenhintergrund bleibt weiß */
      margin: 0;
    }
    header,
    footer {
      display: none; /* Versteckt Header und Footer beim Drucken */
    }
  }
`;

const Header = styled.header`
  background: #333;
  width: 100%;
  padding: 50px;
  color: white;
  overflow: hidden; /* Falls Inhalt größer als Container */
  h1 {
    font-size: 2.5rem;
    margin: 0;
  }
  p {
    font-size: 1.2rem;
  }
`;

const Main = styled.main`
  width: 100%;
  max-width: 100vw; /* Begrenzung auf 100% der Viewport-Breite */
  padding: 20px;
  display: flex;
  justify-content: center;
  overflow-x: hidden; /* Verhindert horizontales Scrollen */
`;

const Footer = styled.footer`
  background: #333;
  color: white;
  padding: 10px;
  width: 100%;
  max-width: 100vw;
  text-align: center;
  margin-top: auto;
  overflow: hidden;
`;

const LanguageSwitch = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  border: none;
  max-width: 100vw; /* Sicherstellen, dass es im Viewport bleibt */
  overflow: hidden; /* Verhindert, dass es zu groß wird */
`;

const FlagWrapper = styled.div`
  display: inline-block;
  padding: 5px;
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;

  &:hover {
    transform: scale(1.25); /* Leichter Zoom bei Hover */
  }

  &:trackmouse {
    transform: scale(1.25); /* Leichter Zoom bei Hover */
  }

  &:active {
    transform: scale(0.95); /* Klick-Effekt */
  }
`;
