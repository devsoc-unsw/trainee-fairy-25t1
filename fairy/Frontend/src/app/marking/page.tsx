'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

import Footer from '@/components/landing/footer';
import DriveCard from '@/components/societies/society-drive-card';

export interface Drive {
  s_id: string;
  s_name: string;
  alias: string;
  s_description: string;
  img_url: string;

  d_id: string;
  d_name: string;
  d_description: string;
  open_date: string;
  close_date: string;
}

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [drives, setDrives] = useState<Drive[]>([]);

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const res = await fetch('http://localhost:3000/mark/drives', {
          credentials: 'include',
        });

        if (res.status === 401) {
          // Not authenticated, redirect to login page
          router.push("/auth");
          return;
        }

        const data = await res.json();
        setDrives(data.drives);
      } catch (err) {
        console.error('Failed to fetch drives:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSocieties();
  }, [])

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div >
      <main className="bg-foreground">
        <div className="bg-background min-h-screen rounded-b-4xl">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Currently marking...</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Here you can find all the drives that are currently open for marking. Click on a drive to view more details and submit your portfolio.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drives.map((drive) => (
                <DriveCard key={drive.d_id} drive={drive} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  )
};

export default Page;