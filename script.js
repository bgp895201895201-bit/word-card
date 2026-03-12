const wordList = [
{en:"apple",zh:"蘋果"},
{en:"dog",zh:"狗"},
{en:"cat",zh:"貓"},
{en:"book",zh:"書"},
{en:"water",zh:"水"}
];

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

children.push({
name:name,
correct:0,
wrong:0
});

loadChildren();

}

function nextWord(){

const word=wordList[Math.floor(Math.random()*wordList.length)];

currentWord=word;

mode=document.getElementById("mode").value;

wordText.textContent= mode==="en-zh"?word.en:word.zh;

optionsDiv.innerHTML="";

let options=[word];

while(options.length<4){

let w=wordList[Math.floor(Math.random()*wordList.length)];

if(!options.includes(w)) options.push(w);

}

options.sort(()=>Math.random()-0.5);

options.forEach(w=>{

let btn=document.createElement("button");

btn.textContent=mode==="en-zh"?w.zh:w.en;

btn.onclick=()=>checkAnswer(w);

optionsDiv.appendChild(btn);

});

}

function checkAnswer(w){

let correct = w===currentWord;

const buttons=optionsDiv.querySelectorAll("button");

buttons.forEach(btn=>{

if(btn.textContent === (mode==="en-zh"?currentWord.zh:currentWord.en)){
btn.classList.add("correct");
}

});

if(!correct){

event.target.classList.add("wrong");

}

setTimeout(nextWord,800);

}

wordText.onclick=function(){

let text=currentWord.en;

let speech=new SpeechSynthesisUtterance(text);

speech.lang="en-US";

speechSynthesis.speak(speech);

};

document.querySelectorAll(".theme-dot").forEach(dot=>{

dot.onclick=function(){

document.body.setAttribute("data-theme",this.dataset.theme);

};

});

loadChildren();

nextWord();
