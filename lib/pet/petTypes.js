(function () {
  var PET_STATE_MESSAGES = {
    idle: "我在这里，随时可以帮你啃论文。",
    searching: "正在帮你找文献。",
    uploading: "论文来了。",
    eatPaper: "我先吃下这篇论文。",
    reading: "正在拆解文章结构。",
    writing: "正在整理精读笔记。",
    done: "精读完成，可以查看结果了。",
    error: "这篇论文好像有点噎住了。",
    sleeping: "暂时没任务，我先趴一会儿。"
  };

  var PET_ANIMATION_MAP = {
    idle: "emoji-cat-idle",
    searching: "emoji-cat-searching",
    uploading: "emoji-cat-uploading",
    eatPaper: "emoji-cat-eat-paper",
    reading: "emoji-cat-reading",
    writing: "emoji-cat-writing",
    done: "emoji-cat-done",
    error: "emoji-cat-error",
    sleeping: "emoji-cat-sleeping"
  };

  window.PetTypes = {
    states: Object.keys(PET_STATE_MESSAGES),
    stateMessages: PET_STATE_MESSAGES,
    animationMap: PET_ANIMATION_MAP
  };
})();
