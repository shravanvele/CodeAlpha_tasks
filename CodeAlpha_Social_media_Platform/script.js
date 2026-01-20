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
  setupHandlers();
  if (token) {
    await loadFeed();
    showLoggedIn();
  } else {
    showLoggedOut();
  }
}

function setupHandlers() {
  document.getElementById('loginBtn').onclick = login;
  document.getElementById('registerBtn').onclick = register;
  document.getElementById('logoutBtn').onclick = logout;

  // Floating Post Button + Modal Handlers
  const openPostModal = document.getElementById('openPostModal');
  const postModal = document.getElementById('postModal');
  const closeModal = document.getElementById('closeModal');
  const postBtn = document.getElementById('postBtn');

  openPostModal.onclick = () => (postModal.style.display = 'flex');
  closeModal.onclick = () => (postModal.style.display = 'none');

  postBtn.onclick = createPost;
}

function logout() {
  token = null;
  localStorage.removeItem('token');
  me = null;
  document.getElementById('feed').innerHTML = '';
  showLoggedOut();
}

function showLoggedIn() {
  document.getElementById('auth-forms').classList.add('hidden');
  document.getElementById('logoutBtn').classList.remove('hidden');
  document.getElementById('feed').classList.remove('hidden');
  document.getElementById('openPostModal').style.display = 'block';
}

function showLoggedOut() {
  document.getElementById('auth-forms').classList.remove('hidden');
  document.getElementById('logoutBtn').classList.add('hidden');
  document.getElementById('feed').classList.add('hidden');
  document.getElementById('openPostModal').style.display = 'none';
}

async function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  if (!username || !password) return alert('Please fill all fields');

  const res = await api('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
  if (res.token) {
    token = res.token;
    localStorage.setItem('token', token);
    me = res.user;
    await loadFeed();
    showLoggedIn();
  } else alert(res.error || 'Login failed');
}

async function register() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  if (!username || !password) return alert('Please fill all fields');

  const res = await api('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, displayName: username })
  });
  if (res.token) {
    token = res.token;
    localStorage.setItem('token', token);
    me = res.user;
    await loadFeed();
    showLoggedIn();
  } else alert(res.error || 'Register failed');
}

async function createPost() {
  const content = document.getElementById('postContent').value.trim();
  if (!content) return alert('Write something');

  const res = await api('/posts', { method: 'POST', body: JSON.stringify({ content }) });
  if (res._id) {
    document.getElementById('postContent').value = '';
    document.getElementById('postModal').style.display = 'none';
    await loadFeed();
  } else alert(res.error || 'Could not post');
}

async function loadFeed() {
  const feed = await api('/posts/feed');
  if (!Array.isArray(feed)) return;
  const el = document.getElementById('feed');
  el.innerHTML = '';

  feed.forEach(p => {
    const div = document.createElement('div');
    div.className = 'post';
    div.innerHTML = `
      <div class="meta"><strong>${escapeHtml(p.author.displayName || p.author.username)}</strong> • ${new Date(p.createdAt).toLocaleString()}</div>
      <div class="content">${escapeHtml(p.content)}</div>
      <div class="actions">
        <button data-id="${p._id}" class="likeBtn">${p.likes?.length || 0} ♥</button>
        <button data-id="${p._id}" class="commentToggle">💬 Comment</button>
      </div>
      <div class="comments"></div>
    `;
    el.appendChild(div);

    const likeBtn = div.querySelector('.likeBtn');
    likeBtn.onclick = async () => {
      const res = await api(`/posts/${p._id}/like`, { method: 'POST' });
      if (res.liked !== undefined) loadFeed();
    };

    const commentsDiv = div.querySelector('.comments');
    p.comments = p.comments || [];
    p.comments.forEach(c => {
      const cdiv = document.createElement('div');
      cdiv.className = 'comment';
      cdiv.innerHTML = `<strong>${escapeHtml(c.author.displayName || c.author.username)}</strong>: ${escapeHtml(c.text)}`;
      commentsDiv.appendChild(cdiv);
    });

    const commentToggle = div.querySelector('.commentToggle');
    commentToggle.onclick = () => {
      if (div.querySelector('.commentBox')) {
        div.querySelector('.commentBox').remove();
      } else {
        const box = document.createElement('div');
        box.className = 'commentBox';
        box.innerHTML = `<input placeholder="Write comment" class="cinput" /><button class="cbtn">Send</button>`;
        commentsDiv.appendChild(box);
        box.querySelector('.cbtn').onclick = async () => {
          const txt = box.querySelector('.cinput').value.trim();
          if (!txt) return;
          const res = await api(`/posts/${p._id}/comment`, { method: 'POST', body: JSON.stringify({ text: txt }) });
          if (res._id) loadFeed();
          else alert(res.error || 'Failed');
        };
      }
    };
  });
}

function escapeHtml(s) {
  return String(s || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

init();
