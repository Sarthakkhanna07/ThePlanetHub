import Head from "next/head";
import { useState } from "react";
import Link from "next/link";

export default function LaunchPad() {
  return (
    <>
      <Head>
        <title>Launch Pad | The Planet Hub</title>
      </Head>

      <section className="min-h-screen bg-gradient-to-b from-black to-gray-950 text-white px-6 py-20 flex flex-col items-center justify-center">
        <div className="flex flex-col space-y-6 w-full max-w-xs">
          <a
            href="#" // TODO: Replace with your actual page
            className="block w-full text-center py-3 px-6 rounded-lg bg-purple-700 hover:bg-purple-800 font-semibold text-lg transition"
          >
            Make New Issue
          </a>
          <Link
            href="/launchpad/new" // TODO: Replace with your actual page
            className="block w-full text-center py-3 px-6 rounded-lg bg-blue-700 hover:bg-blue-800 font-semibold text-lg transition"
          >
            Submit Research
          </Link>
        </div>
      </section>
    </>
  );
}
