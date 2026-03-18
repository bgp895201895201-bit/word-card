let wrongWords = [];

let customWords=[];
let currentList=[];
let currentWord;
let mode="en-zh";

const wordText=document.getElementById("word-text");
const optionsDiv=document.getElementById("options");

const childSelect=document.getElementById("child-select");

let children=[
{name:"孩子1",correct:0,wrong:0},
{name:"孩子2",correct:0,wrong:0}
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

/* 單字來源 */
function loadWordSource(){

let source=document.getElementById("word-source").value;

document.getElementById("custom-box").style.display=
source==="custom"?"block":"none";

if(source==="elementary") currentList=elementaryWords;
if(source==="junior") currentList=juniorWords;
if(source==="custom") currentList=customWords;

nextWord();
}

document.getElementById("word-source").onchange=loadWordSource;

/* 自訂單字 */
function saveCustomWords(){

let text=document.getElementById("customWords").value;
let lines=text.split("\n");

customWords=[];

lines.forEach(line=>{
let parts=line.split(",");
if(parts.length===2){
customWords.push({
en:parts.trim(),
zh:parts.trim()
});
}
});

alert("自訂單字已儲存");
}

/* 題目（含錯題機制） */
function nextWord(){

if(currentList.length===0) return;

let useWrong = Math.random()<0.4 && wrongWords.length>0;
let pool = useWrong ? wrongWords : currentList;

const word=pool[Math.floor(Math.random()*pool.length)];
currentWord=word;

mode=document.getElementById("mode").value;

wordText.textContent=mode==="en-zh"?word.en:word.zh;

optionsDiv.innerHTML="";

let options=[word];

while(options.length<4 && currentList.length>3){
let w=currentList[Math.floor(Math.random()*currentList.length)];
if(!options.includes(w)) options.push(w);
}

options.sort(()=>Math.random()-0.5);

options.forEach(w=>{
let btn=document.createElement("button");
btn.textContent=mode==="en-zh"?w.zh:w.en;
btn.onclick=(e)=>checkAnswer(w,e);
optionsDiv.appendChild(btn);
});
}

/* 判斷答案 */
function checkAnswer(w,e){

let correct=w===currentWord;

const buttons=optionsDiv.querySelectorAll("button");

buttons.forEach(btn=>{
if(btn.textContent === (mode==="en-zh"?currentWord.zh:currentWord.en)){
btn.classList.add("correct");
}
});

if(!correct){
e.target.classList.add("wrong");

if(!wrongWords.includes(currentWord)){
wrongWords.push(currentWord);
}

}else{
wrongWords = wrongWords.filter(item=>item!==currentWord);
}

setTimeout(nextWord,800);
}

/* 發音 */
wordText.onclick=function(){
let speech=new SpeechSynthesisUtterance(currentWord.en);
speech.lang="en-US";
speechSynthesis.speak(speech);
};

/* 主題 */
document.querySelectorAll(".theme-dot").forEach(dot=>{
dot.onclick=function(){
document.body.setAttribute("data-theme",this.dataset.theme);
};
});

/* 清除錯題 */
function clearWrong(){
wrongWords = [];
alert("錯題已清空！");
}

/* 初始化 */
loadChildren();
loadWordSource();



