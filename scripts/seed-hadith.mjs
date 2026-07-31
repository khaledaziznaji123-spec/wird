/**
 * Seeds Sahih al-Bukhari + Sahih Muslim (Arabic + English) into `hadiths`
 * from the open fawazahmed0/hadith-api. Idempotent (clears + reloads).
 *
 * Run: node --env-file=.env.local scripts/seed-hadith.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing env");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false } });

const CDN = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";
async function fetchEdition(name) {
  const r = await fetch(`${CDN}/${name}.min.json`);
  if (!r.ok) throw new Error(`fetch ${name}: ${r.status}`);
  return (await r.json()).hadiths;
}

async function seedCollection(collection, araEd, engEd) {
  const ara = await fetchEdition(araEd);
  const eng = await fetchEdition(engEd);
  const engByNum = new Map(eng.map((h) => [h.hadithnumber, h.text]));
  const rows = ara.map((h) => ({
    collection,
    reference: `${collection} ${h.hadithnumber}`,
    arabic_text: h.text,
    english_text: engByNum.get(h.hadithnumber) ?? null,
  }));
  for (let i = 0; i < rows.length; i += 1000) {
    const { error } = await supabase.from("hadiths").insert(rows.slice(i, i + 1000));
    if (error) throw error;
    process.stdout.write(`  ${collection}: ${Math.min(i + 1000, rows.length)}/${rows.length}\r`);
  }
  console.log(`\n✓ ${collection}: ${rows.length}`);
  return rows.length;
}

await supabase.from("hadiths").delete().gt("id", 0);
let total = 0;
total += await seedCollection("Sahih al-Bukhari", "ara-bukhari", "eng-bukhari");
total += await seedCollection("Sahih Muslim", "ara-muslim", "eng-muslim");
total += await seedCollection("Sunan Abu Dawud", "ara-abudawud", "eng-abudawud");
total += await seedCollection("Jami' at-Tirmidhi", "ara-tirmidhi", "eng-tirmidhi");
total += await seedCollection("Sunan an-Nasa'i", "ara-nasai", "eng-nasai");
total += await seedCollection("Sunan Ibn Majah", "ara-ibnmajah", "eng-ibnmajah");
total += await seedCollection("Muwatta Malik", "ara-malik", "eng-malik");
console.log(`✓ Seeded ${total} hadith.`);
