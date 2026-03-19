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
wordText.addEventListener("click", function(){

if(!currentWord) return;

let speech=new SpeechSynthesisUtterance(currentWord.en);
speech.lang="en-US";
speech.rate=0.9;   // 慢一點比較清楚
speech.pitch=1;

speechSynthesis.cancel(); // 防止卡住
speechSynthesis.speak(speech);

});


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

if(source==="e1") currentList = elementary_1;
if(source==="e2") currentList = elementary_2;
if(source==="e3") currentList = elementary_3;

/* ===== 完整單字庫（已修正） ===== */
let fullWordList = [

{en:"a (an)",zh:"一(個)"},
{en:"a few",zh:"一些"},
{en:"a little",zh:"一些"},
{en:"a lot",zh:"許多"},
{en:"able",zh:"能夠...的"},
{en:"about",zh:"關於"},
{en:"above",zh:"在...上方"},
{en:"abroad",zh:"在國外"},
{en:"across",zh:"在...對面"},
{en:"actress",zh:"女演員"},
{en:"afraid",zh:"害怕的"},
{en:"after",zh:"在...之後"},
{en:"afternoon",zh:"下午"},
{en:"again",zh:"再一次"},
{en:"age",zh:"年齡"},
{en:"ago",zh:"以前"},
{en:"agree",zh:"同意"},
{en:"ahead",zh:"在前方"},
{en:"air",zh:"空氣"},
{en:"airplane",zh:"飛機"},
{en:"airport",zh:"機場"},
{en:"all",zh:"全部的"},
{en:"almost",zh:"幾乎"},
{en:"along",zh:"沿著"},
{en:"already",zh:"已經"},
{en:"also",zh:"也"},
{en:"always",zh:"總是"},
{en:"a.m.",zh:"上午"},
{en:"America",zh:"美國"},
{en:"American",zh:"美國人:美國的"},
{en:"and",zh:"和"},
{en:"angry",zh:"生氣的"},
{en:"animal",zh:"動物"},
{en:"another",zh:"另一個的"},
{en:"answer",zh:"回答"},
{en:"ant",zh:"螞蟻"},
{en:"any",zh:"任何的"},
{en:"anyone",zh:"任何人"},
{en:"anything",zh:"任何事物"},
{en:"apartment",zh:"公寓"},
{en:"appear",zh:"出現"},
{en:"apple",zh:"蘋果"},
{en:"April",zh:"四月"},
{en:"arm",zh:"手臂"},
{en:"around",zh:"在...四周"},
{en:"arrive",zh:"到達"},
{en:"art",zh:"美術"},
{en:"as",zh:"與...一樣"},
{en:"ask",zh:"問"},
{en:"at",zh:"在"},
{en:"August",zh:"八月"},
{en:"aunt",zh:"伯(叔)母"},
{en:"autumn",zh:"秋天"},
{en:"away",zh:"遠離"},
{en:"baby",zh:"嬰兒"},
{en:"back",zh:"在...後面"},
{en:"bad",zh:"壞的"},
{en:"bag",zh:"袋子"},
{en:"ball",zh:"球"},
{en:"banana",zh:"香蕉"},
{en:"bank",zh:"銀行"},
{en:"baseball",zh:"棒球"},
{en:"basketball",zh:"籃球"},
{en:"bath",zh:"洗澡"},
{en:"bathroom",zh:"浴室"},
{en:"be",zh:"是"},
{en:"beach",zh:"海灘"},
{en:"bear",zh:"熊"},
{en:"beautiful",zh:"美麗的"},
{en:"because",zh:"因為"},
{en:"bed",zh:"床"},
{en:"bedroom",zh:"臥室"},
{en:"before",zh:"在...之前"},
{en:"begin",zh:"開始"},
{en:"behind",zh:"在...後面"},
{en:"believe",zh:"相信"},
{en:"below",zh:"在...下方"},
{en:"big",zh:"大的"},
{en:"bird",zh:"鳥"},
{en:"birthday",zh:"生日"},
{en:"black",zh:"黑色"},
{en:"blue",zh:"藍色"},
{en:"boat",zh:"船"},
{en:"book",zh:"書"},
{en:"boy",zh:"男孩"},
{en:"bread",zh:"麵包"},
{en:"breakfast",zh:"早餐"},
{en:"brother",zh:"兄弟"},
{en:"brown",zh:"棕色"},
{en:"bus",zh:"公車"},
{en:"busy",zh:"忙碌的"},
{en:"but",zh:"但是"},
{en:"buy",zh:"買"},
{en:"by",zh:"藉著"},
{en:"cake",zh:"蛋糕"},
{en:"call",zh:"打電話"},
{en:"can",zh:"能夠"},
{en:"car",zh:"車子"},
{en:"cat",zh:"貓"},
{en:"catch",zh:"抓"},
{en:"chair",zh:"椅子"},
{en:"child",zh:"小孩"},
{en:"China",zh:"中國"},
{en:"class",zh:"班級"},
{en:"classroom",zh:"教室"},
{en:"clean",zh:"打掃"},
{en:"clock",zh:"時鐘"},
{en:"close",zh:"關上"},
{en:"clothes",zh:"衣服"},
{en:"cold",zh:"寒冷的"},
{en:"color",zh:"顏色"},
{en:"come",zh:"來"},
{en:"cook",zh:"煮飯"},
{en:"cool",zh:"涼爽的"},
{en:"copy",zh:"抄寫"},
{en:"count",zh:"計算"},
{en:"country",zh:"國家"},
{en:"course",zh:"課程"},
{en:"cow",zh:"牛"},
{en:"cut",zh:"切"},
{en:"dance",zh:"跳舞"},
{en:"dark",zh:"黑暗的"},
{en:"day",zh:"日子"},
{en:"December",zh:"十二月"},
{en:"desk",zh:"書桌"},
{en:"dictionary",zh:"字典"},
{en:"different",zh:"不同的"},
{en:"dinner",zh:"晚餐"},
{en:"doctor",zh:"醫生"},
{en:"dog",zh:"狗"},
{en:"door",zh:"門"},
{en:"down",zh:"向下"},
{en:"draw",zh:"畫"},
{en:"drink",zh:"喝"},
{en:"drive",zh:"駕駛"},
{en:"eat",zh:"吃"},
{en:"egg",zh:"蛋"},
{en:"eight",zh:"八"},
{en:"elephant",zh:"大象"},
{en:"end",zh:"結束"},
{en:"English",zh:"英文"},
{en:"enjoy",zh:"喜歡"},
{en:"eye",zh:"眼睛"},
{en:"face",zh:"臉"},
{en:"family",zh:"家庭"},
{en:"father",zh:"父親"},
{en:"favorite",zh:"最喜歡的"},
{en:"February",zh:"二月"},
{en:"feel",zh:"感覺"},
{en:"fish",zh:"魚"},
{en:"five",zh:"五"},
{en:"food",zh:"食物"},
{en:"foot",zh:"腳"},
{en:"for",zh:"為了"},
{en:"four",zh:"四"},
{en:"friend",zh:"朋友"},
{en:"from",zh:"從"},
{en:"fruit",zh:"水果"},
{en:"game",zh:"遊戲"},
{en:"get",zh:"得到"},
{en:"girl",zh:"女孩"},
{en:"give",zh:"給"},
{en:"go",zh:"去"},
{en:"good",zh:"好的"},
{en:"great",zh:"很棒的"},
{en:"green",zh:"綠色"},
{en:"hair",zh:"頭髮"},
{en:"hand",zh:"手"},
{en:"happy",zh:"快樂的"},
{en:"have",zh:"有"},
{en:"he",zh:"他"},
{en:"head",zh:"頭"},
{en:"help",zh:"幫助"},
{en:"her",zh:"她的"},
{en:"here",zh:"這裡"},
{en:"hi",zh:"嗨"},
{en:"him",zh:"他"},
{en:"his",zh:"他的"},
{en:"home",zh:"家"},
{en:"hot",zh:"熱的"},
{en:"house",zh:"房子"},
{en:"how",zh:"如何"},
{en:"I",zh:"我"},
{en:"ice",zh:"冰"},
{en:"in",zh:"在...裡面"},
{en:"is",zh:"是"},
{en:"it",zh:"它"},
{en:"job",zh:"工作"},
{en:"jump",zh:"跳"},
{en:"June",zh:"六月"},
{en:"just",zh:"只是"},
{en:"keep",zh:"保持"},
{en:"kid",zh:"小孩"},
{en:"kind",zh:"種類"},
{en:"know",zh:"知道"},
{en:"last",zh:"最後的"},
{en:"late",zh:"晚的"},
{en:"learn",zh:"學習"},
{en:"leave",zh:"離開"},
{en:"left",zh:"左邊"},
{en:"leg",zh:"腿"},
{en:"let",zh:"讓"},
{en:"like",zh:"喜歡"},
{en:"line",zh:"線"},
{en:"listen",zh:"聽"},
{en:"little",zh:"小的"},
{en:"live",zh:"住"},
{en:"long",zh:"長的"},
{en:"look",zh:"看"},
{en:"love",zh:"愛"},
{en:"make",zh:"做"},
{en:"man",zh:"男人"},
{en:"many",zh:"很多"},
{en:"March",zh:"三月"},
{en:"May",zh:"五月"},
{en:"me",zh:"我"},
{en:"meet",zh:"遇見"},
{en:"milk",zh:"牛奶"},
{en:"Monday",zh:"星期一"},
{en:"month",zh:"月"},
{en:"more",zh:"更多"},
{en:"morning",zh:"早上"},
{en:"mother",zh:"母親"},
{en:"move",zh:"移動"},
{en:"much",zh:"很多"},
{en:"music",zh:"音樂"},
{en:"my",zh:"我的"},
{en:"name",zh:"名字"},
{en:"need",zh:"需要"},
{en:"new",zh:"新的"},
{en:"night",zh:"晚上"},
{en:"nine",zh:"九"},
{en:"no",zh:"不"},
{en:"not",zh:"不"},
{en:"now",zh:"現在"},
{en:"number",zh:"數字"},
{en:"October",zh:"十月"},
{en:"of",zh:"的"},
{en:"off",zh:"離開"},
{en:"often",zh:"常常"},
{en:"old",zh:"老的"},
{en:"on",zh:"在...上"},
{en:"one",zh:"一"},
{en:"only",zh:"只有"},
{en:"open",zh:"打開"},
{en:"or",zh:"或"},
{en:"other",zh:"其他"},
{en:"our",zh:"我們的"},
{en:"out",zh:"外面"},
{en:"over",zh:"結束"},
{en:"park",zh:"公園"},
{en:"part",zh:"部分"},
{en:"people",zh:"人們"},
{en:"play",zh:"玩"},
{en:"please",zh:"請"},
{en:"read",zh:"閱讀"},
{en:"red",zh:"紅色"},
{en:"run",zh:"跑"},
{en:"school",zh:"學校"},
{en:"see",zh:"看見"},
{en:"she",zh:"她"},
{en:"sit",zh:"坐"},
{en:"six",zh:"六"},
{en:"sleep",zh:"睡覺"},
{en:"small",zh:"小"},
{en:"so",zh:"如此"},
{en:"some",zh:"一些"},
{en:"song",zh:"歌"},
{en:"stand",zh:"站"},
{en:"study",zh:"學習"},
{en:"sun",zh:"太陽"},
{en:"take",zh:"拿"},
{en:"talk",zh:"說話"},
{en:"teacher",zh:"老師"},
{en:"ten",zh:"十"},
{en:"thank",zh:"謝謝"},
{en:"that",zh:"那"},
{en:"the",zh:"這個"},
{en:"their",zh:"他們的"},
{en:"them",zh:"他們"},
{en:"there",zh:"那裡"},
{en:"they",zh:"他們"},
{en:"this",zh:"這"},
{en:"three",zh:"三"},
{en:"time",zh:"時間"},
{en:"to",zh:"到"},
{en:"today",zh:"今天"},
{en:"two",zh:"二"},
{en:"up",zh:"向上"},
{en:"us",zh:"我們"},
{en:"very",zh:"非常"},
{en:"want",zh:"想要"},
{en:"water",zh:"水"},
{en:"way",zh:"方式"},
{en:"we",zh:"我們"},
{en:"what",zh:"什麼"},
{en:"when",zh:"何時"},
{en:"where",zh:"哪裡"},
{en:"which",zh:"哪個"},
{en:"who",zh:"誰"},
{en:"why",zh:"為什麼"},
{en:"will",zh:"將會"},
{en:"with",zh:"和"},
{en:"word",zh:"單字"},
{en:"work",zh:"工作"},
{en:"write",zh:"寫"},
{en:"year",zh:"年"},
{en:"you",zh:"你"},
{en:"your",zh:"你的"}

];

/* ===== 自動切三批 ===== */
let elementary_1 = fullWordList.slice(0, 400);
let elementary_2 = fullWordList.slice(400, 800);
let elementary_3 = fullWordList.slice(800, 1200);

