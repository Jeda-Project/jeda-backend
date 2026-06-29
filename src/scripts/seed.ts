/**
 * Scope: seed.ts
 * Purpose: Populates the database with realistic dummy entries for development and testing.
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "../env.ts";
import * as schema from "../db/schema/index.ts";

const sql = neon(env.DATABASE_URL);
const db = drizzle(sql, { schema, casing: "snake_case" });

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(21, 30, 0, 0);
  return d;
}

const entries: (typeof schema.entries.$inferInsert)[] = [
  {
    content: "Akhirnya hari ini kami presentasi di depan klien besar. Deg-degan dari semalam, tapi ternyata berjalan lancar. Tim kompak, slide-nya oke, dan kliennya responsif. Lega banget rasanya.",
    sentimentScore: 0.85,
    openQuestion: 'Kamu menyebut "presentasi" — seperti apa rasanya saat memikirkan itu?',
    reflectionText: "Rasanya campur aduk sih. Ada deg-degan tapi juga semangat. Yang bikin tenang itu karena kita udah prepare bareng-bareng, jadi ngerasa ada yang backup.",
    reflectedPhrase: "Wajar banget kalau deg-degan sebelum presentasi besar. Tapi fakta bahwa kamu bisa tetap tenang dan kompak sama tim itu menunjukkan kematangan yang luar biasa. Perasaan lega yang kamu rasakan sekarang adalah bukti nyata dari kerja keras yang sudah kamu lakukan.",
    createdAt: daysAgo(1),
  },
  {
    content: "Hari ini cuma rebahan. Tidak produktif sama sekali. Coba kerja tapi kepala rasanya berat, akhirnya malah scroll medsos terus. Besok harus lebih baik.",
    sentimentScore: -0.4,
    openQuestion: 'Kamu menyebut "berat" — apa yang membuat kata itu terasa berat hari ini?',
    reflectionText: "Entah kenapa susah fokus belakangan ini. Mungkin karena terlalu banyak pikiran yang belum kelar. Harus belajar istirahat yang bener, bukan cuma rebahan tapi tetap overthinking.",
    reflectedPhrase: "Rebahan dan recharging itu beda tipis, dan kamu sudah mulai menyadari itu. Langkah kecil seperti mengenali polamu sendiri adalah awal yang baik untuk besok.",
    createdAt: daysAgo(2),
  },
  {
    content: "Dapat kabar teman lama mau nikah bulan depan. Ikut seneng tapi juga tiba-tiba inget masa kuliah dulu. Waktu cepet banget berlalu ya.",
    sentimentScore: 0.5,
    openQuestion: 'Kamu menyebut "masa kuliah" — kenangan apa yang paling kamu rindukan?',
    reflectionText: "Kangen masa-masa kuliah yang lebih santai, nongkrong bareng, belum banyak beban. Tapi sekarang juga bersyukur sudah sejauh ini.",
    reflectedPhrase: "Nostalgia itu tanda kamu punya kenangan yang berharga. Dan rasa syukur yang kamu sebutkan di akhir menunjukkan kedewasaan — kamu bisa menghargai masa lalu tanpa terjebak di dalamnya.",
    createdAt: daysAgo(3),
  },
  {
    content: "Deadline project mepet banget. Kerja sampai jam 2 malam tapi masih belum kelar. Frustrasi sama diri sendiri kenapa dari awal tidak mulai lebih cepat.",
    sentimentScore: -0.75,
    openQuestion: 'Kamu menyebut "frustrasi" — apa yang paling kamu inginkan dari dirimu sendiri saat ini?',
    reflectionText: "Pengen bisa lebih disiplin dari awal. Tapi setiap kali ada waktu kosong malah dipakai yang lain. Harus belajar prioritas yang beneran.",
    reflectedPhrase: "Frustrasi pada diri sendiri itu melelahkan. Tapi menyadari pola ini adalah langkah pertama yang penting. Coba tanyakan ke dirimu: apa satu kebiasaan kecil yang bisa kamu ubah minggu depan?",
    createdAt: daysAgo(5),
  },
  {
    content: "Jogging pagi pertama setelah 3 bulan tidak olahraga. Cuma 2 km tapi rasanya sudah kayak marathon. Tapi seneng karena akhirnya mulai lagi.",
    sentimentScore: 0.7,
    openQuestion: 'Kamu menyebut "akhirnya mulai" — apa yang selama ini menghambatmu?',
    reflectionText: "Selama ini selalu ada alasan. Kurang tidur, sibuk, hujan. Tapi hari ini entah kenapa langsung jalan aja tanpa mikir. Mungkin memang harus gitu caranya.",
    reflectedPhrase: "Dua kilometer itu bukan soal jarak — itu soal membuktikan ke dirimu sendiri bahwa kamu bisa memulai lagi. Energi yang kamu rasakan sekarang itu nyata dan berhak kamu rayakan.",
    createdAt: daysAgo(7),
  },
  {
    content: "Rapat yang harusnya 1 jam jadi 3 jam. Capek banget tapi tidak bisa bilang apa-apa. Pulang ke rumah langsung tidur.",
    sentimentScore: -0.5,
    openQuestion: 'Kamu menyebut "tidak bisa bilang apa-apa" — apa yang ingin kamu katakan tapi tertahan?',
    reflectionText: "Sebenernya pengen bilang bahwa rapat ini tidak efisien dan banyak yang bisa dibahas async. Tapi takut dianggap tidak sopan atau tidak kooperatif.",
    reflectedPhrase: "Perasaan ingin didengar tapi khawatir salah dipahami itu sangat manusiawi. Mungkin ada cara yang lebih halus untuk menyuarakan ini — dan kamu lebih mampu dari yang kamu kira.",
    createdAt: daysAgo(9),
  },
  {
    content: "Masak sendiri untuk pertama kali setelah pindah kos. Hasilnya lumayan, tidak gosong, dan rasanya bisa dimakan. Merasa independen hari ini.",
    sentimentScore: 0.8,
    openQuestion: 'Kamu menyebut "independen" — apa arti kemandirian bagimu sekarang?',
    reflectionText: "Kemandirian buat aku artinya bisa ngurus diri sendiri tanpa harus selalu minta bantuan. Hal kecil kayak masak sendiri ini ternyata cukup bikin percaya diri.",
    reflectedPhrase: "Langkah kecil seperti memasak sendiri bisa jadi penanda besar tentang siapa kamu sedang tumbuh menjadi. Kebanggaan yang kamu rasakan itu valid dan layak untuk dirayakan.",
    createdAt: daysAgo(12),
  },
  {
    content: "Tidak sengaja ketemu mantan di minimarket. Awkward banget. Pura-pura tidak lihat tapi kayaknya dia lihat aku. Langsung keluar buru-buru.",
    sentimentScore: -0.3,
    openQuestion: 'Kamu menyebut "awkward" — perasaan apa yang paling dominan setelah kejadian itu?',
    reflectionText: "Lebih ke nggak nyaman aja sih, bukan sedih. Kayak situasinya tidak ideal. Mungkin kalau suatu hari ketemu lagi, aku udah lebih siap untuk sekadar sapa biasa.",
    reflectedPhrase: "Rasa tidak nyaman itu wajar, dan fakta bahwa kamu bisa merefleksikannya dengan kepala dingin menunjukkan bahwa kamu sudah jauh lebih baik dari sebelumnya.",
    createdAt: daysAgo(14),
  },
  {
    content: "Dapat feedback positif dari atasan soal laporan yang aku buat minggu lalu. Tidak expect sama sekali. Seneng tapi juga bingung harus respons gimana.",
    sentimentScore: 0.75,
    openQuestion: 'Kamu menyebut "tidak expect" — mengapa kamu sulit mengantisipasi hal baik untuk dirimu sendiri?',
    reflectionText: "Mungkin karena aku sering lebih fokus ke kekurangan daripada apa yang sudah baik. Perlu belajar lebih percaya sama kemampuan diri sendiri.",
    reflectedPhrase: "Pertanyaan yang kamu ajukan ke diri sendiri itu sangat jeli. Kesadaran itu adalah benih dari kepercayaan diri yang sedang tumbuh dalam dirimu.",
    createdAt: daysAgo(16),
  },
  {
    content: "Hujan deras seharian. Kerja dari rumah sambil dengerin musik. Hari yang tenang dan tidak banyak drama. Kadang memang butuh hari seperti ini.",
    sentimentScore: 0.6,
    openQuestion: 'Kamu menyebut "tenang" — kapan terakhir kali kamu benar-benar merasakannya?',
    reflectionText: "Sudah lama tidak merasa setenang ini. Biasanya kalau di rumah malah lebih banyak gangguan. Tapi hari ini entah kenapa bisa menikmati momen.",
    reflectedPhrase: "Ketenangan itu bukan kekosongan — itu tanda bahwa kamu sedang hadir sepenuhnya. Hari seperti ini berharga dan layak untuk diingat.",
    createdAt: daysAgo(20),
  },
];

async function main() {
  console.log(`[seed] inserting ${entries.length} entries...`);

  for (const entry of entries) {
    await db.insert(schema.entries).values(entry);
  }

  console.log("[seed] done.");
}

main().catch((error) => {
  console.error("[seed] failed:", error);
  process.exit(1);
});
