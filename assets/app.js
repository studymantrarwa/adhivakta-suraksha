const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function postCard(p){const url=esc(p.url||('/posts/'+encodeURIComponent(p.slug)+'.html'));const image=p.image?`<a class="post-image-link" href="${url}" aria-label="${esc(p.title)} पूरा लेख पढ़ें"><img class="post-thumb" src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy"></a>`:`<a class="post-image-link post-image-placeholder" href="${url}" aria-label="${esc(p.title)} पूरा लेख पढ़ें"><span>⚖</span><small>अधिवक्ता सुरक्षा आंदोलन</small></a>`;return `<article class="post-card">${image}<div class="post-card-inner"><span class="tag">${esc(p.category||'सूचना')}</span><small class="post-date">${esc(p.date||'')}</small><h3><a href="${url}">${esc(p.title)}</a></h3><p>${esc(p.excerpt||'अभियान से संबंधित विस्तृत सूचना पढ़ें।')}</p><a class="read" href="${url}">पूरा लेख पढ़ें →</a></div></article>`}
async function readPublicJson(path){const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw Error('Could not load '+path);return r.json()}
async function getSiteData(){
  try{
    const r=await fetch('/api/posts',{cache:'no-store'});
    if(r.ok){const d=await r.json();if(!d.warning)return d;}
  }catch(e){/* Use public static content if the API is temporarily unavailable. */}
  const [posts,events,settings]=await Promise.all([
    readPublicJson('/data/posts.json').catch(()=>[]),
    readPublicJson('/data/events.json').catch(()=>[]),
    readPublicJson('/data/settings.json').catch(()=>({}))
  ]);
  return {posts,events,settings,source:'static-fallback'};
}
function emptyState(title,description,icon='✓',link='',linkText=''){
  return `<div class="empty-state"><span class="empty-state-icon" aria-hidden="true">${icon}</span><div><h3>${esc(title)}</h3><p>${esc(description)}</p>${link?`<a class="inline-link" href="${esc(link)}">${esc(linkText||'और जानकारी देखें')} →</a>`:''}</div></div>`;
}
async function load(){
  const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
  try{
    const d=await getSiteData();
    const posts=(d.posts||[]).filter(p=>p.status!=='draft').sort((a,b)=>{
      const da=Date.parse((a.date||'')+'T00:00:00')||0,db=Date.parse((b.date||'')+'T00:00:00')||0;
      return db-da||((Date.parse(b.updated||'')||0)-(Date.parse(a.updated||'')||0));
    });
    const empty=emptyState('अभी कोई लेख प्रकाशित नहीं है','इस समय लेख संग्रह में कोई प्रकाशित लेख उपलब्ध नहीं है। कृपया बाद में फिर देखें।','▤','/blog.html','लेख संग्रह खोलें');
    const latest=document.getElementById('latest-posts');
    if(latest)latest.innerHTML=posts.slice(0,3).map(postCard).join('')||empty;
    const blog=document.getElementById('all-posts');
    if(blog)blog.innerHTML=posts.map(postCard).join('')||empty;
    const searchBox=document.getElementById('blog-search');
    if(searchBox&&blog){
      const count=document.getElementById('blog-result-count');
      const filterPosts=()=>{const q=searchBox.value.trim().toLocaleLowerCase('hi');let visible=0;blog.querySelectorAll('.post-card').forEach(card=>{const hit=card.textContent.toLocaleLowerCase('hi').includes(q);card.hidden=!hit;if(hit)visible++;});if(count)count.textContent=q?(visible+' लेख मिले'):((posts.length)+' प्रकाशित लेख');};
      searchBox.addEventListener('input',filterPosts);filterPosts();
    }
    const events=document.getElementById('events-list');
    if(events){
      const raw=d.events||[],seen=new Set();
      const ev=raw.filter(e=>{const key=[e.title,e.date,e.location].map(v=>String(v||'').trim().toLocaleLowerCase('hi')).join('|');if(seen.has(key))return false;seen.add(key);return true;})
        .sort((a,b)=>(Date.parse(a.date||'')||0)-(Date.parse(b.date||'')||0));
      events.innerHTML=ev.length?ev.map(e=>`<article class="event"><div class="event-date">${esc(e.dateLabel||'तिथि')}<span>${esc(e.time||'समय घोषित नहीं')}</span></div><div><h3>${esc(e.title)}</h3><p>${esc(e.location||'स्थान की पुष्टि की जा रही है')}${e.description?' — '+esc(e.description):''}</p></div></article>`).join(''):emptyState('अभी कोई आगामी कार्यक्रम सूचीबद्ध नहीं है','केवल पुष्ट कार्यक्रमों की तारीख, समय और स्थान यहाँ दिखाए जाएँगे। नई घोषणा के लिए इस पेज को दोबारा देखें।','◷','#updates','नवीनतम सूचनाएँ देखें');
    }
    const settings=d.settings||{};
    document.querySelectorAll('[data-signature-form]').forEach(a=>{
      if(settings.formUrl){a.href=settings.formUrl;a.target='_blank';a.rel='noopener noreferrer';a.classList.remove('disabled','form-not-configured');a.setAttribute('aria-label','हस्ताक्षर अभियान Google Form नए टैब में खोलें');}
      else{a.href=a.dataset.fallback||'/#join';a.target='_self';a.classList.add('form-not-configured');a.title='सहभागिता फॉर्म का लिंक अभी उपलब्ध नहीं है';}
    });
    const fl=document.getElementById('form-link');
    if(fl&&settings.formUrl){fl.href=settings.formUrl;fl.textContent=settings.formLabel||'हस्ताक्षर अभियान में समर्थन दर्ज करें';fl.classList.remove('disabled');fl.target='_blank';fl.rel='noopener noreferrer';}
    else if(fl){fl.href='#join';fl.textContent='फॉर्म लिंक फिलहाल उपलब्ध नहीं है';fl.classList.add('disabled');fl.setAttribute('aria-disabled','true');}
    const cd=document.getElementById('contact-detail');if(cd&&settings.contactText)cd.textContent=settings.contactText;
    const ce=document.getElementById('contact-email');if(ce&&settings.email){ce.hidden=false;ce.href='mailto:'+settings.email;ce.textContent=settings.email;}
    const contactLabel=document.querySelector('.footer-contact-label');if(contactLabel&&(!settings.contactText||!String(settings.contactText).trim()))contactLabel.textContent='संपर्क जानकारी';
  }catch(e){
    const l=document.getElementById('latest-posts');if(l)l.innerHTML=emptyState('सूचनाएँ अभी लोड नहीं हो सकीं','कृपया इंटरनेट कनेक्शन जाँचें और कुछ देर बाद दोबारा प्रयास करें।','↻');
    const ev=document.getElementById('events-list');if(ev)ev.innerHTML=emptyState('कार्यक्रम लोड नहीं हो सके','अभी कार्यक्रमों की जानकारी प्राप्त नहीं हो सकी। कृपया कुछ देर बाद पुनः प्रयास करें।','◷');
  }
}
load();

