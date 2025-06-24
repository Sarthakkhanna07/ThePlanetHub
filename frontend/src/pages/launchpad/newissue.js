// pages/launchpad/newissue.jsx
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { supabase } from "../../lib/supabaseClient";

export default function NewIssue() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  // 1) Check session on mount, and listen to changes
  useEffect(() => {
    let authListener = null;

    const initAuth = async () => {
      // Get initial session
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
        // Still mark loading done so we can redirect
      }
      setSession(data.session);
      setLoadingSession(false);

      // Listen for subsequent changes
      authListener = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
      });
    };
    initAuth();

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Ensure user row in 'users' table to avoid FK errors
  const ensureUserRowExists = useCallback(async () => {
    try {
      const user = session?.user;
      if (!user) return;
      
      const { data: existing, error: selectErr } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();
      if (selectErr && selectErr.code !== "PGRST116") {
        console.error("Error checking users table:", selectErr);
      }
      if (!existing) {
        const username = user.user_metadata?.full_name
          ? user.user_metadata.full_name.replace(/\s+/g, "").toLowerCase()
          : user.email.split("@")[0];
        const { error: upsertErr } = await supabase
          .from("users")
          .insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || username,
            username,
            role: "researcher", // default role
          });
        if (upsertErr) {
          console.error("Error inserting user row:", upsertErr);
        }
      }
    } catch (err) {
      console.error("Unexpected error in ensureUserRowExists:", err);
    }
  }, [session]);

  // 2) Once session known and if no session, redirect to login
  useEffect(() => {
    if (!loadingSession) {
      if (!session) {
        router.push("/login");
      } else {
        // Optionally ensure user row exists here if not done elsewhere
        ensureUserRowExists();
      }
    }
  }, [loadingSession, session, router, ensureUserRowExists]);

  // 3) Fetch categories after mount
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, short_code");
      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        setCategories(data || []);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim() || !selectedCategory) {
      setErrorMsg("Title and category are required.");
      return;
    }
    setSubmitting(true);

    try {
      // 4) Count existing issues in this category
      const { count, error: countErr } = await supabase
        .from("planetary_issues")
        .select("id", { count: "exact", head: true })
        .eq("category_id", selectedCategory);
      if (countErr) {
        console.error("Error counting issues:", countErr);
        setErrorMsg("Failed to generate issue code.");
        setSubmitting(false);
        return;
      }
      const existingCount = count || 0;

      // 5) Build unique_code
      const cat = categories.find((c) => c.id === selectedCategory);
      const short = cat?.short_code?.toUpperCase() || "";
      const nextNum = (existingCount + 1).toString().padStart(3, "0");
      const unique_code = `${short}${nextNum}`;

      // 6) Insert into planetary_issues
      const { data: newIssue, error: insertErr } = await supabase
        .from("planetary_issues")
        .insert({
          title: title.trim(),
          description: description.trim(),
          category_id: selectedCategory,
          unique_code,
          // author_id defaults to auth.uid() via RLS policy
        })
        .select("id")
        .single();

      if (insertErr) {
        console.error("Error inserting issue:", insertErr);
        setErrorMsg("Failed to create issue: " + insertErr.message);
        setSubmitting(false);
        return;
      }
      // Redirect to detail page
      router.push(`/issues/${newIssue.id}`);
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMsg("Unexpected error occurred.");
      setSubmitting(false);
    }
  };

  // While we know session-loading isn't done yet:
  if (loadingSession) {
    return (
      <div className="text-white p-8">
        Checking authentication...
      </div>
    );
  }
  // If no session, the effect above already redirected; you can show placeholder
  if (!session) {
    return (
      <div className="text-white p-8">
        Redirecting to login...
      </div>
    );
  }

  // Finally, render form
  return (
    <>
      <Head>
        <title>New Issue | The Planet Hub</title>
      </Head>
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-gray-900 p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-4">📣 Create New Issue</h1>
          {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-800 text-white p-2 rounded"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-800 text-white p-2 rounded"
                placeholder="Brief title of the issue"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-800 text-white p-2 rounded h-32"
                placeholder="Describe the planetary issue in detail"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Issue"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
