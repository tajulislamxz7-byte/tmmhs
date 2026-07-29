// ================================================
// MESSAGES PAGE — localStorage-backed real messaging
// ================================================

import * as auth from '../utils/auth.js';

const FALLBACK_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

// ── Storage helpers ──────────────────────────────
function getConversations() {
  return JSON.parse(localStorage.getItem('gfa_conversations') || '[]');
}
function saveConversations(list) {
  localStorage.setItem('gfa_conversations', JSON.stringify(list));
}
function getMessages(convId) {
  return JSON.parse(localStorage.getItem('gfa_msgs_' + convId) || '[]');
}
function saveMessages(convId, msgs) {
  localStorage.setItem('gfa_msgs_' + convId, JSON.stringify(msgs));
}

// Ensure admin welcome message exists for new users
function ensureWelcomeConv(meId) {
  const convs = getConversations();
  const existing = convs.find(c => c.participants.includes(meId) && c.participants.includes('admin'));
  if (!existing) {
    const convId = 'C_admin_' + meId;
    convs.unshift({
      id: convId,
      participants: ['admin', meId],
      lastMsg: 'Welcome to Tiarkhali M.M High School portal.',
      lastTime: new Date().toISOString(),
      unread: { [meId]: 1 },
    });
    saveConversations(convs);
    const msgs = getMessages(convId);
    if (msgs.length === 0) {
      saveMessages(convId, [{
        id: 'm_welcome',
        senderId: 'admin',
        senderName: 'Admin Office',
        text: 'Welcome to Tiarkhali M.M High School and College portal. Use this messaging system to communicate with teachers and staff.',
        time: new Date().toISOString(),
      }]);
    }
  }
}

// Get display info for a user id
function getUserInfo(id) {
  if (id === 'admin') return { id:'admin', name:'Admin Office', role:'Administration', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminTMMH' };
  // Read from localStorage (messages still uses localStorage for real-time polling)
  const allUsers = JSON.parse(localStorage.getItem('gfa_users') || '[]');
  const u = allUsers.find(x => x.id === id);
  if (u) return { id: u.id, name: u.name, role: u.role, avatar: u.avatar || FALLBACK_AVATAR };
  return { id, name: id, role: 'User', avatar: FALLBACK_AVATAR };
}

// Get the other participant in a 2-person conversation
function getOtherParticipant(conv, meId) {
  const otherId = conv.participants.find(p => p !== meId) || conv.participants[0];
  return getUserInfo(otherId);
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff/60000) + 'm ago';
  if (diff < 86400000) return d.toTimeString().slice(0,5);
  if (diff < 604800000) return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
  return d.toLocaleDateString('en-BD', {day:'numeric',month:'short'});
}

let activeConvId = null;

