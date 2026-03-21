// ===== 狀態 =====
let wrongWords = [];
let customWords = [];
let currentList = [];
let currentWord;
let mode = "en-zh";

// ⭐ 新增：避免篩選卡住
let filteredList = [];

// DOM
const wordText = document.getElementById("word-text");
const optionsDiv = document.getElementById("options");
const childSelect = document.getElementById("child-select");

// ===== 孩子系統 =====
let children = [
  { name: "孩子1", correct: 0, wrong: 0 },
  { name: "孩子2", correct: 0, wrong: 0 }
];

function loadChildren(){
  childSelect.innerHTML="";
  children.forEach((c,i)=>{
    let opt=document.createElement("option");
    opt.value=i;
    opt.textContent=c.name;
    childSelect.appendChild(opt);
  });
}

function addChild(){
  let name=prompt("孩子名字");
  if(!name)return;

  children.push({name:name,correct:0,wrong:0});
  loadChildren();
}

// ===== 單字來源 =====
function loadWordSource(){

  let source=document.getElementById("word-source").value;

  document.getElementById("custom-box").style.display =
  source==="custom" ? "block" : "none";

  if(source==="elementary") currentList = elementaryWords;
  if(source==="junior") currentList = juniorWords;
  if(source==="custom") currentList = customWords;

  // ⭐ 關鍵：清空篩選
  filteredList = [];

  nextWord();
  showExample();
}

document.getElementById("word-source").onchange = loadWordSource;


// ===== 自訂單字（已修正BUG🔥）=====
function saveCustomWords(){

  let text = document.getElementById("customWords").value;
  let lines = text.split("\n");

  customWords = [];

  lines.forEach(line=>{
    let parts = line.split(",");

    if(parts.length===2){
      customWords.push({
        en: parts[0].trim(),
        zh: parts[1].trim(),
        category: "custom"
      });
    }
  });

  alert("自訂單字已儲存");

  // ⭐ 強制切到 custom
  document.getElementById("word-source").value = "custom";

  loadWordSource();
}


// ===== 題目（含錯題機制）=====
function nextWord(){

  let list = filteredList.length ? filteredList : currentList;

  if(list.length === 0){
    wordText.textContent = "沒有單字";
    optionsDiv.innerHTML = "";
    return;
  }

  let useWrong = Math.random() < 0.4 && wrongWords.length > 0;
  let pool = useWrong ? wrongWords : list;

  currentWord = pool[Math.floor(Math.random()*pool.length)];

  mode = document.getElementById("mode").value;

  wordText.textContent = mode==="en-zh" ? currentWord.en : currentWord.zh;

  optionsDiv.innerHTML = "";

  let options = [currentWord];

  // ⭐ 修正：選項來源用 list
  while(options.length < 4 && list.length > 3){
    let w = list[Math.floor(Math.random()*list.length)];
    if(!options.includes(w)) options.push(w);
  }

  options.sort(()=>Math.random()-0.5);

  options.forEach(w=>{
    let btn = document.createElement("button");
    btn.textContent = mode==="en-zh" ? w.zh : w.en;
    btn.onclick = (e)=>checkAnswer(w,e);
    optionsDiv.appendChild(btn);
  });
}


// ===== 判斷答案 =====
function checkAnswer(w,e){

  let correct = w === currentWord;

  const buttons = optionsDiv.querySelectorAll("button");

  buttons.forEach(btn=>{
    if(btn.textContent === (mode==="en-zh"?currentWord.zh:currentWord.en)){
      btn.classList.add("correct");
    }
  });

  if(!correct){
    e.target.classList.add("wrong");

    if(!wrongWords.some(item=>item.en===currentWord.en)){
      wrongWords.push(currentWord);
    }

  }else{
    wrongWords = wrongWords.filter(item=>item.en!==currentWord.en);
  }

  setTimeout(nextWord,800);
}


// ===== 發音 =====
wordText.addEventListener("click", function(){

  if(!currentWord) return;

  let speech = new SpeechSynthesisUtterance(currentWord.en);
  speech.lang = "en-US";
  speech.rate = 0.9;
  speech.pitch = 1;

  speechSynthesis.cancel();
  speechSynthesis.speak(speech);

});


// ===== 主題 =====
document.querySelectorAll(".theme-dot").forEach(dot=>{
  dot.onclick=function(){
    document.body.setAttribute("data-theme",this.dataset.theme);
  };
});


// ===== 清除錯題 =====
function clearWrong(){
  wrongWords = [];
  alert("錯題已清空！");
}


// ===== 初始化 =====
loadChildren();
loadWordSource();


// ===== 如果你有1200單字（保留）=====
let elementary_1 = fullWordList.slice(0, 400);
let elementary_2 = fullWordList.slice(400, 800);
let elementary_3 = fullWordList.slice(800, 1200);

// ===== 例句資料（先放幾個示範）=====
let exampleData = {
  apple: "I eat an apple every day.（我每天吃一顆蘋果）",
  dog: "The dog is very cute.（這隻狗很可愛）",
  run: "I run in the park.（我在公園跑步）",
  book: "This book is interesting.（這本書很有趣）"
};


// ===== 顯示例句 =====
function showExample(){

let box = document.getElementById("example-box");
let checkbox = document.getElementById("showExample");

if(!checkbox.checked){
  box.innerHTML = "";
  return;
}

if(!currentWord){
  box.innerHTML = "";
  return;
}

// ⭐ 抓英文key
let key = currentWord.en.toLowerCase();

if(exampleData[key]){
    box.innerHTML = exampleData[key]; 
  }else{
    box.innerHTML = "（目前沒有例句）";
  }

}
