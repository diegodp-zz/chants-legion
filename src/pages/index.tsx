import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import SongDisplay from "../components/song-display/SongDisplay"
import "../styles/index.scss"
import { graphql } from 'gatsby';
import { useTranslation, Trans, I18nextContext } from 'gatsby-plugin-react-i18next';


const IndexPage: React.FC<PageProps<any>> = ({ data }) => {
  const { i18n } = useTranslation();
  const { language } = React.useContext(I18nextContext);

  // Assuming data.locales.edges[0].node.data is a JSON object with translations
  data.locales.edges.forEach(({ node }) => {
    i18n.addResourceBundle(node.language, node.ns, JSON.parse(node.data), true, true);
  });

  return (
    <main>
      <SongDisplay />
    </main>
  );
};

export default IndexPage

export const Head: HeadFC = () => (<>
  <title>Carnet de chants de la legion etrangeres</title>
  <meta name="keywords" content="Carnet de chants de la legion etrangere, Chants Legion, french foreign legion, legion songs" />
  <meta name="description" content="Complete book of all songs that leggionaires need to learn" />
</>)

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(
      filter: { language: { eq: $language } }
    ) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;