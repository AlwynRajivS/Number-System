
const S={page:"home",xp:+localStorage.nv_xp||0,streak:+localStorage.nv_streak||1,correct:+localStorage.nv_correct||0,total:+localStorage.nv_total||0,dark:localStorage.nv_dark==="1"};
if(S.dark)document.body.classList.add("dark");
const $=s=>document.querySelector(s);
function save(){localStorage.nv_xp=S.xp;localStorage.nv_streak=S.streak;localStorage.nv_correct=S.correct;localStorage.nv_total=S.total;localStorage.nv_dark=S.dark?"1":"0"}
function baseValue(ch){ch=ch.toUpperCase();return "0123456789ABCDEF".indexOf(ch)}
function validForBase(v,b){
  v=String(v).trim().toUpperCase();
  if(!v||v==="."||v==="-.")return false;
  let s=v[0]==="-"?v.slice(1):v;
  if((s.match(/\./g)||[]).length>1)return false;
  return [...s.replace(".","")].every(c=>baseValue(c)>=0&&baseValue(c)<b);
}
function toDecimalValue(v,b){
  let neg=String(v).trim().startsWith("-"),s=String(v).trim().replace(/^-/,"").toUpperCase();
  let [ip="0",fp=""]=s.split(".");
  let n=0;
  for(const c of ip)n=n*b+baseValue(c);
  for(let i=0;i<fp.length;i++)n+=baseValue(fp[i])/Math.pow(b,i+1);
  return neg?-n:n;
}
function fromDecimalValue(num,b,precision=12){
  if(!Number.isFinite(num))return "Invalid input";
  let neg=num<0;num=Math.abs(num);
  let whole=Math.floor(num),frac=num-whole;
  let wi=whole===0?"0":"";
  while(whole>0){wi="0123456789ABCDEF"[whole%b]+wi;whole=Math.floor(whole/b)}
  if(frac<1e-14)return (neg?"-":"")+wi;
  let out="";
  for(let i=0;i<precision&&frac>1e-12;i++){
    frac*=b;let d=Math.floor(frac+1e-12);out+="0123456789ABCDEF"[d];frac-=d;
  }
  out=out.replace(/0+$/,"");
  return (neg?"-":"")+wi+(out?"."+out:"");
}
function convert(v,from,to){
  const bases={bin:2,oct:8,dec:10,hex:16},fb=bases[from],tb=bases[to];
  if(!validForBase(v,fb))return "Invalid input";
  return fromDecimalValue(toDecimalValue(v,fb),tb,12);
}
function nav(p){S.page=p;render();scrollTo(0,0)}
function layout(body){
 const items=[["home","🏠","Home"],["learn","📚","Learn"],["converter","🔄","Convert"],["practice","🎯","Practice"],["quiz","🏆","Quiz"],["progress","📈","Progress"]];
 return `<div class="shell"><header class="topbar"><div class="topin"><div class="brand" onclick="nav('home')">Number<span>Verse</span></div><div class="actions"><button class="iconbtn" onclick="toggleDark()">${S.dark?"☀️":"🌙"}</button><button class="iconbtn">⭐ ${S.xp} XP</button></div></div></header><main>${body}</main><div class="bottom"><div class="nav">${items.map(x=>`<button class="${S.page===x[0]?"active":""}" onclick="nav('${x[0]}')"><span>${x[1]}</span>${x[2]}</button>`).join("")}</div></div></div>`
}
function toggleDark(){S.dark=!S.dark;document.body.classList.toggle("dark");save();render()}
function home(){return `<section class="hero"><div class="badge" style="background:#fff;color:#6c4cff">✨ Master Number Systems</div><h1>Explore the<br>NumberVerse 🚀</h1><p>Learn binary, octal, decimal and hexadecimal through interactive lessons, instant conversions, practice and quizzes.</p><div class="heroBtns"><button class="btn alt" onclick="nav('learn')">Start Learning 📚</button><button class="btn" onclick="nav('converter')">Quick Converter 🔄</button></div></section><div class="stats"><div class="card stat"><b>${S.xp}</b><span class="muted">Total XP</span></div><div class="card stat"><b>${S.streak}🔥</b><span class="muted">Day Streak</span></div><div class="card stat"><b>${S.correct}</b><span class="muted">Correct</span></div><div class="card stat"><b>${S.total}</b><span class="muted">Attempts</span></div></div><h2 class="sectionTitle">Choose your adventure</h2><div class="grid">${[["📚","Learn","Understand each number system step by step","learn"],["🔄","Converter","Convert instantly between bases","converter"],["🎯","Practice","Build skill with generated questions","practice"],["🏆","Quiz","Test your knowledge and earn XP","quiz"],["📈","Progress","Track your learning journey","progress"],["💡","About","Discover why number systems matter","about"]].map(x=>`<div class="card learnCard" onclick="nav('${x[3]}')"><div class="emoji">${x[0]}</div><h3>${x[1]}</h3><div class="muted">${x[2]}</div></div>`).join("")}</div>`}
const lessons={decimal:["🔟","Decimal Number System","Base 10 uses digits 0–9. Each position has a power of 10.","Example: 347 = 3×10² + 4×10¹ + 7×10⁰."],binary:["💻","Binary Number System","Base 2 uses only 0 and 1. Digital circuits naturally represent these as two logic states.","Example: 1011₂ = 1×8 + 0×4 + 1×2 + 1 = 11₁₀."],octal:["8️⃣","Octal Number System","Base 8 uses digits 0–7. Each octal digit corresponds to exactly three binary bits.","Example: 157₈ = 001 101 111₂."],hex:["🔷","Hexadecimal Number System","Base 16 uses 0–9 and A–F. Each hexadecimal digit represents four binary bits.","Example: 2F₁₆ = 0010 1111₂ = 47₁₀."]};
function learn(){return `<div class="panel"><h1>📚 Learn Number Systems</h1><p class="muted">Select a topic and explore the fundamentals.</p><div class="grid">${Object.entries(lessons).map(([k,v])=>`<div class="card learnCard" onclick="lesson('${k}')"><div class="emoji">${v[0]}</div><h3>${v[1]}</h3><p class="muted">${v[2]}</p><b style="color:var(--p)">Explore →</b></div>`).join("")}</div></div>`}
function lesson(k){let v=lessons[k];$("#app").innerHTML=layout(`<div class="panel"><button class="btn alt" onclick="nav('learn')">← Back</button><div class="card lesson" style="margin-top:16px"><div class="emoji">${v[0]}</div><h1>${v[1]}</h1><p>${v[2]}</p><h3>How it works</h3><p>${v[3]}</p><h3>Place values</h3><p>In a base <i>b</i> number system, positions from right to left have weights b⁰, b¹, b², b³ and so on.</p><button class="btn" onclick="nav('practice')">Practice Now 🎯</button></div></div>`)}

