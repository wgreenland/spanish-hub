---
import Layout from "../components/Layout.astro";
import Flashcards from "../components/Flashcards.jsx";
import AuthGuard from "../components/AuthGuard.jsx";
---
<Layout>
  <h1>🃏 Flashcards</h1>
  <AuthGuard client:load>
    <Flashcards />
  </AuthGuard>
</Layout>
