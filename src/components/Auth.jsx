import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Auth({ onLogin }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ?? null);
      if (user) onLogin?.(user);
      setLoading(false);
    }
    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) onLogin?.(session.user);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <p>Loading session...</p>;

  if (user) {
    return (
      <div>
        <p>Logged in as {user.email}</p>
        <button onClick={() => supabase.auth.signOut()}>Log out</button>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const email = form.get("email");
        const password = form.get("password");

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert(error.message);
      }}
    >
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Log In</button>
      <button
        type="button"
        onClick={async () => {
          const form = new FormData(document.querySelector("form"));
          const email = form.get("email");
          const password = form.get("password");
          const { error } = await supabase.auth.signUp({ email, password });
          if (error) alert(error.message);
        }}
      >
        Sign Up
      </button>
    </form>
  );
}
