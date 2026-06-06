(function () {
  var ROOT_CLASS = "pet-widget";
  var DEFAULT_STATE = "idle";

  function getBasePath() {
    var script = document.querySelector("script[src$='components/pet/PetWidget.js']");
    if (!script) {
      return "";
    }
    return script.getAttribute("src").replace(/components\/pet\/PetWidget\.js.*$/, "");
  }

  function loadStylesheet() {
    if (document.querySelector("link[data-pet-widget-style]")) {
      return;
    }
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = getBasePath() + "components/pet/PetWidget.css";
    link.setAttribute("data-pet-widget-style", "true");
    document.head.appendChild(link);
  }

  function isDevMode() {
    var query = new URLSearchParams(window.location.search);
    return query.get("petDev") === "1" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.protocol === "file:";
  }

  function getMessage(state) {
    var language = localStorage.getItem("ljsdoctor:translationLanguage") || "zh-CN";
    if (window.PetTypes && typeof window.PetTypes.getStateMessage === "function") {
      return window.PetTypes.getStateMessage(state, language);
    }
    return window.PetTypes && window.PetTypes.stateMessages[state] ? window.PetTypes.stateMessages[state] : "";
  }

  function getToggleText(isCollapsed) {
    var language = localStorage.getItem("ljsdoctor:translationLanguage") || "zh-CN";
    var labels = {
      "zh-CN": { open: "展开", close: "收起" },
      en: { open: "Open", close: "Hide" },
      ja: { open: "開く", close: "閉じる" },
      ru: { open: "Открыть", close: "Скрыть" },
      de: { open: "Öffnen", close: "Ausblenden" }
    };
    var normalized = language === "zh" ? "zh-CN" : language;
    var selected = labels[normalized] || labels["zh-CN"];
    return isCollapsed ? selected.open : selected.close;
  }

  function createDevPanel(setState) {
    var panel = document.createElement("div");
    panel.className = "pet-dev-panel";
    panel.setAttribute("aria-label", "Pet state test buttons");
    (window.PetTypes ? window.PetTypes.states : []).forEach(function (state) {
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = state;
      button.addEventListener("click", function () {
        setState(state);
      });
      panel.appendChild(button);
    });
    return panel;
  }

  function createPetCatModel() {
    var model = document.createElement("div");
    model.className = "pet-cat-model";
    model.setAttribute("aria-hidden", "true");
    model.innerHTML = [
      "<svg class='pet-cat-svg' viewBox='0 0 160 160' role='img' focusable='false'>",
      "  <defs>",
      "    <linearGradient id='petCatFur' x1='20' y1='18' x2='132' y2='146' gradientUnits='userSpaceOnUse'>",
      "      <stop offset='0' stop-color='#fff8ec'/>",
      "      <stop offset='0.68' stop-color='#ffdcae'/>",
      "      <stop offset='1' stop-color='#f8ba77'/>",
      "    </linearGradient>",
      "    <linearGradient id='petCatPaper' x1='0' y1='0' x2='1' y2='1'>",
      "      <stop offset='0' stop-color='#ffffff'/>",
      "      <stop offset='1' stop-color='#dceff4'/>",
      "    </linearGradient>",
      "  </defs>",
      "  <g class='cat-tail'>",
      "    <path d='M116 106c27-11 30-42 14-48-11-4-19 6-15 15 3 7 12 4 12-2' fill='none' stroke='#f0a766' stroke-width='13' stroke-linecap='round'/>",
      "    <path d='M116 106c27-11 30-42 14-48' fill='none' stroke='#fff1d7' stroke-width='5' stroke-linecap='round' opacity='.62'/>",
      "  </g>",
      "  <ellipse class='cat-shadow' cx='81' cy='137' rx='48' ry='10' fill='#24364d' opacity='.12'/>",
      "  <g class='cat-body'>",
      "    <path d='M45 84c2-24 18-38 41-37 23 1 37 18 37 44 0 27-17 45-43 45-25 0-40-18-35-52z' fill='url(#petCatFur)' stroke='#8f5b37' stroke-width='3'/>",
      "    <path d='M58 103c7 17 30 19 42 2' fill='none' stroke='#fff4df' stroke-width='6' stroke-linecap='round' opacity='.8'/>",
      "  </g>",
      "  <g class='cat-head'>",
      "    <path class='cat-ear-left' d='M48 49 38 19l29 18z' fill='#ffdcae' stroke='#8f5b37' stroke-width='3' stroke-linejoin='round'/>",
      "    <path class='cat-ear-right' d='M99 37 128 19l-10 31z' fill='#ffdcae' stroke='#8f5b37' stroke-width='3' stroke-linejoin='round'/>",
      "    <path d='M44 62c0-24 18-40 40-40s41 16 41 40c0 25-18 41-41 41S44 87 44 62z' fill='url(#petCatFur)' stroke='#8f5b37' stroke-width='3'/>",
      "    <path d='M58 43c10-7 23-9 36-6' fill='none' stroke='#fff4df' stroke-width='5' stroke-linecap='round' opacity='.7'/>",
      "    <circle class='cat-eye cat-eye-left' cx='67' cy='62' r='5' fill='#172033'/>",
      "    <circle class='cat-eye cat-eye-right' cx='99' cy='62' r='5' fill='#172033'/>",
      "    <path class='cat-glasses' d='M56 62h22m21 0h22M78 62c4-3 10-3 14 0M56 62a11 9 0 1 0 22 0 11 9 0 1 0-22 0Zm43 0a11 9 0 1 0 22 0 11 9 0 1 0-22 0Z' fill='none' stroke='#1f6f78' stroke-width='3' stroke-linecap='round' opacity='0'/>",
      "    <path d='M83 70 78 77h11z' fill='#df7e76'/>",
      "    <path class='cat-mouth' d='M80 82c4 4 9 4 13 0' fill='none' stroke='#6d3f2c' stroke-width='3' stroke-linecap='round'/>",
      "    <path d='M48 72h16M48 80h16M111 72h16M111 80h16' stroke='#8f5b37' stroke-width='2' stroke-linecap='round' opacity='.65'/>",
      "  </g>",
      "  <g class='cat-paper'>",
      "    <path d='M31 92h44l13 13v46H31z' fill='url(#petCatPaper)' stroke='#2c7882' stroke-width='3' stroke-linejoin='round'/>",
      "    <path d='M75 92v14h13' fill='none' stroke='#2c7882' stroke-width='3' stroke-linejoin='round'/>",
      "    <path d='M42 114h35M42 126h31M42 138h25' stroke='#76aeb5' stroke-width='4' stroke-linecap='round'/>",
      "  </g>",
      "  <g class='cat-card'>",
      "    <rect x='88' y='102' width='50' height='38' rx='7' fill='#e9fbf7' stroke='#1f8a7b' stroke-width='3'/>",
      "    <path d='M99 115h27M99 126h20' stroke='#1f8a7b' stroke-width='4' stroke-linecap='round'/>",
      "  </g>",
      "  <g class='cat-paws'>",
      "    <ellipse class='cat-paw cat-paw-left' cx='62' cy='107' rx='12' ry='9' fill='#ffd49c' stroke='#8f5b37' stroke-width='3'/>",
      "    <ellipse class='cat-paw cat-paw-right' cx='98' cy='107' rx='12' ry='9' fill='#ffd49c' stroke='#8f5b37' stroke-width='3'/>",
      "  </g>",
      "  <g class='cat-pen'>",
      "    <path d='M104 108 136 136' stroke='#24425e' stroke-width='6' stroke-linecap='round'/>",
      "    <path d='M132 132 141 143' stroke='#1f8a7b' stroke-width='5' stroke-linecap='round'/>",
      "  </g>",
      "  <g class='cat-magnifier'>",
      "    <circle cx='119' cy='41' r='14' fill='rgba(255,255,255,.6)' stroke='#1f8a7b' stroke-width='5'/>",
      "    <path d='m130 52 14 14' stroke='#1f8a7b' stroke-width='6' stroke-linecap='round'/>",
      "  </g>",
      "  <g class='cat-question'>",
      "    <text x='121' y='45' font-size='34' font-weight='800' fill='#d35c52'>?</text>",
      "  </g>",
      "  <g class='cat-sleep-bubbles'>",
      "    <circle cx='119' cy='32' r='6' fill='#d8edf5' stroke='#3a7892' stroke-width='2'/>",
      "    <circle cx='136' cy='19' r='4' fill='#d8edf5' stroke='#3a7892' stroke-width='2'/>",
      "  </g>",
      "</svg>"
    ].join("");
    return model;
  }

  function createWidget() {
    if (document.querySelector("." + ROOT_CLASS)) {
      return;
    }
    loadStylesheet();

    var state = DEFAULT_STATE;
    var collapsed = window.matchMedia("(max-width: 720px)").matches;
    var idleTimer = null;
    var root = document.createElement("aside");
    var shell = document.createElement("div");
    var avatar = document.createElement("div");
    var model = createPetCatModel();
    var bubble = document.createElement("div");
    var status = document.createElement("p");
    var message = document.createElement("p");
    var controls = document.createElement("div");
    var toggle = document.createElement("button");

    root.className = ROOT_CLASS;
    root.setAttribute("aria-live", "polite");
    shell.className = "pet-shell";
    avatar.className = "pet-avatar";
    bubble.className = "pet-bubble";
    status.className = "pet-status";
    message.className = "pet-message";
    controls.className = "pet-controls";
    toggle.className = "pet-toggle";
    toggle.type = "button";

    avatar.appendChild(model);
    bubble.appendChild(status);
    bubble.appendChild(message);
    controls.appendChild(toggle);
    bubble.appendChild(controls);
    shell.appendChild(avatar);
    shell.appendChild(bubble);
    root.appendChild(shell);

    function render() {
      root.className = ROOT_CLASS + " pet-state-" + state + (collapsed ? " is-collapsed" : " is-expanded");
      root.setAttribute("data-pet-state", state);
      status.textContent = state;
      message.textContent = getMessage(state);
      toggle.textContent = getToggleText(collapsed);
      toggle.setAttribute("aria-expanded", String(!collapsed));
    }

    function setState(nextState) {
      if (!window.PetTypes || window.PetTypes.states.indexOf(nextState) === -1) {
        return;
      }
      state = nextState;
      render();
      scheduleLongIdle();
    }

    function scheduleLongIdle() {
      window.clearTimeout(idleTimer);
      if (state === "sleeping" || state === "reading" || state === "writing") {
        return;
      }
      idleTimer = window.setTimeout(function () {
        if (window.triggerPetEvent) {
          window.triggerPetEvent("long_idle");
        } else {
          setState("sleeping");
        }
      }, 90000);
    }

    toggle.addEventListener("click", function () {
      collapsed = !collapsed;
      render();
    });

    avatar.addEventListener("click", function () {
      if (collapsed) {
        collapsed = false;
        render();
      }
    });

    window.addEventListener("pet-language-updated", render);

    if (isDevMode()) {
      bubble.appendChild(createDevPanel(setState));
    }

    if (window.PetEvents) {
      window.PetEvents.subscribePet(function (detail) {
        setState(detail.state);
      });
    }

    document.body.appendChild(root);
    render();
    if (window.triggerPetEvent) {
      window.triggerPetEvent("page_idle");
    } else {
      scheduleLongIdle();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createWidget);
  } else {
    createWidget();
  }
})();
