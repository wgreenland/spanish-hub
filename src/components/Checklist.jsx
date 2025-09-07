import React, { useState } from "react";
import log from "../data/practice-log.json";

export default function Checklist() {
  const today = new Date().toISOString().split("T")[0];
  const [status, setStatus] = useState(
    log.find(e => e.date === today) || { date: today, vocab: false, grammar: false, listening: false, conversation: false }
  );

  function toggle(key) {
    setStatus({ ...status, [key]: !status[key] });
  }

  return (
    <div>
      <p>{today}</p>
      {["vocab", "grammar", "listening", "conversation"].map(task => (
        <div key={task}>
          <label>
            <input
              type="checkbox"
              checked={status[task]}
              onChange={() => toggle(task)}
            />
            {task}
          </label>
        </div>
      ))}
    </div>
  );
}
