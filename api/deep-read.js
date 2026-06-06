const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_OPENAI_MODEL = "gpt-5.2";

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

export default async function handler(request, response) {
  const corsHeaders = getCorsHeaders();
  setHeaders(response, corsHeaders);

  if (!isAllowedOrigin(request)) {
    return sendJson(response, 403, { error: "Origin is not allowed for this API endpoint." });
  }

  if (request.method === "OPTIONS") {
    response.statusCode = 204;
    return response.end();
  }

  if (request.method === "GET") {
    return sendJson(response, 200, {
      ok: true,
      service: "ljsdoctor-deep-read",
      openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
      model: getOpenAIModel()
    });
  }

  if (request.method !== "POST") {
    return sendJson(response, 405, { error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return sendJson(response, 500, { error: "OPENAI_API_KEY is not configured on the server." });
  }

  try {
    const body = await readJsonBody(request);
    const paper = normalizePaper(body);
    const providerResponse = await callOpenAI(paper);
    return sendJson(response, 200, providerResponse);
  } catch (error) {
    return sendJson(response, error.statusCode || 500, {
      error: error.message || "Deep-reading request failed."
    });
  }
}

function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8"
  };
}

function isAllowedOrigin(request) {
  if (!process.env.ALLOWED_ORIGIN) {
    return true;
  }
  const origin = getHeader(request, "origin");
  return !origin || origin === process.env.ALLOWED_ORIGIN;
}

async function readJsonBody(request) {
  const raw = await readRawBody(request);
  if (raw.length > 24000) {
    const error = new Error("Request is too large. Use a shorter abstract or selected excerpt.");
    error.statusCode = 413;
    throw error;
  }

  try {
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    error.statusCode = 400;
    error.message = "Request body must be valid JSON.";
    throw error;
  }
}

async function readRawBody(request) {
  if (typeof request.body === "string") {
    return request.body;
  }

  if (request.body && typeof request.body === "object" && !isReadableStream(request.body)) {
    return JSON.stringify(request.body);
  }

  var chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

function isReadableStream(body) {
  return body && typeof body.on === "function" && typeof body.pipe === "function";
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
      model: getOpenAIModel(),
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
    model: data.model || getOpenAIModel(),
    result: JSON.parse(text)
  };
}

function getOpenAIModel() {
  return process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;
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

function getHeader(request, name) {
  if (!request.headers) {
    return "";
  }
  if (typeof request.headers.get === "function") {
    return request.headers.get(name);
  }
  return request.headers[name] || request.headers[name.toLowerCase()] || "";
}

function setHeaders(response, headers) {
  Object.keys(headers).forEach(function (name) {
    response.setHeader(name, headers[name]);
  });
}

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.end(JSON.stringify(payload));
}
