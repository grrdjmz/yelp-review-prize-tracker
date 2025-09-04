import { createSupabaseServer } from '@/lib/supabaseServer';
import Leaderboard from '@/components/Leaderboard';
import Mascots from '@/components/Mascots';

export const revalidate = 60; // revalidate leaderboard every minute

export default async function Page() {
  const supabase = createSupabaseServer();

  async function fetchLeaderboard(period: string) {
    // call custom RPC to get leaderboard for the given period
    const { data, error } = await supabase.rpc('get_leaderboard', { period });
    if (error) {
      console.error('Failed to fetch leaderboard', error.message);
      return [];
    }
    return data as any[];
  }

  const [allTime, thisMonth, thisWeek] = await Promise.all([
    fetchLeaderboard('all_time'),
    fetchLeaderboard('this_month'),
    fetchLeaderboard('this_week'),
  ]);

  const leaderboardData = {
    all_time: allTime,
    this_month: thisMonth,
    this_week: thisWeek,
  } as const;

  return (
    <div className="relative pt-8 pb-16">
      <h1 className="text-center text-3xl font-bold mb-4">
        Yelp Review Prize Tracker
      </h1>
      <Leaderboard data={leaderboardData} />
      <Mascots />
      <footer className="mt-8 flex justify-between text-sm text-bc-gray px-4">
        <span>1 review = 1 spin</span>
        <div className="space-x-4">
          <a href="/staff">Staff</a>
          <a href="/manager">Manager</a>
        </div>
      </footer>
    </div>
  );
}
