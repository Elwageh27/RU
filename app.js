const $=(s,ctx=document)=>ctx.querySelector(s), $$=(s,ctx=document)=>[...ctx.querySelectorAll(s)];
let currentCourse="premalignant",currentPage=1,done=new Set(JSON.parse(localStorage.getItem("dentalDone")||"[]")),quizFilter="all";
const courseNames={premalignant:"PREMALIGNANT LESIONS",benign:"BENIGN TUMORS"};
const getPages=()=>LECTURES.filter(x=>x.course===currentCourse);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function switchTab(name){$$(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));$$(".panel").forEach(p=>p.classList.toggle("active",p.id===name));}
$$(".tab").forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));
function updateProgress(){let n=done.size;$("#progressLabel").textContent=`${n} / 77 صفحة تمت`;$("#progressBar").style.width=(n/77*100)+"%";}
function renderPageList(){let pages=getPages();$("#pageList").innerHTML=pages.map(p=>`<button class="page-item ${p.page===currentPage?"active":""} ${done.has(p.course+"-"+p.page)?"done":""}" data-page="${p.page}">صفحة ${p.page} · ${esc(p.heading)}</button>`).join("");$$(".page-item").forEach(b=>b.onclick=()=>{currentPage=+b.dataset.page;renderLesson();});}
function renderLesson(){
 let p=getPages().find(x=>x.page===currentPage);if(!p)return;
 $("#currentCourseLabel").textContent=courseNames[currentCourse];$("#readerTitle").textContent=p.heading;
 $("#lesson").innerHTML=`<h3>${esc(p.heading)}</h3><div class="sub">المحاضرة: ${p.courseTitle} · صفحة ${p.page} من ${currentCourse==="premalignant"?38:39}</div>
 <div class="lesson-grid"><div class="lesson-text"><h4>🧠 نفهمها ببساطة</h4><p>${esc(p.explanation)}</p><div class="keybox"><b>👀 ركّز في الصورة:</b><br>${esc(p.imageGuide)}</div><p><b>طريقة مذاكرة الصفحة:</b> اقرأ الشرح مرة، ثم انظر للصورة وحاول تسمي العلامة بنفسك قبل قراءة النص الأصلي.</p></div>
 <div class="image-box"><img src="${p.image}" alt="صورة المحاضرة الأصلية صفحة ${p.page}" onclick="window.open('${p.image}','_blank')"><small>السلايد الأصلي من ملف المحاضرة — اضغط على الصورة لفتحها بحجم أكبر.</small></div></div>
 <details class="source"><summary>📄 النص الأصلي المستخرج من السلايد</summary><pre>${esc(p.sourceText)}</pre></details>
 <button class="primary mark-done" id="doneBtn">${done.has(p.course+"-"+p.page)?"✓ تمت المذاكرة — إلغاء العلامة":"علّم الصفحة تمت مذاكرتها ✓"}</button>`;
 $("#doneBtn").onclick=()=>{let id=p.course+"-"+p.page;done.has(id)?done.delete(id):done.add(id);localStorage.setItem("dentalDone",JSON.stringify([...done]));updateProgress();renderPageList();renderLesson();};
 renderPageList();$("#prevBtn").disabled=currentPage===1;$("#nextBtn").disabled=currentPage===getPages().length;
}
function openCourse(c){currentCourse=c;currentPage=1;renderPageList();renderLesson();$("#readerTitle").scrollIntoView({behavior:"smooth",block:"center"});}
$$(".course-card").forEach(b=>b.onclick=()=>openCourse(b.dataset.course));
$("#prevBtn").onclick=()=>{if(currentPage>1){currentPage--;renderLesson();}};
$("#nextBtn").onclick=()=>{if(currentPage<getPages().length){currentPage++;renderLesson();}};
$("#searchInput").oninput=e=>{let q=e.target.value.trim().toLowerCase();let filtered=getPages().filter(p=>(p.heading+" "+p.sourceText+" "+p.explanation).toLowerCase().includes(q));$("#pageList").innerHTML=filtered.map(p=>`<button class="page-item ${p.page===currentPage?"active":""}" data-page="${p.page}">صفحة ${p.page} · ${esc(p.heading)}</button>`).join("");$$(".page-item").forEach(b=>b.onclick=()=>{currentPage=+b.dataset.page;renderLesson();});};
$("#themeBtn").onclick=()=>{document.body.classList.toggle("dark");$("#themeBtn").textContent=document.body.classList.contains("dark")?"☀ الوضع النهاري":"☾ الوضع الليلي";};
const comparisons=[
["Premalignant lesion vs Invasive carcinoma","Premalignant: dysplasia مع Basement membrane سليم ولا يوجد غزو للنسيج الضام.","Invasive: يحدث rupture للـ basement membrane وتدخل الخلايا إلى connective tissue."],
["Mild vs Moderate vs Severe dysplasia","Mild: Basal + Parabasal layers فقط.","Moderate: من Basal حتى منتصف Spinous layer. Severe: من Basal إلى أعلى من منتصف الظهارة."],
["Severe dysplasia vs Carcinoma in situ","Severe: التغيرات تتجاوز منتصف سمك الظهارة.","Carcinoma in situ: كامل سمك الظهارة من القاعدة للسطح، مع بقاء basement membrane سليمًا."],
["Squamous cell papilloma vs Keratoacanthoma","Papilloma: نتوء حليمي/قرنبيطي، غالبًا soft، مرتبط بـ HPV 6,11 في السلايد.","Keratoacanthoma: عقدة قُبّبية بها central keratin plug، firm، شائعة في المناطق المعرضة للشمس."],
["Neurofibroma vs Schwannoma","Neurofibroma: خليط من Schwann cells وPerineural fibroblasts.","Schwannoma: ينشأ من Schwann cells في nerve sheath، وله Antoni A وAntoni B."],
["Granular cell tumor vs Congenital epulis","Granular cell tumor: أصل Schwannian حسب السلايد، S-100 positive، وقد تظهر pseudoepitheliomatous hyperplasia.","Congenital epulis: على alveolar ridge لحديث الولادة، S-100 وActin negative، والظهارة لا تظهر pseudoepitheliomatous hyperplasia."],
["Chondroma vs Osteoma في الأشعة","Chondroma: Radiolucency مع مناطق مركزية Radiopacity.","Osteoma: Well-circumscribed Radiopaque mass."],
["Leiomyoma vs Rhabdomyoma","Leiomyoma: smooth muscle، خلايا spindle وحزم متشابكة وأنوية طويلة blunt-ended.","Rhabdomyoma: striated muscle، خلايا polygonal وسيتوبلازم eosinophilic مع cross striations."]
];
$("#comparisonCards").innerHTML=comparisons.map(c=>`<div class="compare-card"><h3>${c[0]}</h3><p><b>الأول:</b> ${c[1]}</p><p><b>الثاني:</b> ${c[2]}</p></div>`).join("");
const terms=[
["Premalignant lesion","آفة قبل سرطانية؛ نسيج متغير يزيد خطر تحوله الخبيث."],["Epithelial dysplasia","اضطراب في تكوّن وترتيب ونضج نسيج الظهارة."],["Atypia","صفات خلوية/نووية غير طبيعية."],["Basement membrane","الغشاء القاعدي الفاصل بين الظهارة والنسيج الضام."],["Connective tissue (C.T.)","النسيج الضام الموجود أسفل الظهارة."],["Invasion","اختراق الخلايا إلى النسيج الموجود تحتها."],["Metastasis","انتقال الخلايا السرطانية إلى أماكن أخرى."],["Hyperplasia","زيادة عدد الخلايا."],["Rete pegs","امتدادات الظهارة النازلة باتجاه النسيج الضام."],["Polarity","اتجاه/اصطفاف الخلايا بصورة منظمة."],["Hemidesmosome","تركيب يساعد على تثبيت الخلية بالسطح القاعدي."],["Desmosome","وصلة تربط الخلايا الظهارية ببعضها."],["Cohesion","تماسك الخلايا مع بعضها."],["Stratification","ترتيب الخلايا في طبقات."],["Maturation","نضج الخلايا أثناء انتقالها من القاعدة للسطح."],["Mitosis","انقسام الخلية."],["N/C ratio","نسبة حجم النواة إلى السيتوبلازم."],["Hyperchromatism","زيادة شدة صبغ النواة وظهورها داكنة."],["Nucleolus","النوية؛ جسم داخل النواة."],["Pleomorphism","اختلاف الخلايا أو الأنوية في الحجم والشكل."],["Dyskeratosis","تقرن مبكر وغير طبيعي داخل الظهارة."],["Keratin pearl","تجمع دائري من خلايا متقرنة في طبقات متحدة المركز."],["Sessile","كتلة ذات قاعدة عريضة دون ساق."],["Pedunculated","كتلة متصلة بسطحها عن طريق ساق."],["Exophytic","نامٍ أو بارز إلى الخارج."],["Hyperkeratosis","زيادة سمك طبقة الكيراتين."],["Koilocyte","خلية ذات تغيرات شكلية مرتبطة بعدوى HPV؛ مذكورة في شريحة papilloma."],["Crater","حفرة مركزية."],["Keratin plug","سدادة كيراتينية."],["Spindle-shaped","مغزلي الشكل؛ طويل ورفيع."],["Eosinophilic","يميل لالتقاط صبغة الإيوزين ويظهر ورديًا."],["Palisading","اصطفاف متوازٍ يشبه السياج."],["Verocay bodies","مناطق مركزية لا خلوية وردية ضمن نمط Antoni A."],["S-100","بروتين/علامة مناعية مذكورة مع أصل Schwannian."],["Lacunae","فجوات داخل الغضروف تحتوي chondrocytes."],["Chondrocyte","خلية غضروفية."],["Radiolucent","أقل كثافة شعاعية ويظهر أغمق."],["Radiopaque","أكثر كثافة شعاعية ويظهر أفتح."],["Periosteal","على سطح العظم/السمحاق."],["Endosteal","داخل العظم أو التجويف النخاعي."],["Hamartoma","نسيج طبيعي في مكانه الطبيعي لكن بكمية زائدة."],["Nevus","Hamartoma في الجلد أو الغشاء المخاطي."]
];
function renderGlossary(q=""){let filtered=terms.filter(t=>(t[0]+" "+t[1]).toLowerCase().includes(q.toLowerCase()));$("#glossaryList").innerHTML=filtered.map(t=>`<div class="term"><h3>${esc(t[0])}</h3><p>${esc(t[1])}</p></div>`).join("")||"<p>مفيش نتائج مطابقة.</p>";}
$("#glossarySearch").oninput=e=>renderGlossary(e.target.value);renderGlossary();
const questions=[
["premalignant","ما العلامة الفاصلة بين Premalignant lesion وInvasive carcinoma؟",["وجود Epithelial dysplasia","سلامة أو تمزق Basement membrane","لون الآفة","عمر المريض"],1,"الـ basement membrane إذا ظل سليمًا لا يوجد غزو. تمزقه مع دخول الخلايا للنسيج الضام يعني invasive carcinoma."],
["premalignant","أي طبقات تتأثر في Mild epithelial dysplasia؟",["كل سمك الظهارة","Basal وParabasal فقط","حتى أعلى من منتصف الظهارة","Spinous فقط"],1,"Mild محدودة في basal وparabasal layers."],
["premalignant","ما المقصود بـ Drop-shaped rete pegs؟",["امتدادات عريضة عند الجزء العميق","خلايا دهنية","تقرن سطحي","نوى متعددة"],0,"تكون rete pegs أعرض في الجزء العميق من الجزء السطحي."],
["premalignant","N/C ratio تعني:",["نسبة النواة إلى السيتوبلازم","عدد الخلايا","حجم النسيج الضام","سمك الغشاء القاعدي"],0,"N = nucleus وC = cytoplasm؛ المحاضرة تذكر زيادة النسبة."],
["premalignant","ما الذي يميز Carcinoma in situ؟",["غزو النسيج الضام","Metastasis","إصابة كامل سمك الظهارة مع basement membrane سليم","غياب dysplasia"],2,"كل السمك مصاب، لكن الغشاء القاعدي لم يتم اختراقه."],
["premalignant","Keratin pearls هي:",["خلايا دهنية","دوائر متراكزة من خلايا متقرنة","أوعية دموية","خلايا عصبية"],1,"تجمعات دائرية بؤرية من طبقات كيراتينية متحدة المركز."],
["premalignant","أي تغير يدل على فقد تماسك الخلايا؟",["Loss of desmosomal junctions","Hyperchromatism","Nucleoli enlargement","Keratin plug"],0,"Desmosomes تربط الخلايا ببعضها؛ فقدها يقلل adhesion/cohesion."],
["benign","أي HPV types ذكرتها المحاضرة مع Squamous cell papilloma؟",["16,18","6,11","31,33","لا يوجد"],1,"السلايد يذكر HPV type 6 و11."],
["benign","الوصف الإكلينيكي المميز لـ Squamous cell papilloma:",["كتلة صفراء لينة","Dome مع central keratin plug","Finger-like/cauliflower projections","تورم عظمي معتم"],2,"Papilloma يظهر exophytic مع finger-like projections."],
["benign","Keratoacanthoma غالبًا يظهر كـ:",["كتلة قُبّبية بها central keratin plug","بقعة بنية مسطحة","كتلة صفراء لينة","عقدة داخل اللسان فقط"],0,"هذا هو الشكل الإكلينيكي الموصوف في المحاضرة."],
["benign","أي ورم يتكون من نسيج دهني؟",["Myoma","Lipoma","Osteoma","Chondroma"],1,"Lipoma هو benign neoplasm of adipose tissue."],
["benign","ما العلامة المجهرية المميزة لـ Lipoma؟",["نوى مركزية كبيرة","نواة مضغوطة ناحية طرف الخلية الدهنية","Verocay bodies","Lacunae"],1,"الخلية الدهنية ذات cytoplasm clear والنواة مزاحة للطرف."],
["benign","Leiomyoma ينشأ من:",["Striated muscle","Smooth muscle","Cartilage","Fat"],1,"Leio تعني smooth؛ أما rhabdomyoma فمن striated muscle."],
["benign","أي وصف يناسب Rhabdomyoma؟",["Spindle cells وwavy nuclei","Cross striations وخلايا polygonal","Keratin pearls","Antoni B"],1,"المحاضرة تذكر خلايا كبيرة متعددة الأضلاع وسيتوبلازم eosinophilic وتخطيطات عرضية."],
["benign","Neurofibroma ينشأ من:",["Schwann cells فقط","خليط يشمل Schwann cells وperineural fibroblasts","الخلايا الغضروفية","الخلايا الدهنية"],1,"هذه هي نقطة التمييز المذكورة في تعريفه."],
["benign","Café-au-lait macules مرتبطة في المحاضرة بـ:",["Neurofibromatosis","Osteoma","Lipoma","Papilloma"],0,"المحاضرة تربطها بـ Von Recklinghausen's disease."],
["benign","Schwannoma ينشأ من:",["Schwann cell of nerve sheath","Adipose tissue","Smooth muscle","Cartilage"],0,"هذا نص التعريف في السلايد."],
["benign","Verocay bodies تظهر في:",["Antoni A","Antoni B","Lipoma","Osteoma"],0,"Antoni A فيه palisading حول مناطق acellular eosinophilic تسمى Verocay bodies."],
["benign","Granular cell tumor يكون غالبًا إيجابيًا لـ:",["Actin فقط","S-100 protein","Keratin plug","Hemoglobin"],1,"السلايد يذكر S-100 وارتباطه بأصل Schwann cells."],
["benign","Congenital epulis يظهر غالبًا على:",["Alveolar ridge of newborn","Buccal mucosa of elderly","Skin of hand","Floor of mouth in adults"],0,"ورم خلقي يظهر تقريبًا حصريًا على الحواف السنخية لحديثي الولادة."],
["benign","أي علامة تفرق Congenital epulis عن Granular cell tumor حسب السلايد؟",["S-100 وActin negative","S-100 positive","وجود Verocay bodies","Radiopaque mass"],0,"Congenital epulis سلبي لـ S-100 وActin حسب المحاضرة."],
["benign","Chondroma يتكون من:",["Mature bone","Cartilage","Fat","Nerve tissue"],1,"Chondro تعني غضروف."],
["benign","ما الوصف الشعاعي لـ Chondroma؟",["Well-defined radiopaque only","Radiolucency مع central radiopacity","Radiolucent بالكامل دون بؤر","لا يظهر بالأشعة"],1,"هذا هو الوصف الموجود في الصفحة 33."],
["benign","Osteoma يظهر شعاعيًا كـ:",["Radiopaque well-circumscribed mass","Central crater","Radiolucency with central opacity","Soft tissue shadow فقط"],0,"المحاضرة تصفه بأنه well-circumscribed radiopaque mass."],
["benign","Periosteal osteoma يقع:",["داخل medullary bone","على سطح العظم","في الظهارة","في الغضروف"],1,"Periosteal يعني على سطح العظم، مقابل endosteal داخل العظم."],
["benign","Hamartoma يعني:",["نسيج غير طبيعي في مكان خاطئ","نسيج طبيعي في مكانه الطبيعي بكمية زائدة","ورم خبيث منتشر","تقرن مبكر"],1,"هذا تعريف المحاضرة؛ زيادة كمية النسيج الطبيعي في موقعه الطبيعي."]
];
let answered=0,correct=0;
function renderQuiz(){let qs=questions.filter(q=>quizFilter==="all"||q[0]===quizFilter);$("#quizArea").innerHTML=`<div class="quiz-score">جاوب على الأسئلة واحدة واحدة. <span id="scoreText"></span></div>`+qs.map((q,i)=>`<div class="question" data-q="${questions.indexOf(q)}"><h3>${i+1}. ${q[1]}</h3>${q[2].map((a,j)=>`<button class="answer" data-choice="${j}">${["A","B","C","D"][j]}. ${a}</button>`).join("")}<div class="feedback">${q[4]}</div></div>`).join("");
 $$(".question").forEach(el=>$$(".answer",el).forEach(btn=>btn.onclick=()=>{if(el.dataset.answered)return;el.dataset.answered="1";let q=questions[+el.dataset.q],choice=+btn.dataset.choice;answered++;if(choice===q[3]){correct++;btn.classList.add("correct")}else{btn.classList.add("wrong");$$(".answer",el)[q[3]].classList.add("correct")}$(".feedback",el).classList.add("show");$("#scoreText").textContent=`النتيجة الحالية: ${correct} صح من ${answered}`;}));
}
$$(".filter").forEach(b=>b.onclick=()=>{$$(".filter").forEach(x=>x.classList.toggle("active",x===b));quizFilter=b.dataset.qfilter;renderQuiz();});renderQuiz();
updateProgress();openCourse("premalignant");