function baseName(k){return {bin:"Binary",oct:"Octal",dec:"Decimal",hex:"Hexadecimal"}[k]}
function baseNum(k){return {bin:2,oct:8,dec:10,hex:16}[k]}
function digitChar(n){return "0123456789ABCDEF"[n]}
function detailedSteps(v,from,to){
 const fb=baseNum(from),tb=baseNum(to);
 if(!validForBase(v,fb))return "";
 let raw=String(v).trim().toUpperCase(),neg=raw.startsWith("-"),s=raw.replace(/^-/,"");
 let [ip="0",fp=""]=s.split(".");
 let dec=toDecimalValue(raw,fb),absDec=Math.abs(dec);
 let html=`<div class="stepBox"><h3>🧠 Step-by-Step Conversion</h3>`;
 if(from!=="dec"){
   html+=`<div class="stepSection"><h4>Step 1: Convert ${baseName(from)} to Decimal</h4>`;
   if(ip){
     let terms=[...ip].map((c,i)=>`${c} × ${fb}<sup>${ip.length-1-i}</sup>`);
     html+=`<p><b>Integer part:</b> ${ip}<sub>${fb}</sub></p><div class="formula">${terms.join(" + ")}</div>`;
     let iv=[...ip].reduce((a,c,i)=>a+baseValue(c)*Math.pow(fb,ip.length-1-i),0);
     html+=`<p>= <b>${iv}</b></p>`;
   }
   if(fp){
     let terms=[...fp].map((c,i)=>`${c} × ${fb}<sup>-${i+1}</sup>`);
     let fv=[...fp].reduce((a,c,i)=>a+baseValue(c)*Math.pow(fb,-(i+1)),0);
     html+=`<p><b>Fractional part:</b> .${fp}<sub>${fb}</sub></p><div class="formula">${terms.join(" + ")}</div><p>= <b>${+fv.toFixed(12)}</b></p>`;
   }
   html+=`<p class="stepFinal">Decimal value = <b>${dec}</b></p></div>`;
 }else{
   html+=`<div class="stepSection"><h4>Step 1: Separate Integer and Fractional Parts</h4><p>Integer part = <b>${Math.floor(absDec)}</b></p><p>Fractional part = <b>${+(absDec-Math.floor(absDec)).toFixed(12)}</b></p></div>`;
 }
 if(to!=="dec"){
   let whole=Math.floor(absDec),frac=absDec-whole;
   html+=`<div class="stepSection"><h4>Step ${from==="dec"?2:2}: Convert Decimal Integer Part to ${baseName(to)}</h4>`;
   if(whole===0)html+=`<p>Integer part is 0, so the result is <b>0</b>.</p>`;
   else{
     let rows=[],w=whole;
     while(w>0){let q=Math.floor(w/tb),r=w%tb;rows.push([w,tb,q,digitChar(r)]);w=q}
     html+=`<div class="stepTable"><div class="tr head"><span>Number</span><span>÷ Base</span><span>Quotient</span><span>Remainder</span></div>${rows.map(r=>`<div class="tr"><span>${r[0]}</span><span>÷ ${r[1]}</span><span>${r[2]}</span><span>${r[3]}</span></div>`).join("")}</div><p>Read remainders from bottom to top → <b>${fromDecimalValue(Math.floor(absDec),tb)}</b></p>`;
   }
   html+=`</div>`;
   if(frac>1e-12){
     html+=`<div class="stepSection"><h4>Step 3: Convert Decimal Fractional Part to ${baseName(to)}</h4><p>Multiply the fractional part repeatedly by ${tb}. Read the integer digits from top to bottom.</p>`;
     let rows=[],f=frac;
     for(let i=0;i<10&&f>1e-10;i++){let before=f;let x=f*tb,d=Math.floor(x+1e-12);f=x-d;rows.push([before,tb,x,digitChar(d),f])}
     html+=`<div class="stepTable fracTable"><div class="tr head"><span>Fraction</span><span>× Base</span><span>Product</span><span>Digit</span></div>${rows.map(r=>`<div class="tr"><span>${(+r[0].toFixed(10))}</span><span>× ${r[1]}</span><span>${(+r[2].toFixed(10))}</span><span>${r[3]}</span></div>`).join("")}</div><p>Fractional digits → <b>.${rows.map(r=>r[3]).join("")}</b>${f>1e-10?"…":""}</p></div>`;
   }
 }
 html+=`<div class="stepAnswer">✅ Final Answer: <b>${v}<sub>${fb}</sub> = ${convert(v,from,to)}<sub>${tb}</sub></b></div></div>`;
 return html;
}
function converter(){return `<div class="panel converterPage"><div class="converterHero"><div class="floatNum n1">1010.101₂</div><div class="floatNum n2">2A.F₁₆</div><div class="floatNum n3">52.75₈</div><h1>🔄 Number Converter</h1><p>Convert whole and <b>fractional numbers</b> instantly between Binary, Octal, Decimal and Hexadecimal.</p></div><div class="card converterCard"><div class="convertGrid"><div class="field"><label>From Number System</label><select id="from" onchange="doConvert()"><option value="dec">🔟 Decimal</option><option value="bin">💻 Binary</option><option value="oct">8️⃣ Octal</option><option value="hex">🔷 Hexadecimal</option></select></div><div class="swapIcon">⇄</div><div class="field"><label>To Number System</label><select id="to" onchange="doConvert()"><option value="bin">💻 Binary</option><option value="dec">🔟 Decimal</option><option value="oct">8️⃣ Octal</option><option value="hex">🔷 Hexadecimal</option></select></div></div><div class="field"><label>Enter Whole or Fractional Number</label><input id="cv" value="42.625" inputmode="decimal" placeholder="Example: 42.625 or 1010.101" oninput="doConvert()"></div><div class="resultWrap"><span class="muted">Converted Result</span><div id="cres" class="result">101010.101</div></div><div id="csteps" class="steps muted"></div><div class="exampleChips"><button onclick="setExample('10.625','dec','bin')">10.625₁₀ → Binary</button><button onclick="setExample('101.101','bin','dec')">101.101₂ → Decimal</button><button onclick="setExample('2A.F','hex','dec')">2A.F₁₆ → Decimal</button></div></div></div>`}
function setExample(v,f,t){$("#cv").value=v;$("#from").value=f;$("#to").value=t;doConvert()}
function doConvert(){let f=$("#from").value,t=$("#to").value,v=$("#cv").value,r=convert(v,f,t);$("#cres").textContent=r;$("#csteps").innerHTML=r==="Invalid input"?"⚠️ Check that every digit is valid for the selected number system. Fractional values can use one decimal point.":detailedSteps(v,f,t);}
let pq={};
function randomFraction(base){
 const choices=base===2?[".1",".01",".11",".101",".001"] : base===8?[".4",".25",".7",".125"] : base===16?[".8",".A",".C",".4"] : [".5",".25",".75",".625",".125"];
 return choices[Math.floor(Math.random()*choices.length)];
}
function newPractice(){
 const systems=["bin","oct","dec","hex"];
 let from=systems[Math.floor(Math.random()*systems.length)],to=systems[Math.floor(Math.random()*systems.length)];
 while(to===from)to=systems[Math.floor(Math.random()*systems.length)];
 let fractional=Math.random()<0.55, decBase=Math.floor(Math.random()*31)+1;
 let decimalValue=decBase+(fractional?[.5,.25,.75,.625,.125][Math.floor(Math.random()*5)]:0);
 let v=fromDecimalValue(decimalValue,baseNum(from),8);
 pq={v,from,to,ans:convert(v,from,to),fractional};
 $("#pquestion").innerHTML=`Convert <b>${v}<sub>${baseNum(from)}</sub></b> from ${baseName(from)} to ${baseName(to)}.${fractional?` <span class="badge">Fractional</span>`:` <span class="badge">Integer</span>`}`;
 $("#pans").value="";$("#pfeed").innerHTML="";$("#psolution").innerHTML="";
}
function practice(){setTimeout(newPractice,0);return `<div class="panel"><div class="practiceHero"><h1>🎯 Practice Zone</h1><p>Practice both <b>integer and fractional</b> number-system conversions. Questions are generated randomly like a quiz.</p></div><div class="card practiceCard"><div id="pquestion" class="question"></div><div class="field"><label>Your Answer</label><input id="pans" placeholder="Enter answer, e.g. 1010.101" autocomplete="off"></div><div class="practiceBtns"><button class="btn" onclick="checkPractice()">✓ Check Answer</button><button class="btn alt" onclick="newPractice()">⟳ Next Question</button></div><p id="pfeed" class="practiceFeed"></p><div id="psolution"></div></div></div>`}
function checkPractice(){
 let user=$("#pans").value.trim().toUpperCase(),ok=user===pq.ans.toUpperCase();S.total++;
 if(ok){S.correct++;S.xp+=10;$("#pfeed").innerHTML="✅ Correct! Excellent work. <b>+10 XP</b>";$("#pfeed").className="practiceFeed correctFeed"}
 else{$("#pfeed").innerHTML=`❌ Not quite. Correct answer: <b>${pq.ans}</b>`;$("#pfeed").className="practiceFeed wrongFeed"}
 $("#psolution").innerHTML=detailedSteps(pq.v,pq.from,pq.to);save();renderHeaderStats()
}
const qs = [

  // ===== INTEGER CONVERSION =====

  ["Convert 101101₂ to decimal.",
    ["43", "44", "45", "46"], 2],

  ["Convert 1100110₂ to decimal.",
    ["100", "101", "102", "103"], 2],

  ["Convert 75₁₀ to binary.",
    ["1001011", "1001101", "1011011", "1001111"], 0],

  ["Convert 125₁₀ to binary.",
    ["1111010", "1111101", "1111110", "1101101"], 1],

  ["Convert 157₈ to decimal.",
    ["109", "110", "111", "112"], 2],

  ["Convert 345₈ to decimal.",
    ["227", "228", "229", "230"], 2],

  ["Convert 2F₁₆ to decimal.",
    ["45", "46", "47", "48"], 2],

  ["Convert A5₁₆ to decimal.",
    ["163", "164", "165", "166"], 2],

  ["Convert 255₁₀ to hexadecimal.",
    ["EF", "FE", "FF", "F0"], 2],

  ["Convert 1000₁₀ to hexadecimal.",
    ["3E7", "3E8", "3F8", "4E8"], 1],


  // ===== BINARY ↔ OCTAL / HEX =====

  ["Convert 111011₂ to octal.",
    ["71", "72", "73", "74"], 2],

  ["Convert 10110110₂ to octal.",
    ["264", "265", "266", "267"], 2],

  ["Convert 725₈ to binary.",
    ["111010101", "111010100", "110010101", "111011101"], 0],

  ["Convert 347₈ to binary.",
    ["11100111", "11100011", "11000111", "11110111"], 0],

  ["Convert 10111100₂ to hexadecimal.",
    ["AC", "BC", "BD", "CC"], 1],

  ["Convert 11101011₂ to hexadecimal.",
    ["DA", "EA", "EB", "FB"], 2],

  ["Convert 3A₁₆ to binary.",
    ["00111010", "00110110", "00111100", "00101010"], 0],

  ["Convert B7₁₆ to binary.",
    ["10110111", "10111101", "11110111", "10100111"], 0],


  // ===== FRACTIONAL CONVERSION =====

  ["Convert 10.625₁₀ to binary.",
    ["1010.101", "1010.011", "1011.101", "1001.101"], 0],

  ["Convert 25.75₁₀ to binary.",
    ["11001.01", "11001.10", "11001.11", "10101.11"], 2],

  ["Convert 0.625₁₀ to binary.",
    ["0.011", "0.101", "0.110", "0.111"], 1],

  ["Convert 0.875₁₀ to binary.",
    ["0.101", "0.110", "0.111", "0.100"], 2],

  ["Convert 101.101₂ to decimal.",
    ["5.125", "5.25", "5.5", "5.625"], 3],

  ["Convert 1101.011₂ to decimal.",
    ["13.125", "13.25", "13.375", "13.625"], 2],

  ["Convert 111.111₂ to decimal.",
    ["7.625", "7.75", "7.875", "8.875"], 2],

  ["Convert 10101.01101₂ to decimal.",
    ["21.375", "21.40625", "21.4375", "22.40625"], 1],


  // ===== OCTAL FRACTION =====

  ["Convert 17.4₈ to decimal.",
    ["15.25", "15.5", "15.75", "16.5"], 1],

  ["Convert 157.4₈ to decimal.",
    ["110.5", "111.25", "111.5", "112.5"], 2],

  ["Convert 345.6₈ to binary.",
    ["11100101.11", "11100101.110", "11000101.110", "11110101.110"], 1],

  ["Convert 725.4₈ to binary.",
    ["111010101.100", "111010101.010", "111001101.100", "111010110.100"], 0],


  // ===== HEX FRACTION =====

  ["Convert A.8₁₆ to decimal.",
    ["10.25", "10.5", "10.75", "11.5"], 1],

  ["Convert 2D.4₁₆ to decimal.",
    ["44.25", "45.25", "45.5", "46.25"], 1],

  ["Convert 7B.8₁₆ to decimal.",
    ["122.5", "123.25", "123.5", "124.5"], 2],

  ["Convert A3.C₁₆ to binary.",
    ["10100011.11", "10100011.1100", "10110011.1100", "10100010.1100"], 1],


  // ===== DIRECT BASE CONVERSION =====

  ["Convert 11101011.101₂ to hexadecimal.",
    ["EB.5", "EB.A", "EA.A", "FB.A"], 1],

  ["Convert 101101011.101₂ to hexadecimal.",
    ["16B.A", "16A.A", "15B.A", "16B.5"], 0],

  ["Convert 753.4₈ to hexadecimal.",
    ["1EB.8", "1EA.8", "1EB.4", "1DB.8"], 0],

  ["Convert 3AF.C₁₆ to octal.",
    ["1657.6", "1657.4", "1667.6", "1656.6"], 0],

  ["Convert FF.A₁₆ to binary.",
    ["11111111.1010", "11111111.1001", "11111110.1010", "11111111.1100"], 0],

  ["Convert 1010111100.1011₂ to hexadecimal.",
    ["2BC.A", "2BC.B", "2BD.B", "ABC.B"], 1],


  // ===== ADVANCED FRACTIONAL =====

  ["Convert 11111111.111₂ to decimal.",
    ["255.625", "255.75", "255.875", "256.875"], 2],

  ["Convert 777.7₈ to decimal.",
    ["510.875", "511.75", "511.875", "512.875"], 2],

  ["Convert 1023.75₁₀ to hexadecimal.",
    ["3FF.A", "3FF.B", "3FF.C", "4FF.C"], 2],

  ["Convert 1111111111.11₂ to decimal.",
    ["1022.75", "1023.5", "1023.75", "1024.75"], 2],

  ["Convert ABC.D₁₆ to decimal.",
    ["2747.8125", "2748.8125", "2748.75", "2749.8125"], 1],


  // ===== EXPERT LEVEL =====

  ["Convert 101111101101.1101₂ to hexadecimal.",
    ["BED.C", "BED.D", "BFD.D", "AED.D"], 1],

  ["Convert 6F3.A₁₆ to binary.",
    ["011011110011.1010", "011011110011.1001",
     "011011101011.1010", "011111110011.1010"], 0],

  ["Convert 456.625₁₀ to hexadecimal.",
    ["1C8.A", "1C8.B", "1C8.C", "1D8.A"], 0],

  ["Convert 101011.11101₂ to decimal.",
    ["43.875", "43.90625", "43.9375", "44.90625"], 1],

  ["Convert 110110101.10101₂ to hexadecimal.",
    ["1B5.A8", "1B5.A", "1B4.A8", "1D5.A8"], 0]

];


