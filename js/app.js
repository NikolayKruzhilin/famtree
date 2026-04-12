/* ══════════════════════════════════════════════════════════════
   js/app.js  —  Family Tree Application Logic
   Pan/zoom canvas, layout engine, rendering, panel, modal, search.
   GitHub Pages compatible: no server deps, localStorage persistence.
   ══════════════════════════════════════════════════════════════ */

// ════════════════════════════════════════
// STATE
// ════════════════════════════════════════

let data = JSON.parse(localStorage.getItem('familytree-zaycev')) ||
           JSON.parse(JSON.stringify(DEFAULT_DATA));

let selectedId  = null;
let editingId   = null;
let panelOpen   = false;

// Canvas transform
let tx = 0, ty = 0, scale = 1;
let dragging = false;
let dragStart  = { x: 0, y: 0 };
let dragOrigin = { x: 0, y: 0 };

// Node positions computed by layout engine
let positions = {};

// Grab DOM references early (before DOMContentLoaded — all elements are inline in HTML)
const wrap     = document.getElementById('canvas-wrap');
const canvasEl = document.getElementById('canvas');

// ════════════════════════════════════════
// LAYOUT ENGINE
// ════════════════════════════════════════

// Node dimensions & gaps (must match CSS --node-w / --node-h)
const NW = 184, NH = 86, HGAP = 30, VGAP = 74;

/**
 * Assigns a generation index to every person, then lays them out
 * on a grid.  Spouses are kept adjacent on the same row.
 */
function computeLayout() {
  const gen    = {};
  const allIds = Object.keys(data.people);

  // Recursive generation assignment
  function getGen(id, visited = new Set()) {
    if (gen[id] !== undefined) return gen[id];
    if (visited.has(id)) return 0;
    visited.add(id);
    const p = data.people[id];
    if (!p) return 0;
    // Allow an explicit row override in data (e.g. Андрей Зайцев has no parents
    // but should appear on the same row as his wife Ольга)
    if (p._gen !== undefined) { gen[id] = p._gen; return p._gen; }
    let maxParentGen = -1;
    for (const pid of [p.father, p.mother]) {
      if (pid && data.people[pid]) {
        const pg = getGen(pid, new Set(visited));
        maxParentGen = Math.max(maxParentGen, pg);
      }
    }
    gen[id] = maxParentGen + 1;
    return gen[id];
  }

  allIds.forEach(id => getGen(id));

  // Group by generation
  const byGen = {};
  allIds.forEach(id => {
    const g = gen[id] || 0;
    if (!byGen[g]) byGen[g] = [];
    byGen[g].push(id);
  });

  positions = {};
  const genOrder = Object.keys(byGen).map(Number).sort((a, b) => a - b);

  genOrder.forEach((g, gi) => {
    const ids    = byGen[g];
    const placed = new Set();
    const ordered = [];

    // Pair spouses together
    ids.forEach(id => {
      if (placed.has(id)) return;
      ordered.push(id);
      placed.add(id);
      const p = data.people[id];
      if (p && p.spouse && ids.includes(p.spouse) && !placed.has(p.spouse)) {
        ordered.push(p.spouse);
        placed.add(p.spouse);
      }
    });

    const totalW = ordered.length * NW + (ordered.length - 1) * HGAP;
    const startX = -totalW / 2;

    ordered.forEach((id, i) => {
      positions[id] = {
        x: startX + i * (NW + HGAP),
        y: gi  * (NH + VGAP),
      };
    });
  });

  return { genCount: genOrder.length };
}

// ════════════════════════════════════════
// RENDER
// ════════════════════════════════════════

function render() {
  computeLayout();
  renderNodes();
  renderLines();
  renderGenLabels();
  updateMinimap();
}

// ── Generation labels ──────────────────

