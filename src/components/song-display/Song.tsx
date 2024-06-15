import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import HighlightedLyrics from "./HighlightedLyrics";
import { Howl } from "howler";
import "../../styles/song-display.scss"; // Ensure SCSS file is imported

interface SongProps {
  title: string;
  lyrics: string[];
  audioSrc?: string;
  id?: number;
  onPlay: () => void; // Callback function to stop other songs
}

const Song: React.ForwardRefRenderFunction<HTMLDivElement, SongProps> = (
  { title, lyrics, audioSrc, id, onPlay },
  ref
) => {
  const soundRef = useRef<Howl | null>(null);
  const [currentTimeState, setCurrentTimeState] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1); // Volume range from 0.0 to 1.0

  useEffect(() => {
    if (audioSrc) {
      soundRef.current = new Howl({
        src: [audioSrc],
        preload: true,
        html5: true, // Ensure it uses HTML5 Audio to keep accurate track of currentTime
        volume: volume,
        onload: () => {
          setDuration(soundRef.current?.duration() || 0);
        },
        onplay: () => {
          const updateCurrentTime = () => {
            setCurrentTimeState(soundRef.current?.seek() as number);
            requestAnimationFrame(updateCurrentTime);
          };
          updateCurrentTime();
        },
      });

      // Preload the audio file
      soundRef.current.load();
    }

    return () => {
      soundRef.current?.unload();
    };
  }, [audioSrc, volume]);

  const handleLyricClick = (timestamp: string) => {
    const [minutesStr, secondsStr] = timestamp.split(":");
    const minutes = parseInt(minutesStr, 10);
    const seconds = parseInt(secondsStr, 10);

    if (!isNaN(minutes) && !isNaN(seconds) && soundRef.current) {
      const targetTime = minutes * 60 + seconds;
      soundRef.current.seek(targetTime);
      soundRef.current.play();
      onPlay();
      setIsPlaying(true);
    } else {
      console.error("Invalid timestamp format:", timestamp);
    }
  };

  const handlePlayPause = () => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.pause();
      } else {
        soundRef.current.play();
        onPlay();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    if (soundRef.current) {
      soundRef.current.stop();
      setIsPlaying(false);
      setCurrentTimeState(0);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  };

  const handleSeekChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    setCurrentTimeState(newTime);
    if (soundRef.current) {
      soundRef.current.seek(newTime);
    }
  };

  useImperativeHandle(ref, () => ({
    stop: handleStop
  }));

  return (
    <div className="song" ref={ref}>
      <h1 className="song-title">{title}</h1>
      {id && <div style={{ display: 'none' }}>{id}</div>}
      <HighlightedLyrics lyrics={lyrics} currentTime={currentTimeState} onLyricClick={handleLyricClick} />
      {audioSrc && (
        <div className="controls">
          <button className="play-pause-button" onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
          <button className="stop-button" onClick={handleStop}>Stop</button>
          <div className="seek-bar">
            <label>Seek:</label>
            <input
              type="range"
              min="0"
              max={duration}
              step="0.01"
              value={currentTimeState}
              onChange={handleSeekChange}
            />
          </div>
          <div className="volume-control">
            <label>Volume:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default forwardRef(Song);
