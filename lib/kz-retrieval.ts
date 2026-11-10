/**
 * Lexical retrieval over the Kazakhstan law corpus.
 *
 * BM25 over light Russian stems: users ask "арендодатель удержал залог", while
 * the code says "арендодателя", "залогом" — exact substring matching misses
 * these. Stems + BM25 also stop long articles from dominating every query.
 * Pure functions only, so the same code runs in the app and in eval scripts.
 */

export type LegalChunk = {
  id: string;
  sourceId: string;
  title: string;
  article: string;
  text: string;
  url: string;
  authority: string;
  language: string;
  fetchedAt: string;
};

type IndexedChunk = {
  chunk: LegalChunk;
  length: number;
  tf: Map<string, number>;
  heading: Set<string>;
};

export type LegalIndex = {
  docs: IndexedChunk[];
  df: Map<string, number>;
  avgLength: number;
};

const STOP_WORDS = new Set([
  "и", "в", "во", "не", "на", "с", "со", "что", "как", "а", "то", "все", "она", "так", "его", "но",
  "да", "ты", "к", "у", "же", "вы", "за", "бы", "по", "только", "ее", "её", "мне", "было", "вот",
  "от", "меня", "еще", "ещё", "нет", "о", "из", "ему", "теперь", "когда", "даже", "ну", "ли",
  "если", "уже", "или", "ни", "быть", "был", "него", "до", "вас", "нибудь", "опять", "уж", "вам",
  "ведь", "там", "потом", "себя", "ничего", "ей", "может", "они", "тут", "где", "есть", "надо",
  "ней", "для", "мы", "тебя", "их", "чем", "была", "сам", "чтоб", "без", "будто", "чего", "раз",
  "тоже", "себе", "под", "будет", "ж", "тогда", "кто", "этот", "того", "потому", "этого", "какой",
  "какие", "какая", "совсем", "ним", "здесь", "этом", "один", "почти", "мой", "тем", "чтобы",
  "нее", "сейчас", "были", "куда", "зачем", "всех", "никогда", "можно", "при", "наконец", "два",
  "об", "другой", "хоть", "после", "над", "больше", "тот", "через", "эти", "нас", "про", "всего",
  "них", "какая", "много", "разве", "три", "эту", "моя", "впрочем", "хорошо", "свою", "этой",
  "перед", "иногда", "лучше", "чуть", "том", "нельзя", "такой", "им", "более", "всегда",
  "конечно", "всю", "между", "это", "нужно", "либо", "также", "мне", "мой", "моего", "моей",
  "республики", "республика", "казахстан", "казахстана", "закон", "закона", "законом", "кодекс",
  "кодекса", "статья", "статьи", "статье", "норма", "права", "право", "вопрос", "вопросу",
  "the", "and", "for", "with", "that", "this", "what", "can", "law", "does"
]);

// Ordered longest first so "ениями" is stripped before "ями".
const RU_ENDINGS = [
  "иями", "ениями", "ениях", "ением", "ений", "ение", "ения", "ению", "ости", "остью", "ость",
  "ующий", "ующая", "ующее", "ующие", "ующих", "ющий", "ющая", "ющее", "ющие", "ющих",
  "ными", "ного", "ному", "ными", "ных", "ный", "ная", "ное", "ные", "ной", "ную",
  "ами", "ями", "ого", "его", "ому", "ему", "ыми", "ими", "ая", "яя", "ое", "ее", "ые", "ие",
  "ый", "ий", "ой", "ей", "ом", "ем", "ам", "ям", "ах", "ях", "ов", "ев", "ую", "юю",
  "ть", "ти", "ет", "ут", "ют", "ит", "ат", "ят", "ал", "ял", "ил", "ла", "ли", "ло",
  "а", "я", "о", "е", "ы", "и", "у", "ю", "ь", "й"
];

const TOKEN_SPLIT = /[^\p{L}\p{N}]+/u;

export function stem(word: string) {
  const lower = word.toLowerCase().replace(/ё/g, "е");
  if (!/[а-я]/.test(lower) || lower.length <= 4) return lower;
  for (const ending of RU_ENDINGS) {
    if (lower.endsWith(ending) && lower.length - ending.length >= 4) {
      return lower.slice(0, -ending.length);
    }
  }
  return lower;
}

