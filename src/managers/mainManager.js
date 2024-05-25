const MainManager = (function () {
  return {
    setup() {
      console.log("Setup Ran");
      ProcessManager.setup();
    },

    draw(dt) {
      ProcessManager.draw(dt);
    }
  }
})();