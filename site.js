(function () {
  function setupFilter() {
    var input = document.querySelector("[data-filter-input]");
    var list = document.querySelector("[data-filter-list]");

    if (!input || !list) {
      return;
    }

    var items = Array.prototype.slice.call(list.querySelectorAll("a"));

    input.addEventListener("input", function () {
      var query = input.value.trim().toLowerCase();

      items.forEach(function (item) {
        var text = item.textContent.toLowerCase();
        item.hidden = query.length > 0 && text.indexOf(query) === -1;
      });
    });
  }

  function setupResearchGraph() {
    var root = document.querySelector("[data-research-graph]");
    if (!root) {
      return;
    }

    var board = root.querySelector("[data-graph-board]");
    var details = root.querySelector("[data-graph-details]");
    var search = root.querySelector("[data-graph-search]");
    var type = root.querySelector("[data-graph-type]");
    var graph = { nodes: [], edges: [] };

    function visibleNodes() {
      var query = search ? search.value.trim().toLowerCase() : "";
      var selectedType = type ? type.value : "";

      return graph.nodes.filter(function (node) {
        var text = JSON.stringify(node).toLowerCase();
        var typeOk = !selectedType || node.type === selectedType;
        var queryOk = !query || text.indexOf(query) !== -1;
        return typeOk && queryOk;
      });
    }

    function renderBoard() {
      var nodes = visibleNodes();
      board.innerHTML = "";

      if (!nodes.length) {
        board.innerHTML = "<p class='empty-state'>No graph nodes match this filter.</p>";
        return;
      }

      nodes.forEach(function (node) {
        var card = document.createElement("button");
        card.type = "button";
        card.className = "graph-node";
        card.innerHTML =
          "<span>" + escapeHtml(node.type) + "</span>" +
          "<strong>" + escapeHtml(node.title) + "</strong>" +
          "<em>" + escapeHtml((node.tags || []).join(", ")) + "</em>";
        card.addEventListener("click", function () {
          renderDetails(node);
        });
        board.appendChild(card);
      });
    }

    function renderDetails(node) {
      var connections = graph.edges.filter(function (edge) {
        return edge.source === node.id || edge.target === node.id;
      });

      var connectedHtml = connections.map(function (edge) {
        var otherId = edge.source === node.id ? edge.target : edge.source;
        var other = graph.nodes.find(function (candidate) {
          return candidate.id === otherId;
        });
        return "<li><strong>" + escapeHtml(edge.label) + ":</strong> " +
          escapeHtml(other ? other.title : otherId) + "</li>";
      }).join("");

      details.innerHTML =
        "<article class='tool-card'>" +
        "<p class='project-type'>" + escapeHtml(node.type) + "</p>" +
        "<h2>" + escapeHtml(node.title) + "</h2>" +
        "<p>" + escapeHtml(node.description || "") + "</p>" +
        "<p><strong>Tags:</strong> " + escapeHtml((node.tags || []).join(", ")) + "</p>" +
        "<p><a href='../" + escapeHtml(node.url) + "'>Open source page</a></p>" +
        "<h3>Connections</h3>" +
        (connectedHtml ? "<ul>" + connectedHtml + "</ul>" : "<p>No connections yet.</p>") +
        "</article>";
    }

    if (search) {
      search.addEventListener("input", renderBoard);
    }
    if (type) {
      type.addEventListener("change", renderBoard);
    }

    fetch("../data/research/graph.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("graph data unavailable");
        }
        return response.json();
      })
      .then(function (data) {
        graph = {
          nodes: Array.isArray(data.nodes) ? data.nodes : [],
          edges: Array.isArray(data.edges) ? data.edges : []
        };
        renderBoard();
        if (graph.nodes[0]) {
          renderDetails(graph.nodes[0]);
        }
      })
      .catch(function () {
        board.innerHTML = "<p class='empty-state'>Graph data could not be loaded.</p>";
      });
  }

  function readStore(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (error) {
      return [];
    }
  }

  function writeStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function setupApp(config) {
    var root = document.querySelector("[data-app='" + config.key + "']");
    if (!root) {
      return;
    }

    var form = root.querySelector("[data-form]");
    var list = root.querySelector("[data-list]");
    var search = root.querySelector("[data-search]");
    var exportButton = root.querySelector("[data-export]");
    var importInput = root.querySelector("[data-import]");
    var clearButton = root.querySelector("[data-clear]");
    var storeKey = "ljsdoctor:" + config.key;
    var seedItems = [];

    function getFilteredItems() {
      var query = search ? search.value.trim().toLowerCase() : "";
      var localItems = readStore(storeKey).map(function (item) {
        item.source = item.source || "browser-local";
        return item;
      });

      return seedItems.concat(localItems).filter(function (item) {
        return query.length === 0 || JSON.stringify(item).toLowerCase().indexOf(query) !== -1;
      });
    }

    function render() {
      var items = getFilteredItems();
      list.innerHTML = "";

      if (items.length === 0) {
        var empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = config.empty;
        list.appendChild(empty);
        return;
      }

      items.forEach(function (item) {
        var card = document.createElement("article");
        card.className = "tool-card";
        card.innerHTML = config.render(item);

        if (item.source !== "repository-seed") {
          var remove = document.createElement("button");
          remove.type = "button";
          remove.className = "text-button";
          remove.textContent = "Delete local record";
          remove.addEventListener("click", function () {
            var next = readStore(storeKey).filter(function (candidate) {
              return candidate.id !== item.id;
            });
            writeStore(storeKey, next);
            render();
          });
          card.appendChild(remove);
        }

        list.appendChild(card);
      });
    }

    function loadSeedData() {
      if (!config.seed) {
        render();
        return;
      }

      fetch(config.seed)
        .then(function (response) {
          if (!response.ok) {
            return [];
          }
          return response.json();
        })
        .then(function (items) {
          seedItems = Array.isArray(items) ? items : [];
          render();
        })
        .catch(function () {
          seedItems = [];
          render();
        });
    }

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();

        var data = {};
        Array.prototype.slice.call(form.elements).forEach(function (field) {
          if (!field.name) {
            return;
          }
          data[field.name] = field.value.trim();
        });

        data.id = "local-" + Date.now() + "-" + Math.random().toString(16).slice(2);
        data.source = "browser-local";
        data.createdAt = new Date().toISOString().slice(0, 10);

        var items = readStore(storeKey);
        items.unshift(data);
        writeStore(storeKey, items);
        form.reset();
        render();
      });
    }

    if (search) {
      search.addEventListener("input", render);
    }

    if (exportButton) {
      exportButton.addEventListener("click", function () {
        var blob = new Blob([JSON.stringify(readStore(storeKey), null, 2)], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        link.download = config.key + "-export.json";
        link.click();
        URL.revokeObjectURL(url);
      });
    }

    if (importInput) {
      importInput.addEventListener("change", function () {
        var file = importInput.files && importInput.files[0];
        if (!file) {
          return;
        }

        var reader = new FileReader();
        reader.addEventListener("load", function () {
          try {
            var imported = JSON.parse(reader.result);
            if (!Array.isArray(imported)) {
              window.alert("Import file must be a JSON array.");
              return;
            }

            var existing = readStore(storeKey);
            imported.forEach(function (item) {
              item.source = "browser-local";
              item.id = item.id || "imported-" + Date.now() + "-" + Math.random().toString(16).slice(2);
              item.createdAt = item.createdAt || new Date().toISOString().slice(0, 10);
              existing.unshift(item);
            });

            writeStore(storeKey, existing);
            importInput.value = "";
            render();
          } catch (error) {
            window.alert("Could not read this JSON file.");
          }
        });
        reader.readAsText(file);
      });
    }

    if (clearButton) {
      clearButton.addEventListener("click", function () {
        if (window.confirm("Clear local records for this module?")) {
          writeStore(storeKey, []);
          render();
        }
      });
    }

    if (config.key === "literature") {
      setupPubMed(root, storeKey, render);
    }

    loadSeedData();
  }

  function setupPubMed(root, storeKey, render) {
    var form = root.querySelector("[data-pubmed-form]");
    var queryInput = root.querySelector("[data-pubmed-query]");
    var results = root.querySelector("[data-pubmed-results]");
    var preview = root.querySelector("[data-query-preview]");
    var highRelevance = root.querySelector("[data-high-relevance]");
    var lastPapers = [];
    var lastCriteria = {};

    if (!form || !queryInput || !results) {
      return;
    }

    function updatePreview() {
      if (preview) {
        preview.textContent = buildPubMedQuery(root) || "Waiting for input...";
      }
    }

    Array.prototype.slice.call(root.querySelectorAll("[data-pubmed-field], [data-pubmed-query]")).forEach(function (field) {
      field.addEventListener("input", updatePreview);
      field.addEventListener("change", updatePreview);
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var query = buildPubMedQuery(root);

      if (!query) {
        results.innerHTML = "<p class='empty-state'>Add at least one search term.</p>";
        return;
      }

      results.innerHTML = "<p class='empty-state'>Connecting to PubMed...</p>";
      lastCriteria = getSearchCriteria(root);

      searchPubMed(query)
        .then(function (papers) {
          lastPapers = papers.map(function (paper) {
            paper.screening = scorePaper(paper, lastCriteria);
            return paper;
          }).sort(function (a, b) {
            return b.screening.score - a.screening.score;
          });
          renderPubMedResults(filterPapers(lastPapers, highRelevance), results, storeKey, render);
        })
        .catch(function () {
          results.innerHTML = "<p class='empty-state'>PubMed is not reachable right now. Try again later or use a more specific English query.</p>";
        });
    });

    if (highRelevance) {
      highRelevance.addEventListener("change", function () {
        renderPubMedResults(filterPapers(lastPapers, highRelevance), results, storeKey, render);
      });
    }

    setupDeepReading(root);
    updatePreview();
  }

  function getSearchCriteria(root) {
    return {
      population: getPubMedField(root, "population"),
      intervention: getPubMedField(root, "intervention"),
      outcome: getPubMedField(root, "outcome"),
      extra: (root.querySelector("[data-pubmed-query]") || {}).value || "",
      type: getPubMedField(root, "type"),
      fromYear: getPubMedField(root, "fromYear"),
      toYear: getPubMedField(root, "toYear")
    };
  }

  function filterPapers(papers, highRelevance) {
    if (!highRelevance || !highRelevance.checked) {
      return papers;
    }
    return papers.filter(function (paper) {
      return paper.screening && paper.screening.score >= 55;
    });
  }

  function getPubMedField(root, name) {
    var field = root.querySelector("[data-pubmed-field='" + name + "']");
    return field ? field.value.trim() : "";
  }

  function buildPubMedQuery(root) {
    var population = getPubMedField(root, "population");
    var intervention = getPubMedField(root, "intervention");
    var outcome = getPubMedField(root, "outcome");
    var type = getPubMedField(root, "type");
    var fromYear = getPubMedField(root, "fromYear");
    var toYear = getPubMedField(root, "toYear");
    var scope = getPubMedField(root, "scope") || "title abstract";
    var extraField = root.querySelector("[data-pubmed-query]");
    var extra = extraField ? extraField.value.trim() : "";
    var parts = [];

    function scoped(term) {
      if (!term) {
        return "";
      }
      if (/^\d{6,}$/.test(term)) {
        return term + "[PMID]";
      }
      if (scope === "mesh") {
        return "(" + term + "[MeSH Terms] OR " + term + "[Title/Abstract])";
      }
      if (scope === "all fields") {
        return term + "[All Fields]";
      }
      return term + "[Title/Abstract]";
    }

    [population, intervention, outcome, extra].forEach(function (term) {
      var built = scoped(term);
      if (built) {
        parts.push(built);
      }
    });

    if (type) {
      parts.push(type + "[Publication Type]");
    }

    if (fromYear || toYear) {
      parts.push("(" + (fromYear || "1900") + ":" + (toYear || "3000") + "[Date - Publication])");
    }

    return parts.join(" AND ");
  }

  function searchPubMed(query) {
    var base = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";
    var common = "&tool=ljsdoctor_research_site&email=288302595%2BL-js-doctor%40users.noreply.github.com";
    var searchUrl = base + "esearch.fcgi?db=pubmed&retmode=json&retmax=8&sort=relevance&term=" + encodeURIComponent(query) + common;

    return fetch(searchUrl)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("PubMed search failed");
        }
        return response.json();
      })
      .then(function (searchData) {
        var ids = searchData.esearchresult && searchData.esearchresult.idlist;
        if (!ids || ids.length === 0) {
          return [];
        }

        var summaryUrl = base + "esummary.fcgi?db=pubmed&retmode=json&id=" + ids.join(",") + common;
        return fetch(summaryUrl);
      })
      .then(function (response) {
        if (Array.isArray(response)) {
          return response;
        }
        if (!response.ok) {
          throw new Error("PubMed summary failed");
        }
        return response.json();
      })
      .then(function (summaryData) {
        if (Array.isArray(summaryData)) {
          return summaryData;
        }

        var result = summaryData.result || {};
        var uids = result.uids || [];
        return uids.map(function (uid) {
          var item = result[uid] || {};
          return {
            pmid: uid,
            title: item.title || "Untitled PubMed record",
            journal: item.fulljournalname || item.source || "",
            year: extractYear(item.pubdate || item.epubdate || ""),
            pubdate: item.pubdate || item.epubdate || "",
            authors: formatAuthors(item.authors || []),
            pubtypes: Array.isArray(item.pubtype) ? item.pubtype.join(", ") : "",
            url: "https://pubmed.ncbi.nlm.nih.gov/" + uid + "/"
          };
        });
      });
  }

  function scorePaper(paper, criteria) {
    var score = 20;
    var reasons = [];
    var title = (paper.title || "").toLowerCase();
    var year = Number(paper.year || 0);
    var pubtypes = (paper.pubtypes || "").toLowerCase();

    [
      ["population", criteria.population],
      ["mechanism/intervention", criteria.intervention],
      ["outcome/focus", criteria.outcome],
      ["extra term", criteria.extra]
    ].forEach(function (entry) {
      var label = entry[0];
      var value = entry[1];
      if (!value) {
        return;
      }
      var tokens = value.toLowerCase().split(/[,\s]+/).filter(function (token) {
        return token.length >= 4 && !/^\d+$/.test(token);
      });
      var matched = tokens.filter(function (token) {
        return title.indexOf(token) !== -1;
      });
      if (matched.length > 0) {
        score += Math.min(25, matched.length * 10);
        reasons.push("title matches " + label + ": " + matched.slice(0, 3).join(", "));
      }
    });

    if (criteria.type && pubtypes.indexOf(criteria.type.toLowerCase()) !== -1) {
      score += 18;
      reasons.push("publication type matches " + criteria.type);
    }

    if (criteria.fromYear && year >= Number(criteria.fromYear)) {
      score += 7;
      reasons.push("within lower year limit");
    }

    if (criteria.toYear && year <= Number(criteria.toYear)) {
      score += 7;
      reasons.push("within upper year limit");
    }

    if (paper.journal) {
      score += 5;
      reasons.push("journal metadata available");
    }

    if (!reasons.length) {
      reasons.push("PubMed relevance ranking only; inspect manually");
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      reasons: reasons
    };
  }

  function renderPubMedResults(papers, target, storeKey, render) {
    target.innerHTML = "";

    if (!papers.length) {
      target.innerHTML = "<p class='empty-state'>No PubMed results found. Try a more specific English query.</p>";
      return;
    }

    papers.forEach(function (paper) {
      var card = document.createElement("article");
      card.className = "tool-card";
      card.innerHTML =
        "<p class='project-type'>PMID " + escapeHtml(paper.pmid) + "</p>" +
        "<h3>" + escapeHtml(paper.title) + "</h3>" +
        "<p><strong>Local relevance:</strong> " + escapeHtml((paper.screening && paper.screening.score) || 0) + "/100</p>" +
        "<p><strong>Why:</strong> " + escapeHtml(((paper.screening && paper.screening.reasons) || []).join("; ")) + "</p>" +
        "<p><strong>Journal:</strong> " + escapeHtml(paper.journal || "Not provided") + "</p>" +
        "<p><strong>Date:</strong> " + escapeHtml(paper.pubdate || paper.year || "Not provided") + "</p>" +
        "<p><strong>Type:</strong> " + escapeHtml(paper.pubtypes || "Not provided") + "</p>" +
        "<p><strong>Authors:</strong> " + escapeHtml(paper.authors || "Not provided") + "</p>" +
        "<p><a href='" + escapeHtml(paper.url) + "'>Open PubMed page</a></p>";

      var save = document.createElement("button");
      save.type = "button";
      save.className = "button secondary";
      save.textContent = "Save to literature library";
      save.addEventListener("click", function () {
        var items = readStore(storeKey);
        items.unshift({
          id: "pubmed-" + paper.pmid + "-" + Date.now(),
          title: paper.title,
          year: paper.year,
          question: "PubMed imported record. Add the research question after reading.",
          finding: paper.journal + (paper.pubdate ? " - " + paper.pubdate : ""),
          next: paper.url,
          pmid: paper.pmid,
          authors: paper.authors,
          pubtypes: paper.pubtypes,
          relevanceScore: paper.screening && paper.screening.score,
          relevanceReasons: paper.screening && paper.screening.reasons,
          source: "browser-local",
          createdAt: new Date().toISOString().slice(0, 10)
        });
        writeStore(storeKey, items);
        render();
        save.textContent = "Saved";
        save.disabled = true;
      });

      card.appendChild(save);

      var brief = document.createElement("button");
      brief.type = "button";
      brief.className = "button secondary";
      brief.textContent = "Use for deep reading";
      brief.addEventListener("click", function () {
        fillDeepReadingForm(paper);
        var targetSection = document.querySelector("[data-deep-reading]");
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });

      card.appendChild(brief);
      target.appendChild(card);
    });
  }

  function fillDeepReadingForm(paper) {
    var form = document.querySelector("[data-reading-form]");
    if (!form) {
      return;
    }
    if (form.elements.id) {
      form.elements.id.value = paper.pmid || "";
    }
    if (form.elements.title) {
      form.elements.title.value = paper.title || "";
    }
    if (form.elements.abstract) {
      form.elements.abstract.value = [
        paper.journal ? "Journal: " + paper.journal : "",
        paper.pubdate ? "Date: " + paper.pubdate : "",
        paper.authors ? "Authors: " + paper.authors : "",
        paper.url ? "URL: " + paper.url : ""
      ].filter(Boolean).join("\n");
    }
  }

  function setupDeepReading(root) {
    var form = root.querySelector("[data-reading-form]");
    var output = root.querySelector("[data-reading-output]");
    var copyButton = root.querySelector("[data-copy-reading]");

    if (!form || !output) {
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var fields = {};
      Array.prototype.slice.call(form.elements).forEach(function (field) {
        if (field.name) {
          fields[field.name] = field.value.trim();
        }
      });
      output.value = buildReadingBrief(fields);
    });

    if (copyButton) {
      copyButton.addEventListener("click", function () {
        output.select();
        document.execCommand("copy");
        copyButton.textContent = "Copied";
        window.setTimeout(function () {
          copyButton.textContent = "Copy brief";
        }, 1200);
      });
    }
  }

  function buildReadingBrief(fields) {
    return [
      "Please perform a deep reading of this paper and create an HTML-ready literature note.",
      "",
      "Reading mode: " + (fields.mode || "research"),
      "Identifier: " + (fields.id || "not provided"),
      "Title: " + (fields.title || "not provided"),
      "",
      "Abstract or key details:",
      fields.abstract || "not provided",
      "",
      "My reading goal:",
      fields.goal || "not provided",
      "",
      "Required output:",
      "1. One-paragraph high-signal summary.",
      "2. Research question and why it matters.",
      "3. Study type, methods, population/model, and evidence level.",
      "4. Main findings with mechanisms and limitations.",
      "5. Important terms and confusing comparisons.",
      "6. How this connects to pathology/medicine learning.",
      "7. Follow-up papers or search terms.",
      "8. A compact HTML note that can be saved into the research ecosystem."
    ].join("\n");
  }

  function setupReadingDesk() {
    var root = document.querySelector("[data-reading-desk]");
    if (!root) {
      return;
    }

    var form = root.querySelector("[data-reading-desk-form]");
    var outputs = {};

    Array.prototype.slice.call(root.querySelectorAll("[data-desk-output]")).forEach(function (field) {
      outputs[field.getAttribute("data-desk-output")] = field;
    });

    function writeOutputs() {
      var fields = readNamedFields(form);
      var packageData = buildReadingPackage(fields);

      outputs.codex.value = packageData.codex;
      outputs.json.value = packageData.json;
      outputs.issue.value = packageData.issue;
      outputs.html.value = packageData.html;
    }

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        writeOutputs();
      });

      form.addEventListener("input", function () {
        if (form.elements.title && form.elements.title.value.trim()) {
          writeOutputs();
        }
      });
      form.addEventListener("change", function () {
        if (form.elements.title && form.elements.title.value.trim()) {
          writeOutputs();
        }
      });
    }

    Array.prototype.slice.call(root.querySelectorAll("[data-copy-target]")).forEach(function (button) {
      button.addEventListener("click", function () {
        var target = outputs[button.getAttribute("data-copy-target")];
        if (!target) {
          return;
        }
        target.select();
        document.execCommand("copy");
        button.textContent = "Copied";
        window.setTimeout(function () {
          button.textContent = "Copy";
        }, 1200);
      });
    });
  }

  function readNamedFields(form) {
    var fields = {};
    Array.prototype.slice.call(form.elements).forEach(function (field) {
      if (field.name) {
        fields[field.name] = field.value.trim();
      }
    });
    return fields;
  }

  function slugify(value) {
    return String(value || "untitled-paper")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 72) || "untitled-paper";
  }

  function buildReadingPackage(fields) {
    var identifier = fields.pmid ? "pmid-" + fields.pmid : slugify(fields.title);
    var page = identifier + ".html";
    var title = fields.title || "Untitled paper";
    var question = fields.question || "Not specified yet.";
    var abstract = fields.abstract || "Not provided yet.";
    var decision = fields.decision || "Keep only if it changes the research question, mechanism map, method choice, or follow-up search.";
    var jsonRecord = {
      id: identifier,
      pmid: fields.pmid || "",
      doi: fields.doi || "",
      title: title,
      year: fields.year || "",
      journal: fields.journal || "",
      category: fields.category || "Mechanism",
      question: question,
      finding: "Deep-reading record prepared; complete after Codex review.",
      next: page,
      source: "repository-seed",
      createdAt: new Date().toISOString().slice(0, 10)
    };

    var codex = [
      "Please deep-read this paper and turn it into a repository-backed literature note.",
      "",
      "Mode: " + (fields.mode || "Research-question deep reading"),
      "Identifier: " + (fields.pmid || fields.doi || "not provided"),
      "Title: " + title,
      "Journal/year: " + [fields.journal, fields.year].filter(Boolean).join(", "),
      "DOI: " + (fields.doi || "not provided"),
      "",
      "Research question:",
      question,
      "",
      "Decision rule:",
      decision,
      "",
      "Abstract or PubMed summary:",
      abstract,
      "",
      "Required output:",
      "1. One-paragraph high-signal summary.",
      "2. Why this paper matters to the active research question.",
      "3. Study type, methods, models/population, and evidence level.",
      "4. Key findings, mechanism chain, and limitations.",
      "5. Terms to add to the knowledge map.",
      "6. Follow-up PubMed query and 3-5 papers to inspect next.",
      "7. Final HTML note for research-ecosystem/literature/" + page + "."
    ].join("\n");

    var issue = [
      "Title: Deep-read " + title,
      "",
      "## Paper",
      "- PMID: " + (fields.pmid || "not provided"),
      "- DOI: " + (fields.doi || "not provided"),
      "- Journal/year: " + ([fields.journal, fields.year].filter(Boolean).join(", ") || "not provided"),
      "- Category: " + (fields.category || "Mechanism"),
      "",
      "## Reading goal",
      question,
      "",
      "## Decision rule",
      decision,
      "",
      "## Expected repository changes",
      "- Add or update data/research/literature.json",
      "- Add research-ecosystem/literature/" + page,
      "- Link relevant knowledge-map and graph nodes if the paper is useful"
    ].join("\n");

    var html = [
      "<!doctype html>",
      "<html lang=\"en\">",
      "  <head>",
      "    <meta charset=\"utf-8\">",
      "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
      "    <title>" + escapeHtml(title) + "</title>",
      "    <link rel=\"stylesheet\" href=\"../../styles.css\">",
      "  </head>",
      "  <body class=\"subpage\">",
      "    <main class=\"page-shell note-page literature-note\">",
      "      <a class=\"back-link\" href=\"./\">Back to Literature Lab</a>",
      "      <p class=\"section-kicker\">Literature Note</p>",
      "      <h1>" + escapeHtml(title) + "</h1>",
      "      <dl class=\"metadata-grid\">",
      "        <div><dt>PMID</dt><dd>" + escapeHtml(fields.pmid || "Not provided") + "</dd></div>",
      "        <div><dt>DOI</dt><dd>" + escapeHtml(fields.doi || "Not provided") + "</dd></div>",
      "        <div><dt>Journal</dt><dd>" + escapeHtml(fields.journal || "Not provided") + "</dd></div>",
      "        <div><dt>Year</dt><dd>" + escapeHtml(fields.year || "Not provided") + "</dd></div>",
      "      </dl>",
      "      <section class=\"note-block\"><h2>Research Question</h2><p>" + escapeHtml(question) + "</p></section>",
      "      <section class=\"note-block\"><h2>High-Signal Summary</h2><p>Complete after deep reading.</p></section>",
      "      <section class=\"note-block\"><h2>Evidence and Methods</h2><p>Complete after deep reading.</p></section>",
      "      <section class=\"note-block\"><h2>Mechanism Map Links</h2><p>Complete after deep reading.</p></section>",
      "      <section class=\"note-block\"><h2>Limitations and Next Search</h2><p>Complete after deep reading.</p></section>",
      "    </main>",
      "  </body>",
      "</html>"
    ].join("\n");

    return {
      codex: codex,
      json: JSON.stringify(jsonRecord, null, 2),
      issue: issue,
      html: html
    };
  }

  function extractYear(value) {
    var match = String(value).match(/\d{4}/);
    return match ? match[0] : "";
  }

  function formatAuthors(authors) {
    return authors.slice(0, 4).map(function (author) {
      return author.name;
    }).filter(Boolean).join(", ");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  setupFilter();
  setupResearchGraph();
  setupReadingDesk();

  setupApp({
    key: "literature",
    seed: "../../data/research/literature.json",
    empty: "No literature records yet. Add a paper or import PubMed results.",
    render: function (item) {
      return "<p class='project-type'>" + escapeHtml(item.year || item.pmid || "Paper") + "</p>" +
        "<h3>" + escapeHtml(item.title || "Untitled literature record") + "</h3>" +
        "<p><strong>Research question:</strong> " + escapeHtml(item.question || "Not filled") + "</p>" +
        "<p><strong>Main finding:</strong> " + escapeHtml(item.finding || "Not filled") + "</p>" +
        "<p><strong>Next step:</strong> " + linkIfUrl(item.next || "Not filled") + "</p>";
    }
  });

  setupApp({
    key: "knowledge",
    seed: "../../data/research/knowledge.json",
    empty: "No knowledge nodes yet. Add a concept and search it later.",
    render: function (item) {
      return "<p class='project-type'>" + escapeHtml(item.system || "Concept") + "</p>" +
        "<h3>" + escapeHtml(item.concept || "Untitled concept") + "</h3>" +
        "<p><strong>Mechanism:</strong> " + escapeHtml(item.mechanism || "Not filled") + "</p>" +
        "<p><strong>Related disease:</strong> " + escapeHtml(item.disease || "Not filled") + "</p>" +
        "<p><strong>Comparison:</strong> " + escapeHtml(item.compare || "Not filled") + "</p>";
    }
  });

  setupApp({
    key: "notebook",
    seed: "../../data/research/notebook.json",
    empty: "No notebook entries yet. Add today's learning log.",
    render: function (item) {
      return "<p class='project-type'>" + escapeHtml(item.date || item.createdAt || "Log") + "</p>" +
        "<h3>" + escapeHtml(item.topic || "Untitled log") + "</h3>" +
        "<p><strong>Done:</strong> " + escapeHtml(item.done || "Not filled") + "</p>" +
        "<p><strong>Problem:</strong> " + escapeHtml(item.problem || "Not filled") + "</p>" +
        "<p><strong>Next step:</strong> " + escapeHtml(item.next || "Not filled") + "</p>";
    }
  });

  setupApp({
    key: "dataTools",
    seed: "../../data/research/data-tools.json",
    empty: "No data or tool records yet. Add a table, script, or analysis tool.",
    render: function (item) {
      return "<p class='project-type'>" + escapeHtml(item.kind || "Tool") + "</p>" +
        "<h3>" + escapeHtml(item.name || "Untitled tool") + "</h3>" +
        "<p><strong>Input:</strong> " + escapeHtml(item.input || "Not filled") + "</p>" +
        "<p><strong>Output:</strong> " + escapeHtml(item.output || "Not filled") + "</p>" +
        "<p><strong>Method:</strong> " + escapeHtml(item.method || "Not filled") + "</p>";
    }
  });

  setupApp({
    key: "publication",
    seed: "../../data/research/publication.json",
    empty: "No publication records yet. Add an abstract, poster, review, or project page.",
    render: function (item) {
      return "<p class='project-type'>" + escapeHtml(item.status || "Draft") + "</p>" +
        "<h3>" + escapeHtml(item.title || "Untitled output") + "</h3>" +
        "<p><strong>Audience:</strong> " + escapeHtml(item.audience || "Not filled") + "</p>" +
        "<p><strong>Core message:</strong> " + escapeHtml(item.message || "Not filled") + "</p>" +
        "<p><strong>Next step:</strong> " + escapeHtml(item.next || "Not filled") + "</p>";
    }
  });

  function linkIfUrl(value) {
    var text = String(value);
    if (/^https?:\/\//.test(text)) {
      return "<a href='" + escapeHtml(text) + "'>" + escapeHtml(text) + "</a>";
    }
    return escapeHtml(text);
  }
})();
