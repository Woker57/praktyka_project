const listView = document.querySelector('#list-view');
const formView = document.querySelector('#form-view');
const list = document.querySelector('#task-list');
const taskForm = document.querySelector('#task-form');
const search = document.querySelector('#task-search');
const notice = document.querySelector('#task-notice');
const formNotice = document.querySelector('#form-notice');
const commentsPanel = document.querySelector('#comments-panel');
const commentsList = document.querySelector('#comments-list');
const commentForm = document.querySelector('#comment-form');
const commentNotice = document.querySelector('#comment-notice');
const titleError = document.querySelector('#title-error');
const priorityNames = { high: 'Wysoki', medium: 'Średni', low: 'Niski' };

let user;
try {
  user = JSON.parse(sessionStorage.getItem('zadaniowo-user') || 'null');
} catch {
  user = null;
}
if (!user || !Number.isInteger(user.id)) {
  window.location.replace('index.html');
}

let tasks = [];
let filter = 'all';
let editingId = null;
let nextNotice = '';

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });
  if (!response.ok) {
    let detail = '';
    try {
      const problem = await response.json();
      detail = problem.detail || problem.title || '';
    } catch { /* Non-JSON response. */ }
    throw new Error('HTTP ' + response.status + (detail ? ': ' + detail : ''));
  }
  return response.status === 204 ? null : response.json();
}

function showNotice(element, text) {
  element.textContent = text;
  element.hidden = !text;
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatDate(value) {
  if (!value) return '—';
  const [year, month, day] = value.split('-');
  return day + '.' + month + '.' + year;
}

async function loadTasks() {
  tasks = await api('/api/tasks?userId=' + encodeURIComponent(user.id));
  renderList();
}

function taskRow(task) {
  const row = element('article', 'task-row');
  const main = element('div', 'task-row__main');
  const checkbox = element('input', 'task-row__checkbox');
  checkbox.type = 'checkbox';
  checkbox.checked = task.status === 'done';
  checkbox.setAttribute('aria-label', 'Zakończ zadanie: ' + task.title);
  checkbox.addEventListener('change', async () => {
    checkbox.disabled = true;
    try {
      const updated = await api('/api/tasks/' + task.id + '/status', {
        method: 'PATCH',
        body: JSON.stringify({ status: checkbox.checked ? 'done' : 'todo' })
      });
      Object.assign(task, updated);
      renderList();
    } catch (error) {
      checkbox.checked = !checkbox.checked;
      showNotice(notice, 'Nie zapisano zmiany: ' + error.message);
      checkbox.disabled = false;
    }
  });
  const text = element('div', 'task-row__text');
  text.append(
    element('h2', 'task-row__title', task.title),
    element('p', 'task-row__description', task.description || 'Bez opisu')
  );
  main.append(checkbox, text);

  const priorityCell = element('div');
  const priority = priorityNames[task.priority] ? task.priority : 'medium';
  priorityCell.append(element('span', 'priority priority--' + priority, priorityNames[priority]));
  const date = element('span', 'task-row__date', formatDate(task.dueDate));

  const actions = element('div', 'task-row__actions');
  const edit = element('a', 'task-row__edit', 'Edytuj');
  edit.href = '#edit-' + task.id;
  const remove = element('button', 'task-row__delete', 'Usuń');
  remove.type = 'button';
  remove.setAttribute('aria-label', 'Usuń zadanie: ' + task.title);
  remove.addEventListener('click', async () => {
    if (!window.confirm('Usunąć zadanie „' + task.title + '” i jego komentarze?')) return;
    remove.disabled = true;
    try {
      await api('/api/tasks/' + task.id, { method: 'DELETE' });
      nextNotice = 'Zadanie usunięte.';
      await loadTasks();
    } catch (error) {
      showNotice(notice, 'Nie usunięto zadania: ' + error.message);
      remove.disabled = false;
    }
  });
  actions.append(edit, remove);
  row.append(main, priorityCell, date, actions);
  return row;
}

function renderList() {
  const done = tasks.filter((task) => task.status === 'done').length;
  const pending = tasks.length - done;
  document.querySelector('#all-count').textContent = '(' + tasks.length + ')';
  document.querySelector('#todo-count').textContent = '(' + pending + ')';
  document.querySelector('#done-count').textContent = '(' + done + ')';
  document.querySelectorAll('[data-filter]').forEach((button) => {
    const active = button.dataset.filter === filter;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  const query = search.value.trim().toLocaleLowerCase('pl');
  const visible = tasks.filter((task) => {
    const matchesFilter = filter === 'all'
      || (filter === 'todo' ? task.status !== 'done' : task.status === filter);
    return matchesFilter
      && (task.title + ' ' + (task.description || '')).toLocaleLowerCase('pl').includes(query);
  });
  list.replaceChildren(...visible.map(taskRow));
  const empty = document.querySelector('#empty-state');
  empty.hidden = visible.length !== 0;
  empty.textContent = tasks.length ? 'Nie znaleziono zadań.' : 'Nie masz jeszcze zadań. Dodaj pierwsze zadanie.';
  document.querySelector('#task-summary').textContent =
    pending === 1 ? '1 zadanie czeka na wykonanie' : pending + ' zadań czeka na wykonanie';
  if (nextNotice) {
    showNotice(notice, nextNotice);
    nextNotice = '';
  }
}

async function loadComments(id) {
  commentsList.replaceChildren();
  showNotice(commentNotice, '');
  try {
    const comments = await api('/api/tasks/' + id + '/comments');
    if (!comments.length) commentsList.append(element('p', '', 'Brak komentarzy.'));
    for (const comment of comments) {
      const item = element('p', 'comment-item');
      item.append(element('strong', '', comment.userLogin + ': '));
      item.append(document.createTextNode(comment.content));
      commentsList.append(item);
    }
  } catch (error) {
    showNotice(commentNotice, 'Nie pobrano komentarzy: ' + error.message);
  }
}

function renderView() {
  const hash = window.location.hash;
  const editMatch = /^#edit-(\d+)$/.exec(hash);
  const isForm = hash === '#new' || Boolean(editMatch);
  formNotice.hidden = true;
  titleError.hidden = true;
  commentsPanel.hidden = !editMatch;
  if (editMatch) {
    const task = tasks.find((item) => item.id === Number(editMatch[1]));
    if (!task) {
      window.location.hash = '#list';
      return;
    }
    editingId = task.id;
    document.querySelector('#form-title').textContent = 'Edytuj zadanie';
    taskForm.elements.title.value = task.title;
    taskForm.elements.description.value = task.description || '';
    taskForm.elements.dueDate.value = task.dueDate || '';
    taskForm.elements.priority.value = task.priority || 'medium';
    taskForm.elements.status.value = task.status;
    loadComments(task.id);
  } else if (hash === '#new') {
    editingId = null;
    taskForm.reset();
    document.querySelector('#form-title').textContent = 'Dodaj zadanie';
  } else {
    editingId = null;
    renderList();
  }
  listView.hidden = isForm;
  formView.hidden = !isForm;
  document.title = (isForm ? 'Formularz zadania' : 'Twoje zadania') + ' — Zadaniowo';
  window.scrollTo(0, 0);
}

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    filter = button.dataset.filter;
    renderList();
  });
});
search.addEventListener('input', renderList);

taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = taskForm.elements.title.value.trim();
  if (!title) {
    titleError.hidden = false;
    taskForm.elements.title.focus();
    return;
  }
  const payload = {
    title,
    description: taskForm.elements.description.value.trim(),
    dueDate: taskForm.elements.dueDate.value || null,
    priority: taskForm.elements.priority.value,
    status: taskForm.elements.status.value
  };
  if (!editingId) payload.userId = user.id;
  const button = taskForm.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    await api(editingId ? '/api/tasks/' + editingId : '/api/tasks', {
      method: editingId ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    });
    await loadTasks();
    nextNotice = 'Zadanie zapisane w bazie danych.';
    filter = 'all';
    search.value = '';
    window.location.hash = '#list';
  } catch (error) {
    showNotice(formNotice, 'Nie zapisano zadania: ' + error.message);
  } finally {
    button.disabled = false;
  }
});

commentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const content = commentForm.elements.content.value.trim();
  if (!editingId || !content) return;
  const button = commentForm.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    await api('/api/tasks/' + editingId + '/comments', {
      method: 'POST',
      body: JSON.stringify({ content, userId: user.id })
    });
    commentForm.reset();
    await loadComments(editingId);
  } catch (error) {
    showNotice(commentNotice, 'Nie dodano komentarza: ' + error.message);
  } finally {
    button.disabled = false;
  }
});

taskForm.elements.title.addEventListener('input', () => {
  if (taskForm.elements.title.value.trim()) titleError.hidden = true;
});
document.querySelector('#logout').addEventListener('click', () => {
  sessionStorage.removeItem('zadaniowo-user');
  window.location.href = 'index.html';
});
if (user) {
  document.querySelector('#welcome').textContent = 'Witaj, ' + user.login;
  window.addEventListener('hashchange', renderView);
  loadTasks().then(renderView).catch((error) => {
    showNotice(notice, 'Nie można pobrać zadań: ' + error.message);
    renderView();
  });
}
