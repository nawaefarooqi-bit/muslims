document.addEventListener('DOMContentLoaded',()=>{
 const btn=document.querySelector('.menu-btn'),menu=document.querySelector('.menu');
 if(btn&&menu) btn.addEventListener('click',()=>menu.classList.toggle('open'));
 document.querySelectorAll('#siteSearch').forEach(input=>{
  input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();let n=0;const nodes=document.querySelectorAll('[data-search],.item');nodes.forEach(c=>{const hay=(c.dataset.search||c.textContent||'').toLowerCase();const ok=!q||hay.includes(q);c.style.display=ok?'':'none';if(ok)n++});const count=document.querySelector('.count');if(count)count.textContent=`${n} نتائج`});
 });
 document.querySelectorAll('details').forEach(d=>{if(window.innerWidth>700)d.open=true});
 const y=document.querySelectorAll('.year');y.forEach(e=>e.textContent=new Date().getFullYear());
 const params=new URLSearchParams(location.search);const title=params.get('title');
 const topic=document.getElementById('topicTitle');const topicHeading=document.getElementById('topicHeading');if(title&&topic){topic.textContent=title;if(topicHeading)topicHeading.textContent=title}
 const qTitle=document.getElementById('qTitle');const qHeading=document.getElementById('qHeading');if(title&&qTitle){qTitle.textContent=title;if(qHeading)qHeading.textContent=title}
 const n=params.get('n');if(n&&qTitle){qTitle.textContent='حدیث نمبر '+n;qHeading.textContent='حدیث نمبر '+n;}
});