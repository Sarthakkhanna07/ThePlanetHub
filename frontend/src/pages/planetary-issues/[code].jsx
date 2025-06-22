// pages/planetary-issues/[code].jsx
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

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      {category ? (
        <>
          <h1 className="text-3xl font-bold mb-4">
            {category.icon_url} {category.name}
          </h1>
          <p className="mb-6 text-gray-400">{category.description}</p>
        </>
      ) : (
        <p className="text-gray-400">Loading category...</p>
      )}

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">🛠 Planetary Issues</h2>
        {issues.length === 0 ? (
          <p className="text-gray-500">No issues posted for this category yet.</p>
        ) : (
          issues.map((issue) => (
            <Link href={`/issues/${issue.id}`} key={issue.id}>
              <div className="cursor-pointer bg-gray-800 p-4 rounded mb-3 hover:bg-gray-700 transition-all">
                <h3 className="font-bold">{issue.title}</h3>
                <p className="text-sm text-gray-300">{issue.description}</p>
                <p className="text-xs text-yellow-400">Issue Code: {issue.unique_code}</p>
              </div>
            </Link>
          ))
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">📄 Research Submissions</h2>
        {submissions.length === 0 ? (
          <p className="text-gray-500">No research has been submitted for this category yet.</p>
        ) : (
          submissions.map((res) => (
            <Link href={`/research/${res.id}`} key={res.id}>
              <div className="cursor-pointer bg-gray-700 p-4 rounded mb-3 hover:bg-gray-600 transition-all">
                <h3 className="font-bold">{res.title}</h3>
                <p className="text-sm text-gray-300">{res.summary}</p>
                <p className="text-xs text-green-400">AI Score: {res.ai_score}</p>
                <p className="text-xs text-blue-400">Issue ID: {res.planetary_issue_id}</p>
              </div>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
