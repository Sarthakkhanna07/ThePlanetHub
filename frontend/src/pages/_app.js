import "../styles/globals.css";
import Layout from "@/components/Layout";
import { useAuthUpsert } from '../lib/authListener';

export default function App({ Component, pageProps }) {
  useAuthUpsert();
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