function renderGenLabels() {
  const overlay = document.getElementById('gen-overlay');
  overlay.innerHTML = '';

  // Find the minimum Y per unique generation row
  const genYs = {};
  Object.entries(positions).forEach(([id, pos]) => {
    const g = getGenIndex(id);
    if (genYs[g] === undefined || pos.y < genYs[g]) genYs[g] = pos.y;
  });

  const genNames = [
    'Прапрадеды',
    'Прадеды',
    'Дедушки и бабушки',
    'Родители',
    'Вы'
  ];

  Object.entries(genYs).forEach(([g, yCanvas]) => {
    // Convert canvas Y → screen Y accounting for pan/zoom
    const screenY = yCanvas * scale + ty + (NH * scale) / 2 - 12;
    if (screenY < -40 || screenY > window.innerHeight) return; // skip off-screen

    const label = document.createElement('div');
    label.className  = 'gen-label';
    label.style.top  = screenY + 'px';
    label.textContent = genNames[+g] || `Поколение ${+g + 1}`;
    overlay.appendChild(label);
  });
}

// Returns the row index (0-based) for a given person ID
function getGenIndex(id) {
  const pos = positions[id];
  if (!pos) return 0;
  const uniqueYs = [...new Set(Object.values(positions).map(p => p.y))].sort((a, b) => a - b);
  return uniqueYs.indexOf(pos.y);
}

// ── Nodes ──────────────────────────────

function renderNodes() {
  // Remove old nodes, keep the SVG
  canvasEl.querySelectorAll('.node').forEach(el => el.remove());

  Object.entries(positions).forEach(([id, pos]) => {
    const p = data.people[id];
    if (!p) return;

    const node = document.createElement('div');
    node.className =
      'node' +
      (p.gender === 'm' ? ' male'   : '') +
      (p.gender === 'f' ? ' female' : '') +
      (p.death           ? ' deceased' : '') +
      (selectedId && selectedId !== id ? ' dimmed' : '') +
      (selectedId === id ? ' selected' : '');

    node.style.left     = pos.x + 'px';
    node.style.top      = pos.y + 'px';
    node.dataset.id     = id;
    node.setAttribute('role', 'button');
    node.setAttribute('tabindex', '0');
    node.setAttribute('aria-label', getFullName(p));
    node.onclick        = () => selectPerson(id);
    node.onkeydown      = e => { if (e.key === 'Enter' || e.key === ' ') selectPerson(id); };

    const avatarHtml = p.photo
      ? `<div class="node-avatar"><img src="${p.photo}" alt="${getInitials(p)}"></div>`
      : `<div class="node-dot"></div>`;

    node.innerHTML = `
      ${avatarHtml}
      <div class="node-info">
        <div class="node-firstname">${escHtml(p.firstname || '?')}</div>
        ${p.lastname ? `<div class="node-lastname">${escHtml(p.lastname)}</div>` : ''}
        <div class="node-years">${getYears(p)}</div>
      </div>
    `;

    canvasEl.appendChild(node);
  });
}

// ── SVG Connector Lines ────────────────

function renderLines() {
  const svg = document.getElementById('lines-svg');
  svg.innerHTML = '';

  const rendered = new Set();

  Object.entries(data.people).forEach(([id, p]) => {
    const pos = positions[id];
    if (!pos) return;

    // Marriage line (horizontal dashed gold)
    if (p.spouse && positions[p.spouse] && !rendered.has(id + '_' + p.spouse)) {
      rendered.add(id + '_' + p.spouse);
      rendered.add(p.spouse + '_' + id);
      const sp = positions[p.spouse];
      // Draw left→right only (avoid drawing twice)
      if (pos.x < sp.x) {
        drawLine(svg, pos.x + NW, pos.y + NH / 2, sp.x, sp.y + NH / 2, 'line-marriage');
      } else {
        drawLine(svg, sp.x + NW, sp.y + NH / 2, pos.x, pos.y + NH / 2, 'line-marriage');
      }
    }

    // Parent → children lines
    if (p.children && p.children.length > 0) {
      const validChildren = p.children.filter(cid => positions[cid]);
      if (validChildren.length === 0) return;

      const spousePos   = p.spouse ? positions[p.spouse] : null;
      // Spouses are "on the same row" when their Y positions match
      const sameRowSpouse = spousePos && Math.abs(spousePos.y - pos.y) < 1;

      // Deduplicate: only one parent draws the lines
      // • Same row  → the RIGHT spouse yields (left one draws)
      // • Diff rows → the LOWER-gen parent (smaller Y) yields so the
      //               parent closer to the children draws from the right level
      if (sameRowSpouse  && spousePos.x < pos.x)  return;
      if (!sameRowSpouse && spousePos && pos.y < spousePos.y) return;

      // Use midpoint between same-row parents; otherwise use this node's centre
      let parentMidX = pos.x + NW / 2;
      if (sameRowSpouse) {
        parentMidX = (pos.x + NW / 2 + spousePos.x + NW / 2) / 2;
      }
      const parentTopY = pos.y + NH;

      const junctionY = parentTopY + VGAP / 2;

      // Vertical stem down
      drawLine(svg, parentMidX, parentTopY, parentMidX, junctionY, 'line-child');

      if (validChildren.length === 1) {
        const cpos = positions[validChildren[0]];
        const cx   = cpos.x + NW / 2;
        drawLine(svg, parentMidX, junctionY, cx, junctionY, 'line-child');
        drawLine(svg, cx, junctionY, cx, cpos.y, 'line-child');
      } else {
        // Horizontal branch at junction Y
        const xs   = validChildren.map(cid => positions[cid].x + NW / 2);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        drawLine(svg, minX, junctionY, maxX, junctionY, 'line-child');
        validChildren.forEach(cid => {
          const cpos = positions[cid];
          const cx   = cpos.x + NW / 2;
          drawLine(svg, cx, junctionY, cx, cpos.y, 'line-child');
        });
      }
    }
  });
}

