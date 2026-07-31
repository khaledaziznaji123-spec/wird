/**
 * Seeds ALL adhkar into Supabase (idempotent — clears + reloads), batched:
 *   • Morning + Evening from the Seen-Arabic dataset (WITH per-dhikr proof)
 *   • Every other Hisn al-Muslim chapter (bilingual names, sourced to the book)
 *
 * Run: node --env-file=.env.local scripts/seed-adhkar.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing env");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false } });

const morningEvening = JSON.parse(
  readFileSync(new URL("../data/adhkar-morning-evening.json", import.meta.url)),
);
const full = JSON.parse(readFileSync(new URL("../data/adhkar-full.json", import.meta.url)));

async function addTopic(t) {
  const { data, error } = await supabase.from("topics").insert(t).select("id").single();
  if (error) throw error;
  return data.id;
}
async function addManyDhikr(rows) {
  if (!rows.length) return [];
  const { data, error } = await supabase.from("adhkar").insert(rows).select("id");
  if (error) throw error;
  return data.map((r) => r.id); // single INSERT preserves input order
}
async function addManyLinks(links) {
  if (!links.length) return;
  const { error } = await supabase.from("adhkar_topics").insert(links);
  if (error) throw error;
}

// clear everything
await supabase.from("adhkar_topics").delete().gt("adhkar_id", 0);
await supabase.from("adhkar").delete().gt("id", 0);
await supabase.from("topics").delete().gt("id", 0);

// Morning + Evening (with per-dhikr proof)
const morningId = await addTopic({ slug: "morning", name_ar: "أذكار الصباح", name_en: "Morning", kind: "routine", sort_order: 1 });
const eveningId = await addTopic({ slug: "evening", name_ar: "أذكار المساء", name_en: "Evening", kind: "routine", sort_order: 2 });

const meIds = await addManyDhikr(
  morningEvening.map((it) => ({
    arabic_text: it.content,
    repeat_count: it.count ?? 1,
    count_description: it.count_description ?? null,
    virtue: it.fadl ?? null,
    source_proof: it.source ?? null,
  })),
);
const meLinks = [];
morningEvening.forEach((it, i) => {
  if (it.type === 0 || it.type === 1) meLinks.push({ adhkar_id: meIds[i], topic_id: morningId, sort_order: it.order ?? 0 });
  if (it.type === 0 || it.type === 2) meLinks.push({ adhkar_id: meIds[i], topic_id: eveningId, sort_order: it.order ?? 0 });
});
await addManyLinks(meLinks);
let total = meIds.length;

// Every other Hisn al-Muslim chapter (skip 27 = morning/evening, already covered)
let sort = 3;
for (const c of full) {
  if (c.id === 27) continue;
  const topicId = await addTopic({
    slug: `cat-${c.id}`,
    name_ar: c.name_ar,
    name_en: c.name_en,
    kind: "situational",
    sort_order: sort++,
  });
  const ids = await addManyDhikr(
    c.adhkar.map((dh) => ({
      arabic_text: dh.arabic_text,
      repeat_count: dh.repeat > 0 ? dh.repeat : 1,
      source_proof: `من كتاب «حصن المسلم من أذكار الكتاب والسنّة» — باب ${c.name_ar}`,
    })),
  );
  await addManyLinks(ids.map((id, i) => ({ adhkar_id: id, topic_id: topicId, sort_order: i })));
  total += ids.length;
}

console.log(`✓ Seeded ${total} adhkar across ${sort - 1} topics.`);
