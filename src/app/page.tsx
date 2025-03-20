import { getAllSurahs } from '../api/utils/surahUtils';
import MainLayout from '../components/Layout/MainLayout';

// This is a Server Component (no 'use client' directive)
export default async function Home() {
  // Fetch data on the server
  const surahs = await getAllSurahs();

  // Pass the data to the client component
  return <MainLayout initialSurahs={surahs} />;
}