function drawLine(svg, x1, y1, x2, y2, cls) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('class', cls);
  svg.appendChild(line);
}

// ════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getInitials(p) {
  const f = p.firstname ? p.firstname[0] : '';
  const l = p.lastname  ? p.lastname[0]  : '';
  return (f + l) || '?';
}

function getShortName(p) {
  if (!p.firstname && !p.lastname) return 'Неизвестно';
  return [p.firstname, p.lastname].filter(Boolean).join(' ');
}

function getFullName(p) {
  return [p.lastname, p.firstname, p.patronymic].filter(Boolean).join(' ') || 'Неизвестно';
}

function getYears(p) {
  if (!p.birth && !p.death) return '';
  if (p.birth && p.death)   return `${p.birth} — ${p.death}`;
  if (p.birth)               return `${p.birth} —`;
  return `† ${p.death}`;
}

function saveData() {
  localStorage.setItem('familytree-zaycev', JSON.stringify(data));
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

// ════════════════════════════════════════
// SELECTION & SIDE PANEL
// ════════════════════════════════════════

function selectPerson(id) {
  selectedId = id;
  openPanel(id);
  render();
  centerOnNode(id);
}

function openPanel(id) {
  const p = data.people[id];
  if (!p) return;

  panelOpen = true;
  document.getElementById('panel').classList.add('open');
  wrap.classList.add('panel-open');

  // Avatar
  const av = document.getElementById('panel-avatar');
  av.style.background = p.gender === 'm' ? 'var(--male-dim)' : p.gender === 'f' ? 'var(--female-dim)' : 'var(--bg4)';
  av.style.color      = p.gender === 'm' ? 'var(--male)'     : p.gender === 'f' ? 'var(--female)'     : 'var(--text)';
  av.style.fontFamily = "'Cormorant Garamond', serif";
  av.style.fontSize   = '26px';
  av.style.fontWeight = '600';

  if (p.photo) {
    av.innerHTML = `<img src="${escHtml(p.photo)}" alt="${escHtml(getInitials(p))}" style="width:100%;height:100%;object-fit:cover">`;
  } else {
    av.innerHTML = escHtml(getInitials(p));
  }

  document.getElementById('panel-name').textContent  = getFullName(p);
  document.getElementById('panel-years').textContent = getYears(p);

  let html = '';

  // ── Basic info ──
  const fields = [
    ['Место рождения',  p.birthplace],
    ['Место смерти',    p.deathplace],
    ['Профессия / роль', p.job],
  ].filter(([, v]) => v);

  if (fields.length) {
    html += `<div class="panel-section">
      <div class="panel-section-title">О человеке</div>`;
    fields.forEach(([label, val]) => {
      html += `<div class="panel-field">
        <div class="panel-field-label">${escHtml(label)}</div>
        <div class="panel-field-value">${escHtml(val)}</div>
      </div>`;
    });
    html += '</div>';
  }

  // ── Relations ──
  const rels = [];
  if (p.father && data.people[p.father]) rels.push({ label: 'Отец',     id: p.father, p: data.people[p.father] });
  if (p.mother && data.people[p.mother]) rels.push({ label: 'Мать',     id: p.mother, p: data.people[p.mother] });
  if (p.spouse && data.people[p.spouse]) rels.push({ label: 'Супруг(а)', id: p.spouse, p: data.people[p.spouse] });
  (p.children || []).forEach(cid => {
    if (data.people[cid]) rels.push({ label: 'Ребёнок', id: cid, p: data.people[cid] });
  });

  if (rels.length) {
    html += `<div class="panel-section">
      <div class="panel-section-title">Родственники</div>
      <div>`;
    rels.forEach(({ label, id: rid, p: rp }) => {
      const color = rp.gender === 'm' ? 'var(--male)' : rp.gender === 'f' ? 'var(--female)' : 'var(--text3)';
      html += `<span class="rel-chip" onclick="selectPerson('${rid}')" role="button" tabindex="0">
        <span class="dot" style="background:${color}"></span>
        <span class="rel-label-small">${escHtml(label)}:</span>
        ${escHtml(getShortName(rp))}
      </span>`;
    });
    html += '</div></div>';
  }

  // ── Notes ──
  if (p.notes) {
    html += `<div class="panel-section">
      <div class="panel-section-title">История и заметки</div>
      <div class="notes-text">${escHtml(p.notes)}</div>
    </div>`;
  }

  document.getElementById('panel-body').innerHTML = html;
}

function closePanel() {
  panelOpen  = false;
  selectedId = null;
  document.getElementById('panel').classList.remove('open');
  wrap.classList.remove('panel-open');
  render();
}

// ════════════════════════════════════════
// MODAL: ADD / EDIT PERSON
// ════════════════════════════════════════

function populateSelects(excludeId = null) {
  const selIds = ['f-father', 'f-mother', 'f-spouse'];
  selIds.forEach(sid => {
    const sel = document.getElementById(sid);
    const cur = sel.value;
    sel.innerHTML = '<option value="">— не указан(а) —</option>';
    Object.entries(data.people)
      .sort((a, b) => getFullName(a[1]).localeCompare(getFullName(b[1]), 'ru'))
      .forEach(([id, p]) => {
        if (id === excludeId) return;
        const opt = document.createElement('option');
        opt.value       = id;
        opt.textContent = getFullName(p) + (p.birth ? ` (${p.birth})` : '');
        sel.appendChild(opt);
      });
    sel.value = cur;
  });
}

function openAddModal(prefill = {}) {
  editingId = null;
  document.getElementById('modal-title').textContent = 'Добавить человека';
  document.getElementById('person-form').reset();
  populateSelects();
  if (prefill.father) document.getElementById('f-father').value = prefill.father;
  if (prefill.mother) document.getElementById('f-mother').value = prefill.mother;
  if (prefill.spouse) document.getElementById('f-spouse').value = prefill.spouse;
  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('f-firstname').focus();
}

function openEditModal(id) {
  if (!id || !data.people[id]) return;
  editingId = id;
  const p   = data.people[id];
  document.getElementById('modal-title').textContent = 'Редактировать';

  document.getElementById('f-firstname').value  = p.firstname  || '';
  document.getElementById('f-patronymic').value = p.patronymic || '';
  document.getElementById('f-lastname').value   = p.lastname   || '';
  document.getElementById('f-gender').value     = p.gender     || 'u';
  document.getElementById('f-birth').value      = p.birth      || '';
  document.getElementById('f-death').value      = p.death      || '';
  document.getElementById('f-birthplace').value = p.birthplace || '';
  document.getElementById('f-job').value        = p.job        || '';
  document.getElementById('f-photo').value      = p.photo      || '';
  document.getElementById('f-notes').value      = p.notes      || '';

  populateSelects(id);
  document.getElementById('f-father').value = p.father || '';
  document.getElementById('f-mother').value = p.mother || '';
  document.getElementById('f-spouse').value = p.spouse || '';

  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('f-firstname').focus();
}

function openAddRelModal(fromId) {
  // Open add modal – no auto-prefill; user selects relations manually
  openAddModal();
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  editingId = null;
}

function savePerson(e) {
  if (e) e.preventDefault();

  const firstname = document.getElementById('f-firstname').value.trim();
  if (!firstname) { showToast('Введите имя'); return; }

  const id   = editingId || ('p_' + Date.now());
  const oldP = editingId ? data.people[editingId] : {};

  const father = document.getElementById('f-father').value || null;
  const mother = document.getElementById('f-mother').value || null;
  const spouse = document.getElementById('f-spouse').value || null;

  const person = {
    firstname,
    patronymic: document.getElementById('f-patronymic').value.trim() || null,
    lastname:   document.getElementById('f-lastname').value.trim()   || null,
    gender:     document.getElementById('f-gender').value,
    birth:      parseInt(document.getElementById('f-birth').value)   || null,
    death:      parseInt(document.getElementById('f-death').value)   || null,
    birthplace: document.getElementById('f-birthplace').value.trim() || null,
    deathplace: oldP.deathplace || null,
    job:        document.getElementById('f-job').value.trim()        || null,
    photo:      document.getElementById('f-photo').value.trim()      || null,
    notes:      document.getElementById('f-notes').value.trim()      || null,
    father,
    mother,
    spouse,
    children: oldP.children || [],
  };

  // ── Clean up old relations ──
  if (editingId) {
    // Remove from old parents' children lists
    [oldP.father, oldP.mother].forEach(pid => {
      if (pid && data.people[pid]) {
        data.people[pid].children = (data.people[pid].children || []).filter(c => c !== editingId);
      }
    });
    // Break old spouse link
    if (oldP.spouse && data.people[oldP.spouse]) {
      data.people[oldP.spouse].spouse = null;
    }
  }

  // ── Set up new relations ──
  [father, mother].forEach(pid => {
    if (pid && data.people[pid]) {
      if (!data.people[pid].children) data.people[pid].children = [];
      if (!data.people[pid].children.includes(id)) {
        data.people[pid].children.push(id);
      }
    }
  });

  if (spouse && data.people[spouse]) {
    data.people[spouse].spouse = id;
  }

  data.people[id] = person;
  saveData();
  closeModal();
  render();

  if (!editingId) {
    setTimeout(() => selectPerson(id), 80);
  } else if (selectedId) {
    setTimeout(() => openPanel(selectedId), 80);
  }

  showToast(editingId ? '✓ Сохранено' : '✓ Добавлен новый человек');
}

function deletePerson(id) {
  if (!id || !data.people[id]) return;
  const p    = data.people[id];
  const name = getFullName(p);

  if (!confirm(`Удалить «${name}»?\n\nВсе связи с этим человеком также будут удалены.`)) return;

  if (p.spouse && data.people[p.spouse])         data.people[p.spouse].spouse = null;
  [p.father, p.mother].forEach(pid => {
    if (pid && data.people[pid]) {
      data.people[pid].children = (data.people[pid].children || []).filter(c => c !== id);
    }
  });
  (p.children || []).forEach(cid => {
    if (data.people[cid]) {
      if (data.people[cid].father === id) data.people[cid].father = null;
      if (data.people[cid].mother === id) data.people[cid].mother = null;
    }
  });

  delete data.people[id];
  saveData();
  closePanel();
  render();
  showToast(`✕ ${name} удалён(а)`);
}

// ════════════════════════════════════════
// CANVAS PAN & ZOOM
// ════════════════════════════════════════

function applyTransform() {
  canvasEl.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  renderGenLabels();
  updateMinimap();
}

// ── Mouse drag ──
wrap.addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  if (e.target.closest('.node')) return;
  dragging   = true;
  dragStart  = { x: e.clientX, y: e.clientY };
  dragOrigin = { x: tx, y: ty };
  wrap.classList.add('grabbing');
});