let qi=0,qscore=0,locked=false;
function quiz(){qi=0;qscore=0;locked=false;setTimeout(showQ,0);return `<div class="panel"><h1>🏆 Quick Quiz</h1><div class="progressbar"><i id="qbar" style="width:20%"></i></div><div class="card" style="margin-top:16px"><div id="qnum" class="muted"></div><div id="qq" class="question"></div><div id="qopts" class="options"></div><p id="qfeed"></p></div></div>`}
function showQ(){if(qi>=qs.length){S.xp+=qscore*10;S.correct+=qscore;S.total+=qs.length;save();$("#app").innerHTML=layout(`<div class="panel center"><div class="card"><div class="emoji">🎉</div><h1>Quiz Complete!</h1><div class="result">${qscore}/${qs.length}</div><p>You earned ${qscore*10} XP.</p><button class="btn" onclick="nav('quiz')">Try Again</button></div></div>`);return}locked=false;let q=qs[qi];$("#qnum").textContent=`Question ${qi+1} of ${qs.length}`;$("#qq").textContent=q[0];$("#qbar").style.width=`${(qi+1)/qs.length*100}%`;$("#qopts").innerHTML=q[1].map((o,i)=>`<button class="option" onclick="answerQ(${i},this)">${o}</button>`).join("")}
function answerQ(i,el){if(locked)return;locked=true;let q=qs[qi],ops=[...document.querySelectorAll(".option")];ops[q[2]].classList.add("good");if(i===q[2])qscore++;else el.classList.add("bad");setTimeout(()=>{qi++;showQ()},700)}
function progress(){let acc=S.total?Math.round(S.correct/S.total*100):0;return `<div class="panel"><h1>📈 Your Progress</h1><div class="stats"><div class="card stat"><b>${S.xp}</b>XP</div><div class="card stat"><b>${S.streak}</b>Day Streak</div><div class="card stat"><b>${S.correct}</b>Correct</div><div class="card stat"><b>${acc}%</b>Accuracy</div></div><h2 class="sectionTitle">Learning Journey</h2><div class="card"><h3>Overall mastery</h3><div class="progressbar"><i style="width:${Math.min(100,S.xp/5)}%"></i></div><p class="muted">Keep learning, converting and practicing to build your XP.</p><button class="btn alt" onclick="resetProgress()">Reset Progress</button></div></div>`}
function resetProgress(){if(confirm("Reset all local progress?")){S.xp=0;S.correct=0;S.total=0;S.streak=1;save();render()}}
function about(){return `<div class="panel"><div class="card lesson"><div class="emoji">🌌</div><h1>About NumberVerse</h1><p>NumberVerse is an interactive learning web app for mastering decimal, binary, octal and hexadecimal number systems.</p><p>It combines concise lessons, instant conversion, practice questions, quizzes, XP and progress tracking in a responsive interface that runs directly in the browser.</p><h3>Pure HTML, CSS & JavaScript</h3><p>This converted edition has no React, TypeScript, Vite or build dependency. Progress is stored locally in the browser using Local Storage, making it suitable for static hosting such as GitHub Pages.</p></div></div>`}
function render(){let body=S.page==="home"?home():S.page==="learn"?learn():S.page==="converter"?converter():S.page==="practice"?practice():S.page==="quiz"?quiz():S.page==="progress"?progress():about();$("#app").innerHTML=layout(body)}
render();
