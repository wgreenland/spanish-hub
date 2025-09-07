import React, { useState } from "react";
import cards from "../data/flashcards.json";

export default function Flashcards() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  function nextCard() {
    setIndex((index + 1) % cards.length);
    setFlipped(false);
  }

  return (
    <div onClick={() => setFlipped(!flipped)} style={{ border: "1px solid #333", padding: "2rem", textAlign: "center" }}>
      <h2>{flipped ? cards[index].back : cards[index].front}</h2>
      <button onClick={nextCard} style={{ marginTop: "1rem" }}>Next</button>
    </div>
  );
}
