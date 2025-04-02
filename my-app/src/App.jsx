import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [rectangles, setRectangles] = useState([]);
  const [showPopupIndex, setShowPopupIndex] = useState(-1);

  // --- GLOBAL LISTENERS FOR ESC KEY & OUTSIDE CLICKS ---
  useEffect(() => {
    if (showPopupIndex === -1) return;

    const handleClickOutside = (e) => {
      const popupEl = document.querySelector(".options-popup");
      if (popupEl && !popupEl.contains(e.target)) {
        setShowPopupIndex(-1);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowPopupIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showPopupIndex]);

  // --- PLUS BUTTON EVENTS ---
  const handlePlusClick = (index) => {
    // Toggle popup at the given plus index
    setShowPopupIndex((prev) => (prev === index ? -1 : index));
  };

  const handleAddRectangle = (label, index) => {
    // Insert a rectangle at the chosen index
    const newRectangles = [...rectangles];
    newRectangles.splice(index, 0, label);
    setRectangles(newRectangles);
    setShowPopupIndex(-1);
  };

  const handleDeleteRectangle = (index) => {
    // Remove a rectangle from the array
    const newRectangles = [...rectangles];
    newRectangles.splice(index, 1);
    setRectangles(newRectangles);
  };

  // --- BUILD THE VERTICAL CHAIN ---
  const chain = [];

  // 1) Start Node
  chain.push(
    <div key="start-node" className="node start-node">
      <span>Start</span>
    </div>
  );

  // 2) Arrow + plus(0)
  chain.push(<div key="arrow-start" className="vertical-line" />);
  chain.push(
    <PlusButton
      key="plus-0"
      index={0}
      showPopupIndex={showPopupIndex}
      onPlusClick={handlePlusClick}
      onOptionSelect={handleAddRectangle}
    />
  );

  // 3) For each rectangle: arrow → rectangle → arrow → plus
  rectangles.forEach((rectLabel, i) => {
    chain.push(
      <div key={`arrow-before-rect-${i}`} className="vertical-line" />
    );
    chain.push(
      <RectangleNode
        key={`rect-${i}`}
        label={rectLabel}
        onDelete={() => handleDeleteRectangle(i)}
      />
    );
    chain.push(<div key={`arrow-after-rect-${i}`} className="vertical-line" />);
    chain.push(
      <PlusButton
        key={`plus-${i + 1}`}
        index={i + 1}
        showPopupIndex={showPopupIndex}
        onPlusClick={handlePlusClick}
        onOptionSelect={handleAddRectangle}
      />
    );
  });

  // 4) Final arrow + End Node
  chain.push(<div key="arrow-end" className="vertical-line" />);
  chain.push(
    <div key="end-node" className="node end-node">
      <span>End</span>
    </div>
  );

  return (
    <div className="workflow-container">
      {/* HEADER BOX */}
      <div className="header-box">
        <button className="back-button">&larr; Go Back</button>
        <span className="title">Untitled</span>
        <button className="save-button">
          <img src="../images/save.png" alt="Save" className="save-icon" />
        </button>
      </div>

      {/* MAIN CANVAS */}
      <div className="workflow-canvas">{chain}</div>

      {/* BOTTOM CONTROLS (optional) */}
      <div className="bottom-controls">
        <div className="undo-redo">
          <button>&#x21B6;</button>
          <button>&#x21B7;</button>
        </div>
        <div className="zoom-controls">
          <button>-</button>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            defaultValue="1"
          />
          <button>+</button>
        </div>
      </div>
    </div>
  );
}

// --- PLUS BUTTON COMPONENT ---
function PlusButton({ index, showPopupIndex, onPlusClick, onOptionSelect }) {
  const isPopupOpen = showPopupIndex === index;

  return (
    <div className="plus-wrapper">
      <div className="plus-button" onClick={() => onPlusClick(index)}>
        +
      </div>
      {isPopupOpen && (
        <div className="options-popup">
          <div
            className="option-button"
            onClick={() => onOptionSelect("API Call", index)}
          >
            API Call
          </div>
          <div
            className="option-button"
            onClick={() => onOptionSelect("Condition", index)}
          >
            Condition
          </div>
          <div
            className="option-button"
            onClick={() => onOptionSelect("Another Action", index)}
          >
            Another Action
          </div>
        </div>
      )}
    </div>
  );
}

// --- RECTANGLE NODE COMPONENT ---
function RectangleNode({ label, onDelete }) {
  return (
    <div className="rectangle-node">
      <span>{label}</span>
      <button className="delete-btn" onClick={onDelete}>
        <img src="../images/delete.png" alt="Delete" className="delete-icon" />
      </button>
    </div>
  );
}
