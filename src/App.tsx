import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Quote from "./Quote";
import QuoteResult from "./QuoteResult";

const App = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/quote" element={<Quote />} />
      <Route path="/quote-results" element={<QuoteResult />} />
    </Routes>
  );
};

export default App;
