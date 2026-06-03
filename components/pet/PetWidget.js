(function () {
  var ROOT_CLASS = "pet-widget";
  var DEFAULT_STATE = "idle";
  var STATE_PROPS = {
    idle: "📄",
    searching: "🔎",
    uploading: "📄",
    eatPaper: "🍽️",
    reading: "💭",
    writing: "✍️",
    done: "📘",
    error: "❓",
    sleeping: "💤"
  };

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
    return window.PetTypes && window.PetTypes.stateMessages[state]
      ? window.PetTypes.stateMessages[state]
      : "";
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
    var emoji = document.createElement("span");
    var prop = document.createElement("span");
    var bubble = document.createElement("div");
    var status = document.createElement("p");
    var message = document.createElement("p");
    var controls = document.createElement("div");
    var toggle = document.createElement("button");

    root.className = ROOT_CLASS;
    root.setAttribute("aria-live", "polite");
    shell.className = "pet-shell";
    avatar.className = "pet-avatar";
    emoji.className = "pet-emoji";
    emoji.textContent = "🐱";
    prop.className = "pet-prop";
    bubble.className = "pet-bubble";
    status.className = "pet-status";
    message.className = "pet-message";
    controls.className = "pet-controls";
    toggle.className = "pet-toggle";
    toggle.type = "button";

    avatar.appendChild(emoji);
    avatar.appendChild(prop);
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
      prop.textContent = STATE_PROPS[state] || "";
      toggle.textContent = collapsed ? "展开" : "收起";
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
