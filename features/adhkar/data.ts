import { createClient } from "@/lib/supabase/server";

export type Topic = {
  id: number;
  slug: string;
  name_ar: string;
  name_en: string;
  kind: string;
  sort_order: number;
};

export type Dhikr = {
  id: number;
  arabic_text: string;
  repeat_count: number;
  count_description: string | null;
  virtue: string | null;
  source_proof: string | null;
};

/** All topics, ordered. Returns [] if the content isn't seeded yet. */
export async function getTopics(): Promise<Topic[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .order("sort_order");
  if (error) {
    console.warn("getTopics:", error.message);
    return [];
  }
  return data ?? [];
}

/** One topic by slug (or null). */
export async function getTopic(slug: string): Promise<Topic | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.warn("getTopic:", error.message);
    return null;
  }
  return data ?? null;
}

/** The adhkar in a topic, in order. Returns [] if not seeded yet. */
export async function getAdhkarForTopic(topicId: number): Promise<Dhikr[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("adhkar_topics")
    .select("sort_order, adhkar:adhkar_id (*)")
    .eq("topic_id", topicId)
    .order("sort_order");
  if (error) {
    console.warn("getAdhkarForTopic:", error.message);
    return [];
  }
  // Supabase returns the joined row under `adhkar`.
  return (data ?? []).map((row) => row.adhkar as unknown as Dhikr);
}

/** IDs of adhkar the current user has saved. */
export async function getAdhkarFavoriteIds(): Promise<number[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("adhkar_favorites")
    .select("adhkar_id")
    .eq("user_id", user.id);
  return (data ?? []).map((r) => r.adhkar_id);
}

/** The current user's saved adhkar. */
export async function getFavoriteAdhkar(): Promise<Dhikr[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data: favs } = await supabase
    .from("adhkar_favorites")
    .select("adhkar_id")
    .eq("user_id", user.id);
  const ids = (favs ?? []).map((r) => r.adhkar_id);
  if (ids.length === 0) return [];
  const { data } = await supabase.from("adhkar").select("*").in("id", ids);
  return data ?? [];
}

/**
 * Search adhkar by a free-text topic: matches the query against the dhikr's
 * Arabic text and against topic names (so "sleep"/"نوم" finds sleep adhkar).
 */
export async function searchAdhkar(qRaw: string): Promise<Dhikr[]> {
  const q = qRaw.replace(/[%,()]/g, " ").trim();
  if (!q) return [];
  const supabase = await createClient();

  const results: Dhikr[] = [];
  const seen = new Set<number>();
  const add = (d?: Dhikr | null) => {
    if (d && !seen.has(d.id)) {
      seen.add(d.id);
      results.push(d);
    }
  };

  // 1) adhkar whose Arabic text contains the query
  const { data: byText } = await supabase
    .from("adhkar")
    .select("*")
    .ilike("arabic_text", `%${q}%`)
    .limit(20);
  (byText ?? []).forEach((d) => add(d as Dhikr));

  // 2) adhkar inside topics whose name matches the query
  const { data: topics } = await supabase
    .from("topics")
    .select("id")
    .or(`name_ar.ilike.%${q}%,name_en.ilike.%${q}%`);
  const topicIds = (topics ?? []).map((t) => t.id);
  if (topicIds.length) {
    const { data: links } = await supabase
      .from("adhkar_topics")
      .select("adhkar:adhkar_id (*)")
      .in("topic_id", topicIds)
      .limit(30);
    (links ?? []).forEach((row) => add(row.adhkar as unknown as Dhikr));
  }

  return results.slice(0, 15);
}
