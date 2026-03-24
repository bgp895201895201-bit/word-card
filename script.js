const $ = (id) => document.getElementById(id);

const els = {
  wordText: $("word-text"),
  wordHint: $("word-hint"),
  options: $("options"),
  childSelect: $("child-select"),
  addChildBtn: $("add-child-btn"),
  wordSource: $("word-source"),
  level: $("level"),
  mode: $("mode"),
  customBox: $("custom-box"),
  customWords: $("customWords"),
  saveCustomBtn: $("save-custom-btn"),
  importBtn: $("import-btn"),
  fileInput: $("fileInput"),
  nextBtn: $("next-btn"),
  clearWrongBtn: $("clear-wrong-btn"),
  showExample: $("showExample"),
  showGrammar: $("showGrammar"),
  exampleContent: $("example-content"),
  grammarContent: $("grammar-content"),
  poolCount: $("pool-count"),
  wrongCount: $("wrong-count"),
  childScore: $("child-score"),
  childScoreLabel: $("child-score-label"),
  sourceLabel: $("source-label"),
  themeDots: Array.from(document.querySelectorAll(".theme-dot"))
};

const state = {
  children: [
    { name: "孩子1", correct: 0, wrong: 0 },
    { name: "孩子2", correct: 0, wrong: 0 }
  ],
  customWords: [],
  currentList: [],
  currentWord: null,
  wrongWords: [],
  locked: false
};

const setOf = (value) => new Set(value.split(" "));

const MONTHS = setOf("january february march april may june july august september october november december");
const WEEKDAYS = setOf("monday tuesday wednesday thursday friday saturday sunday");
const SEASONS = setOf("spring summer autumn fall winter");
const NUMBERS = setOf("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred thousand first second third fourth fifth sixth seventh eighth ninth tenth eleventh twelfth thirteenth twentieth once twice");
const PLACES = setOf("america china taiwan usa");
const UNCOUNTABLE = setOf("air art beef bread breakfast business butter cheese coffee coke communication culture dinner education food homework information knowledge lunch milk money music rice tea technology traffic water weather work");
const PLURALS = setOf("chopsticks clothes glasses jeans pants shorts shoes socks");
const VERBS = setOf("agree appear arrive ask bake begin believe belong bite blow boil borrow bow break bring brush build burn buy call care carry catch celebrate change check cheer choose clap clean clear climb close collect comb come cook copy count cover cry cut dance decide develop dig discover do draw drink drive eat exercise feel fill find finish fix fly forget get give go guess have hear help improve jump keep kick know laugh learn leave lend like listen live look love make meet move need open paint pay pick plan play practice pull push put read remember ride ring run say see sell send show sing sit sleep smell smile spell stand start stay study swim take talk taste teach tell think throw touch travel treat try turn understand use visit wait wake walk want wash watch wear win wish worry write");
const ADJECTIVES = setOf("able afraid angry american bad beautiful big blind blue bored boring bright brown busy careful cheap chinese clean clear cloudy cold comfortable common convenient cool correct crazy cute dangerous dark dear delicious different difficult dirty easy empty excited famous fast favorite fine free friendly full funny glad good great green happy hard healthy heavy helpful high hot hungry important interesting kind late lazy light little long loud lovely lucky modern new nice old perfect pink poor pretty quick quiet ready red rich right round sad safe same short shy sick simple slow small smart soft sorry special strong sunny sweet tall terrible thick thin thirsty tidy tired true unhappy useful warm weak wet white windy wise wonderful wrong yellow young yummy");