document.addEventListener('mousemove', e => {
  if (!dragging) return;
  tx = dragOrigin.x + e.clientX - dragStart.x;
  ty = dragOrigin.y + e.clientY - dragStart.y;
  applyTransform();
});

document.addEventListener('mouseup', () => {
  if (!dragging) return;
  dragging = false;
  wrap.classList.remove('grabbing');
});

// ── Touch drag ──
let touchStart = null;
wrap.addEventListener('touchstart', e => {
  if (e.touches.length === 1) {
    const t = e.touches[0];
    touchStart = { x: t.clientX, y: t.clientY, tx, ty };
  }
}, { passive: true });

wrap.addEventListener('touchmove', e => {
  if (!touchStart || e.touches.length !== 1) return;
  e.preventDefault();
  const t = e.touches[0];
  tx = touchStart.tx + t.clientX - touchStart.x;
  ty = touchStart.ty + t.clientY - touchStart.y;
  applyTransform();
}, { passive: false });

wrap.addEventListener('touchend', () => { touchStart = null; }, { passive: true });

// ── Mouse wheel zoom ──
wrap.addEventListener('wheel', e => {
  e.preventDefault();
  const delta    = e.deltaY > 0 ? -0.1 : 0.1;
  const rect     = wrap.getBoundingClientRect();
  const mx       = e.clientX - rect.left;
  const my       = e.clientY - rect.top;
  const newScale = Math.max(0.15, Math.min(3, scale + delta));
  const ratio    = newScale / scale;
  tx    = mx - ratio * (mx - tx);
  ty    = my - ratio * (my - ty);
  scale = newScale;
  applyTransform();
}, { passive: false });

