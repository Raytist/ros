import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const RTL67 = join(ROOT, "data", "rtl67");

type RtlItem = Record<string, unknown>;

const THEME_TO_TOPIC: Record<string, string> = {
  "ФЗ-44": "44-fz",
  "Рабочая тетрадь": "methodology",
};

const SOURCE_BY_TOPIC: Record<string, { law: string; label: string }> = {
  "44-fz": { law: "44-ФЗ", label: "Закон №44-ФЗ" },
  methodology: { law: "Методичка", label: "Рабочая тетрадь / Методичка Росэлторг" },
};

let taskCounter = 0;

function nextId(prefix: string) {
  taskCounter += 1;
  return `${prefix}-${taskCounter}`;
}

function loadJson(path: string): RtlItem[] {
  const raw = readFileSync(path, "utf-8").replace(/```[\s\S]*$/m, "").trim();
  return JSON.parse(raw);
}

function pickOptions(correct: string, pool: string[], count = 4): string[] {
  const unique = [...new Set([correct, ...pool.filter((v) => v !== correct)])];
  return unique.slice(0, count);
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function splitSentences(body: string): string[] {
  const numbered = body.split(/(?=\d+\.\s)/).map((s) => s.trim()).filter(Boolean);
  if (numbered.length > 1) return numbered;
  const byPeriod = body.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 15);
  return byPeriod.length > 0 ? byPeriod : [body];
}

function findSentenceIndex(sentences: string[], answer: string): number {
  const normAnswer = answer.toLowerCase().replace(/\s+/g, " ").trim();
  let best = 0;
  let bestScore = -1;
  sentences.forEach((sentence, index) => {
    const norm = sentence.toLowerCase().replace(/\s+/g, " ");
    if (norm.includes(normAnswer.slice(0, Math.min(60, normAnswer.length)))) {
      bestScore = 1000;
      best = index;
      return;
    }
    const words = normAnswer.split(/\s+/).filter((w) => w.length > 4);
    const score = words.filter((w) => norm.includes(w)).length;
    if (score > bestScore) {
      bestScore = score;
      best = index;
    }
  });
  return best;
}

function convertTextSelection(items: RtlItem[], answerPool: string[]) {
  return items.map((item) => {
    const body = String(item.body);
    const answer = String(item.answer);
    const sentences = splitSentences(body);
    return {
      id: nextId("text-highlight"),
      type: "text-highlight",
      topicId: THEME_TO_TOPIC[String(item.theme)] ?? "44-fz",
      difficulty: Number(item.level) || 2,
      title: "Выделение фрагмента закона",
      instruction: String(item.question),
      content: {
        type: "text-highlight",
        text: "",
        sentences,
        correctSentenceIndex: findSentenceIndex(sentences, answer),
      },
      source: SOURCE_BY_TOPIC[THEME_TO_TOPIC[String(item.theme)] ?? "44-fz"],
      timeLimit: 150,
    };
  });
}

function convertFillSpace(items: RtlItem[], answerPool: string[], title: string) {
  return items.map((item) => {
    const body = String(item.body);
    const answer = String(item.answer);
    const template = body.replace(/\[SPACE\]/g, "___");
    return {
      id: nextId("fill-blanks"),
      type: "fill-blanks",
      topicId: THEME_TO_TOPIC[String(item.theme)] ?? "44-fz",
      difficulty: Number(item.level) || 2,
      title,
      instruction: String(item.question ?? "Заполните пропуск в тексте"),
      content: {
        type: "fill-blanks",
        template,
        blanks: [
          {
            id: "b1",
            correctAnswer: answer,
            options: pickOptions(answer, answerPool),
          },
        ],
      },
      source: SOURCE_BY_TOPIC[THEME_TO_TOPIC[String(item.theme)] ?? "44-fz"],
      timeLimit: 120,
    };
  });
}

function convertCorrectOrder(items: RtlItem[]) {
  return items.map((item) => {
    const body = item.body as string[];
    const answer = item.answer as string[];
    const steps = body.map((label, i) => ({ id: `s${i}`, label }));
    const labelToId = Object.fromEntries(steps.map((s) => [s.label, s.id]));
    return {
      id: nextId("step-sorting"),
      type: "step-sorting",
      topicId: THEME_TO_TOPIC[String(item.theme)] ?? "44-fz",
      difficulty: Number(item.level) || 2,
      title: "Правильная последовательность",
      instruction: String(item.question),
      content: {
        type: "step-sorting",
        steps: shuffle(steps),
        correctOrder: answer.map((label) => labelToId[label]).filter(Boolean),
      },
      source: SOURCE_BY_TOPIC[THEME_TO_TOPIC[String(item.theme)] ?? "44-fz"],
      timeLimit: 180,
    };
  });
}

function swapDistribution(body: string[]): string[] {
  const customer = body[0]?.replace(/^Обязанности заказчика:\s*/i, "") ?? "";
  const supplier = body[1]?.replace(/^Обязанности (поставщика|победителя|исполнителя|подрядчика)[^:]*:\s*/i, "") ?? "";
  const customerItems = customer.split(";").map((s) => s.trim()).filter(Boolean);
  const supplierItems = supplier.split(";").map((s) => s.trim()).filter(Boolean);
  if (customerItems.length > 1 && supplierItems.length > 0) {
    const moved = customerItems.pop()!;
    supplierItems.unshift(moved);
    return [
      `Обязанности заказчика: ${customerItems.join("; ")}.`,
      `Обязанности исполнителя: ${supplierItems.join("; ")}.`,
    ];
  }
  return body.map((line) => `${line} (ошибочный вариант)`);
}

function convertDistribution(items: RtlItem[]) {
  return items.map((item) => {
    const body = item.body as string[];
    const correctLabel = body.join("\n\n");
    const wrongVariants = [
      swapDistribution(body),
      [body[1], body[0]],
      body.map((line) => line.replace(/заказчик/gi, "аудитор")),
    ].map((variant) => variant.join("\n\n"));

    const options = shuffle([
      { id: "a", label: correctLabel },
      ...wrongVariants.slice(0, 3).map((label, i) => ({ id: `w${i}`, label })),
    ]);
    const correctOptionId = options.find((o) => o.label === correctLabel)?.id ?? "a";

    return {
      id: nextId("fas-case"),
      type: "fas-case",
      topicId: THEME_TO_TOPIC[String(item.theme)] ?? "44-fz",
      difficulty: Number(item.level) || 2,
      title: "Распределение обязанностей",
      instruction: String(item.question),
      content: {
        type: "fas-case",
        scenario: "Определите правильное распределение обязанностей между сторонами.",
        question: "Выберите верный вариант распределения:",
        options,
        correctOptionId,
      },
      source: SOURCE_BY_TOPIC[THEME_TO_TOPIC[String(item.theme)] ?? "44-fz"],
      timeLimit: 180,
    };
  });
}

function convertArticleSearch(items: RtlItem[]) {
  return items.map((item) => {
    const article = Number(item.answer);
    const candidates = [...new Set([article, article - 1, article + 1, article + 2, article - 2, article + 5])]
      .filter((n) => n > 0)
      .slice(0, 4);
    const options = shuffle(candidates.map((n) => ({ id: `art-${n}`, label: `Статья ${n}` })));
    return {
      id: nextId("article-search"),
      type: "article-search",
      topicId: "44-fz",
      difficulty: Number(item.level) || 2,
      title: "Номер статьи 44-ФЗ",
      instruction: String(item.question),
      content: {
        type: "article-search",
        question: String(item.question),
        options,
        correctOptionId: `art-${article}`,
      },
      source: SOURCE_BY_TOPIC["44-fz"],
      timeLimit: 120,
    };
  });
}

function convertFragmentsSelection(items: RtlItem[]) {
  return items.map((item) => {
    const blocks = item.blocks as string[];
    const answers = item.answer as string[];
    const segments = blocks.map((text, i) => ({
      id: `seg-${i}`,
      text: i < blocks.length - 1 ? `${text} ` : text,
    }));
    const correctSegmentIds = blocks
      .map((block, i) => (answers.includes(block) ? `seg-${i}` : null))
      .filter(Boolean);

    return {
      id: nextId("highlight-errors"),
      type: "highlight-errors",
      topicId: "methodology",
      difficulty: Number(item.level) || 2,
      title: "Найдите ошибочный фрагмент",
      instruction: String(item.question),
      content: {
        type: "highlight-errors",
        intro: String(item.body).replace(/\[[^\]]+\]/g, "").trim(),
        paragraphs: [{ segments }],
        correctSegmentIds,
      },
      source: SOURCE_BY_TOPIC.methodology,
      timeLimit: 150,
    };
  });
}

function convertCalculation(items: RtlItem[], title: string) {
  return items.map((item) => {
    const answer = String(item.answer);
    const numeric = Number(answer.replace(/\s/g, "").replace(",", "."));
    const hasDecimal = answer.includes(".") || answer.includes(",");
    return {
      id: nextId("nmck-calculation"),
      type: "nmck-calculation",
      topicId: "methodology",
      difficulty: Number(item.level) || 2,
      title,
      instruction: String(item.question ?? "Выполните расчёт и введите числовой ответ"),
      content: {
        type: "nmck-calculation",
        caseDescription: String(item.body ?? item.question),
        items: [],
        correctAnswer: numeric,
        tolerance: hasDecimal ? 0.5 : 0,
      },
      source: SOURCE_BY_TOPIC.methodology,
      timeLimit: 240,
    };
  });
}

function convertDefinition(items: RtlItem[], answerPool: string[]) {
  return items.map((item) => {
    const answer = String(item.answer);
    const link = item.link ? String(item.link) : undefined;
    return {
      id: nextId("fill-blanks"),
      type: "fill-blanks",
      topicId: "methodology",
      difficulty: Number(item.level) || 2,
      title: "Определение термина",
      instruction: "Определите термин или понятие по описанию",
      content: {
        type: "fill-blanks",
        template: `${String(item.body)} Термин: ___`,
        blanks: [
          {
            id: "b1",
            correctAnswer: answer,
            options: pickOptions(answer, answerPool),
          },
        ],
      },
      source: { law: "Методичка", article: link, label: "Рабочая тетрадь / Методичка Росэлторг" },
      timeLimit: 120,
    };
  });
}

function main() {
  const fzFill = loadJson(join(RTL67, "fz-44", "fill_space.json"));
  const wbFill = loadJson(join(RTL67, "workbook", "fill_space.json"));
  const definitions = loadJson(join(RTL67, "workbook", "definition.json"));

  const fillPool = [...fzFill, ...wbFill].map((i) => String(i.answer));
  const definitionPool = definitions.map((i) => String(i.answer));

  const tasks = [
    ...convertTextSelection(loadJson(join(RTL67, "fz-44", "text_selection.json")), []),
    ...convertFillSpace(fzFill, fillPool, "Заполните пропуск (44-ФЗ)"),
    ...convertCorrectOrder(loadJson(join(RTL67, "fz-44", "correct_order.json"))),
    ...convertDistribution(loadJson(join(RTL67, "fz-44", "distribution.json"))),
    ...convertArticleSearch(loadJson(join(RTL67, "fz-44", "number_of_state.json"))),
    ...convertFragmentsSelection(loadJson(join(RTL67, "workbook", "fragments_selection.json"))),
    ...convertCalculation(loadJson(join(RTL67, "workbook", "penalty.json")), "Расчёт неустойки"),
    ...convertDefinition(definitions, definitionPool),
    ...convertFillSpace(wbFill, fillPool, "Заполните пропуск (рабочая тетрадь)"),
    ...convertCalculation(loadJson(join(RTL67, "workbook", "NMCK.json")), "Расчёт НМЦК"),
  ];

  const frontendJson = join(ROOT, "src", "data", "mock", "tasks.json");
  const backendJson = join(ROOT, "backend", "src", "data", "tasks.json");

  writeFileSync(frontendJson, JSON.stringify(tasks, null, 2), "utf-8");
  writeFileSync(backendJson, JSON.stringify(tasks, null, 2), "utf-8");

  const counts: Record<string, number> = {};
  for (const task of tasks) {
    const topicId = (task as { topicId: string }).topicId;
    counts[topicId] = (counts[topicId] ?? 0) + 1;
  }

  console.log(`Imported ${tasks.length} tasks`);
  console.log("By topic:", counts);
}

main();