// Homepage interactions: accessible mobile navigation, reading progress and back-to-top.
(function initHomepageInteractions(){
  const menuButton=document.querySelector('.menu');
  const nav=document.getElementById('main-navigation');
  if(menuButton&&nav){
    const closeMenu=()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','मेनू खोलें');};
    menuButton.addEventListener('click',()=>{
      const isOpen=nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded',String(isOpen));
      menuButton.setAttribute('aria-label',isOpen?'मेनू बंद करें':'मेनू खोलें');
    });
    nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
    document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
    document.addEventListener('click',event=>{if(!nav.contains(event.target)&&!menuButton.contains(event.target))closeMenu();});
  }
  const progress=document.getElementById('scroll-progress');
  const topButton=document.getElementById('back-to-top');
  let scheduled=false;
  const updateScrollUI=()=>{
    const maxScroll=document.documentElement.scrollHeight-window.innerHeight;
    const ratio=maxScroll>0?Math.min(1,Math.max(0,window.scrollY/maxScroll)):0;
    if(progress)progress.style.width=(ratio*100)+'%';
    if(topButton)topButton.classList.toggle('visible',window.scrollY>500);
    scheduled=false;
  };
  window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;window.requestAnimationFrame(updateScrollUI);}},{passive:true});
  window.addEventListener('resize',updateScrollUI,{passive:true});
  updateScrollUI();
  if(topButton)topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
})();
