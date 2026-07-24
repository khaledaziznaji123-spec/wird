/**
 * Seeds all adhkar into Supabase (idempotent — clears + reloads everything):
 *   • Morning + Evening from the Seen-Arabic dataset (WITH per-dhikr proof)
 *   • ~30 curated life situations from Hisn al-Muslim (searchable; sourced to the book)
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

// ---- Morning + Evening (with per-dhikr proof) ----
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

// ---- Curated life situations (English name chosen to match common searches) ----
// cats = Hisn al-Muslim category IDs merged into one topic.
const situations = [
  { cats: [28], slug: "sleep", name_ar: "أذكار النوم", name_en: "Sleep" },
  { cats: [1, 29], slug: "waking", name_ar: "أذكار الاستيقاظ", name_en: "Waking Up" },
  { cats: [34], slug: "worry", name_ar: "الهمّ والحزن", name_en: "Worry & Sadness" },
  { cats: [35], slug: "distress", name_ar: "الكرب والضيق", name_en: "Distress & Anguish" },
  { cats: [30, 31], slug: "fear-sleep", name_ar: "الخوف والأرق", name_en: "Anxiety & Bad Dreams" },
  { cats: [82], slug: "anger", name_ar: "عند الغضب", name_en: "Anger" },
  { cats: [25], slug: "after-prayer", name_ar: "أذكار بعد الصلاة", name_en: "After Prayer" },
  { cats: [15], slug: "adhan", name_ar: "أذكار الأذان", name_en: "The Adhan (call to prayer)" },
  { cats: [49, 50, 51], slug: "sick", name_ar: "المريض وزيارته", name_en: "Sickness & Visiting the Sick" },
  { cats: [8, 9], slug: "wudu", name_ar: "أذكار الوضوء", name_en: "Ablution (wudu)" },
  { cats: [11], slug: "home-enter", name_ar: "دخول المنزل", name_en: "Entering Home" },
  { cats: [10], slug: "home-leave", name_ar: "الخروج من المنزل", name_en: "Leaving Home" },
  { cats: [12, 13, 14], slug: "mosque", name_ar: "المسجد", name_en: "The Mosque" },
  { cats: [69, 70], slug: "eating", name_ar: "أذكار الطعام", name_en: "Eating" },
  { cats: [72], slug: "drink", name_ar: "الشراب", name_en: "Drinking" },
  { cats: [95, 96, 97], slug: "travel", name_ar: "أذكار السفر", name_en: "Travel & Riding" },
  { cats: [98], slug: "market", name_ar: "دخول السوق", name_en: "The Market" },
  { cats: [63, 64, 65], slug: "rain", name_ar: "المطر", name_en: "Rain" },
  { cats: [61], slug: "wind", name_ar: "الريح", name_en: "Wind" },
  { cats: [62], slug: "thunder", name_ar: "الرعد", name_en: "Thunder" },
  { cats: [67], slug: "new-moon", name_ar: "رؤية الهلال", name_en: "New Moon" },
  { cats: [79, 80, 81], slug: "marriage", name_ar: "الزواج", name_en: "Marriage & Wedding" },
  { cats: [77, 78], slug: "sneezing", name_ar: "العطاس", name_en: "Sneezing" },
  { cats: [41], slug: "debt", name_ar: "قضاء الدَّين", name_en: "Debt" },
  { cats: [44, 45], slug: "repentance", name_ar: "التوبة والاستغفار", name_en: "Repentance & Forgiveness" },
  { cats: [26], slug: "istikharah", name_ar: "صلاة الاستخارة", name_en: "Istikharah (seeking guidance)" },
  { cats: [2, 3], slug: "clothes", name_ar: "لبس الثوب", name_en: "Getting Dressed" },
  { cats: [6, 7], slug: "restroom", name_ar: "دخول الخلاء", name_en: "The Restroom" },
  { cats: [48], slug: "children", name_ar: "تحصين الأطفال", name_en: "Protecting Children" },
  { cats: [68, 73], slug: "iftar", name_ar: "الإفطار في الصوم", name_en: "Breaking the Fast" },
];
let sort = 3;
for (const s of situations) {
  const rows = s.cats.flatMap((id) => husn.find((c) => c.ID === id)?.TEXT ?? []);
  if (!rows.length) continue;
  const topicId = await addTopic({ slug: s.slug, name_ar: s.name_ar, name_en: s.name_en, kind: "situational", sort_order: sort++ });
  let order = 0;
  for (const dh of rows) {
    const rep = parseInt(dh.REPEAT, 10);
    const id = await addDhikr({
      arabic_text: dh.ARABIC_TEXT,
      repeat_count: Number.isFinite(rep) && rep > 0 ? rep : 1,
      count_description: null,
      virtue: null,
      source_proof: `من كتاب «حصن المسلم من أذكار الكتاب والسنّة» — باب ${s.name_ar}`,
    });
    await link(id, topicId, order++);
    total++;
  }
}

console.log(`✓ Seeded ${total} adhkar across ${2 + situations.length} topics.`);
