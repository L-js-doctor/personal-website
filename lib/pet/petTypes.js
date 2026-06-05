(function () {
  var PET_STATE_MESSAGES_BY_LANGUAGE = {
    "zh-CN": {
      idle: "我在这里，随时可以帮你啃论文。",
      searching: "正在帮你找文献。",
      uploading: "论文来了。",
      eatPaper: "我先吃下这篇论文。",
      reading: "正在拆解文章结构。",
      writing: "正在整理精读笔记。",
      done: "精读完成，可以查看结果了。",
      error: "这篇论文好像有点噎住了。",
      sleeping: "暂时没任务，我先趴一会儿。"
    },
    en: {
      idle: "I am here whenever you need help chewing through a paper.",
      searching: "Looking for literature with you.",
      uploading: "A paper just arrived.",
      eatPaper: "Let me eat this paper first.",
      reading: "Breaking down the article structure.",
      writing: "Organizing the deep-reading notes.",
      done: "Deep reading is ready. You can check the result.",
      error: "This paper seems a little hard to swallow.",
      sleeping: "No task for now. I will curl up for a bit."
    },
    ja: {
      idle: "ここにいるよ。いつでも論文を一緒にかじれる。",
      searching: "文献を探しているところ。",
      uploading: "論文が届いたよ。",
      eatPaper: "まずこの論文を食べてみるね。",
      reading: "論文の構造を分解しているところ。",
      writing: "精読ノートを整理しているところ。",
      done: "精読が完了したよ。結果を確認できる。",
      error: "この論文は少し飲み込みにくいみたい。",
      sleeping: "今は作業がないから少し丸くなるね。"
    },
    ru: {
      idle: "Я здесь и готов помочь разобрать статью.",
      searching: "Ищу литературу вместе с тобой.",
      uploading: "Статья пришла.",
      eatPaper: "Сначала съем эту статью.",
      reading: "Разбираю структуру статьи.",
      writing: "Оформляю заметки глубокого чтения.",
      done: "Глубокое чтение готово. Можно смотреть результат.",
      error: "Эта статья, кажется, застряла.",
      sleeping: "Пока задач нет. Немного отдохну."
    },
    de: {
      idle: "Ich bin hier und helfe dir jederzeit beim Durchkauen eines Papers.",
      searching: "Ich suche gerade Literatur mit dir.",
      uploading: "Ein Paper ist angekommen.",
      eatPaper: "Ich esse dieses Paper erst einmal.",
      reading: "Ich zerlege die Struktur des Artikels.",
      writing: "Ich ordne die Deep-Reading-Notizen.",
      done: "Das Deep Reading ist fertig. Du kannst das Ergebnis ansehen.",
      error: "Dieses Paper scheint etwas schwer zu schlucken.",
      sleeping: "Gerade gibt es keine Aufgabe. Ich rolle mich kurz zusammen."
    }
  };

  var PET_STATE_MESSAGES = PET_STATE_MESSAGES_BY_LANGUAGE["zh-CN"];

  function normalizeLanguage(code) {
    if (code === "zh") {
      return "zh-CN";
    }
    return PET_STATE_MESSAGES_BY_LANGUAGE[code] ? code : "zh-CN";
  }

  function getStateMessage(state, language) {
    var normalized = normalizeLanguage(language || "zh-CN");
    var messages = PET_STATE_MESSAGES_BY_LANGUAGE[normalized] || PET_STATE_MESSAGES;
    return messages[state] || PET_STATE_MESSAGES[state] || "";
  }

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
    stateMessagesByLanguage: PET_STATE_MESSAGES_BY_LANGUAGE,
    getStateMessage: getStateMessage,
    animationMap: PET_ANIMATION_MAP
  };
})();
