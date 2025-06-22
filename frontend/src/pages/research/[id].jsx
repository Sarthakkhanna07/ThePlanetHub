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

  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (!research) return <div className="text-red-500 p-6">Research not found</div>;

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-2">{research.title}</h1>
      <p className="text-gray-400 mb-4">{research.summary}</p>

      <div className="grid gap-3 bg-gray-800 p-4 rounded-lg mb-6">
        {issue && (
          <p><span className="font-semibold">🔗 Linked Issue:</span> {issue.title} ({issue.unique_code})</p>
        )}
        <p><span className="font-semibold">🤖 AI Score:</span> {research.ai_score}</p>
        <p><span className="font-semibold">🌟 Final Score:</span> {research.final_score}</p>
        <p><span className="font-semibold">⭐ Stars:</span> {research.stars}</p>
        <p><span className="font-semibold">📅 Submitted:</span> {new Date(research.created_at).toLocaleString()}</p>
      </div>

      <a
        href={research.document_url}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        📄 View Full Paper
      </a>
    </div>
  );
}