export function renderMessages(loggedInUser) {
  const me = loggedInUser || auth.getCurrentUser();
  if (!me) return `
    <div class="container section-sm text-center" style="padding:80px 0;">
      <div style="font-size:48px;margin-bottom:16px;">💬</div>
      <div class="font-semibold" style="font-size:20px;margin-bottom:8px;">Sign in to use Messages</div>
      <button class="btn btn-primary" onclick="navigate('login')">Sign In</button>
    </div>`;

  ensureWelcomeConv(me.id);
  const convs = getConversations().filter(c => c.participants.includes(me.id));
  if (!activeConvId && convs.length > 0) activeConvId = convs[0].id;

  const activeConv = convs.find(c => c.id === activeConvId) || convs[0] || null;

  return `
    <div style="height:calc(100vh - var(--nav-height));overflow:hidden;">
      <div class="messages-layout">

        <!-- Sidebar -->
        <div class="messages-sidebar">
          <div style="padding:16px 20px;border-bottom:1.5px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
            <div class="font-semibold">Messages</div>
            <button class="btn btn-primary btn-sm" onclick="showNewMessageModal()">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:4px;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>New
            </button>
          </div>
          <div style="padding:10px 12px;">
            <div class="search-inline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input type="text" placeholder="Search messages..." class="search-input-inline" oninput="filterConvs(this.value)">
            </div>
          </div>
          <div id="convList">
            ${convs.length === 0
              ? `<div class="text-center text-muted" style="padding:40px 16px;font-size:13px;">No conversations yet.<br>Start a new message.</div>`
              : convs.map(c => renderConvItem(c, me.id)).join('')
            }
          </div>
        </div>

        <!-- Chat Panel -->
        <div class="messages-panel" id="messagePanel">
          ${activeConv ? renderChatPanel(activeConv, me) : renderEmptyChat()}
        </div>
      </div>
    </div>

    <!-- New Message Modal -->
    <div id="newMsgModal" class="modal-overlay hidden" onclick="if(event.target===this)this.classList.add('hidden')">
      <div class="modal" style="max-width:420px;">
        <div class="modal-header">
          <div class="font-semibold">New Message</div>
          <button class="btn btn-ghost btn-icon" onclick="document.getElementById('newMsgModal').classList.add('hidden')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body" style="display:flex;flex-direction:column;gap:14px;">
          <div class="form-group">
            <label class="form-label">To (name or ID)</label>
            <input class="form-input" id="newMsgTo" placeholder="Search user..." oninput="searchMsgUsers(this.value)">
            <div id="userSuggestions" style="background:var(--bg-primary);border:1px solid var(--border);border-radius:8px;margin-top:4px;display:none;max-height:180px;overflow-y:auto;"></div>
          </div>
          <div id="selectedUserChip" style="display:none;padding:8px 12px;background:var(--primary-50);border-radius:8px;font-size:13px;display:none;align-items:center;gap:8px;">
            <span id="selectedUserName"></span>
            <button class="btn btn-ghost btn-icon btn-sm" onclick="clearSelectedUser()" style="margin-left:auto;">×</button>
          </div>
          <input type="hidden" id="newMsgToId">
          <div class="form-group">
            <label class="form-label">Message</label>
            <textarea class="form-input" id="newMsgText" rows="3" placeholder="Write your message..."></textarea>
          </div>
          <div class="flex gap-3 justify-end">
            <button class="btn btn-secondary" onclick="document.getElementById('newMsgModal').classList.add('hidden')">Cancel</button>
            <button class="btn btn-primary" onclick="sendNewMessage()">Send</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderConvItem(c, meId) {
  const other = getOtherParticipant(c, meId);
  const unread = (c.unread || {})[meId] || 0;
  const isActive = c.id === activeConvId;
  return `
    <div class="message-thread-item ${isActive?'active':''}" id="conv_${c.id}" onclick="selectConversation('${c.id}')">
      <div class="flex items-start gap-3">
        <div style="position:relative;flex-shrink:0;">
          <img src="${other.avatar}" alt="${other.name}" class="avatar avatar-md" onerror="this.src='${FALLBACK_AVATAR}'">
          ${unread > 0 ? `<div style="position:absolute;top:-2px;right:-2px;width:16px;height:16px;background:var(--primary);border-radius:50%;border:2px solid var(--bg-primary);font-size:9px;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;">${unread}</div>` : ''}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <div class="font-semibold text-sm truncate">${other.name}</div>
            <div class="text-xs text-muted" style="white-space:nowrap;margin-left:6px;">${formatTime(c.lastTime)}</div>
          </div>
          <div class="text-xs text-muted truncate">${c.lastMsg || ''}</div>
          <div class="text-xs" style="color:var(--primary);margin-top:1px;text-transform:capitalize;">${other.role}</div>
        </div>
      </div>
    </div>`;
}

function renderChatPanel(conv, me) {
  const other = getOtherParticipant(conv, me.id);
  const msgs = getMessages(conv.id);
  return `
    <div class="message-chat-header">
      <img src="${other.avatar}" alt="${other.name}" class="avatar avatar-md" onerror="this.src='${FALLBACK_AVATAR}'">
      <div>
        <div class="font-semibold">${other.name}</div>
        <div class="text-xs text-muted" style="text-transform:capitalize;">${other.role}</div>
      </div>
      <button class="btn btn-ghost btn-icon btn-sm" style="margin-left:auto;" onclick="showToast('Call feature coming soon','info')" title="Call">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.23h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.29-.29a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 18v.92z"/></svg>
      </button>
    </div>
    <div class="message-bubble-wrap" id="messageBubbles">
      ${msgs.length === 0
        ? `<div class="text-center text-muted" style="padding:40px 0;font-size:13px;">No messages yet. Say hello! 👋</div>`
        : msgs.map(m => renderBubble(m, me.id)).join('')
      }
    </div>
    <div class="message-input-row">
      <input type="text" id="msgInput" class="form-input" placeholder="Type a message..." style="flex:1;"
        onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMsg('${conv.id}')}">
      <button class="btn btn-primary btn-icon" onclick="sendMsg('${conv.id}')" title="Send">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>
  `;
}

function renderBubble(m, meId) {
  const isMine = m.senderId === meId;
  return `
    <div style="display:flex;flex-direction:column;align-items:${isMine?'flex-end':'flex-start'};margin-bottom:8px;">
      ${!isMine ? `<div class="text-xs text-muted" style="margin-bottom:3px;padding:0 4px;">${m.senderName}</div>` : ''}
      <div class="message-bubble ${isMine?'sent':'received'}">${escapeHtml(m.text)}</div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:3px;padding:0 4px;">${formatTime(m.time)}</div>
    </div>`;
}

function renderEmptyChat() {
  return `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-muted);gap:12px;padding:40px;">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <div class="font-semibold" style="font-size:16px;">Your Messages</div>
      <div class="text-sm">Select a conversation or start a new one</div>
      <button class="btn btn-primary" onclick="showNewMessageModal()">Start New Message</button>
    </div>`;
}

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Window functions ──────────────────────────────

window.selectConversation = function(convId) {
  const me = auth.getCurrentUser();
  if (!me) return;
  activeConvId = convId;

  // Mark as read
  const convs = getConversations();
  const conv = convs.find(c => c.id === convId);
  if (conv) {
    if (!conv.unread) conv.unread = {};
    conv.unread[me.id] = 0;
    saveConversations(convs);
  }

  // Update sidebar active state
  document.querySelectorAll('.message-thread-item').forEach(el => el.classList.remove('active'));
  const item = document.getElementById('conv_' + convId);
  if (item) item.classList.add('active');

  // Re-render chat panel
  const panel = document.getElementById('messagePanel');
  if (panel && conv) panel.innerHTML = renderChatPanel(conv, me);

  // Sync poll baseline — mark all currently rendered messages as known
  const currentMsgs = getMessages(convId);
  _lastMsgCount[convId] = currentMsgs.length;
  _renderedMsgIds = new Set(currentMsgs.map(m => m.id));

  setTimeout(() => {
    const bubbles = document.getElementById('messageBubbles');
    if (bubbles) bubbles.scrollTop = bubbles.scrollHeight;
  }, 50);
};

window.sendMsg = function(convId) {
  const me = auth.getCurrentUser();
  if (!me) return;
  const input = document.getElementById('msgInput');
  const text = input?.value?.trim();
  if (!text) return;

  const msg = {
    id: 'm_' + Date.now(),
    senderId: me.id,
    senderName: me.name,
    text,
    time: new Date().toISOString(),
  };

  // Save message
  const msgs = getMessages(convId);
  msgs.push(msg);
  saveMessages(convId, msgs);

  // Mark as rendered so poll doesn't duplicate it
  _renderedMsgIds.add(msg.id);
  _lastMsgCount[convId] = msgs.length;

  // Update conversation last message
  const convs = getConversations();
  const conv = convs.find(c => c.id === convId);
  if (conv) {
    conv.lastMsg = text;
    conv.lastTime = msg.time;
    // Mark unread for the other participant
    conv.participants.forEach(p => {
      if (p !== me.id) {
        if (!conv.unread) conv.unread = {};
        conv.unread[p] = (conv.unread[p] || 0) + 1;
      }
    });
    saveConversations(convs);
  }

  // Append bubble to DOM
  const bubbles = document.getElementById('messageBubbles');
  if (bubbles) {
    // Remove empty state if present
    const empty = bubbles.querySelector('.text-center');
    if (empty) empty.remove();
    const div = document.createElement('div');
    div.innerHTML = renderBubble(msg, me.id);
    bubbles.appendChild(div.firstElementChild);
    bubbles.scrollTop = bubbles.scrollHeight;
  }

  input.value = '';

  // Update conv list item
  const convItem = document.getElementById('conv_' + convId);
  if (conv && convItem) {
    convItem.querySelector('.text-xs.text-muted.truncate').textContent = text;
    convItem.querySelector('.text-xs.text-muted[style]').textContent = 'Just now';
  }
};

window.showNewMessageModal = function() {
  document.getElementById('newMsgModal')?.classList.remove('hidden');
  document.getElementById('newMsgTo')?.focus();
  clearSelectedUser();
};

window.searchMsgUsers = function(query) {
  const box = document.getElementById('userSuggestions');
  if (!box) return;
  if (query.length < 2) { box.style.display = 'none'; return; }

  const me = auth.getCurrentUser();
  const allUsers = JSON.parse(localStorage.getItem('gfa_users') || '[]').filter(u => u.id !== me?.id);
  const q = query.toLowerCase();
  const matched = allUsers.filter(u =>
    u.name.toLowerCase().includes(q) || u.id.toLowerCase().includes(q) || (u.email||'').toLowerCase().includes(q)
  ).slice(0, 8);

  if (matched.length === 0) { box.style.display = 'none'; return; }
  box.style.display = 'block';
  box.innerHTML = matched.map(u => `
    <div style="display:flex;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;border-radius:6px;"
      onmouseenter="this.style.background='var(--bg-secondary)'" onmouseleave="this.style.background=''"
      onclick="selectMsgUser('${u.id}','${escapeHtml(u.name)}','${u.role}')">
      <img src="${u.avatar||FALLBACK_AVATAR}" class="avatar avatar-sm" onerror="this.src='${FALLBACK_AVATAR}'">
      <div>
        <div class="font-medium text-sm">${u.name}</div>
        <div class="text-xs text-muted" style="text-transform:capitalize;">${u.role}</div>
      </div>
    </div>
  `).join('');
};

window.selectMsgUser = function(id, name, role) {
  document.getElementById('newMsgToId').value = id;
  document.getElementById('newMsgTo').value = name;
  const chip = document.getElementById('selectedUserChip');
  const nameEl = document.getElementById('selectedUserName');
  if (chip) { chip.style.display = 'flex'; }
  if (nameEl) nameEl.textContent = name + ' (' + role + ')';
  document.getElementById('userSuggestions').style.display = 'none';
};

window.clearSelectedUser = function() {
  document.getElementById('newMsgToId').value = '';
  document.getElementById('newMsgTo').value = '';
  const chip = document.getElementById('selectedUserChip');
  if (chip) chip.style.display = 'none';
};

window.sendNewMessage = function() {
  const me = auth.getCurrentUser();
  if (!me) return;
  const toId   = document.getElementById('newMsgToId')?.value;
  const text   = document.getElementById('newMsgText')?.value?.trim();
  if (!toId)  { showToast('Please select a recipient','error'); return; }
  if (!text)  { showToast('Message cannot be empty','error'); return; }

  // Find or create conversation
  let convs = getConversations();
  let conv = convs.find(c =>
    c.participants.length === 2 &&
    c.participants.includes(me.id) &&
    c.participants.includes(toId)
  );

  if (!conv) {
    conv = {
      id: 'C_' + me.id + '_' + toId + '_' + Date.now(),
      participants: [me.id, toId],
      lastMsg: text,
      lastTime: new Date().toISOString(),
      unread: { [toId]: 1 },
    };
    convs.unshift(conv);
  } else {
    conv.lastMsg = text;
    conv.lastTime = new Date().toISOString();
    if (!conv.unread) conv.unread = {};
    conv.unread[toId] = (conv.unread[toId] || 0) + 1;
  }
  saveConversations(convs);

  const msg = {
    id: 'm_' + Date.now(),
    senderId: me.id,
    senderName: me.name,
    text,
    time: new Date().toISOString(),
  };
  const msgs = getMessages(conv.id);
  msgs.push(msg);
  saveMessages(conv.id, msgs);

  document.getElementById('newMsgModal')?.classList.add('hidden');
  document.getElementById('newMsgText').value = '';
  showToast('Message sent!', 'success');

  // Navigate to the conversation
  activeConvId = conv.id;
  navigate('messages');
};

window.filterConvs = function(query) {
  const me = auth.getCurrentUser();
  if (!me) return;
  const q = query.toLowerCase();
  document.querySelectorAll('.message-thread-item').forEach(el => {
    const name = el.querySelector('.font-semibold')?.textContent?.toLowerCase() || '';
    const last = el.querySelector('.truncate')?.textContent?.toLowerCase() || '';
    el.style.display = (!q || name.includes(q) || last.includes(q)) ? '' : 'none';
  });
};

// ── Real-time polling ──────────────────────────────
// Since this is a localStorage app (no server), we poll every 3s and also
// listen for the storage event (fires instantly when another tab writes).

let _pollInterval = null;
let _lastMsgCount = {};   // convId → last known message count
let _renderedMsgIds = new Set(); // IDs already in DOM, to avoid duplicates
let _lastConvHash = '';   // to detect new conversations for this user

function _pollMessages() {
  const me = auth.getCurrentUser();
  if (!me) return;
  if (!document.getElementById('messagePanel')) { stopMessagesPolling(); return; }

  const convs = getConversations().filter(c => c.participants.includes(me.id));

  // Detect new conversations appearing in sidebar
  const convHash = convs.map(c => c.id).join(',');
  if (convHash !== _lastConvHash) {
    _lastConvHash = convHash;
    const listEl = document.getElementById('convList');
    if (listEl) {
      listEl.innerHTML = convs.length === 0
        ? `<div class="text-center text-muted" style="padding:40px 16px;font-size:13px;">No conversations yet.<br>Start a new message.</div>`
        : convs.map(c => renderConvItem(c, me.id)).join('');
    }
  }

  // Update unread badges on sidebar items
  convs.forEach(c => {
    const item = document.getElementById('conv_' + c.id);
    if (!item) return;
    const unread = (c.unread || {})[me.id] || 0;
    const dot = item.querySelector('[data-unread-badge]');
    if (unread > 0) {
      if (dot) { dot.textContent = unread; }
      else {
        const avatarWrap = item.querySelector('[style*="position:relative"]');
        if (avatarWrap) {
          const badge = document.createElement('div');
          badge.setAttribute('data-unread-badge', '1');
          badge.style.cssText = 'position:absolute;top:-2px;right:-2px;width:16px;height:16px;background:var(--primary);border-radius:50%;border:2px solid var(--bg-primary);font-size:9px;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;';
          badge.textContent = unread;
          avatarWrap.appendChild(badge);
        }
      }
    } else if (dot) {
      dot.remove();
    }
  });

  // If the active conversation is open, check for new messages
  if (!activeConvId) return;
  const msgs = getMessages(activeConvId);
  const lastKnown = _lastMsgCount[activeConvId] || 0;
  if (msgs.length <= lastKnown) return;

  _lastMsgCount[activeConvId] = msgs.length;

  // Only append messages not yet in the DOM (by ID)
  const newMsgs = msgs.filter(m => !_renderedMsgIds.has(m.id));
  if (newMsgs.length === 0) return;

  const bubbles = document.getElementById('messageBubbles');
  if (!bubbles) return;

  // Remove empty-state placeholder if present
  const empty = bubbles.querySelector('.text-center');
  if (empty) empty.remove();

  newMsgs.forEach(m => {
    _renderedMsgIds.add(m.id);
    const div = document.createElement('div');
    div.innerHTML = renderBubble(m, me.id);
    bubbles.appendChild(div.firstElementChild);
  });

  bubbles.scrollTop = bubbles.scrollHeight;

  // Mark as read if incoming messages arrived
  if (newMsgs.some(m => m.senderId !== me.id)) {
    const convs2 = getConversations();
    const conv = convs2.find(c => c.id === activeConvId);
    if (conv) {
      if (!conv.unread) conv.unread = {};
      conv.unread[me.id] = 0;
      saveConversations(convs2);
    }
  }
}

export function startMessagesPolling() {
  const me = auth.getCurrentUser();
  if (!me) return;
  // Init last-known counts and rendered IDs
  const convs = getConversations().filter(c => c.participants.includes(me.id));
  convs.forEach(c => { _lastMsgCount[c.id] = getMessages(c.id).length; });
  // Seed rendered IDs from the currently visible conversation
  if (activeConvId) {
    _renderedMsgIds = new Set(getMessages(activeConvId).map(m => m.id));
  } else {
    _renderedMsgIds = new Set();
  }
  _lastConvHash = convs.map(c => c.id).join(',');

  stopMessagesPolling();
  _pollInterval = setInterval(_pollMessages, 2000);

  // Also react instantly when another tab writes to localStorage
  window.addEventListener('storage', _onStorageEvent);
}

export function stopMessagesPolling() {
  if (_pollInterval) { clearInterval(_pollInterval); _pollInterval = null; }
  window.removeEventListener('storage', _onStorageEvent);
}

function _onStorageEvent(e) {
  if (e.key && (e.key === 'gfa_conversations' || e.key?.startsWith('gfa_msgs_'))) {
    _pollMessages();
  }
}
