import React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">

      {/* LEFT SECTION → Logo + LBRCE letters */}
      <div className="left-section">
        <img src="/lbrcelogo.jpg" alt="LBRCE Logo" className="lbrce-logo" />

        <div className="lbrce-letters">
          <span className="l">L</span>
          <span className="b">B</span>
          <span className="r">R</span>
          <span className="c">C</span>
          <span className="e">E</span>
        </div>
      </div>

      {/* CENTER SECTION → InnovateHub Title */}
      <div className="center-title">
        <h1>InnovateHub</h1>
        <p>A Unified Portal for Innovation Insights and Research</p>
      </div>

    </header>
  );
}
