import { useState, useEffect } from 'react';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'https://aurumchain-tracker-server.vercel.app';

function App() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('all');
  const [epicOpen, setEpicOpen] = useState({});
  const [storyOpen, setStoryOpen] = useState({});

  const fetchData = () => {
    fetch(`${SERVER_URL}/api/data`)
      .then(res => res.json())
      .then(initialData => {
        setData(initialData);
        if (initialData.length > 0 && Object.keys(epicOpen).length === 0) {
          const initialEpicOpen = {};
          initialData.forEach(ep => { initialEpicOpen[ep.id] = true; });
          setEpicOpen(initialEpicOpen);
        }
      })
      .catch(err => console.error("Error fetching data:", err));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const toggleTask = async (taskId) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/tasks/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
      });
      const result = await res.json();
      if (result.success) {
        setData(prev => prev.map(e => e.id === result.epic.id ? result.epic : e));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const setStoryStatus = async (storyId, status) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/stories/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId, status })
      });
      const result = await res.json();
      if (result.success) {
        setData(prev => prev.map(e => e.id === result.epic.id ? result.epic : e));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async (storyId, text) => {
    if (!text.trim()) return;
    try {
      const res = await fetch(`${SERVER_URL}/api/tasks/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId, text })
      });
      const result = await res.json();
      if (result.success) {
        setData(prev => prev.map(e => e.id === result.epic.id ? result.epic : e));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const res = await fetch(`${SERVER_URL}/api/tasks/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId })
        });
        const result = await res.json();
        if (result.success) {
          setData(prev => prev.map(e => e.id === result.epic.id ? result.epic : e));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const toggleEpic = (id) => {
    setEpicOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleStory = (id) => {
    setStoryOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totals = () => {
    let total = 0, done = 0, wip = 0, storiesDone = 0, storiesTotal = 0;
    data.forEach(ep => ep.stories.forEach(st => {
      total += st.tasks.length;
      done += st.tasks.filter(t => t.completed).length;
      if (st.status === 'wip') wip++;
      if (st.status === 'done') storiesDone++;
      storiesTotal++;
    }));
    return { total, done, wip, storiesDone, storiesTotal };
  };

  const { total, done, wip, storiesDone, storiesTotal } = totals();
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  const isStoryVisible = (st) => {
    if (filter === 'all') return true;
    return st.status === filter;
  };

  const [newTaskText, setNewTaskText] = useState('');
  const [selectedStoryId, setSelectedStoryId] = useState('');

  // Set default story ID for Quick Add once data is loaded
  useEffect(() => {
    if (data.length > 0 && !selectedStoryId) {
      setSelectedStoryId(data[0].stories[0].id);
    }
  }, [data, selectedStoryId]);

  return (
    <div className="page">
      <header className="header">
        <div className="header-eyebrow">AurumChain · Phase 2 · Milestone 2</div>
        <h1 className="header-title">Blockchain <em>Deliverables</em></h1>
        <div className="header-sub">Generated 2026-04-12 · Solana / Anchor / Next.js / SPL</div>
      </header>

      {/* Quick Add Section */}
      <div className="quick-add" style={{ marginBottom: '24px', padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r2)' }}>
        <h3 style={{ fontSize: '12px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'DM Mono' }}>Quick Add Task</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={selectedStoryId}
            onChange={(e) => setSelectedStoryId(e.target.value)}
            style={{ padding: '8px', borderRadius: 'var(--r)', border: '1px solid var(--border)', background: 'var(--surface2)', fontSize: '13px', outline: 'none' }}
          >
            {data.flatMap(ep => ep.stories).map(st => (
              <option key={st.id} value={st.id}>{st.title}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="New task description..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (addTask(selectedStoryId, newTaskText), setNewTaskText(''))}
            style={{ flex: 1, padding: '8px 12px', borderRadius: 'var(--r)', border: '1px solid var(--border)', fontSize: '13px', outline: 'none' }}
          />
          <button
            onClick={() => { addTask(selectedStoryId, newTaskText); setNewTaskText(''); }}
            style={{ padding: '8px 16px', background: 'var(--gold)', color: '#fff', border: 'none', borderRadius: 'var(--r)', cursor: 'pointer', fontWeight: '500' }}
          >
            Add Task
          </button>
        </div>
      </div>

      <div className="stats">
        <div className="stat"><div className="stat-num gold">{pct}%</div><div className="stat-lbl">Complete</div></div>
        <div className="stat"><div className="stat-num">{done}<span style={{ fontSize: '15px', color: 'var(--text3)' }}>/{total}</span></div><div className="stat-lbl">Subtasks</div></div>
        <div className="stat"><div className="stat-num">{storiesDone}<span style={{ fontSize: '15px', color: 'var(--text3)' }}>/{storiesTotal}</span></div><div className="stat-lbl">Stories done</div></div>
        <div className="stat"><div className="stat-num">{wip}</div><div className="stat-lbl">In progress</div></div>
      </div>

      <div className="main-progress">
        <div className="progress-labels">
          <span className="progress-label-left">Overall subtask completion</span>
          <span className="progress-pct">{pct}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }}></div>
        </div>
      </div>

      <div className="filter-row">
        {['all', 'todo', 'wip', 'done'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'todo' ? 'To do' : f === 'wip' ? 'In progress' : 'Done'}
          </button>
        ))}
      </div>

      <div className="epics">
        {data.map(ep => {
          const allT = ep.stories.flatMap(s => s.tasks);
          const doneT = allT.filter(t => t.completed).length;
          const epPct = allT.length === 0 ? 0 : Math.round((doneT / allT.length) * 100);
          const isOpen = epicOpen[ep.id] !== false;
          const visibleStories = ep.stories.filter(isStoryVisible);

          if (filter !== 'all' && visibleStories.length === 0) return null;

          return (
            <div className="epic" key={ep.id}>
              <div className="epic-header" onClick={() => toggleEpic(ep.id)}>
                <span className={`epic-arrow ${isOpen ? 'open' : ''}`}>&#9654;</span>
                <span className={`epic-pill ${ep.pillClass}`}>{ep.pill}</span>
                <span className="epic-title">{ep.title}</span>
                <span className="epic-counter">{doneT}/{allT.length}</span>
              </div>
              <div className="epic-mini-bar-wrap">
                <div className={`epic-mini-bar-fill ${ep.barClass}`} style={{ width: `${epPct}%` }}></div>
              </div>
              <div className={`stories ${isOpen ? 'open' : ''}`}>
                {ep.stories.map(st => {
                  if (!isStoryVisible(st)) return null;
                  const stDone = st.tasks.filter(t => t.completed).length;
                  const isStOpen = !!storyOpen[st.id];

                  return (
                    <div className="story" key={st.id}>
                      <div className="story-row" onClick={() => toggleStory(st.id)}>
                        <span className={`story-dot dot-${st.status}`}></span>
                        <span className="story-id">{st.id}</span>
                        <span className="story-name">{st.title}</span>
                        <select
                          className="story-status-sel"
                          value={st.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setStoryStatus(st.id, e.target.value)}
                        >
                          <option value="todo">todo</option>
                          <option value="wip">in progress</option>
                          <option value="done">done</option>
                        </select>
                        <span className="story-progress">{stDone}/{st.tasks.length}</span>
                        <button
                          className={`story-toggle-btn ${isStOpen ? 'open' : ''}`}
                          onClick={(e) => { e.stopPropagation(); toggleStory(st.id); }}
                        >
                          {isStOpen ? '−' : '+'}
                        </button>
                      </div>
                      <div className={`subtasks ${isStOpen ? 'open' : ''}`}>
                        {st.tasks.map(t => (
                          <div className="subtask" key={t.id} style={{ display: 'flex', alignItems: 'center' }}>
                            <div className={`cb ${t.completed ? 'done' : ''}`} onClick={() => toggleTask(t.id)}></div>
                            <span className={`subtask-text ${t.completed ? 'done' : ''}`}>{t.text}</span>
                            <span className="subtask-id" style={{ marginRight: '10px' }}>{t.id}</span>
                            <button
                              onClick={() => deleteTask(t.id)}
                              style={{ border: 'none', background: 'none', color: 'var(--pink)', cursor: 'pointer', fontSize: '18px', padding: '0 4px', lineHeight: '1' }}
                              title="Delete task"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="deferred-banner">
        <span className="deferred-label">Deferred → M3</span>
        <span className="deferred-text">AC-BC-EPIC-05 — Allocation &amp; Distribution on-chain program (create_distribution, execute_distribution, DistributionEpochAccount, burn_or_adjust)</span>
      </div>
    </div>
  );
}

export default App;
