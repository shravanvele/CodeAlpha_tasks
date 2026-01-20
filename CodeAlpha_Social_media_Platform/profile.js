const API = 'http://localhost:4000/api';
let token = localStorage.getItem('token');
let me = null;

async function api(path, opts = {}) {
  opts.headers = opts.headers || {};
  opts.headers['Content-Type'] = 'application/json';
  if (token) opts.headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API + path, opts);
  return res.json();
}

async function init() {
  if (!token) {
    alert('Please log in first');
    window.location.href = 'index.html';
    return;
  }

  // Fetch user profile data
  const res = await api('/auth/me');
  me = res.user || res;
  if (!me?._id) {
    alert('Session expired. Please log in again.');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('profile-name').textContent = me.displayName || me.username;
  document.getElementById('profile-username').textContent = '@' + me.username;

  await loadMyPosts();

  document.getElementById('logoutBtn').onclick = () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  };
}

async function loadMyPosts() {
  const posts = await api('/posts/feed'); // reuse feed API
  const myPosts = posts.filter(p => p.author._id === me._id);

  document.getElementById('postCount').textContent = `${myPosts.length} Posts`;

  const container = document.getElementById('user-posts');
  container.innerHTML = '';

  myPosts.forEach(p => {
    const div = document.createElement('div');
    div.className = 'post';
    div.innerHTML = `
      <div class="meta"><strong>${p.author.displayName || p.author.username}</strong> • ${new Date(p.createdAt).toLocaleString()}</div>
      <div class="content">${escapeHtml(p.content)}</div>
      <div class="actions">
        <span>${p.likes?.length || 0} ♥</span>
      </div>
    `;
    container.appendChild(div);
  });
}

function escapeHtml(s) {
  return String(s || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

init();
