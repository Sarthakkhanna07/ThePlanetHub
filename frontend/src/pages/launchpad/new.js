// pages/launch-pad/new.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function NewResearch() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [issues, setIssues] = useState([]);
  const [selectedIssueId, setSelectedIssueId] = useState('');
  const [recentSubmissions, setRecentSubmissions] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (data) setCategories(data);
      if (error) console.error('Error fetching categories:', error);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;
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

  const handleFileUpload = async (e) => {
    setUploading(true);
    const file = e.target.files[0];
    if (!file) {
      alert("Please select a file.");
      setUploading(false);
      return;
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `research_docs/${Date.now()}.${fileExt}`;

    let { error } = await supabase.storage
      .from('research-submissions')
      .upload(filePath, file);

    if (error) {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !summary || !selectedCategory || !selectedIssueId || !documentUrl) {
      alert('Please fill all required fields.');
      return;
    }

    const { error } = await supabase.from('research_submissions').insert([
      {
        title,
        summary,
        tags: tags.split(',').map(t => t.trim()),
        planetary_issue_id: selectedIssueId,
        document_url: documentUrl
      }
    ]);

    if (error) {
      alert('Research submission failed');
    } else {
      alert('Submitted successfully!');
      router.push('/launch-pad');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">🚀 Submit New Research</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input className="w-full p-2 rounded bg-gray-800 text-white" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea className="w-full p-2 rounded bg-gray-800 text-white" placeholder="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} required />
          <input className="w-full p-2 rounded bg-gray-800 text-white" type="text" placeholder="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} />

          <select className="w-full p-2 rounded bg-gray-800 text-white" value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setSelectedIssueId(''); setIssues([]); }} required>
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {issues.length > 0 && (
            <select className="w-full p-2 rounded bg-gray-800 text-white" value={selectedIssueId} onChange={(e) => setSelectedIssueId(e.target.value)} required>
              <option value="">Select Issue</option>
              {issues.map(issue => (
                <option key={issue.id} value={issue.id}>{issue.title} ({issue.unique_code})</option>
              ))}
            </select>
          )}

          <input className="w-full p-2 rounded bg-gray-800 text-white" type="file" accept=".pdf" onChange={handleFileUpload} required />
          {uploading && <p className="text-yellow-400">Uploading...</p>}
          <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 w-full" type="submit">Submit Research</button>
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
                {recentSubmissions.map((r, idx) => (
                  <tr
                    key={idx}
                    onClick={() => router.push(`/research/${r.id}`)}
                    className="cursor-pointer border-b border-gray-800 hover:bg-gray-800"
                  >
                    <td className="p-2 text-white">{r.title}</td>
                    <td className="p-2 text-gray-300">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="p-2 text-blue-400 font-bold">{r.ai_score ?? 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
