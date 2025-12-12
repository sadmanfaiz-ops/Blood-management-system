(function(){
  const BACKEND = 'http://127.0.0.1:1320';

  function escapeHtml(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  // ===== Auth-aware navbar =====
  function initNavbarAuthState(){
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let user = null;
    try { user = userStr ? JSON.parse(userStr) : null; } catch(e) { user = null; }

    const guestLinks = document.querySelectorAll('.guest-link');
    const authLinks = document.querySelectorAll('.auth-link');
    const logoutLink = document.getElementById('logout-link');
    const adminLink = document.querySelector('a[href="admin.html"]');
    const requestLink = document.querySelector('a[href="requests.html"]');
    const donorsLinks = document.querySelectorAll('a[href="donors.html"], .donors-link');
    const donateLinks = document.querySelectorAll('.donate-link');

    const isRecipient = !!(user && (user.role === 'recipient' || user.isRecipient));
    const isDonor = !!(user && (user.role === 'donor' || user.isDonor));

    guestLinks.forEach(el => el.style.display = token ? 'none' : 'inline-block');
    authLinks.forEach(el => el.style.display = token ? 'inline-block' : 'none');

    if (adminLink) {
      adminLink.style.display = (token && user && user.role === 'admin') ? 'inline-block' : 'none';
    }

    if (requestLink) {
      requestLink.style.display = (token && isRecipient) ? 'inline-block' : 'none';
    }

    donorsLinks.forEach(link => {
      link.style.display = (token && isRecipient) ? 'inline-block' : 'none';
    });

    donateLinks.forEach(link => {
      link.style.display = (token && isDonor) ? 'inline-block' : 'none';
    });

    if (logoutLink){
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
      });
    }
  }

  // ===== Slider =====
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');

  function showSlide(n) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    if (n >= slides.length) currentSlide = 0;
    if (n < 0) currentSlide = slides.length - 1;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => { currentSlide = idx; showSlide(currentSlide); });
  });

  setInterval(() => { currentSlide++; showSlide(currentSlide); }, 5000);

  // ===== Search =====
  function renderResults(list){
    const grid = document.getElementById('results-grid');
    if(!grid) return;
    grid.innerHTML = '';
    if(!Array.isArray(list) || list.length===0){
      grid.innerHTML = '<div style="text-align:center;color:#999;padding:40px;">No donors found.</div>';
      return;
    }
    list.forEach(d => {
      const card = document.createElement('div');
      card.className = 'result-card';
      card.innerHTML = `\
        <h4>${escapeHtml(d.name || d.full_name || 'Unknown')}</h4>\
        <p style="color:#e74c3c;font-weight:600;">${escapeHtml(d.bloodGroup || '')}</p>\
        <p style="margin:10px 0;color:#666;font-size:14px;">${escapeHtml(d.location || d.city || d.zone || '')}</p>\
        <p style="margin:10px 0;color:#666;font-size:13px;">${escapeHtml(d.notes || '')}</p>\
        <div style="margin-top:15px;display:flex;gap:10px;">\
          <button class="btn btn-primary" style="flex:1;padding:8px;font-size:13px;" onclick="alert('Contact: ${escapeHtml(d.phone || 'N/A')}')">Contact</button>\
          <button class="btn btn-secondary" style="flex:1;padding:8px;font-size:13px;background:#3498db;" onclick="alert('Request sent to ${escapeHtml(d.name || 'donor')}')">Request</button>\
        </div>`;
      grid.appendChild(card);
    });
  }

  async function onSearch(ev){
    ev.preventDefault();
    const groupEl = document.getElementById('blood_group');
    const zoneEl = document.getElementById('zone');
    const params = new URLSearchParams();
    if(groupEl && groupEl.value) params.append('bloodGroup', groupEl.value);
    if(zoneEl && zoneEl.value) params.append('location', zoneEl.value);

    const grid = document.getElementById('results-grid');
    if(grid) grid.innerHTML = '<div style="text-align:center;color:#999;padding:40px;">Loading…</div>';

    try{
      const res = await fetch(BACKEND + '/api/donors/search?' + params.toString());
      if(!res.ok){
        const err = await res.text().catch(()=>res.statusText);
        if(grid) grid.innerHTML = '<div style="color:#999;padding:20px;">Error: ' + escapeHtml(err) + '</div>';
        return;
      }
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.items || data);
      renderResults(items);
    }catch(err){
      if(grid) grid.innerHTML = '<div style="color:#999;padding:20px;">Error fetching results.</div>';
      console.error(err);
    }
  }

  // ===== Newsletter =====
  const newsForm = document.getElementById('newsletter-form');
  if(newsForm) {
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsForm.querySelector('input[type="email"]').value;
      alert('Thanks for subscribing: ' + email);
      newsForm.reset();
    });
  }

  // ===== Init =====
  document.addEventListener('DOMContentLoaded', ()=>{
    initNavbarAuthState();
    showSlide(0);
    const form = document.getElementById('search-form');
    if(form) form.addEventListener('submit', onSearch);
  });

})();
