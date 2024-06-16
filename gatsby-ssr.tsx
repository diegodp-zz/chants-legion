import React from "react";
import { StaticRouter } from "react-router-dom/server";

export const wrapRootElement = ({ element, pathname }) => {
  return (
    <StaticRouter location={pathname}>
      {element}
    </StaticRouter>
  );
};
