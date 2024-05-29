import * as React from "react";

var Song = React.forwardRef((props: {title: string, lyrics: string[], id?: number}, ref) => {
    // Format each element of the array into a JSX Element
    let output = props.lyrics.map((value, index) => {
        // An empty <p> is not normally displayed so we should make it a <br> instead
        if (value.trim().length === 0) {
            return <br key={index}/>;
        }
        // Check if the line starts with "<b>" and ends with "</b>" for bold text
        const isBold = value.trim().startsWith("<b>") && value.trim().endsWith("</b>");
        // If line is bold, render it with <strong> tag, otherwise render as normal <p>
        return (
            <p key={index}>
                {isBold ? <strong>{value.substring(3, value.length - 4)}</strong> : value}
            </p>
        );
    });

    // Format id if it exists
    let prefix = props.id ? props.id + ": " : "";

    return (
        <div className="song" ref={ref}>
            <h1><span>{prefix}</span>{props.title}</h1>
            <span>{output}</span>
        </div>
    );
});

export default Song;
