
const btn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
if(btn && menu){
  btn.addEventListener('click',()=>menu.classList.toggle('open'));
}
const year = document.querySelector('#year');
if(year) year.textContent = new Date().getFullYear();

const search = document.querySelector('#siteSearch');
if(search){
  search.addEventListener('input',()=>{
    const q = search.value.trim().toLowerCase();
    document.querySelectorAll('[data-search]').forEach(el=>{
      el.style.display = !q || el.dataset.search.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}
