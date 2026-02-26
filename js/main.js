// Minimal JS: menu toggle, marquee and testimonials population
document.addEventListener('DOMContentLoaded', function(){
  // Menu
  const menu = document.querySelector('.menu');
  const btn = menu.querySelector('.nav-tgl');
  const body = document.body;
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    menu.classList.toggle('active');
    body.classList.toggle('menu-open');
  });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && menu.classList.contains('active')){ menu.classList.remove('active'); body.classList.remove('menu-open'); }});

  // Marquee (logos)
  const logoList = [
    "https://arminsilatani.com/wp-content/uploads/2026/02/آپاسازه-سفید.webp",
    "https://arminsilatani.com/wp-content/uploads/2026/02/آپا-کالا-سفید.webp",
    "https://arminsilatani.com/wp-content/uploads/2026/02/ارمغان-سفید.webp",
    "https://arminsilatani.com/wp-content/uploads/2026/02/اسپانتا-سفید.webp",
    "https://arminsilatani.com/wp-content/uploads/2026/02/الوند-تاسیسات-سفید.webp"
  ];
  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  const shuffled = shuffle(logoList.slice());
  const container = document.getElementById('marqueeContainer');
  for(let r=0;r<6;r++){
    const row = document.createElement('div'); row.className='marquee-row';
    const marquee = document.createElement('div'); marquee.className='marquee ' + (r%2? 'marquee-right':'');
    const items = [];
    for(let i=0;i<10;i++){ for(let s=0;s<shuffled.length;s++){ items.push(shuffled[s]); }}
    items.forEach(src=>{ const it=document.createElement('div'); it.className='marquee-item'; const img=document.createElement('img'); img.src=src; img.alt='لوگو'; it.appendChild(img); marquee.appendChild(it); });
    row.appendChild(marquee); container.appendChild(row);
  }

  // Testimonials (small set)
  const testimonials = [
    {name:"رامین منصوری",role:"مدیر فروش",content:"من از خدمات سئو آقای سیلاطانی تجربهٔ عالی داشتم.",image:"https://arminsilatani.com/wp-content/uploads/2023/01/ramin-mansoori.webp"},
    {name:"محمود صفری",role:"مدیر موسسه",content:"نتایج سئو ما با ایشان بهبود یافت.",image:"https://arminsilatani.com/wp-content/uploads/2023/01/%D9%85%D8%AD%D9%85%D9%88%D8%AF-%D8%B5%D9%81%D8%B1%DB%8C-%D9%85%D8%AF%DB%8C%D8%B1.webp"},
    {name:"آناهیتا درنیانی",role:"مدیر پروژه",content:"متخصص و قابل اعتماد.",image:"https://arminsilatani.com/wp-content/uploads/2023/01/%D8%A2%D9%86%D8%A7%D9%87%DB%8C%D8%AA%D8%A7-%D8%AF%D8%B1%D9%86%DB%8C%D8%A7%D9%86%DB%8C.webp"}
  ];
  function populateColumn(id){ const el=document.getElementById(id); if(!el) return; for(let i=0;i<6;i++){ testimonials.forEach(t=>{ const card=document.createElement('div'); card.className='card'; card.innerHTML=`<div class="profile"><img src="${t.image}" alt="${t.name}"><div><div class="name">${t.name}</div><div class="role">${t.role}</div></div></div><div class="content">${t.content}</div>`; el.appendChild(card); }); }}
  populateColumn('column1'); populateColumn('column2'); populateColumn('column3');
});
