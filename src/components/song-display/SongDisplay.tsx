import React, { useState, useEffect, createRef, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import "../../styles/song-display.scss";
import Song from "./Song";
import NavBar from "../nav-bar/NavBar";
import JSONSongs from "../../content/songs.json";
import { SongData } from "../../types/SongData";
import headerImage from "../../images/carnet.jpeg";
import { useTranslation } from 'gatsby-plugin-react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';

// Load songs from JSON
let songs: SongData[] = JSONSongs;

const scrollTo = (ref?: React.RefObject<{ stop: () => void, getElement: () => HTMLDivElement | null }>) => {
  if (typeof window !== 'undefined' && ref?.current) {
    const element = ref.current.getElement();
    if (!element) {
      console.error("ref.current.getElement() is null or undefined");
      return;
    }

    const relative = document.getElementsByClassName("All-songs")[0].children[0] as HTMLDivElement;
    const offset = 0;
    const bodyRect = relative.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPos = elementRect - bodyRect;
    const offsetPos = elementPos - offset;

    document.getElementsByClassName("All-songs")[0]?.scrollTo({
      top: offsetPos,
      behavior: "smooth"
    });
  }
};

const getSongRef = (title: string, refs: React.RefObject<{ stop: () => void, getElement: () => HTMLDivElement | null }>[]) => {
  const index = songs.findIndex(song => song.title === title);
  if (index === -1 || !refs[index]) {
    console.error(`Song or ref not found for title: ${title}`);
    return null;
  }
  return refs[index];
}

export default function SongDisplay(props: {}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [songRefs, setSongRefs] = useState<React.RefObject<{ stop: () => void, getElement: () => HTMLDivElement | null }>[]>([]);
  const currentPlayingRef = useRef<React.RefObject<{ stop: () => void, getElement: () => HTMLDivElement | null }> | null>(null);

  const [songObjects, setSongObjects] = useState<JSX.Element[]>([]);
  const [loadedSongs, setLoadedSongs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLoadedSongs = localStorage.getItem('loadedSongs');
      if (storedLoadedSongs) {
        setLoadedSongs(new Set(JSON.parse(storedLoadedSongs)));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('loadedSongs', JSON.stringify([...loadedSongs]));
    }
  }, [loadedSongs]);

  useEffect(() => {
    const refs = songs.map(() => createRef<{ stop: () => void, getElement: () => HTMLDivElement | null }>());
    setSongRefs(refs);

    const updatedSongs = songs.map((song, index) => {
      song.reference = refs[index];
      return (
        <div key={index} className="song-container">
          <Song
            title={song.title}
            lyrics={song.lyrics}
            id={index + 1}
            audioSrc={song.audioSrc}
            ref={refs[index]}
            onPlay={() => {
              if (currentPlayingRef.current && currentPlayingRef.current !== refs[index]) {
                currentPlayingRef.current.current?.stop();
              }
              currentPlayingRef.current = refs[index];
            }}
            onLoaded={(title: string) => {
              setLoadedSongs(prev => new Set(prev).add(title));
            }}
          />
          <div className="share-buttons">
            {typeof window !== 'undefined' && (
              <>
                <a href={`https://wa.me/?text=${encodeURIComponent(window.location.href + `?song=${encodeURIComponent(song.title)}`)}`} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faWhatsapp} size="2x" />
                </a>
                <a href={`https://twitter.com/share?url=${encodeURIComponent(window.location.href + `?song=${encodeURIComponent(song.title)}`)}`} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faTwitter} size="2x" />
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href + `?song=${encodeURIComponent(song.title)}`)}`} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faFacebook} size="2x" />
                </a>
              </>
            )}
          </div>
        </div>
      );
    });
    setSongObjects(updatedSongs);
  }, []);

  useEffect(() => {
    if (songRefs.length > 0) {
      const query = new URLSearchParams(location.search).get('song');
      if (query) {
        const songRef = getSongRef(query, songRefs);
        if (songRef) {
          scrollTo(songRef);
        }
      }
    }
  }, [location.search, songRefs]);

  const searchForElement = (query: string) => {
    const reg = new RegExp(/^\d+$/);

    if (reg.test(query)) {
      let num = Number(query);
      num--;

      if (num < songs.length) {
        const song = songs[num];
        if (song.reference) {
          navigate(`?song=${encodeURIComponent(song.title)}`);
          scrollTo(song.reference);
          return;
        }
      }
    } else {
      const queryLower = query.toLowerCase();
      for (const song of songs) {
        if (song.title.toLowerCase().includes(queryLower) && song.reference) {
          navigate(`?song=${encodeURIComponent(song.title)}`);
          scrollTo(song.reference);
          return;
        }
      }
    }
  };

  return (
    <>
      <NavBar search={searchForElement} songs={songs} />
      <div className="All-songs custom-scrollbar" style={{ position: "relative" }}>
        <img
          src={headerImage}
          alt="Header"
          style={{ width: "70%", height: "auto", margin: "0 auto", paddingTop: "20px" }}
        />
        <div className="text-container">
          <p>{t('buildBy')}</p>
          <h3>{t('offlineUsageQuestion')}</h3>
          <p>{t('offlineUsageDescription')}</p>
          <h4>Android/PC</h4>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>{t('androidPcStep1')}</li>
            <li>{t('androidPcStep2')}</li>
          </ul>
          <h4>iOS</h4>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>{t('iosStep1')}</li>
            <li>{t('iosStep2')}</li>
          </ul>
        </div>
        <span style={{ visibility: "collapse", position: "absolute" }}></span>
        {songObjects}
        <div className="loaded-songs">
          <h3>Loaded Songs</h3>
          <ul>
            {[...loadedSongs].map((title, index) => (
              <li key={index}>{title}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
