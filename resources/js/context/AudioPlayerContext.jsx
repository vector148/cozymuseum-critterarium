import React, { createContext, useContext, useState, useRef, useEffect } from "react";

const AudioPlayerContext = createContext();

export function useAudioPlayer() {
  return useContext(AudioPlayerContext);
}

export function AudioPlayerProvider({ children }) {
  const [currentId, setCurrentId] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef(null);

  // Manage src via useEffect — avoids race condition between direct DOM write
  // and React re-render overwriting src before play() resolves.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (!audioUrl) {
      el.pause();
      el.removeAttribute("src");
      el.load();
      return;
    }
    el.src = audioUrl;
    el.load();
    el.play().catch((err) => {
      console.warn("Audio playback blocked:", err);
      setIsPlaying(false);
    });
  }, [audioUrl]);

  const play = (id, url) => {
    if (currentId === id) {
      // Same track — just resume
      if (audioRef.current) {
        audioRef.current.play().catch((err) => console.warn("Audio playback blocked:", err));
      }
    } else {
      // New track — update state, useEffect handles src + play
      setCurrentId(id);
      setAudioUrl(url);
      setProgress(0);
      setDuration(0);
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const toggle = (id, url) => {
    if (currentId === id && isPlaying) {
      pause();
    } else {
      play(id, url);
    }
  };

  const seekTo = (fraction) => {
    if (audioRef.current && duration > 0) {
      const targetTime = fraction * duration;
      audioRef.current.currentTime = targetTime;
      setProgress(fraction);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration > 0) {
      setProgress(audioRef.current.currentTime / audioRef.current.duration);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <AudioPlayerContext.Provider value={{ currentId, isPlaying, progress, toggle, seekTo }}>
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        style={{ display: "none" }}
      />
    </AudioPlayerContext.Provider>
  );
}
