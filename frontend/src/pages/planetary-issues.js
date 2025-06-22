// pages/planetary-issues.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function PlanetaryIssuesHome() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) console.error('Error fetching categories:', error);
      else setCategories(data);
    };

    fetchCategories();
  }, []);

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6">🌍 Planetary Categories</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/planetary-issues/${encodeURIComponent(cat.short_code)}`}>
            <div className="bg-gray-900 hover:bg-purple-800 p-4 rounded-lg transition cursor-pointer">
              <div className="text-3xl">{cat.icon_url}</div>
              <h2 className="text-lg font-semibold mt-2">{cat.name}</h2>
              <p className="text-sm text-gray-400">{cat.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
