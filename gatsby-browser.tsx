import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

export const wrapRootElement = ({ element }: { element: React.ReactNode }) => {
  return <Router>{element}</Router>;
};
