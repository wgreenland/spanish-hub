import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) fetchPosts(user.id);
    });
  }, []);

  async function fetchPosts(userId) {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setPosts(data);
  }

  async function addPost(e) {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    const { error } = await supabase.from("blog_posts").insert([
      {
        user_id: user.id,
        title: newPost.title,
        content: newPost.content,
      },
    ]);

    if (error) console.error(error);
    else {
      setNewPost({ title: "", content: "" });
      fetchPosts(user.id);
    }
  }

  if (!user) return <p>Please log in to see your blog.</p>;

  return (
    <div>
      <h2>📓 My Blog</h2>
      <form onSubmit={addPost}>
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          placeholder="Write your entry..."
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        />
        <button type="submit">Add Post</button>
      </form>

      <hr />
      <ul>
        {posts.map((p) => (
          <li key={p.id}>
            <h3>{p.title}</h3>
            <small>{new Date(p.created_at).toLocaleString()}</small>
            <p>{p.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
