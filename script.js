
const $=s=>document.querySelector(s), app=$("#app");
const bases={DEC:10,BIN:2,OCT:8,HEX:16};
const state=JSON.parse(localStorage.getItem("nv_state")||'{"xp":0,"streak":0,"bestStreak":0,"completedLessons":[],"quizScores":[],"practiceCorrect":0,"practiceTotal":0}');
let authenticated=localStorage.getItem("nv_auth")==="1", route="home", quiz=null, practice=null;
function save(){localStorage.setItem("nv_state",JSON.stringify(state))}
function valid(v,b){if(!v)return false;return ({DEC:/^[0-9]+$/,BIN:/^[01]+$/,OCT:/^[0-7]+$/,HEX:/^[0-9a-f]+$/i})[b].test(v)}
function convert(v,from,to){if(!valid(v,from))throw Error("Invalid number for "+from);return parseInt(v,bases[from]).toString(bases[to]).toUpperCase()}
function steps(v,from,to){
 const n=parseInt(v,bases[from]), out=convert(v,from,to), b=bases[to], arr=[];
 arr.push(`Interpret ${v} as base ${bases[from]} → decimal value ${n}.`);
 if(to==="DEC") arr.push(`The decimal result is ${n}.`);
 else {let x=n;if(x===0)arr.push(`0 in any base is 0.`);else{while(x>0){let q=Math.floor(x/b),r=x%b;arr.push(`${x} ÷ ${b} = ${q}, remainder ${r<10?r:String.fromCharCode(55+r)}`);x=q}arr.push(`Read the remainders from bottom to top → ${out}.`)}}
 return arr;
}
function addXP(n){state.xp+=n;save()}
function top(){return `<div class="top"><div class="brand">Number<span>Verse</span></div><button class="iconbtn" onclick="toggleTheme()">◐</button></div>`}
function nav(){let items=[["home","⌂","Home"],["learn","📘","Learn"],["converter","⇄","Convert"],["practice","✎","Practice"],["quiz","🎯","Quiz"],["progress","🏆","Progress"]];return `<div class="nav">${items.map(x=>`<button class="${route===x[0]?'active':''}" onclick="go('${x[0]}')"><b>${x[1]}</b>${x[2]}</button>`).join("")}</div>`}
function shell(body){app.innerHTML=`<main class="shell">${top()}${body}</main>${nav()}`}
function go(r){route=r;render()}
function toggleTheme(){document.body.classList.toggle("dark");localStorage.setItem("nv_theme",document.body.classList.contains("dark")?"dark":"light")}
if(localStorage.getItem("nv_theme")!=="light")document.body.classList.add("dark");
function login(){let p=$("#pw").value, stored=localStorage.getItem("nv_password")||"learn123";if(p===stored){authenticated=true;localStorage.setItem("nv_auth","1");render()}else $("#err").textContent="Incorrect password"}
function logout(){localStorage.removeItem("nv_auth");authenticated=false;render()}
function auth(){app.innerHTML=`<div class="auth"><div class="card authbox"><div class="logo">🔢</div><div class="center"><h1>NumberVerse</h1><p class="muted">Master number systems through gamified learning</p></div><input id="pw" class="field" type="password" placeholder="Enter password" onkeydown="if(event.key==='Enter')login()"><p id="err" class="error"></p><button class="btn primary block" onclick="login()">Enter NumberVerse</button><p class="center muted"><small>Default password: <code>learn123</code></small></p></div></div>`}
function home(){
 let lvl=Math.floor(state.xp/100)+1,pct=state.xp%100;
 shell(`<section class="hero"><span class="pill">LEVEL ${lvl}</span><h1>Learn. Convert. Master.</h1><p>Explore decimal, binary, octal and hexadecimal through interactive lessons, practice and quizzes.</p><button class="btn" onclick="go('learn')">Start Learning →</button></section>
 <div class="grid"><div class="card"><div class="muted">Total XP</div><div class="big">${state.xp} XP</div><div class="progress"><i style="width:${pct}%"></i></div></div><div class="card"><div class="muted">Practice Accuracy</div><div class="big">${state.practiceTotal?Math.round(state.practiceCorrect/state.practiceTotal*100):0}%</div></div></div>
 <h2 class="section-title">Quick Actions</h2><div class="grid"><div class="card" onclick="go('converter')"><div class="big">⇄</div><h3>Smart Converter</h3><p class="muted">Convert between all four number systems with steps.</p></div><div class="card" onclick="go('quiz')"><div class="big">🎯</div><h3>Take a Quiz</h3><p class="muted">Test your conversion skills and earn XP.</p></div></div>`)
}
const lessonData={
 DEC:["Decimal Number System","Base 10 uses digits 0–9. Each position represents a power of 10.","Example: 347 = 3×10² + 4×10¹ + 7×10⁰."],
 BIN:["Binary Number System","Base 2 uses only 0 and 1. It is the fundamental language of digital systems.","Example: 1011₂ = 1×8 + 0×4 + 1×2 + 1 = 11₁₀."],
 OCT:["Octal Number System","Base 8 uses digits 0–7. Each octal digit maps neatly to three binary bits.","Example: 57₈ = 5×8 + 7 = 47₁₀."],
 HEX:["Hexadecimal Number System","Base 16 uses 0–9 and A–F, where A=10 through F=15.","Example: 2F₁₆ = 2×16 + 15 = 47₁₀."]
};
function learn(){shell(`<h1>Learn Number Systems</h1><p class="muted">Choose a lesson and build your foundation.</p><div class="grid">${Object.entries(lessonData).map(([k,v])=>`<div class="card"><span class="pill">${k}</span><h3>${v[0]}</h3><p class="muted">${v[1]}</p><button class="btn primary" onclick="openLesson('${k}')">${state.completedLessons.includes(k)?"Review ✓":"Start Lesson"}</button></div>`).join("")}</div><div class="card"><h3>About NumberVerse</h3><p class="muted">A mobile-first learning experience converted from the original React + TypeScript project into dependency-free HTML, CSS and JavaScript.</p></div>`)}
function openLesson(k){let v=lessonData[k];shell(`<div class="card lesson"><button class="btn" onclick="go('learn')">← Back</button><h1>${v[0]}</h1><h2>Concept</h2><p>${v[1]}</p><h2>Worked Example</h2><p>${v[2]}</p><h2>Key Idea</h2><p>To convert to decimal, multiply each digit by its positional base power. To convert from decimal, repeatedly divide by the target base and read remainders upward.</p><button class="btn primary" onclick="completeLesson('${k}')">Mark Complete +20 XP</button></div>`)}
function completeLesson(k){if(!state.completedLessons.includes(k)){state.completedLessons.push(k);addXP(20)}save();go("learn")}
function converter(){shell(`<h1>Number Converter</h1><p class="muted">Convert instantly and view the method step by step.</p><div class="card"><div class="row"><select id="from" class="field">${opts("DEC")}</select><select id="to" class="field">${opts("BIN")}</select></div><input id="num" class="field" style="margin-top:12px" placeholder="Enter a number"><button class="btn primary block" style="margin-top:12px" onclick="doConvert()">Convert & Show Steps</button><div id="convout"></div></div>`)}
function opts(sel){return Object.keys(bases).map(x=>`<option ${x===sel?"selected":""}>${x}</option>`).join("")}
function doConvert(){let v=$("#num").value.trim(),f=$("#from").value,t=$("#to").value,o=$("#convout");try{let r=convert(v,f,t);o.innerHTML=`<h3>Result</h3><div class="result">${r}<sub>(${bases[t]})</sub></div><div class="steps">${steps(v,f,t).map((s,i)=>`<div class="step"><b>Step ${i+1}</b><br>${s}</div>`).join("")}</div>`}catch(e){o.innerHTML=`<p class="error">${e.message}</p>`}}
function makeQ(){let fs=Object.keys(bases),from=fs[Math.floor(Math.random()*4)],to;do{to=fs[Math.floor(Math.random()*4)]}while(to===from);let n=Math.floor(Math.random()*120)+1,v=n.toString(bases[from]).toUpperCase();return{from,to,v,ans:n.toString(bases[to]).toUpperCase()}}
function practicePage(){practice=practice||makeQ();shell(`<h1>Practice</h1><p class="muted">Solve unlimited conversion exercises.</p><div class="card"><span class="pill">${practice.from} → ${practice.to}</span><h2>Convert ${practice.v}<sub>(${bases[practice.from]})</sub> to ${practice.to}</h2><input id="pans" class="field" placeholder="Your answer"><button class="btn primary block" style="margin-top:12px" onclick="checkPractice()">Check Answer</button><div id="pmsg"></div></div>`)}
function checkPractice(){let a=$("#pans").value.trim().toUpperCase(),ok=a===practice.ans;state.practiceTotal++;if(ok){state.practiceCorrect++;addXP(10)}save();$("#pmsg").innerHTML=`<p class="${ok?'':'error'}"><b>${ok?'Correct! +10 XP':'Not quite.'}</b> Answer: ${practice.ans}</p><button class="btn" onclick="nextPractice()">Next Question →</button>`}
function nextPractice(){practice=makeQ();practicePage()}
function startQuiz(){quiz={i:0,score:0,qs:Array.from({length:10},makeQ)};quizView()}
function quizPage(){shell(`<h1>Quiz Challenge</h1><div class="card center"><div class="big">🎯</div><h2>10-Question Challenge</h2><p class="muted">Answer number-system conversions. Earn 10 XP for every correct answer.</p><button class="btn primary" onclick="startQuiz()">Start Quiz</button></div>`)}
function quizView(){let q=quiz.qs[quiz.i];shell(`<div class="row"><h2>Quiz</h2><div>Question ${quiz.i+1}/10</div></div><div class="progress"><i style="width:${quiz.i*10}%"></i></div><div class="card" style="margin-top:18px"><span class="pill">${q.from} → ${q.to}</span><h2>Convert ${q.v}<sub>(${bases[q.from]})</sub> to ${q.to}</h2><input id="qans" class="field"><button class="btn primary block" style="margin-top:12px" onclick="answerQuiz()">Submit Answer</button><div id="qmsg"></div></div>`)}
function answerQuiz(){let q=quiz.qs[quiz.i],ok=$("#qans").value.trim().toUpperCase()===q.ans;if(ok){quiz.score++;addXP(10)}$("#qmsg").innerHTML=`<p>${ok?"✓ Correct!":"✗ Answer: "+q.ans}</p>`;setTimeout(()=>{quiz.i++;if(quiz.i<10)quizView();else finishQuiz()},650)}
function finishQuiz(){state.quizScores.push(quiz.score);save();shell(`<div class="card center"><div class="big">🏆</div><h1>Quiz Complete</h1><div class="big">${quiz.score}/10</div><p class="muted">You earned ${quiz.score*10} XP.</p><button class="btn primary" onclick="quiz=null;go('progress')">View Progress</button></div>`)}
function progress(){let lvl=Math.floor(state.xp/100)+1,pct=state.xp%100,best=state.quizScores.length?Math.max(...state.quizScores):0;shell(`<h1>Your Progress</h1><div class="card"><div class="row"><div><span class="pill">LEVEL ${lvl}</span><div class="big">${state.xp} XP</div></div><div class="center"><div class="big">${state.completedLessons.length}/4</div><div class="muted">Lessons</div></div></div><div class="progress"><i style="width:${pct}%"></i></div><p class="muted">${pct}/100 XP to next level</p></div><div class="grid"><div class="card"><h3>🏆 Best Quiz</h3><div class="big">${best}/10</div></div><div class="card"><h3>🎯 Practice</h3><div class="big">${state.practiceCorrect}/${state.practiceTotal}</div></div></div><div class="card"><h3>Achievements</h3><p>${state.xp>=100?"🏅 Century Club — 100+ XP":"🔒 Century Club — Reach 100 XP"}</p><p>${state.completedLessons.length===4?"📚 Number Master — All lessons complete":"🔒 Number Master — Complete all lessons"}</p><button class="btn" onclick="logout()">Log Out</button></div>`)}
function render(){if(!authenticated)return auth();({home,learn,converter,practice:practicePage,quiz:quizPage,progress}[route]||home)()}
render();
