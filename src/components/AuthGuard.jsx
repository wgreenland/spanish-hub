import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthGuard({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/"; // redirect to home if not logged in
      } else {
        setUser(user);
      }
      setLoading(false);
    }
    checkUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return null; // nothing while redirecting

  return <>{children}</>;
}
