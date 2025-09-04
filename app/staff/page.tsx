import { createSupabaseServer } from '@/lib/supabaseServer';
import StaffGrid from '@/components/StaffGrid';

export const revalidate = 60;

export default async function StaffPage() {
  const supabase = createSupabaseServer();
  const { data, error } = await supabase
    .from('staff')
    .select('id, full_name, active, avatar_url')
    .order('full_name', { ascending: true });
  if (error) {
    console.error('Failed to load staff roster', error.message);
    return <p className="p-4 text-red-600">Failed to load staff roster</p>;
  }
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Our Staff</h1>
      <StaffGrid staff={data || []} />
    </div>
  );
}
