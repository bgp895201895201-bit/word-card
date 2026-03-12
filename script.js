let children = JSON.parse(localStorage.getItem("children")||"null") || [];
let currentChild = null;
let wordList = [];
let currentIndex = 0;
let stats = {correct:0, wrong:0};
let mode = "en-zh";

const wordText = document.getElementById("word-text");
const optionsDiv = document.getElementById("options");
const statsP = document.getElementById("stats");
const exampleContent = document.getElementById("example-content");

function init() {
    if(!children || children.length===0){
    children = [
        {name:"孩子1", progress:0, wrong:[], custom:[]},
        {name:"孩子2", progress:0, wrong:[], custom:[]}
    ];
    saveChildren();
    }
    populateChildSelect();
    selectChild(0);
}

function saveChildren(){ localStorage.setItem("children", JSON.stringify(children)); }
function populateChildSelect(){
    const sel = document.getElementById("child-select");
    sel.innerHTML="";
    children.forEach((c,i)=>{
        let o=document.createElement("option"); o.value=i; o.text=c.name; sel.add(o);
    });
}
function selectChild(index){
    currentChild = children[index];
    loadWords();
}
document.getElementById("child-select").addEventListener("change", e=>selectChild(parseInt(e.target.value)));

function addChild(){
    let name = prompt("輸入孩子名字:");
    if(name){ children.push({name, progress:0, wrong:[], custom:[]}); saveChildren(); populateChildSelect(); }
}
function editChild(){
    let index = document.getElementById("child-select").value;
    let name = prompt("修改名字:", children[index].name);
    if(name){ children[index].name=name; saveChildren(); populateChildSelect(); }
}
function deleteChild(){
    let index = document.getElementById("child-select").value;
    if(confirm("確定刪除?")){ children.splice(index,1); saveChildren(); populateChildSelect(); selectChild(0);}
}

// 載入單字
function loadWords(){
    const src = document.getElementById("source-select").value;
    if(src==="elementary") wordList = [...elementaryList];
    else if(src==="junior") wordList = [...juniorList];
    else if(src==="wrong") wordList = currentChild.wrong;
    else wordList = currentChild.custom;
    currentIndex = 0;
    stats = {correct:0, wrong:0};
    nextWord();
}
document.getElementById("source-select").addEventListener("change", loadWords);
document.getElementById("mode-select").addEventListener("change", e=>mode=e.target.value);

// 下一題
function nextWord(){
    if(currentIndex>=wordList.length) { alert("已完成!"); return; }
    const word = wordList[currentIndex];
    wordText.textContent = mode==="zh-en"? word.zh : word.en;

    optionsDiv.innerHTML="";
    let opts = [word];
    while(opts.length<4){
        let randomWord = wordList[Math.floor(Math.random()*wordList.length)];
        if(!opts.includes(randomWord)) opts.push(randomWord);
    }
    opts = opts.sort(()=>Math.random()-0.5);
    opts.forEach(o=>{
        let btn = document.createElement("button");
        btn.textContent = mode==="zh-en"? o.en:o.zh;
        btn.onclick = (e)=>checkAnswer(o,e);
        optionsDiv.appendChild(btn);
    });
    updateStats();
}
function checkAnswer(selected,e){

    const word = wordList[currentIndex];

    let correct =
    (mode==="zh-en"? selected.en : selected.zh) ===
    (mode==="zh-en"? word.en : word.zh);

    const buttons = optionsDiv.querySelectorAll("button");

    buttons.forEach(btn=>{
        if(btn.textContent === (mode==="zh-en"? word.en : word.zh)){
            btn.classList.add("correct");
        }
    });

    if(correct){
        stats.correct++;
    }else{
        stats.wrong++;

        const clickedButton = e.target;
        clickedButton.classList.add("wrong");

        currentChild.wrong.push(word);
        saveChildren();
    }

    updateStats();

    setTimeout(()=>{
        currentIndex++;
        nextWord();
    },800);
}
function updateStats(){ statsP.textContent=`正確: ${stats.correct} 錯誤: ${stats.wrong}`; }

// 發音
wordText.addEventListener("click", ()=>{
    const word = wordList[currentIndex];
    if(!word) return;

    let utter = new SpeechSynthesisUtterance(word.en);
    utter.lang="en-US";
    speechSynthesis.speak(utter);
});
   
// 例句功能
function toggleExample(){
    if(exampleContent.style.display==="none"){
        const word = wordList[currentIndex];
        exampleContent.innerHTML=`例句: ${word.example}<br>文法: ${word.en} 是單字`;
        exampleContent.style.display="block";
    }else{ exampleContent.style.display="none"; }
}

// 匯出 / 匯入
function exportData(){
    const data = JSON.stringify(children);
    const blob = new Blob([data],{type:"application/json"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="word_data.json";
    a.click();
}
function importData(e){
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = ()=>{
        children=JSON.parse(reader.result);
        saveChildren(); populateChildSelect(); selectChild(0);
    };
    reader.readAsText(file);
}

// 主題切換
document.querySelectorAll(".theme-dot").forEach(dot=>{
    dot.addEventListener("click", ()=>{
        document.body.dataset.theme = dot.dataset.theme;
    });


init();