export function tokenize(value: string) {
  return value
    .split(TOKEN_SPLIT)
    .map((token) => token.toLowerCase())
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token))
    .map(stem);
}

export function buildLegalIndex(chunks: LegalChunk[]): LegalIndex {
  const df = new Map<string, number>();
  let totalLength = 0;
  const docs = chunks.map((chunk) => {
    const tokens = tokenize(chunk.text);
    const tf = new Map<string, number>();
    for (const token of tokens) tf.set(token, (tf.get(token) ?? 0) + 1);
    const heading = new Set(tokenize(`${chunk.title} ${chunk.article}`));
    for (const term of new Set([...tf.keys(), ...heading])) {
      df.set(term, (df.get(term) ?? 0) + 1);
    }
    totalLength += tokens.length;
    return { chunk, length: tokens.length, tf, heading };
  });
  return { docs, df, avgLength: totalLength / Math.max(1, docs.length) };
}

const K1 = 1.2;
const B = 0.75;
const HEADING_BOOST = 1.5;

/** Everyday words → the vocabulary the codes actually use. */
const LAY_SYNONYMS: Array<[RegExp, string]> = [
  [/уволи|увольн/i, "расторжение трудового договора по инициативе работодателя"],
  [/зарплат/i, "заработная плата"],
  [/штраф|пени|пеня/i, "неустойка"],
  [/квартир|жиль[её]/i, "имущественный наем жилища помещение"],
  [/съ[её]м|снима/i, "имущественный наем аренда"],
  [/долг|одолжи|в долг/i, "договор займа заемщик займодатель"],
  [/депозит|гарантийн/i, "обеспечение исполнения обязательства"],
  [/\bип\b|ипшник/i, "индивидуальный предприниматель"],
  [/декрет|беременн/i, "отпуск по беременности и родам"],
  [/больничн/i, "временная нетрудоспособность"],
  [/наследств|завещан/i, "наследование наследник"],
  [/развод/i, "расторжение брака"],
  [/вернуть товар|возврат товар|брак товар/i, "товар ненадлежащего качества права покупателя"],
  [/подать в суд|засуди|судиться/i, "исковое заявление иск подсудность"]
];

export function expandQuery(query: string) {
  return LAY_SYNONYMS.filter(([pattern]) => pattern.test(query))
    .map(([, expansion]) => expansion)
    .join(" ");
}

const EXPANSION_WEIGHT = 0.6;

export function searchLegalIndex(index: LegalIndex, query: string, limit = 7) {
  const original = [...new Set(tokenize(query))];
  const expansion = [...new Set(tokenize(expandQuery(query)))].filter(
    (term) => !original.includes(term)
  );
  const terms = [...original, ...expansion];
  if (!terms.length) return [];
  const total = index.docs.length;
  const idf = new Map(
    terms.map((term) => {
      const n = index.df.get(term) ?? 0;
      return [term, Math.log(1 + (total - n + 0.5) / (n + 0.5))];
    })
  );

  const scored: { chunk: LegalChunk; score: number }[] = [];
  for (const doc of index.docs) {
    let score = 0;
    let matched = 0;
    for (const term of terms) {
      const frequency = doc.tf.get(term) ?? 0;
      const inHeading = doc.heading.has(term);
      if (!frequency && !inHeading) continue;
      if (!expansion.includes(term)) matched += 1;
      const weight =
        (idf.get(term) ?? 0) * (expansion.includes(term) ? EXPANSION_WEIGHT : 1);
      if (frequency) {
        score +=
          weight *
          ((frequency * (K1 + 1)) /
            (frequency + K1 * (1 - B + (B * doc.length) / index.avgLength)));
      }
      if (inHeading) score += weight * HEADING_BOOST;
    }
    if (score <= 0) continue;
    // Reward chunks that cover more of the question, not just one rare word.
    score *= 0.5 + 0.5 * (matched / Math.max(1, original.length));
    scored.push({ chunk: doc.chunk, score });
  }

  return scored
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((item) => item.chunk);
}
