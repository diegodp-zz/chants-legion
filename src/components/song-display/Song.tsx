import React, { useEffect, useRef, useState, forwardRef } from "react";
import HighlightedLyrics from "./HighlightedLyrics";

interface SongProps {
  title: string;
  lyrics: string[];
  audioSrc?: string;
  id?: number;
}

const Song: React.ForwardRefRenderFunction<HTMLDivElement, SongProps> = (
  { title, lyrics, audioSrc, id },
  ref
) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTimeState, setCurrentTimeState] = useState<number>(0);

  useEffect(() => {
    const updateCurrentTime = () => {
      if (audioRef.current) {
        setCurrentTimeState(audioRef.current.currentTime);
      }
    };

    const intervalId = setInterval(updateCurrentTime, 500); // Update every 500ms for smoother highlighting
    return () => clearInterval(intervalId);
  }, []);

  const handleLyricClick = (timestamp: string) => {
    if (audioRef.current) {
      const [minutesStr, secondsStr] = timestamp.split(":");
      const minutes = parseInt(minutesStr, 10);
      const seconds = parseInt(secondsStr, 10);

      if (!isNaN(minutes) && !isNaN(seconds)) {
        const targetTime = minutes * 60 + seconds;
        audioRef.current.currentTime = targetTime;
        audioRef.current.play();
      } else {
        console.error("Invalid timestamp format:", timestamp);
      }
    }
  };

  return (
    <div className="song" ref={ref} style={{ border: "1px solid black", padding: "10px", marginBottom: "20px" }}>
      <h1 style={{ textAlign: "center" }}>{title}</h1>
      {id && <div style={{ display: 'none' }}>{id}</div>}
      <HighlightedLyrics lyrics={lyrics} currentTime={currentTimeState} onLyricClick={handleLyricClick} />
      {audioSrc && (
        <audio controls ref={audioRef}>
          <source src={audioSrc} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default forwardRef(Song);
