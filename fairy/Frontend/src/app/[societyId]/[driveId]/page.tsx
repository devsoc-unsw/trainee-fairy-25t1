'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const Page = () => {
  const searchParams = useSearchParams();
  const societyId = searchParams.get('society_id');
  const driveId = searchParams.get('drive_id');

  const [society, setSociety] = useState(null);
  const [portfolios, setPortfolios] = useState(null);

  useEffect(() => {
    // This effect runs when the component mounts or when the search params change
    if (!societyId || !driveId) {
      console.error('Missing society_id or drive_id in query parameters');
    }

    const fetchSociety = async () => {
      try {
        const response = await fetch(`http://localhost:3000/apply/societies/${societyId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch society');
        }

        const data = await response.json();
        setSociety(data.society);
      } catch (error) {
        console.error('Error fetching society:', error);
      }
    }

    const fetchPortfolios = async () => {
      try {
        const response = await fetch(`http://localhost:3000/apply/portfolios/${driveId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch portfolios');
        }

        const data = await response.json();
        setPortfolios(data.portfolio);
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      }
    }

    fetchSociety();
    fetchPortfolios();
  }, [societyId, driveId]);


  return (
    <div>
      <pre className="bg-gray-100 text-sm text-gray-800 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
        <div className="text-lg font-semibold">Society:</div>
        {JSON.stringify(society, null, 2)}
      </pre>
      <pre className="bg-gray-100 text-sm text-gray-800 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
        <div className="text-lg font-semibold">Society:</div>
        {JSON.stringify(portfolios, null, 2)}
      </pre>
    </div>
  );
};

export default Page;