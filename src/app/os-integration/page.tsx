'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OsIntegrationRedirectPage(): React.ReactElement {
  const router = useRouter();
  useEffect((): void => {
    router.replace('/');
  }, [router]);

  return <div className="h-screen bg-[#0c0c0e]" />;
}