const helperLessons = {
  "a (an)": lesson("I see a cat and an apple.", "我看到一隻貓和一顆蘋果。", "冠詞 a / an", "a 放在子音開頭名詞前，an 放在母音開頭名詞前。", "a dog / an egg"),
  "a few": lesson("I have a few crayons.", "我有幾枝蠟筆。", "數量詞 a few", "a few 用在可數名詞前，表示幾個。", "a few books"),
  "a little": lesson("I need a little water.", "我需要一點水。", "數量詞 a little", "a little 用在不可數名詞前。", "a little milk"),
  "a lot": lesson("We have a lot of fun.", "我們玩得很開心。", "片語 a lot of", "a lot of 表示很多。", "a lot of toys"),
  "all": lesson("All the kids are ready.", "所有孩子都準備好了。", "限定詞 all", "all 放在複數名詞前，表示全部。", "all the students"),
  "another": lesson("Can I have another cookie?", "我可以再拿一塊餅乾嗎？", "限定詞 another", "another 表示另一個、再一個。", "another + 名詞"),
  "any": lesson("Do you have any questions?", "你有任何問題嗎？", "限定詞 any", "any 常出現在問句和否定句。", "any + 名詞"),
  "anyone": lesson("Is anyone at home?", "有人在家嗎？", "代名詞 anyone", "anyone 表示任何人。", "anyone + 動詞"),
  "anything": lesson("Do you want anything to drink?", "你想喝點什麼嗎？", "代名詞 anything", "anything 表示任何東西。", "anything + 動詞"),
  "be": lesson("I want to be a doctor.", "我想成為醫生。", "動詞 be", "be 會依主詞變成 am、is、are。", "I am / He is / They are"),
  "both": lesson("Both my parents can swim.", "我的爸爸媽媽都會游泳。", "限定詞 both", "both 表示兩個都。", "both + 複數名詞"),
  "can": lesson("I can jump high.", "我會跳得很高。", "助動詞 can", "can 後面接原形動詞。", "can + 動詞"),
  "the": lesson("The sun is bright.", "太陽很亮。", "冠詞 the", "the 用來指特定的人事物。", "the book"),
  "there": lesson("There is a cat on the chair.", "椅子上有一隻貓。", "there is / are", "there is / are 用來表示某處有某物。", "There is a book..."),
  "to": lesson("I want to go to school.", "我想去學校。", "to 的用法", "to 可以表示去某地，也能接動詞。", "go to / want to read"),
  "will": lesson("I will help you tomorrow.", "我明天會幫你。", "助動詞 will", "will 後面接原形動詞，表示未來。", "will + 動詞")
};

const questionExamples = {
  how: ["How are you?", "你好嗎？"],
  what: ["What is this?", "這是什麼？"],
  when: ["When is your birthday?", "你的生日是什麼時候？"],
  where: ["Where is my bag?", "我的書包在哪裡？"],
  which: ["Which color do you like?", "你喜歡哪個顏色？"],
  who: ["Who is your teacher?", "誰是你的老師？"],
  whose: ["Whose book is this?", "這是誰的書？"],
  why: ["Why are you happy?", "你為什麼開心？"]
};

const prepositionExamples = {
  about: ["We read a book about animals.", "我們讀一本關於動物的書。"],
  above: ["The bird is above the tree.", "小鳥在樹的上方。"],
  across: ["The library is across from the park.", "圖書館在公園對面。"],
  after: ["We play after school.", "我們放學後玩。"],
  around: ["We walk around the lake.", "我們繞著湖走。"],
  at: ["We meet at the door.", "我們在門口集合。"],
  before: ["Wash your hands before dinner.", "晚餐前先洗手。"],
  behind: ["The ball is behind the box.", "球在盒子後面。"],
  below: ["The fish is below the boat.", "魚在船的下方。"],
  beside: ["The cat is beside the chair.", "貓在椅子旁邊。"],
  between: ["The teddy bear is between the two boxes.", "泰迪熊在兩個盒子中間。"],
  by: ["I go to school by bus.", "我搭公車去上學。"],
  under: ["The puppy is under the table.", "小狗在桌子下面。"],
  until: ["We wait until Mom comes home.", "我們等到媽媽回家。"],
  with: ["I go to school with my brother.", "我和哥哥一起去上學。"],
  without: ["Do not go out without your hat.", "不要沒戴帽子就出門。"]
};

