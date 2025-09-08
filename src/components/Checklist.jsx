import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const TASKS = ["vocab", "grammar", "listening", "conversation"];

function getTodayNZ() {
  return new Date().toLocaleDateString("en-NZ", { timeZone: "Pacific/Auckland" });
}

export default function Checklist() {
  const today = getTodayNZ();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]); // all past rows

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  // Load today's checklist + history
  useEffect(() => {
    if (!user) return;

    async function fetchChecklist() {
      setLoading(true);

      // Fetch today's row
      const { data: todayRow, error: todayError } = await supabase
        .from("checklist_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .single();

      if (todayError && todayError.code !== "PGRST116") {
        console.error(todayError);
      }

      if (todayRow) {
        setStatus(todayRow);
      } else {
        // Insert blank row if missing
        const empty = TASKS.reduce((acc, t) => ({ ...acc, [t]: false }), {});
        const { data: newRow } = await supabase
          .from("checklist_logs")
          .insert([{ user_id: user.id, date: today, ...empty }])
          .select()
          .single();
        setStatus(newRow);
      }

      // Fetch all history for stats
      const { data: logs, error: historyError } = await supabase
        .from("checklist_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (historyError) console.error(historyError);
      else setHistory(logs || []);

      setLoading(false);
    }

    fetchChecklist();
  }, [user, today]);

  // Toggle a task
  async function toggle(task) {
    const newStatus = { ...status, [task]: !status[task] };
    setStatus(newStatus);

    const { error } = await supabase
      .from("checklist_logs")
      .update({ [task]: newStatus[task] })
      .eq("id", status.id);

    if (error) console.error(error);
  }

  // --- Stats ---
  function calculateStreak() {
    if (!history.length) return 0;

    let count = 0;
    const dates = history.map((h) => h.date).sort().reverse();

    for (const d of dates) {
      const log = history.find((h) => h.date === d);
      const allDone = TASKS.every((t) => log?.[t]);
      if (allDone) count++;
      else break;
    }
    return count;
  }

  function calculateAverages() {
    if (!history.length) return [];

    return TASKS.map((t) => {
      const total = history.length;
      const done = history.filter((h) => h[t]).length;
      return { task: t, avg: ((done / total) * 100).toFixed(1) };
    });
  }

  if (!user) return <p>Please log in to use the checklist.</p>;
  if (loading) return <p>Loading...</p>;

  const streak = calculateStreak();
  const averages = calculateAverages();

  return (
    <div>
      <h2>{today}</h2>
      {TASKS.map((task) => (
        <div key={task}>
          <label>
            <input
              type="checkbox"
              checked={status?.[task] || false}
              onChange={() => toggle(task)}
            />
            {task}
          </label>
        </div>
      ))}

      <hr />
      <p>🔥 Streak: {streak} day(s)</p>
      <h3>Averages</h3>
      <ul>
        {averages.map((a) => (
          <li key={a.task}>
            {a.task}: {a.avg}%
          </li>
        ))}
      </ul>
    </div>
  );
}