// ── Zoom buttons ──
function changeZoom(delta) {
  const newScale = Math.max(0.15, Math.min(3, scale + delta));
  const rect     = wrap.getBoundingClientRect();
  const cx = rect.width  / 2;
  const cy = rect.height / 2;
  const ratio = newScale / scale;
  tx    = cx - ratio * (cx - tx);
  ty    = cy - ratio * (cy - ty);
  scale = newScale;
  applyTransform();
}

// ── Fit all nodes into view ──
function fitView() {
  const ids = Object.keys(positions);
  if (!ids.length) return;

  const xs   = ids.map(id => positions[id].x);
  const ys   = ids.map(id => positions[id].y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs) + NW;
  const maxY = Math.max(...ys) + NH;

  const rect = wrap.getBoundingClientRect();
  const pad  = 52;
  const ww   = rect.width  - pad * 2;
  const wh   = rect.height - pad * 2;

  scale = Math.min(ww / (maxX - minX), wh / (maxY - minY), 1.0);
  scale = Math.max(0.18, scale);

  tx = (ww  - (maxX - minX) * scale) / 2 + pad - minX * scale;
  ty = (wh  - (maxY - minY) * scale) / 2 + pad - minY * scale;

  applyTransform();
}

// ── Center canvas on a node ──
function centerOnNode(id) {
  const pos = positions[id];
  if (!pos) return;
  const rect   = wrap.getBoundingClientRect();
  const panelW = panelOpen ? document.getElementById('panel').offsetWidth : 0;
  const cx = (rect.width - panelW) / 2;
  const cy = rect.height / 2;
  tx = cx - (pos.x + NW / 2) * scale;
  ty = cy - (pos.y + NH / 2) * scale;
  applyTransform();
}

