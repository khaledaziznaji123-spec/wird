/**
 * Seeds topics + adhkar (+ links) into Supabase from the sourced
 * Hisn al-Muslim morning/evening dataset. Idempotent (clears + reloads).
 *
 * Run: node --env-file=.env.local scripts/seed-adhkar.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const data = JSON.parse(
  readFileSync(new URL("../data/adhkar-morning-evening.json", import.meta.url)),
);

// 1) Topics (upsert by slug)
const { data: topicRows, error: tErr } = await supabase
  .from("topics")
  .upsert(
    [
      { slug: "morning", name_ar: "أذكار الصباح", name_en: "Morning Adhkar", kind: "routine", sort_order: 1 },
      { slug: "evening", name_ar: "أذكار المساء", name_en: "Evening Adhkar", kind: "routine", sort_order: 2 },
    ],
    { onConflict: "slug" },
  )
  .select();
if (tErr) throw tErr;
const morning = topicRows.find((t) => t.slug === "morning").id;
const evening = topicRows.find((t) => t.slug === "evening").id;

// 2) Clear existing content for a clean reseed
await supabase.from("adhkar_topics").delete().gt("adhkar_id", 0);
await supabase.from("adhkar").delete().gt("id", 0);

// 3) Insert each dhikr + its topic links (type 0=both, 1=morning, 2=evening)
let count = 0;
for (const item of data) {
  const { data: ins, error } = await supabase
    .from("adhkar")
    .insert({
      arabic_text: item.content,
      repeat_count: item.count ?? 1,
      count_description: item.count_description ?? null,
      virtue: item.fadl ?? null,
      source_proof: item.source ?? null,
    })
    .select("id")
    .single();
  if (error) throw error;

  const links = [];
  if (item.type === 0 || item.type === 1)
    links.push({ adhkar_id: ins.id, topic_id: morning, sort_order: item.order ?? 0 });
  if (item.type === 0 || item.type === 2)
    links.push({ adhkar_id: ins.id, topic_id: evening, sort_order: item.order ?? 0 });
  const { error: lErr } = await supabase.from("adhkar_topics").insert(links);
  if (lErr) throw lErr;
  count++;
}

const { count: mCount } = await supabase
  .from("adhkar_topics")
  .select("*", { count: "exact", head: true })
  .eq("topic_id", morning);
const { count: eCount } = await supabase
  .from("adhkar_topics")
  .select("*", { count: "exact", head: true })
  .eq("topic_id", evening);

console.log(`✓ Seeded ${count} adhkar — Morning: ${mCount}, Evening: ${eCount}`);
