// /src/pages/issues/[id].jsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function IssueDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [issue, setIssue] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [starred, setStarred] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchIssueData = async () => {
      const { data: issueData } = await supabase
        .from('planetary_issues')
        .select('*')
        .eq('id', id)
        .single();

      setIssue(issueData);

      const { data: resData } = await supabase
        .from('research_submissions')
        .select('*')
        .eq('planetary_issue_id', id);

      setSubmissions(resData);
      setLoading(false);
    };

    fetchIssueData();
  }, [id]);

  const handleStarClick = async () => {
    if (!issue) return;
    const newStars = issue.stars ? issue.stars + 1 : 1;

    await supabase
      .from('planetary_issues')
      .update({ stars: newStars })
      .eq('id', issue.id);

    setIssue({ ...issue, stars: newStars });
    setStarred(true);
  };

  if (loading) return <div className="text-white p-6">Loading issue...</div>;

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{issue.title}</h1>
        <p className="text-gray-300">{issue.description}</p>
        <p className="text-sm text-yellow-400 mt-1">Issue Code: {issue.unique_code}</p>
        <div className="mt-2">
          <button
            className={`px-4 py-2 rounded ${starred ? 'bg-yellow-500' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={handleStarClick}
            disabled={starred}
          >
            ⭐ Star {issue.stars || 0}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">📄 Research Submissions</h2>
        {submissions.length === 0 ? (
          <p className="text-gray-400">No submissions yet. Be the first to contribute!</p>
        ) : (
          submissions.map((res) => (
            <div key={res.id} className="bg-gray-800 p-4 rounded mb-3">
              <h3 className="font-bold">{res.title}</h3>
              <p className="text-sm text-gray-300">{res.summary}</p>
              <p className="text-xs text-blue-400">AI Score: {res.ai_score}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
