import Head from "next/head";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function LaunchPad() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        router.replace("/login");
      } else {
        setSession(session);
        setLoading(false);
      }
    };

    getSession();
  }, [router]);

  if (loading) {
    return (
      <section className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <>
      <Head>
        <title>Launch Pad | The Planet Hub</title>
      </Head>

      <section className="min-h-screen bg-gradient-to-b from-black to-gray-950 text-white px-6 py-20 flex flex-col items-center justify-center">
        <div className="flex flex-col space-y-6 w-full max-w-xs">
          <Link
            href="/launchpad/newissue"
            className="block w-full text-center py-3 px-6 rounded-lg bg-purple-700 hover:bg-purple-800 font-semibold text-lg transition"
          >
            Make New Issue
          </Link>
          <Link
            href="/launchpad/new"
            className="block w-full text-center py-3 px-6 rounded-lg bg-blue-700 hover:bg-blue-800 font-semibold text-lg transition"
          >
            Submit Research
          </Link>
        </div>
      </section>
    </>
  );
}
