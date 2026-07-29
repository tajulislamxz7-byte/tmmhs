// ================================================
// MESSAGES PAGE
// ================================================

import { teachers, students } from '../data/sampleData.js';

const FALLBACK_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

const CONVERSATIONS = [
  { id:'C1', withName:'Admin Office', withRole:'Administration', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminTMMH', last:'Welcome to Tiarkhali M.M High School portal.', time:'Today', unread:false },
];

const MESSAGES_BY_CONV = {
  C1: [
    { sender:'them', text:'Welcome to Tiarkhali M.M High School and College portal. Use this messaging system to communicate with teachers and staff.', time:'Today' },
  ],
};

let activeConv = 'C1';

export function renderMessages() {
  return `
    <div style="height:calc(100vh - var(--nav-height));display:flex;flex-direction:column;">
      <div class="messages-layout" style="flex:1;overflow:hidden;">
        <!-- Sidebar -->
        <div class="messages-sidebar">
          <div style="padding:16px 20px;border-bottom:1.5px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
            <div class="font-semibold">Messages</div>
            <button class="btn btn-primary btn-sm" onclick="showNewMessage()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>New</button>
          </div>
          <div style="padding:12px;">
            <div class="search-inline" style="margin-bottom:8px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input type="text" placeholder="Search messages..." class="search-input-inline">
            </div>
          </div>
          ${CONVERSATIONS.map(c => `
            <div class="message-thread-item ${c.id===activeConv?'active':''}" onclick="selectConversation('${c.id}')">
              <div class="flex items-start gap-3">
                <div style="position:relative;">
                  <img src="${c.avatar}" alt="${c.withName}" class="avatar avatar-md">
                  ${c.unread?`<div style="position:absolute;top:0;right:0;width:10px;height:10px;background:var(--primary);border-radius:50%;border:2px solid var(--bg-primary);"></div>`:''}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1">
                    <div class="font-semibold text-sm">${c.withName}</div>
                    <div class="text-xs text-muted">${c.time}</div>
                  </div>
                  <div class="text-xs text-muted truncate">${c.last}</div>
                  <div class="text-xs text-muted" style="margin-top:2px;">${c.withRole}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Chat Panel -->
        <div class="messages-panel" id="messagePanel">
          ${renderChatPanel(CONVERSATIONS[0])}
        </div>
      </div>
    </div>
  `;
}

function renderChatPanel(conv) {
  const msgs = MESSAGES_BY_CONV[conv.id] || [{ sender:'them', text:'No messages yet.', time:'' }];
  return `
    <div class="message-chat-header">
      <img src="${conv.avatar}" alt="${conv.withName}" class="avatar avatar-md">
      <div>
        <div class="font-semibold">${conv.withName}</div>
        <div class="text-xs text-muted">${conv.withRole}</div>
      </div>
      <button class="btn btn-ghost btn-icon btn-sm ml-auto" onclick="showToast('Call feature coming soon','info')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.23h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.29-.29a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 18v.92z"/></svg>
      </button>
    </div>
    <div class="message-bubble-wrap" id="messageBubbles">
      ${msgs.map(m=>`
        <div style="display:flex;flex-direction:column;align-items:${m.sender==='me'?'flex-end':'flex-start'};">
          <div class="message-bubble ${m.sender==='me'?'sent':'received'}">${m.text}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px;padding:0 4px;">${m.time}</div>
        </div>
      `).join('')}
    </div>
    <div class="message-input-row">
      <input type="text" id="msgInput" class="form-input" placeholder="Type a message..." style="flex:1;" onkeydown="if(event.key==='Enter')sendMsg('${conv.id}')">
      <button class="btn btn-secondary btn-icon" onclick="showToast('Attach file feature coming soon','info')" title="Attach">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
      </button>
      <button class="btn btn-primary btn-icon" onclick="sendMsg('${conv.id}')" title="Send">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>
  `;
}

window.selectConversation = function(id) {
  activeConv = id;
  const conv = CONVERSATIONS.find(c => c.id === id);
  if (!conv) return;
  // Update active state
  document.querySelectorAll('.message-thread-item').forEach((el, i) => {
    el.classList.toggle('active', CONVERSATIONS[i].id === id);
  });
  document.getElementById('messagePanel').innerHTML = renderChatPanel(conv);
};

window.sendMsg = function(convId) {
  const input = document.getElementById('msgInput');
  const text = input?.value?.trim();
  if (!text) return;
  const bubbles = document.getElementById('messageBubbles');
  if (bubbles) {
    const now = new Date();
    const time = now.toTimeString().slice(0,5);
    bubbles.innerHTML += `
      <div style="display:flex;flex-direction:column;align-items:flex-end;">
        <div class="message-bubble sent">${text}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:4px;padding:0 4px;">${time}</div>
      </div>
    `;
    bubbles.scrollTop = bubbles.scrollHeight;
  }
  input.value = '';
};

window.showNewMessage = function() {
  showToast('New message dialog...', 'info');
};
