import dynamic from 'next/dynamic';

// Dynamically import the manager panel as a client component. This avoids
// including Supabase logic in the server bundle.
const ManagerPanel = dynamic(() => import('../../components/ManagerPanel'), {
  ssr: false,
});

export default function ManagerPage() {
  const pin = process.env.MANAGER_QR_PIN || '';
  return <ManagerPanel pin={pin} />;
}