const adverbExamples = {
  again: ["Please read the word again.", "請再念一次這個單字。"],
  always: ["I always brush my teeth at night.", "我晚上總是刷牙。"],
  already: ["I already finished my homework.", "我已經寫完功課了。"],
  also: ["I like apples, and I also like bananas.", "我喜歡蘋果，也喜歡香蕉。"],
  almost: ["It is almost bedtime.", "快要到睡覺時間了。"],
  then: ["Finish your homework, then play.", "先寫完功課，然後再玩。"],
  today: ["Today is a sunny day.", "今天是晴天。"],
  tomorrow: ["Tomorrow we have a test.", "明天我們有考試。"],
  tonight: ["Tonight we will read a story.", "今晚我們要讀故事。"],
  together: ["We read together every night.", "我們每天晚上一起讀書。"],
  too: ["I am tired, too.", "我也累了。"],
  usually: ["I usually read after dinner.", "我通常在晚餐後讀書。"],
  very: ["The cake is very sweet.", "蛋糕非常甜。"],
  yesterday: ["Yesterday we visited Grandma.", "昨天我們去看奶奶。"]
};

const demonstrativeExamples = {
  this: ["This is my book.", "這是我的書。"],
  that: ["That is my backpack.", "那是我的背包。"],
  these: ["These are my crayons.", "這些是我的蠟筆。"],
  those: ["Those are yellow stars.", "那些是黃色的星星。"]
};

const pronounExamples = {
  we: ["We read together every night.", "我們每天晚上一起讀書。"],
  they: ["They are my friends.", "他們是我的朋友。"],
  you: ["You are a good helper.", "你是很棒的小幫手。"]
};

const conjunctionExamples = {
  and: ["I have a pencil and an eraser.", "我有一枝鉛筆和一塊橡皮擦。"],
  as: ["She sings as well as her sister.", "她唱得和姐姐一樣好。"],
  because: ["I stay home because it is raining.", "我待在家，因為正在下雨。"],
  but: ["I am tired, but I am happy.", "我累了，但是我很開心。"],
  or: ["Do you want milk or juice?", "你想要牛奶還是果汁？"],
  than: ["My bag is bigger than yours.", "我的書包比你的大。"],
  whether: ["I do not know whether it will rain.", "我不知道會不會下雨。"]
};

function lesson(exampleEn, exampleZh, title, note, pattern) {
  return { example: { en: exampleEn, zh: exampleZh }, grammar: { title, note, pattern } };
}

