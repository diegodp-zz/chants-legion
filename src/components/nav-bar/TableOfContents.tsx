import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";

const cleanse = (search: string) => {
    return search.toLowerCase().replaceAll(/[^\w\d\s]/g, "");
}

const matches = (search: string, song: {title: string, lyrics: string[], number: number}) => {
    let title = cleanse(song.title);
    return title.includes(search) || song.number + 1 === Number.parseInt(search);
}

const search = (search: string, songs: {title: string, lyrics: string[]}[]) => {
    let output = songs.slice().map((value, index) => {
        return {...value, number: index};
    });

    search = cleanse(search);

    for (let i = 0; i < output.length; i++) {
        if (!matches(search, output[i])) {
            output.splice(i, 1);
            i--;
        }
    }

    return output;
}

const formatSongs = (
    songs: {title: string, number: number}[],
    onItemPress: (item: {title: string}, index: number) => void
) => {
    let formatted = songs.map((song) => {
        return ({
            name: song.title,
            dom: (
                <p onClick={() => {onItemPress({title: song.title}, song.number)}} key={song.title + song.number}>
                    <span>{song.number + 1 + ":\t"}</span> {song.title}
                </p>
            )
        });
    });

    formatted.sort((a, b) => (a.name > b.name) ? 1 : -1);

    let startingChar = " ";
    for (let i = 0; i < formatted.length; i++) {
        if (startingChar.toLowerCase() !== formatted[i].name[0].toLowerCase()) {
            startingChar = formatted[i].name[0].toLowerCase();

            formatted.splice(i, 0, {
                "name": startingChar,
                dom: (
                    <h1 key={startingChar}><span>{startingChar.toUpperCase()}</span></h1>
                )
            });
        }
    }

    return formatted.map((song) => song.dom);
}

export default function TableOfContents(props: {
    songs: {title: string, lyrics: string[], reference?: React.RefObject<HTMLSpanElement>}[],
    setVisibility: React.Dispatch<React.SetStateAction<boolean>>,
    isVisible: boolean,
    search: (query: string) => void, // Add this prop
}) {
    let [output, setOutput] = useState<JSX.Element[]>([]);
    let [songResults, setSongResults] = useState<{title: string, lyrics: string[], number: number}[]>(props.songs.map((value, index) => {return {...value, number: index}}));

    const onItemPress = (item: {title: string}, index: number) => {
        props.setVisibility(false);
        props.search(item.title); // Call the search function
    }

    const updateSearch = (query: string) => {
        setSongResults(search(query, props.songs));
    }

    useEffect(() => {
        let songs = songResults.map((value) => {return {title: value.title, number: value.number}});
        setOutput(formatSongs(songs, onItemPress));
    }, [props.songs, songResults]);

    return (
        <div className="Table-of-contents custom-scrollbar" style={{
            visibility: props.isVisible ? "visible" : "collapse"
        }} onClick={() => props.setVisibility(false)} >
            <div className="content" onClick={(e) => e.stopPropagation()}>
                <SearchBar search={updateSearch} />
                <div>
                    {output}
                </div>
            </div>
        </div>
    );
}
