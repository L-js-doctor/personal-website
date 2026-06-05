(function () {
  var LANGUAGE_PACKS = {
    zh: {
      label: "ZH",
      navAbout: "About",
      navLibrary: "Library",
      navResearch: "Research",
      navWorkflow: "Workflow",
      navContact: "Contact",
      heroCopy: "Your personal medical learning and research workspace. Medical notes, coding practice, PubMed search, deep-reading templates, exports, and project archives all live behind practical entrances.",
      enterLibrary: "Enter library",
      viewRepo: "View repository",
      aboutTitle: "A practical desk for study, research, and long-term notes.",
      aboutCopy: "This site is meant to store real work: course notes, pathology summaries, literature deep reads, coding practice, and project records. New material can become HTML, JSON, or downloadable files and then be linked from the right section.",
      libraryTitle: "Resource entrances",
      medicalTitle: "Medical learning",
      medicalCopy: "Pathology, basic medicine, course review material, and HTML study packs.",
      medicalOpen: "Open medical resources",
      codingTitle: "Technical practice",
      codingCopy: "Programming practice, web experiments, automation scripts, and coding notes.",
      codingOpen: "Open technical resources",
      archiveTitle: "Project archive",
      archiveCopy: "Personal website work, test repositories, portfolio pages, and future projects.",
      archiveOpen: "Open project archive",
      researchTitle: "A research ecosystem that grows over time.",
      researchCopy: "Literature reading, medical knowledge maps, research logs, data tools, and publication outputs connect inside one site.",
      researchOpen: "Enter research hub",
      workflowTitle: "How this site works with GitHub",
      workflowOneTitle: "Organize",
      workflowOneCopy: "You send notes, PDFs, slides, or ideas; I turn them into clear HTML pages.",
      workflowTwoTitle: "File",
      workflowTwoCopy: "Medical content goes to medical-learning, code to coding-practice, and research work to research-ecosystem.",
      workflowThreeTitle: "Link",
      workflowThreeCopy: "I update the directory pages so you can find everything from the website.",
      contactTitle: "Keep growing this into your long-term archive.",
      visitSite: "Visit site",
      githubHome: "GitHub profile"
    },
    en: {
      label: "EN",
      navAbout: "About",
      navLibrary: "Library",
      navResearch: "Research",
      navWorkflow: "Workflow",
      navContact: "Contact",
      heroCopy: "Your personal medical learning and research workspace. Medical notes, coding practice, PubMed search, deep-reading templates, exports, and project archives all live behind practical entrances.",
      enterLibrary: "Enter library",
      viewRepo: "View repository",
      aboutTitle: "A practical desk for study, research, and long-term notes.",
      aboutCopy: "This site is meant to store real work: course notes, pathology summaries, literature deep reads, coding practice, and project records. New material can become HTML, JSON, or downloadable files and then be linked from the right section.",
      libraryTitle: "Resource entrances",
      medicalTitle: "Medical learning",
      medicalCopy: "Pathology, basic medicine, course review material, and HTML study packs.",
      medicalOpen: "Open medical resources",
      codingTitle: "Technical practice",
      codingCopy: "Programming practice, web experiments, automation scripts, and coding notes.",
      codingOpen: "Open technical resources",
      archiveTitle: "Project archive",
      archiveCopy: "Personal website work, test repositories, portfolio pages, and future projects.",
      archiveOpen: "Open project archive",
      researchTitle: "A research ecosystem that grows over time.",
      researchCopy: "Literature reading, medical knowledge maps, research logs, data tools, and publication outputs connect inside one site.",
      researchOpen: "Enter research hub",
      workflowTitle: "How this site works with GitHub",
      workflowOneTitle: "Organize",
      workflowOneCopy: "You send notes, PDFs, slides, or ideas; I turn them into clear HTML pages.",
      workflowTwoTitle: "File",
      workflowTwoCopy: "Medical content goes to medical-learning, code to coding-practice, and research work to research-ecosystem.",
      workflowThreeTitle: "Link",
      workflowThreeCopy: "I update the directory pages so you can find everything from the website.",
      contactTitle: "Keep growing this into your long-term archive.",
      visitSite: "Visit site",
      githubHome: "GitHub profile"
    },
    ja: null,
    ru: null,
    de: null
  };

  LANGUAGE_PACKS.ja = Object.assign({}, LANGUAGE_PACKS.en, {
    label: "JA",
    navAbout: "Overview",
    navLibrary: "Resources",
    navResearch: "Research",
    navWorkflow: "Workflow",
    navContact: "Contact",
    heroCopy: "Medical learning, PubMed search, literature reading, coding practice, and project records in one practical workspace. Deep-reading outputs can be prepared for Japanese translation.",
    enterLibrary: "Open resources",
    aboutTitle: "A focused workspace for learning and research.",
    researchOpen: "Open research hub"
  });

  LANGUAGE_PACKS.ru = Object.assign({}, LANGUAGE_PACKS.en, {
    label: "RU",
    navAbout: "Overview",
    navLibrary: "Resources",
    navResearch: "Research",
    navWorkflow: "Workflow",
    navContact: "Contact",
    heroCopy: "Medical learning, PubMed search, literature reading, coding practice, and project records in one practical workspace. Deep-reading outputs can be prepared for Russian translation.",
    enterLibrary: "Open resources",
    aboutTitle: "A focused workspace for learning and research.",
    researchOpen: "Open research hub"
  });

  LANGUAGE_PACKS.de = Object.assign({}, LANGUAGE_PACKS.en, {
    label: "DE",
    navAbout: "About",
    navLibrary: "Resources",
    navResearch: "Research",
    navWorkflow: "Workflow",
    navContact: "Contact",
    heroCopy: "Medical learning, PubMed search, literature reading, coding practice, and project records in one practical workspace. Deep-reading outputs can be prepared for German translation.",
    enterLibrary: "Open resources",
    aboutTitle: "A focused workspace for learning and research.",
    researchOpen: "Open research hub"
  });
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

  function setupLanguageSwitcher() {
    if (document.querySelector("[data-language-switcher]")) {
      return;
    }

    var saved = localStorage.getItem("ljsdoctor:language") || "zh";
    var switcher = document.createElement("div");
    switcher.className = "language-switcher";
    switcher.setAttribute("data-language-switcher", "");
    switcher.innerHTML =
      "<span>UI</span>" +
      ["zh", "en", "ja", "ru", "de"].map(function (code) {
        return "<button type='button' data-language-option='" + code + "'>" + LANGUAGE_PACKS[code].label + "</button>";
      }).join("");
    document.body.appendChild(switcher);

    switcher.addEventListener("click", function (event) {
      var button = event.target.closest("[data-language-option]");
      if (!button) {
        return;
      }
      applyLanguage(button.getAttribute("data-language-option"));
    });

    applyLanguage(saved);
  }

  function applyLanguage(code) {
    var pack = LANGUAGE_PACKS[code] || LANGUAGE_PACKS.zh;
    localStorage.setItem("ljsdoctor:language", code);
    document.documentElement.lang = code === "zh" ? "zh-CN" : code;
    Array.prototype.slice.call(document.querySelectorAll("[data-i18n]")).forEach(function (node) {
      var key = node.getAttribute("data-i18n");
      if (pack[key]) {
        node.textContent = pack[key];
      }
    });
    Array.prototype.slice.call(document.querySelectorAll("[data-language-option]")).forEach(function (button) {
      button.classList.toggle("active", button.getAttribute("data-language-option") === code);
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
    var exportHtmlButton = root.querySelector("[data-export-html]");
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
        downloadTextFile(config.key + "-visible-records.json", JSON.stringify(getFilteredItems(), null, 2), "application/json");
      });
    }

    if (exportHtmlButton) {
      exportHtmlButton.addEventListener("click", function () {
        downloadTextFile(config.key + "-visible-records.html", buildRecordsHtmlExport(config.key, getFilteredItems()), "text/html");
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
    var status = root.querySelector("[data-pubmed-status]");
    var lastPapers = [];
    var lastCriteria = {};
    var lastSearchMeta = {};

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
      triggerPet("literature_search_start");

      searchPubMed(query, lastCriteria)
        .then(function (payload) {
          lastSearchMeta = payload.meta || {};
          lastPapers = payload.papers.map(function (paper) {
            paper.screening = scorePaper(paper, lastCriteria);
            return paper;
          });
          if (lastCriteria.sort !== "pub_date") {
            lastPapers.sort(function (a, b) {
              return b.screening.score - a.screening.score;
            });
          }
          renderPubMedStatus(status, lastSearchMeta, lastPapers.length);
          renderPubMedResults(filterPapers(lastPapers, highRelevance), results, storeKey, render);
          triggerPet("literature_search_done");
        })
        .catch(function () {
          results.innerHTML = "<p class='empty-state'>PubMed is not reachable right now. Try again later or use a more specific English query.</p>";
          triggerPet("task_error");
        });
    });

    if (highRelevance) {
      highRelevance.addEventListener("change", function () {
        renderPubMedStatus(status, lastSearchMeta, filterPapers(lastPapers, highRelevance).length);
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
      toYear: getPubMedField(root, "toYear"),
      retmax: getPubMedField(root, "retmax") || "8",
      retstart: getPubMedField(root, "retstart") || "0",
      sort: getPubMedField(root, "sort") || "relevance"
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

  function searchPubMed(query, criteria) {
    var base = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";
    var common = "&tool=ljsdoctor_research_site&email=288302595%2BL-js-doctor%40users.noreply.github.com";
    var retmax = Math.max(1, Math.min(50, Number(criteria.retmax || 8)));
    var retstart = Math.max(0, Number(criteria.retstart || 0));
    var sort = criteria.sort || "relevance";
    var searchUrl = base + "esearch.fcgi?db=pubmed&retmode=json&retmax=" + retmax +
      "&retstart=" + retstart + "&sort=" + encodeURIComponent(sort) +
      "&term=" + encodeURIComponent(query) + common;
    var meta = {
      retmax: retmax,
      retstart: retstart,
      sort: sort,
      count: 0
    };

    return fetch(searchUrl)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("PubMed search failed");
        }
        return response.json();
      })
      .then(function (searchData) {
        var searchResult = searchData.esearchresult || {};
        var ids = searchResult.idlist;
        meta.count = Number(searchResult.count || 0);
        if (!ids || ids.length === 0) {
          return { papers: [], meta: meta };
        }

        var summaryUrl = base + "esummary.fcgi?db=pubmed&retmode=json&id=" + ids.join(",") + common;
        return fetch(summaryUrl).then(function (response) {
          return { response: response, meta: meta };
        });
      })
      .then(function (payload) {
        if (payload.papers) {
          return payload;
        }
        var response = payload.response;
        if (!response.ok) {
          throw new Error("PubMed summary failed");
        }
        return response.json().then(function (summaryData) {
          return { summaryData: summaryData, meta: payload.meta };
        });
      })
      .then(function (payload) {
        if (payload.papers) {
          return payload;
        }

        var result = payload.summaryData.result || {};
        var uids = result.uids || [];
        return {
          meta: payload.meta,
          papers: uids.map(function (uid) {
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
          })
        };
      });
  }

  function renderPubMedStatus(target, meta, shown) {
    if (!target || !meta) {
      return;
    }
    var start = Number(meta.retstart || 0) + 1;
    var end = Number(meta.retstart || 0) + Number(shown || 0);
    var total = Number(meta.count || 0);
    if (!total) {
      target.textContent = "No PubMed records found for this query.";
      return;
    }
    target.textContent = "PubMed matched " + total + " records. Showing " + start + "-" + end +
      ". To page forward, set Start at result to " + (Number(meta.retstart || 0) + Number(meta.retmax || 8)) + ".";
  }

  function fetchPubMedAbstract(pmid) {
    var base = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";
    var common = "&tool=ljsdoctor_research_site&email=288302595%2BL-js-doctor%40users.noreply.github.com";
    var url = base + "efetch.fcgi?db=pubmed&retmode=xml&id=" + encodeURIComponent(pmid) + common;

    return fetch(url)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("PubMed abstract fetch failed");
        }
        return response.text();
      })
      .then(function (xmlText) {
        var doc = new DOMParser().parseFromString(xmlText, "application/xml");
        var parts = Array.prototype.slice.call(doc.querySelectorAll("AbstractText")).map(function (node) {
          var label = node.getAttribute("Label");
          var text = node.textContent.trim();
          return label ? label + ": " + text : text;
        }).filter(Boolean);
        return parts.join("\n\n") || "No abstract was returned by PubMed for this record.";
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
        "<p><a href='" + escapeHtml(paper.url) + "'>Open PubMed page</a></p>" +
        "<div class='abstract-preview' data-abstract-preview>Abstract not loaded yet.</div>";

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

      var queueButton = document.createElement("button");
      queueButton.type = "button";
      queueButton.className = "button secondary";
      queueButton.textContent = "Add to deep-reading queue";
      queueButton.addEventListener("click", function () {
        addToReadingQueue(paper);
        queueButton.textContent = "Added to queue";
        queueButton.disabled = true;
      });

      card.appendChild(queueButton);

      var abstractButton = document.createElement("button");
      abstractButton.type = "button";
      abstractButton.className = "button secondary";
      abstractButton.textContent = "Fetch abstract";
      abstractButton.addEventListener("click", function () {
        var abstractBox = card.querySelector("[data-abstract-preview]");
        abstractButton.textContent = "Fetching...";
        abstractButton.disabled = true;
        fetchPubMedAbstract(paper.pmid)
          .then(function (abstractText) {
            paper.abstract = abstractText;
            if (abstractBox) {
              abstractBox.textContent = abstractText;
            }
            abstractButton.textContent = "Abstract loaded";
          })
          .catch(function () {
            if (abstractBox) {
              abstractBox.textContent = "PubMed did not return an abstract for this record or the request failed.";
            }
            abstractButton.textContent = "Try abstract again";
            abstractButton.disabled = false;
          });
      });

      card.appendChild(abstractButton);
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
        paper.abstract ? "Abstract: " + paper.abstract : "",
        paper.url ? "URL: " + paper.url : ""
      ].filter(Boolean).join("\n");
    }
    if (form.elements.goal && !form.elements.goal.value) {
      form.elements.goal.value = "Identify the research question, experimental design, key evidence, mechanism, limitations, and how this paper should update the research ecosystem.";
    }
    if (form.elements.introduction && !form.elements.introduction.value) {
      form.elements.introduction.value = "To be completed from the introduction/background after reading.";
    }
    if (form.elements.hypothesis && !form.elements.hypothesis.value) {
      form.elements.hypothesis.value = "To be completed: exact research question or hypothesis.";
    }
    if (form.elements.design && !form.elements.design.value) {
      form.elements.design.value = "To be completed: study type, groups, controls, model/population, intervention/comparison, endpoints.";
    }
    if (form.elements.methods && !form.elements.methods.value) {
      form.elements.methods.value = "To be completed: assays, data sources, statistical methods, and measurements.";
    }
    if (form.elements.results && !form.elements.results.value) {
      form.elements.results.value = "To be completed: main figures/results and evidence strength.";
    }
    if (form.elements.mechanism && !form.elements.mechanism.value) {
      form.elements.mechanism.value = "To be completed: mechanism chain and interpretation.";
    }
    if (form.elements.limitations && !form.elements.limitations.value) {
      form.elements.limitations.value = "To be completed: major limitations and uncertainty.";
    }
    if (form.elements.followup && !form.elements.followup.value) {
      form.elements.followup.value = "To be completed: next papers, search terms, graph nodes, and project updates.";
    }
  }

  function setupDeepReading(root) {
    var form = root.querySelector("[data-reading-form]");
    var output = root.querySelector("[data-reading-output]");
    var copyButton = root.querySelector("[data-copy-reading]");
    var downloadButton = root.querySelector("[data-download-reading]");
    var manualAiPromptButton = root.querySelector("[data-manual-ai-prompt]");
    var aiButton = root.querySelector("[data-ai-deep-read]");
    var aiStatus = root.querySelector("[data-ai-deep-read-status]");
    var aiEndpointForm = root.querySelector("[data-ai-endpoint-form]");
    var aiEndpointTest = root.querySelector("[data-ai-endpoint-test]");
    var aiEndpointReset = root.querySelector("[data-ai-endpoint-reset]");
    var queueList = root.querySelector("[data-reading-queue]");
    var exportQueueButton = root.querySelector("[data-export-reading-queue]");
    var pdfUploadInput = root.querySelector("[data-pdf-upload]");
    var pdfDropZone = root.querySelector("[data-pdf-drop-zone]");
    var pdfUploadStatus = root.querySelector("[data-pdf-upload-status]");
    var pdfFileName = root.querySelector("[data-pdf-file-name]");

    if (!form || !output) {
      return;
    }

    setupPdfUploadBinding(pdfUploadInput, pdfDropZone, pdfUploadStatus, pdfFileName);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var fields = {};
      Array.prototype.slice.call(form.elements).forEach(function (field) {
        if (field.name) {
          fields[field.name] = field.value.trim();
        }
      });
      output.value = buildReadingArtifact(fields);
    });

    if (aiButton) {
      aiButton.addEventListener("click", function () {
        var fields = readNamedFields(form);
        requestAiDeepRead(fields, output, aiStatus, aiButton);
      });
    }

    if (manualAiPromptButton) {
      manualAiPromptButton.addEventListener("click", function () {
        var fields = readNamedFields(form);
        triggerPet("ai_output_start");
        output.value = buildManualAiPrompt(fields);
        writeStatus(aiStatus, "Manual AI prompt generated. Copy it into ChatGPT/Codex, then paste the answer back into your notes.");
        triggerPet("ai_output_done");
      });
    }

    setupAiEndpointControls(aiEndpointForm, aiEndpointReset, aiEndpointTest, aiStatus);

    if (copyButton) {
      copyButton.addEventListener("click", function () {
        output.select();
        document.execCommand("copy");
        copyButton.textContent = "Copied";
        window.setTimeout(function () {
          copyButton.textContent = "Copy artifact";
        }, 1200);
      });
    }

    if (downloadButton) {
      downloadButton.addEventListener("click", function () {
        var content = output.value.trim();
        if (!content) {
          return;
        }
        var artifact = form.elements.artifact ? form.elements.artifact.value : "codex";
        var title = form.elements.title ? form.elements.title.value : "literature-note";
        var extension = artifact === "html" ? "html" : artifact === "json" ? "json" : artifact === "matrix" ? "md" : "txt";
        var mime = artifact === "html" ? "text/html" : artifact === "json" ? "application/json" : "text/plain";
        downloadTextFile(slugify(title || "literature-note") + "-" + artifact + "." + extension, content, mime);
      });
    }

    function renderQueue() {
      if (!queueList) {
        return;
      }
      var queue = readStore("ljsdoctor:deepReadingQueue");
      queueList.innerHTML = "";
      if (!queue.length) {
        queueList.innerHTML = "<p class='empty-state'>No papers in the deep-reading queue yet. Use PubMed search results to add papers.</p>";
        return;
      }
      queue.forEach(function (paper) {
        var card = document.createElement("article");
        card.className = "queue-paper-card";
        card.innerHTML =
          "<p class='project-type'>PMID " + escapeHtml(paper.pmid || "Pending") + "</p>" +
          "<h4>" + escapeHtml(paper.title || "Untitled paper") + "</h4>" +
          "<p>" + escapeHtml([paper.journal, paper.pubdate || paper.year].filter(Boolean).join(" - ") || "Metadata pending") + "</p>";

        var use = document.createElement("button");
        use.type = "button";
        use.className = "button secondary";
        use.textContent = "Use in matrix";
        use.addEventListener("click", function () {
          fillDeepReadingForm(paper);
          form.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        var remove = document.createElement("button");
        remove.type = "button";
        remove.className = "text-button";
        remove.textContent = "Remove from queue";
        remove.addEventListener("click", function () {
          var next = readStore("ljsdoctor:deepReadingQueue").filter(function (item) {
            return item.queueId !== paper.queueId;
          });
          writeStore("ljsdoctor:deepReadingQueue", next);
          renderQueue();
        });

        card.appendChild(use);
        card.appendChild(remove);
        queueList.appendChild(card);
      });
    }

    if (exportQueueButton) {
      exportQueueButton.addEventListener("click", function () {
        var blob = new Blob([JSON.stringify(readStore("ljsdoctor:deepReadingQueue"), null, 2)], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        link.download = "deep-reading-queue-export.json";
        link.click();
        URL.revokeObjectURL(url);
      });
    }

    renderQueue();
    window.addEventListener("deep-reading-queue-updated", renderQueue);
  }

  function setupPdfUploadBinding(input, dropZone, status, fileName) {
    if (!input && !dropZone) {
      return;
    }

    function setPdfStatus(message) {
      if (status) {
        status.textContent = message;
      }
    }

    function setPdfFileName(message) {
      if (fileName) {
        fileName.textContent = message;
      }
    }

    function markUploadStart() {
      triggerPet("pdf_upload_start");
      setPdfStatus("Receiving PDF...");
    }

    function handlePdfFile(file) {
      if (!file) {
        setPdfStatus("No PDF selected.");
        return;
      }

      var isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
      if (!isPdf) {
        setPdfFileName("No PDF selected");
        setPdfStatus("Please choose a PDF file.");
        triggerPet("task_error");
        return;
      }

      setPdfFileName(file.name);
      setPdfStatus("PDF received locally: " + file.name + ". Ready for deep-reading workflow.");
      try {
        localStorage.setItem("ljsdoctor:lastPdfUpload", JSON.stringify({
          name: file.name,
          size: file.size,
          type: file.type || "application/pdf",
          receivedAt: new Date().toISOString()
        }));
      } catch (error) {
        // Local storage is optional; the selected PDF should still count as received.
      }
      triggerPet("pdf_upload_done");
    }

    if (input) {
      input.addEventListener("click", markUploadStart);
      input.addEventListener("change", function () {
        handlePdfFile(input.files && input.files[0]);
      });
    }

    if (dropZone) {
      dropZone.addEventListener("dragenter", function (event) {
        event.preventDefault();
        dropZone.classList.add("is-dragging");
        markUploadStart();
      });
      dropZone.addEventListener("dragover", function (event) {
        event.preventDefault();
        dropZone.classList.add("is-dragging");
      });
      dropZone.addEventListener("dragleave", function () {
        dropZone.classList.remove("is-dragging");
      });
      dropZone.addEventListener("drop", function (event) {
        event.preventDefault();
        dropZone.classList.remove("is-dragging");
        markUploadStart();
        handlePdfFile(event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]);
      });
    }
  }

  function requestAiDeepRead(fields, output, status, button) {
    var endpoint = getAiEndpoint();
    if (!fields.title && !fields.abstract) {
      writeStatus(status, "Add a paper title or abstract before requesting AI deep reading.");
      return;
    }

    button.disabled = true;
    writeStatus(status, "Sending selected paper details to the protected AI endpoint...");
    triggerPet("ai_reading_start");

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: fields.id,
        title: fields.title,
        abstract: fields.abstract,
        goal: fields.goal,
        mode: fields.mode,
        language: fields.language
      })
    })
      .then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok) {
            throw new Error(data.error || "AI deep-reading request failed.");
          }
          return data;
        });
      })
      .then(function (data) {
        triggerPet("ai_output_start");
        output.value = formatAiDeepReadResult(data);
        writeStatus(status, "AI deep-reading result received. You can copy or download it now.");
        triggerPet("ai_output_done");
      })
      .catch(function (error) {
        output.value = buildReadingArtifact(fields);
        writeStatus(status, "AI endpoint is not connected yet: " + error.message + " The page generated the local artifact instead.");
        triggerPet("task_error");
      })
      .finally(function () {
        button.disabled = false;
      });
  }

  function buildManualAiPrompt(fields) {
    var language = getReadingLanguage(fields.language || "zh");
    return [
      "You are helping me perform a beginner-friendly but rigorous medical literature deep read.",
      "Output language: " + language.label + ". Keep key biomedical terms in English when useful.",
      "",
      "Paper ID / DOI / PMID:",
      fields.id || "not provided",
      "",
      "Paper title:",
      fields.title || "not provided",
      "",
      "Abstract or copied PubMed details:",
      fields.abstract || "not provided",
      "",
      "My reading goal:",
      fields.goal || "not provided",
      "",
      "Please produce the following sections:",
      "1. One-sentence take-home message.",
      "2. Background and why the study matters.",
      "3. Research question or hypothesis.",
      "4. Experimental design: groups, controls, samples, model, intervention, comparison, endpoints.",
      "5. Methods explained for a beginner.",
      "6. Main results and what each result proves.",
      "7. Mechanism chain and pathology/clinical meaning.",
      "8. Limitations and possible bias.",
      "9. Terms I should learn before reading the full text.",
      "10. Follow-up PubMed search terms and 3-5 next papers to inspect.",
      "11. A compact HTML note skeleton I can save into my website."
    ].join("\n");
  }

  function getAiEndpoint() {
    if (window.LJS_DEEP_READ_ENDPOINT) {
      return window.LJS_DEEP_READ_ENDPOINT;
    }
    var saved = localStorage.getItem("ljsdoctor:deepReadEndpoint");
    if (saved) {
      return saved;
    }
    return "/api/deep-read";
  }

  function isGitHubPagesSite() {
    return window.location.hostname === "l-js-doctor.github.io";
  }

  function setupAiEndpointControls(form, resetButton, testButton, status) {
    if (form && form.elements.endpoint) {
      form.elements.endpoint.value = localStorage.getItem("ljsdoctor:deepReadEndpoint") || "";
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var endpoint = form.elements.endpoint.value.trim();
        if (!endpoint) {
          localStorage.removeItem("ljsdoctor:deepReadEndpoint");
          writeStatus(status, isGitHubPagesSite()
            ? "Saved endpoint cleared. GitHub Pages cannot run /api/deep-read, so paste a Vercel endpoint before testing AI deep reading."
            : "Using same-site AI endpoint: /api/deep-read.");
          return;
        }
        if (!/^https:\/\/.+\/api\/deep-read$/.test(endpoint) && endpoint !== "/api/deep-read") {
          writeStatus(status, "Endpoint should look like https://your-vercel-project.vercel.app/api/deep-read.");
          return;
        }
        localStorage.setItem("ljsdoctor:deepReadEndpoint", endpoint);
        writeStatus(status, "AI endpoint saved for this browser: " + endpoint);
      });
    }

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        localStorage.removeItem("ljsdoctor:deepReadEndpoint");
        if (form && form.elements.endpoint) {
          form.elements.endpoint.value = "";
        }
        writeStatus(status, isGitHubPagesSite()
          ? "Saved endpoint cleared. GitHub Pages cannot run /api/deep-read, so paste a Vercel endpoint before testing AI deep reading."
          : "Using same-site AI endpoint: /api/deep-read.");
      });
    }

    if (testButton) {
      testButton.addEventListener("click", function () {
        var endpoint = form && form.elements.endpoint && form.elements.endpoint.value.trim()
          ? form.elements.endpoint.value.trim()
          : getAiEndpoint();
        if (isGitHubPagesSite() && endpoint === "/api/deep-read") {
          writeStatus(status, "This site is running on GitHub Pages, which cannot host /api/deep-read. Paste the Vercel endpoint first, then test again.");
          return;
        }
        testButton.disabled = true;
        writeStatus(status, "Testing AI endpoint...");
        fetch(endpoint, { method: "GET" })
          .then(function (response) {
            return response.json().then(function (data) {
              if (!response.ok) {
                throw new Error(data.error || "Endpoint test failed.");
              }
              return data;
            });
          })
          .then(function (data) {
            var keyState = data.openaiConfigured ? "OPENAI_API_KEY is configured" : "OPENAI_API_KEY is missing";
            writeStatus(status, "Endpoint online: " + (data.service || endpoint) + ". " + keyState + ". Model: " + (data.model || "unknown") + ".");
          })
          .catch(function (error) {
            writeStatus(status, "Endpoint test failed: " + error.message);
          })
          .finally(function () {
            testButton.disabled = false;
          });
      });
    }
  }

  function writeStatus(node, message) {
    if (node) {
      node.textContent = message;
    }
  }

  function formatAiDeepReadResult(data) {
    var result = data.result || {};
    return [
      "# AI Literature Deep Read",
      "",
      "Provider: " + (data.provider || "unknown"),
      "Model: " + (data.model || "unknown"),
      "",
      "## High-Signal Summary",
      result.summary || "Not returned.",
      "",
      "## Introduction / Background",
      result.introduction || "Not returned.",
      "",
      "## Research Question / Hypothesis",
      result.hypothesis || "Not returned.",
      "",
      "## Experimental Design",
      result.design || "Not returned.",
      "",
      "## Methods / Measurements",
      result.methods || "Not returned.",
      "",
      "## Main Results",
      result.results || "Not returned.",
      "",
      "## Mechanism / Interpretation",
      result.mechanism || "Not returned.",
      "",
      "## Limitations",
      result.limitations || "Not returned.",
      "",
      "## Follow-up Actions",
      Array.isArray(result.followup) ? result.followup.map(function (item) { return "- " + item; }).join("\n") : "Not returned.",
      "",
      "## HTML Note",
      result.html || "Not returned."
    ].join("\n");
  }

  function buildReadingArtifact(fields) {
    if (fields.artifact === "matrix") {
      return buildReadingMatrixMarkdown(fields);
    }
    if (fields.artifact === "design") {
      return buildExperimentalDesignChecklist(fields);
    }
    if (fields.artifact === "json") {
      return JSON.stringify(buildReadingJsonRecord(fields), null, 2);
    }
    if (fields.artifact === "html") {
      return buildReadingHtmlSkeleton(fields);
    }
    return buildReadingBrief(fields);
  }

  function downloadTextFile(filename, content, mimeType) {
    var blob = new Blob([content], { type: mimeType || "text/plain" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function buildRecordsHtmlExport(title, items) {
    var rows = items.map(function (item) {
      var heading = item.title || item.concept || item.topic || item.name || "Untitled record";
      var meta = [item.year, item.pmid, item.journal, item.category, item.status].filter(Boolean).join(" - ");
      var body = item.question || item.finding || item.mechanism || item.done || item.output || item.message || JSON.stringify(item, null, 2);
      var next = item.next || item.followup || item.createdAt || "";
      return [
        "      <article class=\"record-card\">",
        "        <p class=\"meta\">" + escapeHtml(meta || item.source || "Record") + "</p>",
        "        <h2>" + escapeHtml(heading) + "</h2>",
        "        <p>" + escapeHtml(body || "No summary provided.") + "</p>",
        next ? "        <p><strong>Next:</strong> " + escapeHtml(next) + "</p>" : "",
        "      </article>"
      ].join("\n");
    }).join("\n");

    return [
      "<!doctype html>",
      "<html lang=\"en\">",
      "  <head>",
      "    <meta charset=\"utf-8\">",
      "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
      "    <title>" + escapeHtml(title) + " export</title>",
      "    <style>",
      "      body{margin:0;font-family:Arial,sans-serif;background:#f6f8fb;color:#17202a;line-height:1.6}",
      "      main{max-width:960px;margin:0 auto;padding:40px 20px}",
      "      h1{font-size:2rem;margin:0 0 12px}",
      "      .record-card{margin:16px 0;padding:18px;background:#fff;border:1px solid #d9e2ea;border-radius:8px}",
      "      .meta{color:#176b66;font-weight:700;font-size:.85rem}",
      "    </style>",
      "  </head>",
      "  <body>",
      "    <main>",
      "      <h1>" + escapeHtml(title) + " export</h1>",
      "      <p>Exported from L-js-doctor research site on " + new Date().toISOString().slice(0, 10) + ".</p>",
      rows || "      <p>No records matched this export.</p>",
      "    </main>",
      "  </body>",
      "</html>"
    ].join("\n");
  }

  function buildReadingBrief(fields) {
    var lang = getReadingLanguage(fields.language);
    return [
      lang.taskIntro,
      "",
      lang.outputLanguage + ": " + lang.name,
      lang.readingMode + ": " + (fields.mode || "research"),
      lang.identifier + ": " + (fields.id || lang.notProvided),
      lang.title + ": " + (fields.title || lang.notProvided),
      "",
      lang.abstract + ":",
      fields.abstract || lang.notProvided,
      "",
      lang.goal + ":",
      fields.goal || lang.notProvided,
      "",
      lang.matrix + ":",
      lang.introduction + ": " + (fields.introduction || lang.notFilled),
      lang.hypothesis + ": " + (fields.hypothesis || lang.notFilled),
      lang.design + ": " + (fields.design || lang.notFilled),
      lang.methods + ": " + (fields.methods || lang.notFilled),
      lang.results + ": " + (fields.results || lang.notFilled),
      lang.mechanism + ": " + (fields.mechanism || lang.notFilled),
      lang.limitations + ": " + (fields.limitations || lang.notFilled),
      lang.followup + ": " + (fields.followup || lang.notFilled),
      "",
      lang.requiredOutput + ":",
      lang.briefRules.join("\n")
    ].join("\n");
  }

  function buildReadingMatrixMarkdown(fields) {
    var lang = getReadingLanguage(fields.language);
    return [
      "# " + lang.matrix,
      "",
      "## " + lang.paper,
      "- " + lang.identifier + ": " + (fields.id || lang.notProvided),
      "- " + lang.title + ": " + (fields.title || lang.notProvided),
      "- " + lang.readingMode + ": " + (fields.mode || "research"),
      "- " + lang.outputLanguage + ": " + lang.name,
      "",
      "## 1. " + lang.introduction,
      fields.introduction || lang.defaultIntroduction,
      "",
      "## 2. " + lang.hypothesis,
      fields.hypothesis || fields.goal || lang.defaultHypothesis,
      "",
      "## 3. " + lang.design,
      fields.design || lang.defaultDesign,
      "",
      "## 4. " + lang.methods,
      fields.methods || lang.defaultMethods,
      "",
      "## 5. " + lang.results,
      fields.results || lang.defaultResults,
      "",
      "## 6. " + lang.mechanism,
      fields.mechanism || lang.defaultMechanism,
      "",
      "## 7. " + lang.limitations,
      fields.limitations || lang.defaultLimitations,
      "",
      "## 8. " + lang.followup,
      fields.followup || lang.defaultFollowup,
      "",
      "## " + lang.sourceDetails,
      fields.abstract || lang.noAbstract
    ].join("\n");
  }

  function buildExperimentalDesignChecklist(fields) {
    var lang = getReadingLanguage(fields.language);
    return [
      lang.designChecklist,
      "",
      lang.paper + ": " + (fields.title || lang.notProvided),
      lang.identifier + ": " + (fields.id || lang.notProvided),
      lang.outputLanguage + ": " + lang.name,
      "",
      lang.designChecklistItems.map(function (item) { return "[ ] " + item; }).join("\n"),
      "",
      lang.currentDesign + ":",
      fields.design || lang.notFilled,
      "",
      lang.currentMethods + ":",
      fields.methods || lang.notFilled,
      "",
      lang.currentLimitations + ":",
      fields.limitations || lang.notFilled
    ].join("\n");
  }

  function buildReadingJsonRecord(fields) {
    var identifier = fields.id || "unidentified-paper";
    return {
      id: "deep-reading-" + slugify(identifier + "-" + (fields.title || "paper")),
      identifier: identifier,
      title: fields.title || "",
      mode: fields.mode || "research",
      outputLanguage: fields.language || "zh",
      goal: fields.goal || "",
      introduction: fields.introduction || "",
      hypothesis: fields.hypothesis || "",
      experimentalDesign: fields.design || "",
      methods: fields.methods || "",
      results: fields.results || "",
      mechanism: fields.mechanism || "",
      limitations: fields.limitations || "",
      followup: fields.followup || "",
      abstractOrDetails: fields.abstract || "",
      status: "draft-deep-reading",
      createdAt: new Date().toISOString().slice(0, 10)
    };
  }

  function buildReadingHtmlSkeleton(fields) {
    var lang = getReadingLanguage(fields.language);
    var title = fields.title || "Untitled literature note";
    var identifier = fields.id || lang.notProvided;
    var summary = fields.goal || fields.abstract || lang.defaultSummary;
    return [
      "<!doctype html>",
      "<html lang=\"" + escapeHtml(lang.htmlLang) + "\">",
      "  <head>",
      "    <meta charset=\"utf-8\">",
      "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
      "    <title>" + escapeHtml(title) + "</title>",
      "    <link rel=\"stylesheet\" href=\"../../styles.css\">",
      "  </head>",
      "  <body class=\"subpage\">",
      "    <main class=\"page-shell note-page literature-note\">",
      "      <a class=\"back-link\" href=\"./\">" + escapeHtml(lang.backToLab) + "</a>",
      "      <p class=\"section-kicker\">" + escapeHtml(lang.deepReadingNote) + "</p>",
      "      <h1>" + escapeHtml(title) + "</h1>",
      "      <p class=\"page-lead\">" + escapeHtml(summary) + "</p>",
      "",
      "      <section class=\"note-block\">",
      "        <h2>" + escapeHtml(lang.sourceMetadata) + "</h2>",
      "        <dl class=\"metadata-grid\">",
      "          <div><dt>" + escapeHtml(lang.identifier) + "</dt><dd>" + escapeHtml(identifier) + "</dd></div>",
      "          <div><dt>" + escapeHtml(lang.readingMode) + "</dt><dd>" + escapeHtml(fields.mode || "research") + "</dd></div>",
      "          <div><dt>" + escapeHtml(lang.outputLanguage) + "</dt><dd>" + escapeHtml(lang.name) + "</dd></div>",
      "          <div><dt>" + escapeHtml(lang.status) + "</dt><dd>" + escapeHtml(lang.draftStatus) + "</dd></div>",
      "          <div><dt>PubMed</dt><dd>" + buildPubMedLinkHtml(identifier) + "</dd></div>",
      "        </dl>",
      "      </section>",
      "",
      "      <section class=\"note-block\">",
      "        <h2>" + escapeHtml(lang.highSignalSummary) + "</h2>",
      "        <p>" + escapeHtml(fields.abstract || lang.defaultHighSignal) + "</p>",
      "      </section>",
      "",
      "      <section class=\"note-block\">",
      "        <h2>" + escapeHtml(lang.introduction) + "</h2>",
      "        <p>" + escapeHtml(fields.introduction || lang.defaultIntroduction) + "</p>",
      "      </section>",
      "",
      "      <section class=\"note-block\">",
      "        <h2>" + escapeHtml(lang.hypothesis) + "</h2>",
      "        <p>" + escapeHtml(fields.hypothesis || fields.goal || lang.defaultHypothesis) + "</p>",
      "      </section>",
      "",
      "      <section class=\"note-block\">",
      "        <h2>" + escapeHtml(lang.design) + "</h2>",
      "        <p>" + escapeHtml(fields.design || lang.defaultDesign) + "</p>",
      "        <ul>",
      "          <li><strong>" + escapeHtml(lang.studyType) + ":</strong> " + escapeHtml(lang.fillAfterReading) + "</li>",
      "          <li><strong>" + escapeHtml(lang.populationModel) + ":</strong> " + escapeHtml(lang.fillAfterReading) + "</li>",
      "          <li><strong>" + escapeHtml(lang.groupsControls) + ":</strong> " + escapeHtml(lang.fillAfterReading) + "</li>",
      "          <li><strong>" + escapeHtml(lang.primaryEndpoint) + ":</strong> " + escapeHtml(lang.fillAfterReading) + "</li>",
      "        </ul>",
      "      </section>",
      "",
      "      <section class=\"note-block\">",
      "        <h2>" + escapeHtml(lang.methods) + "</h2>",
      "        <p>" + escapeHtml(fields.methods || lang.defaultMethods) + "</p>",
      "      </section>",
      "",
      "      <section class=\"note-block\">",
      "        <h2>" + escapeHtml(lang.resultsEvidence) + "</h2>",
      "        <p>" + escapeHtml(fields.results || lang.defaultResults) + "</p>",
      "        <ol>",
      "          <li><strong>" + escapeHtml(lang.resultOne) + ":</strong> " + escapeHtml(lang.resultPlaceholder) + "</li>",
      "          <li><strong>" + escapeHtml(lang.resultTwo) + ":</strong> " + escapeHtml(lang.resultPlaceholder) + "</li>",
      "          <li><strong>" + escapeHtml(lang.resultThree) + ":</strong> " + escapeHtml(lang.resultPlaceholder) + "</li>",
      "        </ol>",
      "      </section>",
      "",
      "      <section class=\"note-block\">",
      "        <h2>" + escapeHtml(lang.mechanism) + "</h2>",
      "        <p>" + escapeHtml(fields.mechanism || lang.defaultMechanism) + "</p>",
      "      </section>",
      "",
      "      <section class=\"note-block\">",
      "        <h2>" + escapeHtml(lang.limitationsBias) + "</h2>",
      "        <p>" + escapeHtml(fields.limitations || lang.defaultLimitations) + "</p>",
      "      </section>",
      "",
      "      <section class=\"note-block\">",
      "        <h2>" + escapeHtml(lang.followup) + "</h2>",
      "        <ol>",
      "          <li>" + escapeHtml(fields.followup || lang.defaultFollowup) + "</li>",
      "          <li>" + escapeHtml(lang.jsonDecision) + "</li>",
      "          <li>" + escapeHtml(lang.linkDecision) + "</li>",
      "        </ol>",
      "      </section>",
      "    </main>",
      "  </body>",
      "</html>"
    ].join("\n");
  }

  function getReadingLanguage(code) {
    var base = {
      name: "Chinese",
      htmlLang: "zh-CN",
      taskIntro: "Please deep-read this paper and prepare an HTML-ready literature note in Chinese. Preserve key biomedical terms in English when useful, and translate the explanation for the selected target language.",
      outputLanguage: "Output language",
      readingMode: "Reading mode",
      identifier: "Identifier",
      title: "Title",
      abstract: "Abstract or key details",
      goal: "My reading goal",
      matrix: "Deep Reading Matrix",
      paper: "Paper",
      introduction: "Introduction / Background",
      hypothesis: "Research Question / Hypothesis",
      design: "Experimental Design",
      methods: "Methods / Measurements",
      results: "Main Results",
      resultsEvidence: "Main Results And Evidence",
      mechanism: "Mechanism / Interpretation",
      limitations: "Limitations",
      limitationsBias: "Limitations And Bias Risk",
      followup: "Follow-up Actions",
      sourceDetails: "Source Details",
      sourceMetadata: "Source Metadata",
      highSignalSummary: "High-Signal Summary",
      status: "Status",
      draftStatus: "Draft deep-reading note",
      deepReadingNote: "Deep Reading Note",
      backToLab: "Back to Literature Lab",
      designChecklist: "Experimental Design Checklist",
      currentDesign: "Current design notes",
      currentMethods: "Current methods notes",
      currentLimitations: "Current limitations",
      studyType: "Study type",
      populationModel: "Population/model/dataset",
      groupsControls: "Groups and controls",
      primaryEndpoint: "Primary endpoint",
      fillAfterReading: "fill after reading",
      resultOne: "Result 1",
      resultTwo: "Result 2",
      resultThree: "Result 3",
      resultPlaceholder: "finding, evidence source, confidence",
      notProvided: "not provided",
      notFilled: "not filled",
      noAbstract: "No abstract/details pasted yet.",
      defaultSummary: "Add a high-signal summary after reading the abstract and full text.",
      defaultHighSignal: "Add the abstract-level answer: what the paper claims, why it matters, and what decision it changes.",
      defaultIntroduction: "Extract the clinical/scientific problem, prior evidence, and knowledge gap.",
      defaultHypothesis: "State the exact question or hypothesis tested by the paper.",
      defaultDesign: "Specify study type, groups, controls, sample/model, intervention, comparison, endpoints.",
      defaultMethods: "List assays, datasets, statistical methods, primary/secondary endpoints.",
      defaultResults: "Map findings to figures/tables and judge evidence strength.",
      defaultMechanism: "Explain the biological mechanism and pathology/medicine connection.",
      defaultLimitations: "Identify bias, missing controls, model limitations, and uncertainty.",
      defaultFollowup: "Add next papers, search terms, graph nodes, and project updates.",
      jsonDecision: "Decide whether this paper should become a repository literature JSON record.",
      linkDecision: "Link this note to the relevant knowledge-map and project pages.",
      requiredOutput: "Required output",
      briefRules: [
        "1. One-paragraph high-signal summary.",
        "2. Introduction/background logic and knowledge gap.",
        "3. Research question or hypothesis.",
        "4. Experimental design: groups, controls, model/population, intervention/comparison, endpoints.",
        "5. Methods and measurements with evidence level.",
        "6. Main results mapped to figures or evidence blocks.",
        "7. Mechanism, medicine connection, limitations, and bias risks.",
        "8. Follow-up papers/search terms and a compact HTML note."
      ],
      designChecklistItems: [
        "Study type is identified: observational / experimental / clinical trial / review / meta-analysis / other.",
        "Population, sample, model, or dataset is clearly described.",
        "Inclusion and exclusion criteria are captured when applicable.",
        "Groups, controls, intervention, and comparison are identified.",
        "Primary and secondary endpoints are identified.",
        "Main assays, measurements, and statistical methods are listed.",
        "Result claims are mapped to figures, tables, or evidence blocks.",
        "Mechanism claim is separated from direct evidence.",
        "Limitations and bias risks are explicitly listed.",
        "Follow-up paper search terms are generated."
      ]
    };

    var languages = {
      zh: { name: "Chinese", htmlLang: "zh-CN" },
      en: { name: "English", htmlLang: "en" },
      ja: { name: "Japanese", htmlLang: "ja" },
      ru: { name: "Russian", htmlLang: "ru" },
      de: { name: "German", htmlLang: "de" }
    };
    var selected = languages[code] || languages.zh;
    return Object.assign({}, base, selected, {
      taskIntro: "Please deep-read this paper and prepare an HTML-ready literature note in " + selected.name + ". Preserve key biomedical terms in English when useful, translate the explanations for the selected target language, and keep the experimental design, methods, evidence, limitations, and follow-up plan explicit."
    });
  }
  function buildPubMedLinkHtml(identifier) {
    var normalized = (identifier || "").trim();
    if (/^\d+$/.test(normalized)) {
      return "<a href=\"https://pubmed.ncbi.nlm.nih.gov/" + escapeHtml(normalized) + "/\">Open record</a>";
    }
    return "Add PMID to create a PubMed link.";
  }

  function addToReadingQueue(paper) {
    var queue = readStore("ljsdoctor:deepReadingQueue");
    var exists = queue.some(function (item) {
      return item.pmid && item.pmid === paper.pmid;
    });
    if (!exists) {
      queue.unshift({
        queueId: "queue-" + Date.now() + "-" + Math.random().toString(16).slice(2),
        pmid: paper.pmid || "",
        title: paper.title || "",
        journal: paper.journal || "",
        year: paper.year || "",
        pubdate: paper.pubdate || "",
        authors: paper.authors || "",
        pubtypes: paper.pubtypes || "",
        abstract: paper.abstract || "",
        url: paper.url || "",
        relevanceScore: paper.screening && paper.screening.score,
        relevanceReasons: paper.screening && paper.screening.reasons,
        addedAt: new Date().toISOString().slice(0, 10),
        status: "queued-for-deep-reading"
      });
      writeStore("ljsdoctor:deepReadingQueue", queue);
    }
    window.dispatchEvent(new CustomEvent("deep-reading-queue-updated"));
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

  function setupIssueQueue() {
    var root = document.querySelector("[data-issue-queue]");
    if (!root) {
      return;
    }

    var list = root.querySelector("[data-issue-list]");
    var count = root.querySelector("[data-issue-count]");
    var search = root.querySelector("[data-issue-search]");
    var label = root.querySelector("[data-issue-label]");
    var form = root.querySelector("[data-issue-draft-form]");
    var draftLink = root.querySelector("[data-issue-draft-link]");
    var issues = [];

    function renderIssues() {
      var query = search ? search.value.trim().toLowerCase() : "";
      var selectedLabel = label ? label.value : "";
      var visible = issues.filter(function (issue) {
        var labels = issue.labels || [];
        var labelOk = !selectedLabel || labels.indexOf(selectedLabel) !== -1;
        var text = [issue.title, issue.body || "", labels.join(" "), String(issue.number)].join(" ").toLowerCase();
        var queryOk = !query || text.indexOf(query) !== -1;
        return labelOk && queryOk;
      });

      if (count) {
        count.textContent = String(issues.length);
      }

      list.innerHTML = "";
      if (!visible.length) {
        list.innerHTML = "<p class='empty-state'>No open issues match this filter. Use the draft tool below to create the next task.</p>";
        return;
      }

      visible.forEach(function (issue) {
        var card = document.createElement("article");
        card.className = "issue-card";
        card.innerHTML =
          "<div class='issue-meta'><span>#" + escapeHtml(issue.number) + "</span>" +
          "<span>" + escapeHtml(issue.updatedAt || "") + "</span></div>" +
          "<h2><a href='" + escapeHtml(issue.url) + "'>" + escapeHtml(issue.title) + "</a></h2>" +
          "<p>" + escapeHtml(issue.bodyPreview || "No description provided.") + "</p>" +
          "<div class='label-row'>" + issue.labels.map(function (name) {
            return "<span>" + escapeHtml(name) + "</span>";
          }).join("") + "</div>";
        list.appendChild(card);
      });
    }

    function loadIssues() {
      fetch("https://api.github.com/repos/L-js-doctor/personal-website/issues?state=open&per_page=30")
        .then(function (response) {
          if (!response.ok) {
            throw new Error("GitHub Issues unavailable");
          }
          return response.json();
        })
        .then(function (data) {
          issues = data.filter(function (item) {
            return !item.pull_request;
          }).map(function (item) {
            return {
              number: item.number,
              title: item.title || "Untitled issue",
              body: item.body || "",
              bodyPreview: (item.body || "").replace(/\s+/g, " ").slice(0, 220),
              labels: (item.labels || []).map(function (entry) {
                return entry.name;
              }),
              url: item.html_url,
              updatedAt: item.updated_at ? item.updated_at.slice(0, 10) : ""
            };
          });
          renderIssues();
        })
        .catch(function () {
          if (count) {
            count.textContent = "--";
          }
          list.innerHTML = "<p class='empty-state'>Could not load GitHub Issues right now. Open the repository Issues link above or use the draft tool below.</p>";
        });
    }

    function updateDraftLink() {
      if (!form || !draftLink) {
        return;
      }
      var fields = readNamedFields(form);
      var labels = fields.type || "site-feature";
      var body = [
        "## Goal",
        fields.goal || "Describe the concrete output.",
        "",
        "## Source or evidence",
        fields.source || "Add PMID, DOI, PubMed URL, local page, dataset, or notes.",
        "",
        "## Expected repository changes",
        "- Update the relevant HTML page or JSON data file.",
        "- Link the result from the research graph when useful.",
        "- Run tools/validate-site.ps1 before publishing."
      ].join("\n");
      var params = new URLSearchParams({
        title: fields.title || "New research task",
        body: body,
        labels: labels
      });
      draftLink.href = "https://github.com/L-js-doctor/personal-website/issues/new?" + params.toString();
    }

    if (search) {
      search.addEventListener("input", renderIssues);
    }
    if (label) {
      label.addEventListener("change", renderIssues);
    }
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        updateDraftLink();
        draftLink.focus();
      });
      form.addEventListener("input", updateDraftLink);
      form.addEventListener("change", updateDraftLink);
      updateDraftLink();
    }

    loadIssues();
  }

  function setupProjectDashboard() {
    var root = document.querySelector("[data-project-dashboard]");
    if (!root) {
      return;
    }

    var list = root.querySelector("[data-project-list]");
    var search = root.querySelector("[data-project-search]");
    var projects = [];

    function renderLinkedItems(items) {
      if (!items || !items.length) {
        return "<p class='empty-state'>No linked records yet.</p>";
      }
      return "<ul class='linked-record-list'>" + items.map(function (item) {
        return "<li><a href='" + escapeHtml(item.url || "#") + "'>" +
          escapeHtml(item.title || "Untitled record") + "</a><span>" +
          escapeHtml(item.status || "Tracked") + "</span></li>";
      }).join("") + "</ul>";
    }

    function renderBullets(items) {
      if (!items || !items.length) {
        return "<p class='empty-state'>No items yet.</p>";
      }
      return "<ul>" + items.map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      }).join("") + "</ul>";
    }

    function renderProjects() {
      var query = search ? search.value.trim().toLowerCase() : "";
      var visible = projects.filter(function (project) {
        return !query || JSON.stringify(project).toLowerCase().indexOf(query) !== -1;
      });

      list.innerHTML = "";
      if (!visible.length) {
        list.innerHTML = "<p class='empty-state'>No projects match this filter.</p>";
        return;
      }

      visible.forEach(function (project) {
        var progress = Math.max(0, Math.min(100, Number(project.progress || 0)));
        var card = document.createElement("article");
        card.className = "project-dashboard-card";
        card.innerHTML =
          "<div class='project-card-head'>" +
          "<div><p class='project-type'>" + escapeHtml(project.status || "Project") + "</p>" +
          "<h2>" + escapeHtml(project.title || "Untitled project") + "</h2></div>" +
          "<a class='button secondary' href='" + escapeHtml(project.activeIssue || "issue-queue.html") + "'>Open active issue</a>" +
          "</div>" +
          "<div class='progress-track' aria-label='Project progress'><span style='width:" + progress + "%'></span></div>" +
          "<p class='progress-label'>" + progress + "% organized</p>" +
          "<section class='project-brief'><h3>Research Question</h3><p>" + escapeHtml(project.question || "Not defined yet.") + "</p></section>" +
          "<section class='project-brief'><h3>Why It Matters</h3><p>" + escapeHtml(project.why || "Not defined yet.") + "</p></section>" +
          "<div class='project-link-grid'>" +
          "<section><h3>Literature</h3>" + renderLinkedItems(project.literature) + "</section>" +
          "<section><h3>Knowledge Nodes</h3>" + renderLinkedItems(project.knowledge) + "</section>" +
          "</div>" +
          "<div class='project-link-grid'>" +
          "<section><h3>Next Actions</h3>" + renderBullets(project.nextActions) + "</section>" +
          "<section><h3>Quality Gates</h3>" + renderBullets(project.qualityGates) + "</section>" +
          "</div>" +
          "<p class='project-labels'><strong>Issue labels:</strong> " + escapeHtml(project.issueLabel || "none") + "</p>";
        list.appendChild(card);
      });
    }

    if (search) {
      search.addEventListener("input", renderProjects);
    }

    fetch("../data/research/projects.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("project data unavailable");
        }
        return response.json();
      })
      .then(function (items) {
        projects = Array.isArray(items) ? items : [];
        renderProjects();
      })
      .catch(function () {
        list.innerHTML = "<p class='empty-state'>Project data could not be loaded.</p>";
      });
  }

  function setupDeploymentAdvisor() {
    var root = document.querySelector("[data-deployment-advisor]");
    if (!root) {
      return;
    }

    var form = root.querySelector("[data-deployment-advisor-form]");
    var output = root.querySelector("[data-deployment-advisor-output]");
    if (!form || !output) {
      return;
    }

    var routes = {
      static: {
        stack: "GitHub Pages",
        codex: "I can build the page, connect local JSON, add validation, commit it, and publish it to GitHub Pages.",
        approval: "No new account approval is usually needed after GitHub publishing is connected.",
        next: "Best next build: richer HTML literature notes, project dashboards, knowledge maps, and downloadable study files."
      },
      pubmed: {
        stack: "GitHub Pages plus browser-side PubMed API calls",
        codex: "I can build targeted search forms, relevance scoring, abstract retrieval, reading queues, and export tools.",
        approval: "No private key is needed for basic PubMed E-utilities, but heavy usage may later need an NCBI API key.",
        next: "Best next build: save PubMed searches as reusable strategies and turn selected papers into deep-reading pages."
      },
      ai: {
        stack: "Vercel API routes plus GitHub Pages or Vercel frontend",
        codex: "I can write the API route, prompt structure, frontend controls, and safety checks.",
        approval: "You must provide or approve protected API keys in Vercel environment variables. They should never be pasted into public frontend code.",
        next: "Best next build: AI paper triage, structured abstract extraction, and Codex-ready deep-reading tasks."
      },
      private: {
        stack: "Supabase database/auth/storage plus Vercel API routes when needed",
        codex: "I can design tables, login flows, storage buckets, import/export tools, and privacy-aware UI.",
        approval: "You must create or approve the Supabase project, login settings, and any billing/storage choices.",
        next: "Best next build: private literature library, PDF storage, reading status, and personal research notes."
      },
      automation: {
        stack: "Vercel scheduled functions, GitHub Actions, or Codex automations depending on the job",
        codex: "I can define the scheduled task, output format, issue template, and dashboard integration.",
        approval: "You may need to approve scheduled jobs, GitHub permissions, or Vercel cron settings.",
        next: "Best next build: weekly PubMed digest and automatic GitHub Issue drafts for papers worth reading."
      }
    };

    function renderAdvisor() {
      var choice = form.elements.feature.value;
      var route = routes[choice] || routes.static;
      output.innerHTML =
        "<p class='project-type'>Recommended stack</p>" +
        "<h3>" + escapeHtml(route.stack) + "</h3>" +
        "<p><strong>What I can do:</strong> " + escapeHtml(route.codex) + "</p>" +
        "<p><strong>What you approve:</strong> " + escapeHtml(route.approval) + "</p>" +
        "<p><strong>Next practical build:</strong> " + escapeHtml(route.next) + "</p>";
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      renderAdvisor();
    });
    form.elements.feature.addEventListener("change", renderAdvisor);
    renderAdvisor();
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

  function getSiteBasePath() {
    var script = document.querySelector("script[src$='site.js']");
    if (!script) {
      return "";
    }
    return script.getAttribute("src").replace(/site\.js.*$/, "");
  }

  function loadScriptOnce(src) {
    if (document.querySelector("script[src='" + src + "']")) {
      return Promise.resolve();
    }
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = src;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function setupPetWidget() {
    var base = getSiteBasePath();
    loadScriptOnce(base + "lib/pet/petTypes.js")
      .then(function () {
        return loadScriptOnce(base + "lib/pet/petEvents.js");
      })
      .then(function () {
        return loadScriptOnce(base + "components/pet/PetProvider.js");
      })
      .then(function () {
        return loadScriptOnce(base + "components/pet/PetWidget.js");
      })
      .catch(function () {
        // The pet is progressive decoration; the site must remain usable if it fails to load.
      });
  }

  function triggerPet(eventName) {
    if (typeof window.triggerPetEvent === "function") {
      window.triggerPetEvent(eventName);
    }
  }

  setupFilter();
  setupPetWidget();
  setupResearchGraph();
  setupReadingDesk();
  setupIssueQueue();
  setupProjectDashboard();
  setupDeploymentAdvisor();

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
