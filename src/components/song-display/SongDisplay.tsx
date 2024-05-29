import React, { useState, useEffect, createRef } from "react";
import "../../styles/song-display.scss";
import Song from "./Song";
import NavBar from "../nav-bar/NavBar";
import JSONSongs from "../../content/songs.json";
import SongData from "../../types/SongData";
import headerImage from "../../images/carnet.jpeg";

// All the songs that we have
let songs: SongData[] = JSONSongs;

export const scrollTo = (ref?: React.RefObject<HTMLSpanElement>) => {
    if (!ref?.current) {
        return;
    }

    let relative = document.getElementsByClassName("All-songs")[0].children[0];

    let offset = 0;

    let bodyRect = relative.getBoundingClientRect().top;
    let elementRect = ref.current.getBoundingClientRect().top;
    let elementPos = elementRect - bodyRect;
    let offsetPos = elementPos - offset;

    document.getElementsByClassName("All-songs")[0]?.scrollTo({
        top: offsetPos,
        behavior: "smooth" //either "smooth" (scrolls) or "auto" (jumps)
    });
};

// Will display the songs
export default function SongDisplay(props:{}) {
    // Keep track of the references to the songs
    const [songRefs, setSongRefs] = useState<React.RefObject<HTMLSpanElement>[]>([]);

    // Keep track of the song objects to display
    const [songObjects, setSongObjects] = useState<JSX.Element[]>([]);

    useEffect(() => {
        let refs: React.RefObject<HTMLDivElement>[] = songs.map(() => createRef());
        setSongRefs(refs);
        let updatedSongs = songs.map((song, index) => {
            song.reference = refs[index];
            return <Song title={song.title} lyrics={song.lyrics} id={index + 1} ref={refs[index]} key={song.title + index} />;
        });
        setSongObjects(updatedSongs);
    }, []);

    const searchForElement = (query: string) => {
        // Will test if query is a number
        var reg = new RegExp(/^\d+$/);
        
        if (reg.test(query)) {
            // If it's a number
            let num = Number(query);
            num--;

            if (num < songs.length) {
                let song = songs[num];

                if (song.reference) {
                    scrollTo(song.reference);
                    return;
                }
            }
        } else {
            // If it's not a number
            let queryLower = query.toLowerCase();
            let song;
            for (let i = 0; i < songs.length; i++) {
                song = songs[i];
                
                if (song.title.toLowerCase().includes(queryLower) && song.reference) {
                    scrollTo(song.reference);
                    return;
                }
            }
        }
    };

    return (
        <>
            <NavBar search={searchForElement} songs={songs}/>
            <div className="All-songs custom-scrollbar" style={{position: "relative"}}>
                <img src={headerImage} alt="Header" style={{ width: "70%", height: "auto", margin: "0 auto", paddingTop: "20px" }} />
                <p style={{ paddingTop: "2px", textAlign: "center" }}>Build by LEG ENNES</p>
                <span style={{visibility: "collapse", position: "absolute"}}></span>
                {songObjects}
            </div>
        </>
    );
}
