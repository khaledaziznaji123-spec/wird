import { createClient } from "@/lib/supabase/server";

export type StreakInfo = {
  current: number;
  longest: number;
  totalDays: number;
};

const dayNum = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
};

/** Current + longest streak, computed from the user's completion days. */
export async function getStreak(): Promise<StreakInfo> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { current: 0, longest: 0, totalDays: 0 };

  const { data } = await supabase
    .from("completions")
    .select("completed_date")
    .eq("user_id", user.id);

  const nums = [...new Set((data ?? []).map((r) => dayNum(r.completed_date)))].sort(
    (a, b) => a - b,
  );
  if (nums.length === 0) return { current: 0, longest: 0, totalDays: 0 };

  let longest = 1;
  let run = 1;
  for (let i = 1; i < nums.length; i++) {
    run = nums[i] === nums[i - 1] + 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  // "current" counts only if the latest completed day is today or yesterday.
  const today = Math.floor(Date.now() / 86400000);
  const last = nums[nums.length - 1];
  let current = 0;
  if (last === today || last === today - 1) {
    current = 1;
    let p = last;
    for (let i = nums.length - 2; i >= 0; i--) {
      if (nums[i] === p - 1) {
        current++;
        p--;
      } else break;
    }
  }

  return { current, longest, totalDays: nums.length };
}

/** Whether a topic is already marked complete today (in the given local date). */
export async function isTopicDoneToday(
  topicId: number,
  localDate: string,
): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("completions")
    .select("topic_id")
    .eq("user_id", user.id)
    .eq("topic_id", topicId)
    .eq("completed_date", localDate)
    .maybeSingle();
  return !!data;
}
