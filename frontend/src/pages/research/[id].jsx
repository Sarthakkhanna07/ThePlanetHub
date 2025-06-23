// pages/research/[id].jsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ResearchDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [research, setResearch] = useState(null);
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stars, setStars] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchResearch = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('research_submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching research:", error);
        setLoading(false);
        return;
      }

      setResearch(data);
      setStars(data.stars || 0);

      if (data.planetary_issue_id) {
        const { data: issueData, error: issueErr } = await supabase
          .from('planetary_issues')
          .select('title, unique_code')
          .eq('id', data.planetary_issue_id)
          .single();

        if (!issueErr) setIssue(issueData);
      }

      setLoading(false);
    };

    fetchResearch();
  }, [id]);

  const handleStar = async () => {
    const updatedStars = stars + 1;
    setStars(updatedStars);

    const { error } = await supabase
      .from('research_submissions')
      .update({ stars: updatedStars })
      .eq('id', id);

    if (error) {
      console.error("Error updating stars:", error);
    }
  };

  const handleCommentPost = () => {
    if (newComment.trim()) {
      setComments([...comments, {
        author: "You",
        content: newComment,
        date: new Date().toISOString().slice(0, 10),
      }]);
      setNewComment('');
    }
  };

  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (!research) return <div className="text-red-500 p-6">Research not found</div>;

  return (
    <div className="bg-black text-white min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">Project: {research.title}</h1>
      <p><span className="text-2xl font-semibold">Author : Sarthak Khanna</span></p>
      <p className="text-gray-300 mb-4">{research.summary}</p>

      <button onClick={handleStar} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded mb-6">⭐ Star</button>

      <div className="grid gap-3 bg-gray-800 p-4 rounded-lg mb-6">
      
        {issue && <p><span className="font-semibold">🔗 Linked Issue:</span> {issue.title} ({issue.unique_code})</p>}
        <p><span className="font-semibold">🤖 AI Score:</span> {research.ai_score}</p>
        <p><span className="font-semibold">🌟 Final Score:</span> {research.final_score}</p>
        <p><span className="font-semibold">⭐ Stars:</span> {stars}</p>
        <p><span className="font-semibold">📅 Submitted:</span> {new Date(research.created_at).toLocaleString()}</p>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Abstract</h2>
      <p className="text-gray-200 mb-8">{research.summary}</p>

      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      <div className="space-y-4 mb-6">
        {comments.map((c, i) => (
          <div key={i} className="bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-400 font-semibold">{c.author} <span className="text-xs">{c.date}</span></p>
            <p className="text-gray-200 mt-1">{c.content}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 bg-gray-800 text-white p-2 rounded"
          placeholder="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleCommentPost} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Post</button>
      </div>

      <a
        href={research.document_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-10 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        📄 View Full Paper
      </a>
    </div>
  );
}
