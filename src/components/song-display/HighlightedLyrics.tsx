import React, { useState, useEffect } from "react";

const HighlightedLyrics = ({ lyrics, currentTime }) => {
  const [highlightedLines, setHighlightedLines] = useState([]);

  useEffect(() => {
    // Update highlighted status based on current time
    const updatedHighlightedLines = lyrics.map((lyric, index) => {
      const timestampRegex = /\[(\d+:\d+)\]/;
      const match = lyric.match(timestampRegex);

      if (match) {
        const timestamp = match[1];
        const [minutes, seconds] = timestamp.split(":").map(Number);
        const targetTime = minutes * 60 + seconds;

        return currentTime >= targetTime;
      } else {
        return false;
      }
    });

    setHighlightedLines(updatedHighlightedLines);
  }, [currentTime, lyrics]);

  return (
    <div style={{ lineHeight: "1.5", marginBottom: "10px", textAlign: "center" }}>
      {lyrics.map((lyric, index) => (
        <p key={index} style={{ margin: "0" }}>
          {renderLyric(lyric, index, highlightedLines)}
        </p>
      ))}
    </div>
  );
};

// Function to render lyric with bold if applicable
const renderLyric = (lyric, index, highlightedLines) => {
  const timestampRegex = /\[(\d+:\d+)\]/;
  const lyricWithoutTimestamp = lyric.replace(timestampRegex, '').trim();
  const isBold = lyricWithoutTimestamp.startsWith("<b>") && lyricWithoutTimestamp.endsWith("</b>");

  if (isBold) {
    return (
      <strong key={index}>
        <span style={{ backgroundColor: highlightedLines[index] ? "green" : "transparent", padding: "2px 5px", marginRight: "3px" }}>
          {lyricWithoutTimestamp.substring(3, lyricWithoutTimestamp.length - 4)}
        </span>
      </strong>
    );
  } else {
    return (
      <span key={index} style={{ backgroundColor: highlightedLines[index] ? "green" : "transparent", padding: "2px 5px", marginRight: "3px" }}>
        {lyricWithoutTimestamp}
      </span>
    );
  }
};

export default HighlightedLyrics;