// ════════════════════════════════════════
// MINIMAP
// ════════════════════════════════════════

function updateMinimap() {
  const mmEl  = document.getElementById('minimap');
  const cvs   = document.getElementById('minimap-canvas');
  const ctx   = cvs.getContext('2d');

  const dpr    = window.devicePixelRatio || 1;
  cvs.width    = mmEl.offsetWidth  * dpr;
  cvs.height   = mmEl.offsetHeight * dpr;
  ctx.scale(dpr, dpr);

  const mw = mmEl.offsetWidth;
  const mh = mmEl.offsetHeight;

  const ids = Object.keys(positions);
  if (!ids.length) return;

  const xs      = ids.map(id => positions[id].x);
  const ys      = ids.map(id => positions[id].y);
  const minX    = Math.min(...xs);
  const minY    = Math.min(...ys);
  const contentW = Math.max(...xs) + NW - minX || 1;
  const contentH = Math.max(...ys) + NH - minY || 1;

  const ms = Math.min(mw / contentW, mh / contentH) * 0.84;
  const ox = (mw - contentW * ms) / 2;
  const oy = (mh - contentH * ms) / 2;

  ctx.clearRect(0, 0, mw, mh);

  ids.forEach(id => {
    const pos = positions[id];
    const p   = data.people[id];
    if (!p) return;
    const x = ox + (pos.x - minX) * ms;
    const y = oy + (pos.y - minY) * ms;
    const w = NW * ms;
    const h = NH * ms;

    ctx.fillStyle   = p.gender === 'm' ? 'rgba(80,144,184,0.22)'  : p.gender === 'f' ? 'rgba(176,88,136,0.22)' : 'rgba(46,46,52,0.6)';
    ctx.strokeStyle = id === selectedId ? '#c9a96e' : '#38384a';
    ctx.lineWidth   = id === selectedId ? 1.5 : 0.5;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, w, h, 2);
    } else {
      ctx.rect(x, y, w, h);
    }
    ctx.fill();
    ctx.stroke();
  });

  // Viewport indicator
  const rect = wrap.getBoundingClientRect();
  const vx   = ox + (-tx / scale - minX) * ms;
  const vy   = oy + (-ty / scale - minY) * ms;
  const vw   = (rect.width  / scale) * ms;
  const vh   = (rect.height / scale) * ms;

  const vp = document.getElementById('minimap-viewport');
  vp.style.left   = Math.max(0, vx) + 'px';
  vp.style.top    = Math.max(0, vy) + 'px';
  vp.style.width  = Math.min(mw, vw) + 'px';
  vp.style.height = Math.min(mh, vh) + 'px';
}

