import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

export default function CategoryDetailsPage() {
  const router = useRouter();
  const { code } = router.query;

  const [category, setCategory] = useState(null);
  const [issues, setIssues] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [pledges, setPledges] = useState(0);

  useEffect(() => {
    if (!code) return;

    const fetchData = async () => {
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .eq('short_code', decodeURIComponent(code))
        .single();

      if (catError) {
        console.error("Category fetch error:", catError);
        return;
      }

      setCategory(catData);

      const { data: issuesData, error: issuesError } = await supabase
        .from('planetary_issues')
        .select('*')
        .eq('category_id', catData.id);

      if (issuesError) {
        console.error("Issues fetch error:", issuesError);
        return;
      }

      setIssues(issuesData);
      setPledges(issuesData.reduce((sum, issue) => sum + (issue.pledges || 0), 0));

      const issueIds = issuesData.map((i) => i.id);
      if (issueIds.length === 0) {
        setSubmissions([]);
        return;
      }

      const { data: researchData, error: resError } = await supabase
        .from('research_submissions')
        .select('*')
        .in('planetary_issue_id', issueIds);

      if (resError) {
        console.error("Submissions fetch error:", resError);
        return;
      }

      setSubmissions(researchData);
    };

    fetchData();
  }, [code]);

  const handlePledge = async () => {
    if (!issues.length) return;

    const updated = await Promise.all(
      issues.map(async (issue) => {
        const { error } = await supabase
          .from('planetary_issues')
          .update({ pledges: (issue.pledges || 0) + 1 })
          .eq('id', issue.id);
        return error ? 0 : 1;
      })
    );

    const newTotal = pledges + updated.filter(Boolean).length;
    setPledges(newTotal);
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen max-w-5xl mx-auto">
      {category ? (
        <>
          <div className="text-sm text-gray-400 mb-2">Planetary issues / {category.name}</div>
          <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
          <p className="text-gray-400 mb-6">{category.description}</p>

          <div className="flex items-center gap-4 mb-10">
            <button onClick={handlePledge} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
              Take a Pledge
            </button>
            <p className="text-sm text-green-400">Pledges: {pledges}</p>
          </div>
        </>
      ) : (
        <p className="text-gray-400">Loading category...</p>
      )}

      {/* Planetary Issues List */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Planetary Issues</h2>
        {issues.length === 0 ? (
          <p className="text-gray-500">No issues posted for this category yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded">
              <thead>
                <tr className="text-left text-gray-300 border-b border-gray-700">
                  <th className="p-3">Title</th>
                  <th className="p-3">Unique Code</th>
                  <th className="p-3">Pledges</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-gray-700 transition">
                    <td className="p-3 text-yellow-400 hover:underline">
                      <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                    </td>
                    <td className="p-3 text-gray-300">{issue.unique_code}</td>
                    <td className="p-3 text-green-400">{issue.pledges || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Related Research Submissions */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Related Research</h2>
        {submissions.length === 0 ? (
          <p className="text-gray-500">No research has been submitted for this category yet.</p>
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

      {/* Community Discussion */}
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
