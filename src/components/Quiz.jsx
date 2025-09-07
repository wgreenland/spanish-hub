import React, { useState } from "react";
import questions from "../data/grammar.json";

export default function Quiz() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(null);

  const q = questions[index];

  function check(option) {
    setAnswer(option === q.answer);
  }

  function next() {
    setIndex((index + 1) % questions.length);
    setAnswer(null);
  }

  return (
    <div>
      <p>{q.question}</p>
      {q.options.map(opt => (
        <button key={opt} onClick={() => check(opt)}>{opt}</button>
      ))}
      {answer !== null && <p>{answer ? "✅ Correct" : "❌ Incorrect"}</p>}
      {answer !== null && <button onClick={next}>Next</button>}
    </div>
  );
}
