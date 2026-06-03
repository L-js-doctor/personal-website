(function () {
  var EVENT_TO_STATE = {
    page_idle: "idle",
    literature_search_start: "searching",
    literature_search_done: "idle",
    pdf_upload_start: "uploading",
    pdf_upload_done: "eatPaper",
    pdf_eat_start: "eatPaper",
    ai_reading_start: "reading",
    ai_output_start: "writing",
    ai_output_done: "done",
    task_error: "error",
    long_idle: "sleeping"
  };

  var listeners = [];

  function emitPetState(state, eventName) {
    var detail = { state: state, eventName: eventName || null };
    listeners.slice().forEach(function (listener) {
      listener(detail);
    });
    window.dispatchEvent(new CustomEvent("pet-state-change", { detail: detail }));
  }

  function triggerPetEvent(eventName) {
    var state = EVENT_TO_STATE[eventName];
    if (!state) {
      return null;
    }
    emitPetState(state, eventName);
    return state;
  }

  function setPetState(state) {
    var states = window.PetTypes ? window.PetTypes.states : [];
    if (states.indexOf(state) === -1) {
      return null;
    }
    emitPetState(state, null);
    return state;
  }

  function subscribePet(listener) {
    if (typeof listener !== "function") {
      return function () {};
    }
    listeners.push(listener);
    return function () {
      listeners = listeners.filter(function (item) {
        return item !== listener;
      });
    };
  }

  window.PetEvents = {
    eventToState: EVENT_TO_STATE,
    triggerPetEvent: triggerPetEvent,
    setPetState: setPetState,
    subscribePet: subscribePet
  };

  window.triggerPetEvent = triggerPetEvent;
})();
