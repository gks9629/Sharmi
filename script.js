/*
  PERSONALIZE THIS OBJECT.
  Birthday date uses YYYY-MM-DD. The demo defaults match the reference site.
*/
const CONFIG = {
  name: "Her",
  birthday: "2006-02-02",
  signature: "GK Gks",
  // Put a music file at assets/birthday-song.mp3 and keep this path, or set to "".
  musicFile: "assets/birthday-song.mp3"
};

const $ = id => document.getElementById(id);
const birth = new Date(`${CONFIG.birthday}T00:00:00`);
const birthdayParts = CONFIG.birthday.split("-").map(Number);
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const fmtDate = d => `${String(d.getDate()).padStart(2,"0")} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
const fmtShort = d => `${String(d.getDate()).padStart(2,"0")} ${monthNames[d.getMonth()].slice(0,3)} ${d.getFullYear()}`;
const nextBirthday = now => { let d = new Date(now.getFullYear(), birth.getMonth(), birth.getDate()); if (d <= now) d = new Date(now.getFullYear()+1,birth.getMonth(),birth.getDate()); return d; };
const ageAt = date => { let years=date.getFullYear()-birth.getFullYear(), months=date.getMonth()-birth.getMonth(), days=date.getDate()-birth.getDate(); if(days<0){months--;days+=new Date(date.getFullYear(),date.getMonth(),0).getDate()} if(months<0){years--;months+=12} return {years,months,days}; };
const dayWord = d => d.toLocaleDateString(undefined,{weekday:"long"});
function initPersonalText(){
  document.title=`For ${CONFIG.name} · A Birthday Universe`;
  ["hero-name","footer-name"].forEach(id=>$(id).textContent=CONFIG.name);
  $("signature").textContent=CONFIG.signature;
  $("birthday-date-line").textContent=`${String(birthdayParts[2]).padStart(2,"0")} · ${String(birthdayParts[1]).padStart(2,"0")} · ${birthdayParts[0]} — a ${dayWord(birth)}, under a young moon`;
  $("footer-date").textContent=`${String(birthdayParts[1]).padStart(2,"0")} · ${String(birthdayParts[2]).padStart(2,"0")}`;
  $("moon-date-label").textContent=fmtShort(birth);
  $("next-birthday-label").textContent=fmtDate(nextBirthday(new Date()));
}
function updateClock(){
  const now=new Date(), next=nextBirthday(now), diff=Math.max(0,next-now), totalSeconds=Math.floor(diff/1000);
  $("days").textContent=Math.floor(totalSeconds/86400).toString().padStart(3,"0");
  $("hours").textContent=Math.floor(totalSeconds%86400/3600).toString().padStart(2,"0");
  $("minutes").textContent=Math.floor(totalSeconds%3600/60).toString().padStart(2,"0");
  $("seconds").textContent=(totalSeconds%60).toString().padStart(2,"0");
  const age=ageAt(now); $("age-years").textContent=age.years; $("age-months").textContent=`${age.months} months`; $("age-days").textContent=`${age.days} days`;
  $("live-clock").textContent=now.toLocaleTimeString();
  const lived=Math.max(0,now-birth), secs=Math.floor(lived/1000);
  $("days-lived").textContent=Math.floor(secs/86400).toLocaleString();
  $("hours-lived").textContent=Math.floor(secs/3600).toLocaleString();
  $("minutes-lived").textContent=Math.floor(secs/60).toLocaleString();
  $("seconds-lived").textContent=secs.toLocaleString();
  $("full-moons").textContent=Math.floor(lived/(29.53059*86400000)).toLocaleString();
  $("sun-trips").textContent=age.years;
  const last=new Date(now.getFullYear(),birth.getMonth(),birth.getDate()); if(last>now)last.setFullYear(last.getFullYear()-1);
  const span=next-last, pct=Math.max(0,Math.min(100,(now-last)/span*100));
  $("year-progress").textContent=`${pct.toFixed(1)}%`; $("progress-fill").style.width=`${pct}%`;
  $("since-birthday").textContent=`Since her last (${fmtShort(last)})`;
  $("heartbeats").textContent=Math.round(diff/1000*1.2).toLocaleString();
  const upcoming=ageAt(next); const turning=upcoming.years;
  $("turning-age").textContent=turning; $("countdown-age").textContent=turning;
}
$("future-date").addEventListener("change",e=>{if(!e.target.value)return;const d=new Date(`${e.target.value}T12:00:00`);if(d<birth){$("future-age").textContent="That date is before her birthday";return}const a=ageAt(d);$("future-age").textContent=`${a.years} years · ${a.months} months · ${a.days} days`;});

// Approximate lunar phase calculation, adequate for a decorative birthday page.
const SYNODIC=29.530588853, KNOWN_NEW=Date.UTC(2000,0,6,18,14);
function lunarInfo(date){
  const days=(date.getTime()-KNOWN_NEW)/86400000, age=((days%SYNODIC)+SYNODIC)%SYNODIC, phase=age/SYNODIC;
  const illumination=(1-Math.cos(2*Math.PI*phase))/2;
  let name=phase<.035||phase>.965?"New Moon":phase<.22?"Waxing Crescent":phase<.28?"First Quarter":phase<.47?"Waxing Gibbous":phase<.53?"Full Moon":phase<.72?"Waning Gibbous":phase<.78?"Last Quarter":"Waning Crescent";
  return {age,illumination,name,phase};
}
function moonUpdate(){
  const hour=Number($("moon-hour").value), d=new Date(birth);d.setHours(hour);
  $("hour-output").textContent=`${String(hour).padStart(2,"0")}:00`;
  const info=lunarInfo(d);$("moon-phase").textContent=info.name;$("moon-light").textContent=`${(info.illumination*100).toFixed(1)}%`;$("moon-age").textContent=`${info.age.toFixed(1)} days`;
  const distance=384400-20900*Math.cos(2*Math.PI*info.age/SYNODIC);
  $("moon-distance").textContent=`${Math.round(distance).toLocaleString()} km`;
  $("moon-sign").textContent="Not calculated";
  $("moon-phase-visual").textContent=info.name;
  const disc=$("moon-visual-disc");const shift=Math.cos(2*Math.PI*info.phase);
  disc.style.setProperty("--phase",shift);
  disc.style.setProperty("--shadow",`${Math.max(0,Math.min(100,(1-info.illumination)*100))}%`);
  const shadow=disc.querySelector(".shadow-overlay"); if(shadow)shadow.remove();
  const overlay=document.createElement("div");overlay.className="shadow-overlay";
  overlay.style.cssText=`position:absolute;inset:0;border-radius:50%;background:#25243f;opacity:${Math.max(.02,1-info.illumination)};transform:translateX(${info.phase<.5?'-':'+'}${Math.abs(shift)*25}%);mix-blend-mode:multiply`;
  disc.appendChild(overlay);
  const nextFull=new Date(d.getTime()+((SYNODIC/2-info.age+SYNODIC)%SYNODIC)*86400000);
  const nextNew=new Date(d.getTime()+((SYNODIC-info.age)%SYNODIC)*86400000);
  $("next-full").textContent=fmtShort(nextFull);$("next-new").textContent=fmtShort(nextNew);
  $("birth-moon-phase").textContent=lunarInfo(birth).name;
}
$("moon-hour").addEventListener("input",moonUpdate);
$("candles").addEventListener("click",e=>{const c=e.target.closest(".candle");if(c)c.classList.toggle("lit")});
$("relight").addEventListener("click",()=>document.querySelectorAll(".candle").forEach(c=>c.classList.add("lit")));

