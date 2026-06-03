(function () {
  function getApi() {
    return window.PetEvents || null;
  }

  window.PetProvider = {
    triggerPetEvent: function (eventName) {
      var api = getApi();
      return api ? api.triggerPetEvent(eventName) : null;
    },
    setPetState: function (state) {
      var api = getApi();
      return api ? api.setPetState(state) : null;
    },
    subscribe: function (listener) {
      var api = getApi();
      return api ? api.subscribePet(listener) : function () {};
    }
  };
})();
