import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import SongDisplay from "../components/song-display/SongDisplay"
import "../styles/index.scss"

import headerImage from "../images/image.png";

const IndexPage: React.FC<PageProps> = () => {
  return (
    <main>
      <SongDisplay />
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => (<>
  <title>Carnet de chants de la legion etrangeres</title>
  <meta name="keywords" content="Carnet de chants de la legion etrangere, Chants Legion, french foreign legion, legion songs" />
  <meta name="description" content="Carnet de chants de la legion etrangere" />
</>)
