// /pages/issues/[id].jsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export default function IssueDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [issue, setIssue] = useState(null);
  const [category, setCategory] = useState(null);
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

      // Fetch category
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .eq('id', issueData.category_id)
        .single();

      setCategory(catData);

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
    <div className="p-6 bg-black text-white min-h-screen max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-500 mb-2">
        {category ? (
          <Link href={`/planetary-issues/${category.short_code}`} className="underline text-gray-400">
            {category.name}
          </Link>
        ) : (
          <span className="text-gray-600">Loading category...</span>
        )}
        {' '} / {issue.title}
      </p>

      {/* Issue Title & Description */}
      <h1 className="text-4xl font-bold mb-2">{issue.title}</h1>
      <p className="text-gray-300 mb-4">{issue.description}</p>

      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={handleStarClick}
          disabled={starred}
          className={`px-4 py-2 rounded text-sm font-semibold ${starred ? 'bg-yellow-500' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          ⭐ Star {issue.stars || 0}
        </button>
      </div>

      {/* Related Research */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Related Research</h2>
        {submissions.length === 0 ? (
          <p className="text-gray-500">No research submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded">
              <thead>
                <tr className="text-left text-gray-300 border-b border-gray-700">
                  <th className="p-3">Title</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-700 transition">
                    <td className="p-3 text-blue-400 hover:underline">
                      <Link href={`/research/${res.id}`}>{res.title}</Link>
                    </td>
                    <td className="p-3">{res.ai_score}</td>
                    <td className="p-3">{new Date(res.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Community Discussion (Static) */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Community Discussion</h2>
        <p className="text-gray-400 mb-4 italic">(Comment functionality coming soon...)</p>
        <div className="space-y-4">
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-orange-300 font-semibold">Dr. Anya Sharma <span className="text-xs text-gray-400">2024-04-01</span></p>
            <p className="text-gray-300 mt-1">The issue is complex and requires a multi-faceted approach. Our research explores the combination of atmospheric tech and ecological strategies.</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-green-300 font-semibold">Dr. Ben Carter <span className="text-xs text-gray-400">2024-04-02</span></p>
            <p className="text-gray-300 mt-1">We're actively collaborating to refine our models. The challenges are tough, but the potential rewards are huge.</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-blue-300 font-semibold">Dr. Chloe Davis <span className="text-xs text-gray-400">2024-04-03</span></p>
            <p className="text-gray-300 mt-1">Our focus is on creating a stable and predictable climate using cutting-edge materials and collaborative research.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