const audio=$("birthday-audio");audio.src=CONFIG.musicFile;
$("music-toggle").addEventListener("click",async()=>{const btn=$("music-toggle");if(!CONFIG.musicFile){toast("Add your MP3 to assets/birthday-song.mp3 first.");return}if(audio.paused){try{await audio.play();btn.querySelector("span").textContent="Pause her song"}catch{toast("Add a song file to the assets folder first.")}}else{audio.pause();btn.querySelector("span").textContent="Play her song"}});
function toast(message){const t=$("toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600)}

const DB_NAME="birthday-universe-db", STORE="memories";
function openDB(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=()=>req.result.createObjectStore(STORE,{keyPath:"id",autoIncrement:true});req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
async function dbAction(mode,fn){const db=await openDB();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,mode),store=tx.objectStore(STORE),req=fn(store);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close();tx.onerror=()=>reject(tx.error)})}
const getMemories=()=>dbAction("readonly",s=>s.getAll());
const addMemory=record=>dbAction("readwrite",s=>s.add(record));
const deleteMemory=id=>dbAction("readwrite",s=>s.delete(id));
let activeFilter="all", memoryCache=[];
function renderMemories(){
  const grid=$("memory-grid"), items=memoryCache.filter(x=>activeFilter==="all"||x.type===activeFilter);
  if(!items.length){grid.innerHTML=`<div class="empty-state glass"><span>✧</span><h3>Nothing here yet</h3><p>Be the first to drop in a photo, a little video or the song that reminds you of her.</p><button class="button button-quiet" id="add-first">Add the first one ↗</button></div>`;$("add-first").onclick=openMemoryDialog;return}
  grid.innerHTML="";
  items.forEach(item=>{const card=document.createElement("article");card.className="memory-card";
    let media;if(item.type==="image"){media=document.createElement("img");media.src=item.data;media.alt=item.caption||"Birthday memory"}
    else if(item.type==="video"){media=document.createElement("video");media.src=item.data;media.controls=true}
    else{media=document.createElement("audio");media.src=item.data;media.controls=true}
    const cap=document.createElement("p");cap.textContent=item.caption||"A little memory";
    const del=document.createElement("button");del.textContent="×";del.setAttribute("aria-label","Delete memory");del.onclick=async()=>{await deleteMemory(item.id);memoryCache=await getMemories();renderMemories()};
    card.append(media,cap,del);grid.append(card);
  });
}
function openMemoryDialog(){$("memory-dialog").showModal()}
$("add-memory").onclick=openMemoryDialog;
$("add-first").onclick=openMemoryDialog;
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeFilter=b.dataset.filter;renderMemories()}));
$("memory-form").addEventListener("submit",async e=>{e.preventDefault();const files=[...$("memory-files").files];if(!files.length)return;const caption=$("memory-caption").value.trim();try{for(const file of files){if(file.size>4.5*1024*1024){toast(`${file.name} is over 4.5 MB`);continue}const type=file.type.startsWith("image/")?"image":file.type.startsWith("video/")?"video":file.type.startsWith("audio/")?"audio":null;if(!type)continue;const data=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)});await addMemory({type,data,caption,created:Date.now()})}memoryCache=await getMemories();renderMemories();$("memory-dialog").close();$("memory-form").reset();toast("Memory added ♡")}catch(err){toast("Could not save. Browser storage may be full.")}});
$("memory-dialog").querySelector(".modal-close").onclick=()=>$("memory-dialog").close();

function getWishes(){try{return JSON.parse(localStorage.getItem("birthday-wishes")||"[]")}catch{return []}}
function renderWishes(){const list=$("wish-list");list.innerHTML="";getWishes().slice().reverse().forEach(w=>{const card=document.createElement("article");card.className="wish-note glass";const p=document.createElement("p");p.textContent=`“${w.text}”`;const s=document.createElement("small");s.textContent=`— ${w.name}`;card.append(p,s);list.append(card)})}
$("wish-form").addEventListener("submit",e=>{e.preventDefault();const name=$("wish-name").value.trim(),text=$("wish-text").value.trim();if(!name||!text)return;const wishes=getWishes();wishes.push({name,text,created:Date.now()});localStorage.setItem("birthday-wishes",JSON.stringify(wishes));$("wish-form").reset();renderWishes();toast("Your wish has been saved ♡")});

initPersonalText();updateClock();moonUpdate();renderWishes();
getMemories().then(items=>{memoryCache=items;renderMemories()}).catch(()=>toast("Memory storage is not available in this browser."));
setInterval(updateClock,1000);
