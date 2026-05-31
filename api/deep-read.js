const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

const LANGUAGE_NAMES = {
  zh: "Chinese",
  en: "English",
  ja: "Japanese",
  ru: "Russian",
  de: "German"
};

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    introduction: { type: "string" },
    hypothesis: { type: "string" },
    design: { type: "string" },
    methods: { type: "string" },
    results: { type: "string" },
    mechanism: { type: "string" },
    limitations: { type: "string" },
    followup: {
      type: "array",
      items: { type: "string" }
    },
    html: { type: "string" }
  },
  required: [
    "summary",
    "introduction",
    "hypothesis",
    "design",
    "methods",
    "results",
    "mechanism",
    "limitations",
    "followup",
    "html"
  ]
};

module.exports = async function handler(request, response) {
  setCors(response);

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (request.method === "GET") {
    response.status(200).json({
      ok: true,
      service: "ljsdoctor-deep-read",
      openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
      model: process.env.OPENAI_MODEL || "gpt-5.4"
    });
    return;
  }

  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    response.status(500).json({
      error: "OPENAI_API_KEY is not configured on the server."
    });
    return;
  }

  try {
    const body = await readJsonBody(request);
    const paper = normalizePaper(body);
    const providerResponse = await callOpenAI(paper);
    response.status(200).json(providerResponse);
  } catch (error) {
    response.status(error.statusCode || 500).json({
      error: error.message || "Deep-reading request failed."
    });
  }
};

function setCors(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let raw = "";
    request.on("data", chunk => {
      raw += chunk;
      if (raw.length > 24000) {
        const error = new Error("Request is too large. Use a shorter abstract or selected excerpt.");
        error.statusCode = 413;
        reject(error);
      }
    });
    request.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        error.statusCode = 400;
        error.message = "Request body must be valid JSON.";
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function normalizePaper(body) {
  const paper = {
    id: String(body.id || "").trim().slice(0, 120),
    title: String(body.title || "").trim().slice(0, 600),
    abstract: String(body.abstract || "").trim().slice(0, 12000),
    goal: String(body.goal || "").trim().slice(0, 1200),
    mode: String(body.mode || "research").trim().slice(0, 80),
    language: LANGUAGE_NAMES[body.language] || LANGUAGE_NAMES.zh
  };

  if (!paper.title && !paper.abstract) {
    const error = new Error("Provide at least a paper title or abstract.");
    error.statusCode = 400;
    throw error;
  }

  return paper;
}

async function callOpenAI(paper) {
  const prompt = [
    "You are helping a medical student and early researcher perform a rigorous literature deep read.",
    "Output language: " + paper.language + ".",
    "Keep important biomedical terms in English when useful.",
    "Extract experimental design, methods, results, mechanism, limitations, and follow-up search terms.",
    "",
    "Paper ID: " + (paper.id || "not provided"),
    "Title: " + (paper.title || "not provided"),
    "Reading mode: " + paper.mode,
    "Reading goal: " + (paper.goal || "not provided"),
    "",
    "Abstract or details:",
    paper.abstract || "not provided"
  ].join("\n");

  const apiResponse = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.OPENAI_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5.4",
      input: prompt,
      text: {
        format: {
          type: "json_schema",
          name: "literature_deep_read",
          schema: RESPONSE_SCHEMA,
          strict: true
        }
      }
    })
  });

  const data = await apiResponse.json();
  if (!apiResponse.ok) {
    const error = new Error(data.error && data.error.message ? data.error.message : "OpenAI request failed.");
    error.statusCode = apiResponse.status;
    throw error;
  }

  const text = extractResponseText(data);
  if (!text) {
    const error = new Error("OpenAI returned no readable text.");
    error.statusCode = 502;
    throw error;
  }

  return {
    provider: "openai",
    model: data.model || process.env.OPENAI_MODEL || "gpt-5.4",
    result: JSON.parse(text)
  };
}

function extractResponseText(data) {
  if (typeof data.output_text === "string") {
    return data.output_text;
  }

  const output = Array.isArray(data.output) ? data.output : [];
  for (const item of output) {
    const content = Array.isArray(item.content) ? item.content : [];
    for (const part of content) {
      if (typeof part.text === "string") {
        return part.text;
      }
    }
  }

  return "";
}