// ════════════════════════════════════════
// SEARCH
// ════════════════════════════════════════

document.getElementById('search').addEventListener('input', e => {
  const q       = e.target.value.toLowerCase().trim();
  const results = document.getElementById('search-results');

  if (!q) { results.style.display = 'none'; return; }

  const matches = Object.entries(data.people)
    .filter(([, p]) => getFullName(p).toLowerCase().includes(q))
    .slice(0, 8);

  if (!matches.length) { results.style.display = 'none'; return; }

  results.innerHTML = matches.map(([id, p]) => {
    const color = p.gender === 'm' ? 'var(--male)' : p.gender === 'f' ? 'var(--female)' : 'var(--text3)';
    const yearsStr = getYears(p);
    const meta = [yearsStr, p.birthplace].filter(Boolean).join(' · ');
    return `<div class="search-item" role="option"
        onclick="clearSearch(); selectPerson('${id}')">
      <div class="search-dot" style="background:${color}"></div>
      <div>
        <div class="search-item-name">${escHtml(getFullName(p))}</div>
        ${meta ? `<div class="search-item-meta">${escHtml(meta)}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  results.style.display = 'block';
});

function clearSearch() {
  document.getElementById('search').value = '';
  document.getElementById('search-results').style.display = 'none';
}

document.addEventListener('click', e => {
  if (!e.target.closest('#search-wrap')) {
    clearSearch();
  }
});

// Close search on Escape
document.getElementById('search').addEventListener('keydown', e => {
  if (e.key === 'Escape') clearSearch();
});

// ════════════════════════════════════════
// EXPORT / IMPORT
// ════════════════════════════════════════

function exportData() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'familytree-zaycev.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('✓ Файл сохранён');
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const imported = JSON.parse(ev.target.result);
      if (!imported.people) throw new Error('bad format');
      data = imported;
      saveData();
      render();
      setTimeout(fitView, 80);
      showToast('✓ Данные загружены');
    } catch {
      showToast('✕ Ошибка: неверный файл');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

// ════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ════════════════════════════════════════

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

  if (e.key === 'Escape') {
    if (document.getElementById('modal-overlay').classList.contains('open')) {
      closeModal();
    } else if (panelOpen) {
      closePanel();
    }
  }
  if (e.key === 'f' || e.key === 'F') fitView();
  if (e.key === '+' || e.key === '=') changeZoom(0.15);
  if (e.key === '-')                   changeZoom(-0.15);
});

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════

window.addEventListener('load', () => {
  render();
  setTimeout(fitView, 120);
});

window.addEventListener('resize', () => {
  updateMinimap();
  renderGenLabels();
});
