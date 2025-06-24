// pages/launch-pad/new.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';
import Head from "next/head";

export default function NewResearch() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [aiScore, setAiScore] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [scoring, setScoring] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [issues, setIssues] = useState([]);
  const [selectedIssueId, setSelectedIssueId] = useState('');

  const [recentSubmissions, setRecentSubmissions] = useState([]);

  const router = useRouter();

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (data) setCategories(data);
      if (error) console.error('Error fetching categories:', error);
    };
    fetchCategories();
  }, []);

  // Fetch issues whenever category changes
  useEffect(() => {
    if (!selectedCategory) {
      setIssues([]);
      return;
    }
    const fetchIssues = async () => {
      const { data, error } = await supabase
        .from('planetary_issues')
        .select('*')
        .eq('category_id', selectedCategory);
      if (data) setIssues(data);
      if (error) console.error('Error fetching issues:', error);
    };
    fetchIssues();
  }, [selectedCategory]);

  // Fetch recent submissions for display
  useEffect(() => {
    const fetchRecentSubmissions = async () => {
      const { data, error } = await supabase
        .from('research_submissions')
        .select('id, title, created_at, ai_score')
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setRecentSubmissions(data);
      if (error) console.error('Error fetching recent submissions:', error);
    };
    fetchRecentSubmissions();
  }, []);

  // File upload + AI scoring
  const handleFileUpload = async (e) => {
    setUploading(true);
    setAiScore(null);
    const file = e.target.files[0];
    if (!file) {
      alert("Please select a file.");
      setUploading(false);
      return;
    }

    // 1) Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const filePath = `research_docs/${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('research-submissions')
      .upload(filePath, file);
    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      alert('Upload failed');
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase
      .storage
      .from('research-submissions')
      .getPublicUrl(filePath);
    setDocumentUrl(publicUrl);
    setUploading(false);

    // 2) Send to FastAPI for AI scoring
    setScoring(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      // For local testing:
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        console.error("AI endpoint returned status", res.status);
        alert("AI scoring failed: " + res.statusText);
      } else {
        const result = await res.json();
        console.log('AI response:', result);
        if (result.adjusted_score != null) {
          setAiScore(result.adjusted_score);
        } else {
          console.warn("Unexpected AI response:", result);
        }
      }
    } catch (err) {
      console.error("Error calling AI model:", err);
      alert("AI scoring failed.");
    }
    setScoring(false);
  };

  // Utility to ensure user row exists in `users` table before submission
  async function ensureUserRowExists(user) {
    // Check if row exists
    const { data: existing, error: selectErr } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();
    if (selectErr && selectErr.code !== 'PGRST116') {
      console.error("Error checking users table:", selectErr);
      throw new Error("User check failed");
    }
    if (!existing) {
      // Minimal upsert: name, email, username default to email prefix
      const username = user.user_metadata?.full_name
        ? user.user_metadata.full_name.replace(/\s+/g, '').toLowerCase()
        : user.email.split('@')[0];
      const { error: upsertErr } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || username,
          username,
          role: 'researcher', // default role if not using setup-role flow
        });
      if (upsertErr) {
        console.error("Error inserting user row:", upsertErr);
        throw new Error("Failed to create user row");
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!title || !summary || !selectedCategory || !selectedIssueId || !documentUrl) {
      alert('Please fill all required fields.');
      return;
    }
    // If AI score not yet ready, confirm
    if (aiScore === null) {
      const ok = confirm("AI score not available yet. Submit anyway?");
      if (!ok) return;
    }

    // 1) Get current session & user
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Error getting session:", sessionError);
      alert("Not authenticated.");
      return;
    }
    const user = session?.user;
    if (!user) {
      alert("You must be logged in to submit.");
      return;
    }

    // 2) Ensure user row exists
    try {
      await ensureUserRowExists(user);
    } catch (err) {
      alert("Unable to verify/create user record.");
      return;
    }

    // 3) Insert into research_submissions including user_id
    const insertData = {
      title,
      summary,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      planetary_issue_id: selectedIssueId,
      document_url: documentUrl,
      ai_score: aiScore,
      user_id: user.id, // must match existing users.id
    };
    const { data, error } = await supabase
      .from('research_submissions')
      .insert([insertData])
      .select('id') // 👈 Get the inserted row's ID
      .single();    // 👈 Since we only insert one row

    if (error) {
      console.error('Insert error:', error);
      alert('Research submission failed: ' + error.message);
    } else {
      alert('Submitted successfully!');
      router.push(`/research/${data.id}`); // 👈 Redirect to the detail page
    }

  };

  return (
    <>
      <Head>
        <title>New research | The Planet Hub</title>
        <meta name="description" content="Research to Startup | Made in India, for India | For Planetary Engineers" />
      </Head>
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">🚀 Submit New Research</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            className="w-full p-2 rounded bg-gray-800 text-white"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full p-2 rounded bg-gray-800 text-white"
            placeholder="Summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />
          <input
            className="w-full p-2 rounded bg-gray-800 text-white"
            type="text"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <select
            className="w-full p-2 rounded bg-gray-800 text-white"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedIssueId('');
              setIssues([]);
            }}
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {issues.length > 0 && (
            <select
              className="w-full p-2 rounded bg-gray-800 text-white"
              value={selectedIssueId}
              onChange={(e) => setSelectedIssueId(e.target.value)}
              required
            >
              <option value="">Select Issue</option>
              {issues.map(issue => (
                <option key={issue.id} value={issue.id}>
                  {issue.title} ({issue.unique_code})
                </option>
              ))}
            </select>
          )}
          <input
            className="w-full p-2 rounded bg-gray-800 text-white"
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            required
          />
          {uploading && <p className="text-yellow-400">Uploading...</p>}
          {scoring && <p className="text-yellow-400">Scoring with AI...</p>}
          {aiScore !== null && (
            <p className="text-green-400">AI Score: {aiScore}</p>
          )}
          <button
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 w-full"
            type="submit"
          >
            Submit Research
          </button>
        </form>

        {recentSubmissions.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">📄 Recently Submitted</h2>
            <table className="w-full table-auto bg-gray-900 text-sm rounded-lg">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="p-2">Title</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">AI Score</th>
                </tr>
              </thead>
              <tbody>
                {recentSubmissions.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => router.push(`/research/${r.id}`)}
                    className="cursor-pointer border-b border-gray-800 hover:bg-gray-800"
                  >
                    <td className="p-2 text-white">{r.title}</td>
                    <td className="p-2 text-gray-300">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-2 text-blue-400 font-bold">
                      {r.ai_score ?? 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
