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
    var clearButton = root.querySelector("[data-clear]");
    var storeKey = "ljsdoctor:" + config.key;

    function getFilteredItems() {
      var query = search ? search.value.trim().toLowerCase() : "";
      return readStore(storeKey).filter(function (item) {
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

      items.forEach(function (item, index) {
        var card = document.createElement("article");
        card.className = "tool-card";
        card.innerHTML = config.render(item);

        var remove = document.createElement("button");
        remove.type = "button";
        remove.className = "text-button";
        remove.textContent = "删除";
        remove.addEventListener("click", function () {
          var all = readStore(storeKey);
          all.splice(index, 1);
          writeStore(storeKey, all);
          render();
        });

        card.appendChild(remove);
        list.appendChild(card);
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

    if (clearButton) {
      clearButton.addEventListener("click", function () {
        if (window.confirm("确认清空这个板块保存在当前浏览器里的数据？")) {
          writeStore(storeKey, []);
          render();
        }
      });
    }

    render();
  }

  setupFilter();

  setupApp({
    key: "literature",
    empty: "还没有文献记录。添加第一篇论文后，它会保存在当前浏览器里。",
    render: function (item) {
      return "<p class='project-type'>" + escapeHtml(item.year || "Paper") + "</p>" +
        "<h3>" + escapeHtml(item.title || "未命名文献") + "</h3>" +
        "<p><strong>研究问题：</strong>" + escapeHtml(item.question || "未填写") + "</p>" +
        "<p><strong>主要结论：</strong>" + escapeHtml(item.finding || "未填写") + "</p>" +
        "<p><strong>下一步：</strong>" + escapeHtml(item.next || "未填写") + "</p>";
    }
  });

  setupApp({
    key: "knowledge",
    empty: "还没有知识节点。添加概念后，可以用关键词搜索。",
    render: function (item) {
      return "<p class='project-type'>" + escapeHtml(item.system || "Concept") + "</p>" +
        "<h3>" + escapeHtml(item.concept || "未命名概念") + "</h3>" +
        "<p><strong>机制链条：</strong>" + escapeHtml(item.mechanism || "未填写") + "</p>" +
        "<p><strong>关联疾病：</strong>" + escapeHtml(item.disease || "未填写") + "</p>" +
        "<p><strong>易混点：</strong>" + escapeHtml(item.compare || "未填写") + "</p>";
    }
  });

  setupApp({
    key: "notebook",
    empty: "还没有研究日志。添加今天的学习记录，之后可以搜索回看。",
    render: function (item) {
      return "<p class='project-type'>" + escapeHtml(item.date || item.createdAt || "Log") + "</p>" +
        "<h3>" + escapeHtml(item.topic || "未命名日志") + "</h3>" +
        "<p><strong>今天完成：</strong>" + escapeHtml(item.done || "未填写") + "</p>" +
        "<p><strong>问题：</strong>" + escapeHtml(item.problem || "未填写") + "</p>" +
        "<p><strong>下一步：</strong>" + escapeHtml(item.next || "未填写") + "</p>";
    }
  });

  setupApp({
    key: "dataTools",
    empty: "还没有工具记录。添加一个数据表、脚本或分析工具。",
    render: function (item) {
      return "<p class='project-type'>" + escapeHtml(item.kind || "Tool") + "</p>" +
        "<h3>" + escapeHtml(item.name || "未命名工具") + "</h3>" +
        "<p><strong>输入：</strong>" + escapeHtml(item.input || "未填写") + "</p>" +
        "<p><strong>输出：</strong>" + escapeHtml(item.output || "未填写") + "</p>" +
        "<p><strong>使用方法：</strong>" + escapeHtml(item.method || "未填写") + "</p>";
    }
  });

  setupApp({
    key: "publication",
    empty: "还没有成果记录。添加一个摘要、海报、综述或项目展示。",
    render: function (item) {
      return "<p class='project-type'>" + escapeHtml(item.status || "Draft") + "</p>" +
        "<h3>" + escapeHtml(item.title || "未命名成果") + "</h3>" +
        "<p><strong>目标读者：</strong>" + escapeHtml(item.audience || "未填写") + "</p>" +
        "<p><strong>核心信息：</strong>" + escapeHtml(item.message || "未填写") + "</p>" +
        "<p><strong>下一步：</strong>" + escapeHtml(item.next || "未填写") + "</p>";
    }
  });

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