function normalize(text) {
  return String(text || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function firstMeaning(text) {
  return String(text || "").split(/[、，,\/;]/)[0].replace(/[()（）]/g, "").trim();
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sameWord(a, b) {
  return a && b && a.en === b.en && a.zh === b.zh;
}

function uniqueWords(list) {
  const seen = new Set();
  return list.filter((item) => {
    const key = `${item.en}__${item.zh}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function loadChildren() {
  els.childSelect.innerHTML = "";
  state.children.forEach((child, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = child.name;
    els.childSelect.appendChild(option);
  });
}

function selectedChild() {
  return state.children[Number(els.childSelect.value || 0)] || state.children[0];
}

function addChild() {
  const name = window.prompt("請輸入孩子名字");
  if (!name || !name.trim()) return;
  state.children.push({ name: name.trim(), correct: 0, wrong: 0 });
  loadChildren();
  els.childSelect.value = String(state.children.length - 1);
  renderStats();
}

function currentSourceList() {
  if (els.wordSource.value === "junior") return juniorWords;
  if (els.wordSource.value === "custom") return state.customWords;
  if (els.level.value === "2") return elementaryWords2;
  if (els.level.value === "3") return elementaryWords3;
  return elementaryWords1;
}

function sourceLabel() {
  if (els.wordSource.value === "junior") return "國中單字";
  if (els.wordSource.value === "custom") return "自訂單字";
  return els.level.options[els.level.selectedIndex].textContent;
}

function refreshPool(goNext = true) {
  state.currentList = uniqueWords(currentSourceList());
  state.wrongWords = state.wrongWords.filter((word) => state.currentList.some((item) => sameWord(item, word)));
  els.customBox.classList.toggle("hidden", els.wordSource.value !== "custom");
  els.level.disabled = els.wordSource.value !== "elementary";
  els.sourceLabel.textContent = sourceLabel();
  renderStats();
  if (goNext) nextWord();
  else renderSupport();
}

function renderStats() {
  const child = selectedChild();
  const total = child ? child.correct + child.wrong : 0;
  els.poolCount.textContent = String(state.currentList.length);
  els.wrongCount.textContent = String(state.wrongWords.length);
  els.childScore.textContent = child ? `${child.correct} / ${total}` : "0 / 0";
  els.childScoreLabel.textContent = child ? `${child.name} 答對 / 總題數` : "孩子紀錄";
}

function nextWord() {
  state.locked = false;
  if (!state.currentList.length) {
    state.currentWord = null;
    els.wordText.textContent = els.wordSource.value === "custom" ? "先加入自訂單字" : "目前沒有單字";
    els.wordHint.textContent = els.wordSource.value === "custom" ? "請在上方輸入英文,中文" : "請先切換單字來源";
    els.options.innerHTML = "";
    renderSupport();
    renderStats();
    return;
  }

  const pool = state.wrongWords.length && Math.random() < 0.35 ? state.wrongWords : state.currentList;
  state.currentWord = pool[Math.floor(Math.random() * pool.length)];
  els.wordText.textContent = els.mode.value === "en-zh" ? state.currentWord.en : state.currentWord.zh;
  els.wordHint.textContent = els.mode.value === "en-zh" ? "請選出正確的中文" : "請選出正確的英文";
  renderOptions();
  renderSupport();
  renderStats();
}

function renderOptions() {
  els.options.innerHTML = "";
  const choices = shuffle([
    state.currentWord,
    ...shuffle(state.currentList.filter((item) => !sameWord(item, state.currentWord))).slice(0, 3)
  ]);

  choices.forEach((word) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    button.dataset.en = word.en;
    button.dataset.zh = word.zh;
    button.textContent = els.mode.value === "en-zh" ? word.zh : word.en;
    button.addEventListener("click", () => checkAnswer(word, button));
    els.options.appendChild(button);
  });
}

function checkAnswer(word, button) {
  if (state.locked || !state.currentWord) return;
  state.locked = true;
  const correct = sameWord(word, state.currentWord);

  els.options.querySelectorAll("button").forEach((item) => {
    if (item.dataset.en === state.currentWord.en && item.dataset.zh === state.currentWord.zh) {
      item.classList.add("correct");
    }
    item.disabled = true;
  });
  if (!correct) button.classList.add("wrong");

  if (correct) {
    state.wrongWords = state.wrongWords.filter((item) => !sameWord(item, state.currentWord));
  } else if (!state.wrongWords.some((item) => sameWord(item, state.currentWord))) {
    state.wrongWords.push(state.currentWord);
  }

  const child = selectedChild();
  if (child) correct ? child.correct += 1 : child.wrong += 1;
  renderStats();
  window.setTimeout(nextWord, 900);
}

function clearWrong() {
  state.wrongWords = [];
  renderStats();
  window.alert("錯題已清空。");
}

function parseCustomWords(text) {
  return uniqueWords(
    text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.split(","))
      .filter((parts) => parts.length >= 2)
      .map((parts) => ({ en: parts[0].trim(), zh: parts.slice(1).join(",").trim() }))
      .filter((item) => item.en && item.zh)
  );
}

function saveCustomWords() {
  state.customWords = parseCustomWords(els.customWords.value);
  els.wordSource.value = "custom";
  refreshPool();
  window.alert(`已儲存 ${state.customWords.length} 筆自訂單字。`);
}

function importWords(event) {
  const [file] = event.target.files || [];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    els.customWords.value = typeof reader.result === "string" ? reader.result : "";
    saveCustomWords();
    event.target.value = "";
  };
  reader.readAsText(file, "utf-8");
}

function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  els.themeDots.forEach((dot) => dot.classList.toggle("active", dot.dataset.theme === theme));
}

function speakWord() {
  if (!state.currentWord || !window.speechSynthesis) return;
  const speech = new SpeechSynthesisUtterance(state.currentWord.en);
  speech.lang = "en-US";
  speech.rate = 0.9;
  speech.pitch = 1.05;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}

function articleFor(word) {
  const first = normalize(word).split(/[\s-]+/)[0];
  if (["useful", "uniform", "university", "one"].includes(first)) return "a";
  return /^[aeiou]/.test(first) ? "an" : "a";
}

function genericLesson(word) {
  const key = normalize(word.en);
  const meaning = firstMeaning(word.zh);

  if (helperLessons[key]) return helperLessons[key];

  if (questionExamples[key]) {
    return lesson(questionExamples[key][0], questionExamples[key][1], "疑問詞", "疑問詞用來發問，通常放在句首。", `${word.en} ... ?`);
  }

  if (prepositionExamples[key]) {
    return lesson(prepositionExamples[key][0], prepositionExamples[key][1], "介系詞", "介系詞後面通常接名詞，表示位置、時間或方式。", `${word.en} + 名詞`);
  }

  if (adverbExamples[key]) {
    return lesson(adverbExamples[key][0], adverbExamples[key][1], "副詞", "副詞用來補充時間、程度或頻率。", `${word.en} + 句子`);
  }

  if (demonstrativeExamples[key]) {
    return lesson(demonstrativeExamples[key][0], demonstrativeExamples[key][1], "指示詞", "指示詞用來指出近的或遠的人事物。", `${word.en} + 名詞`);
  }

  if (pronounExamples[key]) {
    return lesson(pronounExamples[key][0], pronounExamples[key][1], "代名詞", "代名詞可以代替人或東西的名稱。", `${word.en} + be 動詞`);
  }

  if (conjunctionExamples[key]) {
    return lesson(conjunctionExamples[key][0], conjunctionExamples[key][1], "連接詞", "連接詞用來把兩個字句接起來。", `${word.en} + 句子`);
  }

  if (MONTHS.has(key)) {
    return lesson(`My birthday is in ${word.en}.`, `我的生日在${meaning}。`, "月份", "月份前面常用 in，第一個字母要大寫。", `in ${word.en}`);
  }

  if (WEEKDAYS.has(key)) {
    return lesson(`Today is ${word.en}.`, `今天是${meaning}。`, "星期", "星期前面常用 on，第一個字母要大寫。", `on ${word.en}`);
  }

  if (SEASONS.has(key)) {
    return lesson(`${word.en} is my favorite season.`, `${meaning}是我最喜歡的季節。`, "季節", "季節是時間名詞，常和 in 一起用。", `in ${word.en}`);
  }

  if (NUMBERS.has(key)) {
    if (key === "once" || key === "twice") {
      return lesson(`I read this book ${word.en} a week.`, `我一週讀這本書${meaning}。`, "次數", "once 和 twice 用來表示次數。", `${word.en} a day`);
    }
    if (key.endsWith("th") || ["first", "second", "third"].includes(key)) {
      return lesson(`He is the ${word.en} in line.`, `他排在第${meaning}。`, "序數", "序數表示第幾個，前面常加 the。", `the ${word.en}`);
    }
    return lesson(`I have ${word.en} pencils.`, `我有${meaning}枝鉛筆。`, "數字", "數字放在名詞前，表示數量。", `${word.en} + 名詞`);
  }

  if (PLACES.has(key)) {
    return lesson(`I want to visit ${word.en}.`, `我想去${meaning}。`, "專有名詞", "國家和地名第一個字母要大寫。", word.en);
  }

  if (VERBS.has(key)) {
    return lesson(`I can ${word.en} today.`, `我今天可以${meaning}。`, "動詞", "動詞表示動作或狀態，常放在主詞後面。", `I can ${word.en}.`);
  }

  if (ADJECTIVES.has(key) || /(ous|ful|able|ible|ive|less|ish|ic|al)$/.test(key)) {
    return lesson(`The toy is ${word.en}.`, `這個玩具很${meaning}。`, "形容詞", "形容詞用來描述人或東西，常放在 be 動詞後面。", `be + ${word.en}`);
  }

  if (/ly$/.test(key) && !["family", "friendly", "lovely"].includes(key)) {
    return lesson(`We use "${word.en}" to make the sentence clearer.`, `我們可以用「${meaning}」讓句子更完整。`, "副詞", "副詞用來補充動作、時間或程度。", `${word.en} + 句子`);
  }

  if (PLURALS.has(key)) {
    return lesson(`These are ${word.en}.`, `這些是${meaning}。`, "名詞", "複數名詞常和 these / those 一起用。", `these ${word.en}`);
  }

  if (UNCOUNTABLE.has(key)) {
    return lesson(`This is ${word.en}.`, `這是${meaning}。`, "名詞", "不可數名詞前面通常不直接加 a / an。", word.en);
  }

  const article = articleFor(word.en);
  return lesson(`I see ${article} ${word.en}.`, `我看到一個${meaning}。`, "名詞", "名詞可以表示人、事、物，單數常搭配 a / an。", `${article} ${word.en}`);
}

function renderSupport() {
  if (!state.currentWord) {
    els.exampleContent.innerHTML = '<p class="placeholder-text">選好單字後，這裡會出現例句。</p>';
    els.grammarContent.innerHTML = '<p class="placeholder-text">選好單字後，這裡會出現文法小提示。</p>';
    return;
  }

  const info = genericLesson(state.currentWord);

  if (els.showExample.checked) {
    els.exampleContent.innerHTML = `
      <p class="sentence-en">${escapeHtml(info.example.en)}</p>
      <p class="sentence-zh">${escapeHtml(info.example.zh)}</p>
    `;
  } else {
    els.exampleContent.innerHTML = '<p class="placeholder-text">例句已關閉。</p>';
  }

  if (els.showGrammar.checked) {
    els.grammarContent.innerHTML = `
      <p class="grammar-title">${escapeHtml(info.grammar.title)}</p>
      <p class="grammar-note">${escapeHtml(info.grammar.note)}</p>
      <p class="grammar-pattern">句型小抄：${escapeHtml(info.grammar.pattern)}</p>
    `;
  } else {
    els.grammarContent.innerHTML = '<p class="placeholder-text">文法已關閉。</p>';
  }
}

function bindEvents() {
  els.addChildBtn.addEventListener("click", addChild);
  els.saveCustomBtn.addEventListener("click", saveCustomWords);
  els.importBtn.addEventListener("click", () => els.fileInput.click());
  els.fileInput.addEventListener("change", importWords);
  els.nextBtn.addEventListener("click", nextWord);
  els.clearWrongBtn.addEventListener("click", clearWrong);
  els.wordSource.addEventListener("change", () => refreshPool());
  els.level.addEventListener("change", () => refreshPool());
  els.mode.addEventListener("change", () => refreshPool());
  els.childSelect.addEventListener("change", renderStats);
  els.showExample.addEventListener("change", renderSupport);
  els.showGrammar.addEventListener("change", renderSupport);
  els.wordText.addEventListener("click", speakWord);
  els.themeDots.forEach((dot) => dot.addEventListener("click", () => applyTheme(dot.dataset.theme)));
}

function init() {
  loadChildren();
  bindEvents();
  applyTheme("light");
  refreshPool();
}

init();
