/**
 * Seeds all adhkar into Supabase (idempotent — clears + reloads everything):
 *   • Morning + Evening from the Seen-Arabic dataset (WITH proof source)
 *   • 12 curated situations from Hisn al-Muslim (for topic search)
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

const morningEvening = JSON.parse(
  readFileSync(new URL("../data/adhkar-morning-evening.json", import.meta.url)),
);
const husn = JSON.parse(
  readFileSync(new URL("../data/adhkar-situational.json", import.meta.url)),
).English;

async function addTopic(t) {
  const { data, error } = await supabase.from("topics").insert(t).select("id").single();
  if (error) throw error;
  return data.id;
}
async function addDhikr(d) {
  const { data, error } = await supabase.from("adhkar").insert(d).select("id").single();
  if (error) throw error;
  return data.id;
}
async function link(adhkarId, topicId, order) {
  const { error } = await supabase
    .from("adhkar_topics")
    .insert({ adhkar_id: adhkarId, topic_id: topicId, sort_order: order });
  if (error) throw error;
}

// ---- clear everything for a clean reseed ----
await supabase.from("adhkar_topics").delete().gt("adhkar_id", 0);
await supabase.from("adhkar").delete().gt("id", 0);
await supabase.from("topics").delete().gt("id", 0);

// ---- Morning + Evening (with proofs) ----
const morningId = await addTopic({ slug: "morning", name_ar: "أذكار الصباح", name_en: "Morning", kind: "routine", sort_order: 1 });
const eveningId = await addTopic({ slug: "evening", name_ar: "أذكار المساء", name_en: "Evening", kind: "routine", sort_order: 2 });
let total = 0;
for (const it of morningEvening) {
  const id = await addDhikr({
    arabic_text: it.content,
    repeat_count: it.count ?? 1,
    count_description: it.count_description ?? null,
    virtue: it.fadl ?? null,
    source_proof: it.source ?? null,
  });
  if (it.type === 0 || it.type === 1) await link(id, morningId, it.order ?? 0);
  if (it.type === 0 || it.type === 2) await link(id, eveningId, it.order ?? 0);
  total++;
}

// ---- Curated situations from Hisn al-Muslim (Hisn category ID -> our topic) ----
const situations = [
  { catId: 28, slug: "sleep", name_ar: "أذكار النوم", name_en: "Before Sleep" },
  { catId: 1, slug: "waking", name_ar: "أذكار الاستيقاظ", name_en: "Waking Up" },
  { catId: 34, slug: "worry", name_ar: "دعاء الهمّ والحزن", name_en: "Worry & Grief" },
  { catId: 35, slug: "distress", name_ar: "دعاء الكرب", name_en: "Distress" },
  { catId: 25, slug: "after-prayer", name_ar: "أذكار بعد الصلاة", name_en: "After Prayer" },
  { catId: 15, slug: "adhan", name_ar: "أذكار الأذان", name_en: "The Adhan" },
  { catId: 49, slug: "sick", name_ar: "زيارة المريض", name_en: "Visiting the Sick" },
  { catId: 9, slug: "wudu", name_ar: "أذكار الوضوء", name_en: "After Ablution" },
  { catId: 11, slug: "home-enter", name_ar: "دخول المنزل", name_en: "Entering Home" },
  { catId: 10, slug: "home-leave", name_ar: "الخروج من المنزل", name_en: "Leaving Home" },
  { catId: 44, slug: "repentance", name_ar: "التوبة والاستغفار", name_en: "Repentance" },
  { catId: 26, slug: "istikharah", name_ar: "صلاة الاستخارة", name_en: "Istikharah" },
];
let sort = 3;
for (const s of situations) {
  const cat = husn.find((c) => c.ID === s.catId);
  if (!cat || !cat.TEXT?.length) continue;
  const topicId = await addTopic({ slug: s.slug, name_ar: s.name_ar, name_en: s.name_en, kind: "situational", sort_order: sort++ });
  let order = 0;
  for (const dh of cat.TEXT) {
    const rep = parseInt(dh.REPEAT, 10);
    const id = await addDhikr({
      arabic_text: dh.ARABIC_TEXT,
      repeat_count: Number.isFinite(rep) && rep > 0 ? rep : 1,
      count_description: null,
      virtue: dh.LANGUAGE_ARABIC_TRANSLATED_TEXT || null,
      source_proof: null,
    });
    await link(id, topicId, order++);
    total++;
  }
}

console.log(`✓ Seeded ${total} adhkar across ${2 + situations.length} topics.`);
