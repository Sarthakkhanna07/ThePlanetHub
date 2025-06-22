import Head from "next/head";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Home() {
  const titleRef = useRef(null);
  const taglineRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(titleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1 });
    gsap.fromTo(taglineRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, delay: 0.5, duration: 1 });
  }, []);

  return (
    <>
      <Head>
        <title>The Planet Hub</title>
        <meta name="description" content="Research to Startup | The Planet Hub" />
      </Head>
      <main className="min-h-screen bg-black bg-cover bg-centertext-white flex flex-col items-center justify-center px-6"
      style={{ backgroundImage: "url('/earth-bg.jpg')" }}
      >

        <h1 ref={titleRef} className="text-4xl font-bold text-green-400">
          🌍 The Planet Hub
        </h1>
        <p ref={taglineRef} className="mt-4 text-lg text-gray-300 text-center max-w-xl">
          🚀 Research to Startup | Made in India, for India | For Planetary Engineers
        </p>
      </main>
    </>
  );
}
