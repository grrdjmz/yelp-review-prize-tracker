import { createSupabaseServer } from '@/lib/supabaseServer';

export default async function PrizesPage() {
  // Fetch prizes for display. In a real implementation this page would
  // authenticate the user and restrict access to admins using RLS policies.
  const supabase = createSupabaseServer();
  const { data, error } = await supabase
    .from('prizes')
    .select('id, name, description, quantity, active, order')
    .order('order', { ascending: true });
  if (error) {
    console.error('Failed to load prizes', error.message);
  }
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Prize Catalog</h1>
      <p className="text-sm text-bc-gray">
        This admin-only page allows managers to create, update and remove prizes.
        Implement full CRUD and ordering controls in a client component.
      </p>
      {data && (
        <ul className="space-y-2">
          {data.map((prize) => (
            <li
              key={prize.id}
              className="bg-white shadow-card rounded-xl2 p-3 flex justify-between items-center"
            >
              <span>
                {prize.name} {prize.active ? '' : <span className="text-bc-gray text-xs">(inactive)</span>}
              </span>
              <span className="text-sm text-bc-gray">Qty: {prize.quantity}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
