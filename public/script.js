function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

const app = {
  user: null,
  userToken: null,
  currentDay: null,
  currentTab: 'topics',
  quizState: null,
  adminToken: null,
  adminEmail: null,

  init() {
    if (window.location.pathname === '/admin') {
      const savedToken = sessionStorage.getItem('cth_adminToken');
      if (savedToken) {
        this.adminToken = savedToken;
        this.adminEmail = sessionStorage.getItem('cth_adminEmail');
        this.verifyAdminSession();
      } else {
        this.renderAdminLogin();
      }
      return;
    }
    const savedId = localStorage.getItem('cth_userId');
    const savedToken = localStorage.getItem('cth_userToken');
    if (savedId && savedToken) {
      this.userToken = savedToken;
      this.loadUser(savedId);
    } else {
      localStorage.removeItem('cth_userId');
      localStorage.removeItem('cth_userToken');
      this.renderRegister();
    }
    window.addEventListener('popstate', () => this.handleRoute());
  },

  handleRoute() {
    const path = window.location.pathname;
    if (path === '/admin') {
      if (this.adminToken) {
        this.verifyAdminSession();
      } else {
        this.renderAdminLogin();
      }
    } else if (this.user) {
      this.renderDashboard();
    } else {
      this.renderRegister();
    }
  },

  async loadUser(id) {
    try {
      const res = await fetch(`/api/user/${id}`);
      if (res.ok) {
        this.user = await res.json();
        document.getElementById('headerNav').style.display = 'flex';
        document.getElementById('userBadge').textContent = this.user.name;
        if (window.location.pathname === '/admin') {
          this.renderAdmin();
        } else {
          this.renderDashboard();
        }
      } else {
        localStorage.removeItem('cth_userId');
        this.renderRegister();
      }
    } catch {
      this.renderRegister();
    }
  },

  renderRegister() {
    document.getElementById('headerNav').style.display = 'none';
    document.getElementById('app').innerHTML = `
      <div class="register-container">
        <div class="card">
          <h2>Welcome</h2>
          <p class="subtitle">Register to begin your 5-day Claude Support Training</p>
          <form id="registerForm" onsubmit="app.register(event)">
            <div class="form-group">
              <label for="regName">Full Name</label>
              <input type="text" id="regName" placeholder="Enter your full name" required>
            </div>
            <div class="form-group">
              <label for="regEmail">Email Address</label>
              <input type="email" id="regEmail" placeholder="Enter your email" required>
              <div class="form-error" id="regError"></div>
            </div>
            <button type="submit" class="btn btn-primary btn-block btn-lg">Start Training</button>
          </form>
        </div>
      </div>
    `;
  },

  async register(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    if (!name || !email) return;

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      if (res.ok) {
        const data = await res.json();
        this.userToken = data.sessionToken;
        localStorage.setItem('cth_userToken', data.sessionToken);
        const { sessionToken, ...user } = data;
        this.user = user;
        localStorage.setItem('cth_userId', this.user.id);
        document.getElementById('headerNav').style.display = 'flex';
        document.getElementById('userBadge').textContent = this.user.name;
        this.renderDashboard();
      } else {
        const err = await res.json();
        document.getElementById('regError').textContent = err.error;
        document.getElementById('regError').style.display = 'block';
      }
    } catch {
      document.getElementById('regError').textContent = 'Connection error. Please try again.';
      document.getElementById('regError').style.display = 'block';
    }
  },

  logout() {
    localStorage.removeItem('cth_userId');
    localStorage.removeItem('cth_userToken');
    this.user = null;
    this.userToken = null;
    this.currentDay = null;
    document.getElementById('headerNav').style.display = 'none';
    this.renderRegister();
  },

  renderDashboard() {
    this.currentDay = null;
    const p = this.user.progress;
    const dayMeta = [
      { day: 1, title: 'Foundations: Claude Chat & Projects', totalTopics: 15 },
      { day: 2, title: 'Skills & Connectors', totalTopics: 13 },
      { day: 3, title: 'Claude Code (Basics to Advanced)', totalTopics: 15 },
      { day: 4, title: 'MCP Servers & Claude Cowork', totalTopics: 16 },
      { day: 5, title: 'Plugins, Troubleshooting & Final Assessment', totalTopics: 12 }
    ];

    const overallTopics = dayMeta.reduce((sum, d) => sum + p[d.day].topicsRead.length, 0);
    const totalTopics = dayMeta.reduce((sum, d) => sum + d.totalTopics, 0);
    const overallPct = Math.round((overallTopics / totalTopics) * 100);

    let cards = dayMeta.map(d => {
      const prog = p[d.day];
      const topicPct = Math.round((prog.topicsRead.length / d.totalTopics) * 100);
      const scoreClass = prog.bestScore === null ? 'none' :
        prog.bestScore >= 80 ? 'high' : prog.bestScore >= 60 ? 'mid' : 'low';
      const scoreText = prog.bestScore === null ? 'Not taken' : `${prog.bestScore}%`;

      return `
        <div class="day-card" onclick="app.openDay(${d.day})">
          <div class="day-card-banner">
            <div>
              <div class="day-num">Day ${d.day}</div>
              <div class="day-title">${d.title}</div>
            </div>
            <span class="score-badge ${scoreClass}">${scoreText}</span>
          </div>
          <div class="day-card-body">
            <div class="progress-bar-container">
              <div class="progress-label">
                <span>Topics: ${prog.topicsRead.length}/${d.totalTopics}</span>
                <span>${topicPct}%</span>
              </div>
              <div class="progress-bar"><div class="progress-fill" style="width:${topicPct}%"></div></div>
            </div>
            <div style="margin-top:8px;font-size:12px;color:var(--gray-500);">
              Quiz attempts: ${prog.quizAttempts.length}
            </div>
          </div>
        </div>
      `;
    }).join('');

    document.getElementById('app').innerHTML = `
      <div class="dashboard-greeting">
        <h2>Welcome, ${escapeHtml(this.user.name)}</h2>
        <p>Track your progress across the 5-day Claude Support Training program.</p>
      </div>
      <div class="card" style="margin-bottom:28px;">
        <div class="progress-label">
          <span style="font-weight:700;">Overall Progress</span>
          <span>${overallTopics}/${totalTopics} topics (${overallPct}%)</span>
        </div>
        <div class="progress-bar" style="height:12px;">
          <div class="progress-fill" style="width:${overallPct}%"></div>
        </div>
      </div>
      <div class="day-grid">${cards}</div>
    `;
  },

  async openDay(day) {
    this.currentDay = day;
    this.currentTab = 'topics';
    try {
      const res = await fetch(`/api/content/${day}`);
      this.dayContent = await res.json();
      this.renderDayView();
    } catch {
      document.getElementById('app').innerHTML = '<p>Error loading content.</p>';
    }
  },

  renderDayView() {
    const d = this.dayContent;
    const p = this.user.progress[d.day];

    const objectiveChips = d.objectives.map(o =>
      `<span class="objective-chip">${o}</span>`
    ).join('');

    const tabs = ['topics', 'labs', 'troubleshooting', 'quiz'];
    const tabHtml = tabs.map(t =>
      `<button class="tab ${this.currentTab === t ? 'active' : ''}" onclick="app.switchTab('${t}')">${t.charAt(0).toUpperCase() + t.slice(1)}</button>`
    ).join('');

    let content = '';
    if (this.currentTab === 'topics') content = this.renderTopics(d, p);
    else if (this.currentTab === 'labs') content = this.renderLabs(d);
    else if (this.currentTab === 'troubleshooting') content = this.renderTroubleshooting(d);
    else if (this.currentTab === 'quiz') content = this.renderQuiz(d.day, p);

    document.getElementById('app').innerHTML = `
      <a class="back-link" onclick="app.renderDashboard()">&#8592; Back to Dashboard</a>
      <div class="day-header">
        <div class="day-label">Day ${d.day}</div>
        <h2>${d.title}</h2>
        <div class="objectives-row">${objectiveChips}</div>
      </div>
      <div class="tabs">${tabHtml}</div>
      <div id="tabContent">${content}</div>
    `;
  },

  switchTab(tab) {
    this.currentTab = tab;
    const d = this.dayContent;
    const p = this.user.progress[d.day];

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => {
      if (t.textContent.toLowerCase() === tab) t.classList.add('active');
    });

    let content = '';
    if (tab === 'topics') content = this.renderTopics(d, p);
    else if (tab === 'labs') content = this.renderLabs(d);
    else if (tab === 'troubleshooting') content = this.renderTroubleshooting(d);
    else if (tab === 'quiz') content = this.renderQuiz(d.day, p);
    document.getElementById('tabContent').innerHTML = content;
  },

  renderTopics(d, p) {
    return d.blocks.map(block => {
      const topics = block.topics.map(t => {
        const isDone = p.topicsRead.includes(t.id);
        return `
          <div class="topic-item">
            <div class="topic-header" onclick="app.toggleTopic(this)">
              <span class="topic-title">
                <span class="check-icon ${isDone ? 'done' : ''}">${isDone ? '&#10003;' : ''}</span>
                ${t.title}
              </span>
              <span class="expand-icon">&#9660;</span>
            </div>
            <div class="topic-body">
              <p>${t.content}</p>
              ${!isDone ? `<button class="btn btn-primary btn-sm mark-read-btn" onclick="app.markTopicRead('${t.id}', ${d.day}, this)">Mark as Read</button>` : '<span style="font-size:12px;color:var(--green-dark);font-weight:600;">Completed</span>'}
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="block-section">
          <h3 class="block-title">Block ${block.id}: ${block.title}</h3>
          ${topics}
        </div>
      `;
    }).join('');
  },

  toggleTopic(el) {
    const wasOpen = el.classList.contains('open');
    el.classList.toggle('open');
    el.nextElementSibling.classList.toggle('open');
  },

  async markTopicRead(topicId, day, btnEl) {
    try {
      const res = await fetch(`/api/progress/${this.user.id}/topic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.userToken}` },
        body: JSON.stringify({ day, topicId })
      });
      if (res.ok) {
        this.user.progress[day] = await res.json();
        const topicItem = btnEl.closest('.topic-item');
        const checkIcon = topicItem.querySelector('.check-icon');
        checkIcon.classList.add('done');
        checkIcon.innerHTML = '&#10003;';
        btnEl.outerHTML = '<span style="font-size:12px;color:var(--green-dark);font-weight:600;">Completed</span>';
      }
    } catch { /* silent */ }
  },

  renderLabs(d) {
    return d.labs.map(lab => `
      <div class="lab-card">
        <h4>${lab.title}</h4>
        <p>${lab.description}</p>
      </div>
    `).join('');
  },

  renderTroubleshooting(d) {
    const rows = d.troubleshooting.map(t => `
      <tr>
        <td class="symptom">${t.symptom}</td>
        <td>${t.fix}</td>
      </tr>
    `).join('');
    return `
      <div class="card" style="padding:0;overflow:hidden;">
        <table class="ts-table">
          <thead><tr><th>Symptom</th><th>Resolution</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  },

  renderQuiz(day, p) {
    if (this.quizState && this.quizState.day === day && this.quizState.submitted) {
      return this.renderQuizResults();
    }
    if (this.quizState && this.quizState.day === day && this.quizState.questions) {
      return this.renderQuizQuestions();
    }

    const attempts = p.quizAttempts;
    const hasAttempts = attempts.length > 0;
    let history = '';
    if (hasAttempts) {
      const rows = attempts.map((a, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${a.correct}/${a.total}</td>
          <td><span class="score-badge ${a.score >= 80 ? 'high' : a.score >= 60 ? 'mid' : 'low'}">${a.score}%</span></td>
          <td>${new Date(a.timestamp).toLocaleString()}</td>
        </tr>
      `).join('');
      history = `
        <div class="card" style="margin-top:20px;">
          <div class="card-header"><h3>Attempt History</h3></div>
          <table class="admin-table">
            <thead><tr><th>#</th><th>Score</th><th>Percentage</th><th>Date</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    }

    return `
      <div class="card" style="text-align:center;padding:40px;">
        <h3 style="margin-bottom:8px;">Day ${day} Knowledge Check</h3>
        <p style="color:var(--gray-700);margin-bottom:24px;">15 multiple-choice questions. Unlimited attempts. Your best score is tracked.</p>
        ${p.bestScore !== null ? `<p style="margin-bottom:20px;">Best score: <span class="score-badge ${p.bestScore >= 80 ? 'high' : p.bestScore >= 60 ? 'mid' : 'low'}">${p.bestScore}%</span></p>` : ''}
        <button class="btn btn-primary btn-lg" onclick="app.startQuiz(${day})">
          ${hasAttempts ? 'Retake Quiz' : 'Start Quiz'}
        </button>
      </div>
      ${history}
    `;
  },

  async startQuiz(day) {
    try {
      const res = await fetch(`/api/quiz/${day}`);
      const data = await res.json();
      this.quizState = {
        day,
        questions: data.questions,
        answers: new Array(data.questions.length).fill(null),
        currentQ: 0,
        submitted: false,
        results: null
      };
      document.getElementById('tabContent').innerHTML = this.renderQuizQuestions();
    } catch {
      document.getElementById('tabContent').innerHTML = '<p>Error loading quiz.</p>';
    }
  },

  renderQuizQuestions() {
    const qs = this.quizState;
    const q = qs.questions[qs.currentQ];
    const answered = qs.answers.filter(a => a !== null).length;
    const pct = Math.round((answered / qs.questions.length) * 100);

    const options = q.options.map((opt, i) =>
      `<button class="quiz-option ${qs.answers[qs.currentQ] === i ? 'selected' : ''}" onclick="app.selectAnswer(${i})">${opt}</button>`
    ).join('');

    const prevDisabled = qs.currentQ === 0 ? 'disabled' : '';
    const isLast = qs.currentQ === qs.questions.length - 1;
    const allAnswered = qs.answers.every(a => a !== null);

    return `
      <div class="quiz-container">
        <div class="quiz-progress">
          <span class="qp-text">${answered}/${qs.questions.length} answered</span>
          <div class="qp-bar progress-bar" style="height:6px;"><div class="progress-fill" style="width:${pct}%"></div></div>
        </div>
        <div class="quiz-question-card">
          <div class="q-number">Question ${qs.currentQ + 1} of ${qs.questions.length}</div>
          <div class="q-text">${q.question}</div>
          ${options}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
          <button class="btn btn-secondary" ${prevDisabled} onclick="app.quizNav(-1)">&#8592; Previous</button>
          <div style="display:flex;gap:4px;">
            ${qs.questions.map((_, i) => `<button style="width:28px;height:28px;border-radius:50%;border:1px solid ${qs.answers[i] !== null ? 'var(--green)' : 'var(--gray-300)'};background:${i === qs.currentQ ? 'var(--black)' : qs.answers[i] !== null ? 'var(--green-light)' : 'var(--white)'};color:${i === qs.currentQ ? 'var(--white)' : 'var(--dark)'};font-size:11px;cursor:pointer;font-weight:600;" onclick="app.quizJump(${i})">${i + 1}</button>`).join('')}
          </div>
          ${isLast && allAnswered ?
            `<button class="btn btn-primary" onclick="app.submitQuiz()">Submit Quiz</button>` :
            `<button class="btn btn-secondary" ${isLast ? 'disabled' : ''} onclick="app.quizNav(1)">Next &#8594;</button>`
          }
        </div>
      </div>
    `;
  },

  selectAnswer(idx) {
    this.quizState.answers[this.quizState.currentQ] = idx;
    document.getElementById('tabContent').innerHTML = this.renderQuizQuestions();
  },

  quizNav(dir) {
    this.quizState.currentQ += dir;
    document.getElementById('tabContent').innerHTML = this.renderQuizQuestions();
  },

  quizJump(idx) {
    this.quizState.currentQ = idx;
    document.getElementById('tabContent').innerHTML = this.renderQuizQuestions();
  },

  async submitQuiz() {
    const qs = this.quizState;
    try {
      const res = await fetch(`/api/quiz/${qs.day}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.userToken}` },
        body: JSON.stringify({ userId: this.user.id, answers: qs.answers })
      });
      const data = await res.json();
      qs.submitted = true;
      qs.results = data;
      this.user.progress[qs.day].quizAttempts.push(data.attempt);
      this.user.progress[qs.day].bestScore = Math.max(
        this.user.progress[qs.day].bestScore || 0,
        data.score
      );
      document.getElementById('tabContent').innerHTML = this.renderQuizResults();
    } catch {
      alert('Error submitting quiz. Please try again.');
    }
  },

  renderQuizResults() {
    const qs = this.quizState;
    const r = qs.results;
    const scoreClass = r.score >= 80 ? 'high' : r.score >= 60 ? 'mid' : 'low';
    const message = r.score >= 80 ? 'Excellent work!' : r.score >= 60 ? 'Good effort. Review the topics and try again.' : 'Keep studying. Review the topics and retake the quiz.';

    const review = r.results.map((res, i) => {
      const q = qs.questions[i];
      const opts = q.options.map((opt, oi) => {
        let cls = '';
        if (oi === res.correctAnswer) cls = 'correct';
        else if (oi === res.selected && !res.isCorrect) cls = 'incorrect';
        return `<div class="quiz-option ${cls}" disabled>${opt}</div>`;
      }).join('');
      return `
        <div class="quiz-question-card" style="border-left:4px solid ${res.isCorrect ? 'var(--green)' : 'var(--red)'};">
          <div class="q-number">Question ${i + 1} — ${res.isCorrect ? 'Correct' : 'Incorrect'}</div>
          <div class="q-text">${q.question}</div>
          ${opts}
        </div>
      `;
    }).join('');

    return `
      <div class="quiz-results">
        <div class="score-circle ${scoreClass}">
          <span class="big">${r.score}%</span>
          <span class="label">${r.correct}/${r.total}</span>
        </div>
        <h3>${message}</h3>
        <p>You answered ${r.correct} out of ${r.total} questions correctly.</p>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="app.retakeQuiz()">Retake Quiz</button>
          <button class="btn btn-secondary" onclick="app.switchTab('topics')">Review Topics</button>
          <button class="btn btn-secondary" onclick="app.renderDashboard()">Dashboard</button>
        </div>
      </div>
      <div style="max-width:800px;margin:32px auto 0;">
        <h3 style="margin-bottom:16px;">Review Your Answers</h3>
        ${review}
      </div>
    `;
  },

  retakeQuiz() {
    this.quizState = null;
    this.switchTab('quiz');
  },

  // --- Admin Authentication ---

  renderAdminLogin() {
    document.getElementById('headerNav').style.display = 'none';
    document.getElementById('app').innerHTML = `
      <div class="register-container">
        <div class="card">
          <div style="text-align:center;margin-bottom:8px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;background:var(--black);color:var(--green);font-size:24px;font-weight:800;border-radius:6px;">D</span>
          </div>
          <h2 style="text-align:center;">Admin Login</h2>
          <p class="subtitle">Enter your admin email to receive a one-time password</p>
          <form id="adminEmailForm" onsubmit="app.requestOTP(event)">
            <div class="form-group">
              <label for="adminEmail">Admin Email</label>
              <input type="email" id="adminEmail" placeholder="Enter admin email" required>
              <div class="form-error" id="adminError"></div>
            </div>
            <button type="submit" class="btn btn-primary btn-block btn-lg" id="adminSubmitBtn">Send OTP</button>
          </form>
        </div>
      </div>
    `;
  },

  async requestOTP(e) {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value.trim();
    if (!email) return;

    const btn = document.getElementById('adminSubmitBtn');
    const errEl = document.getElementById('adminError');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    errEl.style.display = 'none';

    try {
      const res = await fetch('/api/admin/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        errEl.textContent = data.error;
        errEl.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Send OTP';
        return;
      }
      this.adminEmail = email.trim().toLowerCase();
      this.renderOTPInput();
    } catch {
      errEl.textContent = 'Connection error. Please try again.';
      errEl.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Send OTP';
    }
  },

  renderOTPInput() {
    document.getElementById('app').innerHTML = `
      <div class="register-container">
        <div class="card">
          <div style="text-align:center;margin-bottom:8px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;background:var(--black);color:var(--green);font-size:24px;font-weight:800;border-radius:6px;">D</span>
          </div>
          <h2 style="text-align:center;">Verify OTP</h2>
          <p class="subtitle">Enter the 6-digit code sent to <strong>${this.adminEmail}</strong></p>
          <form id="otpForm" onsubmit="app.verifyOTP(event)">
            <div class="form-group">
              <label for="otpInput">One-Time Password</label>
              <input type="text" id="otpInput" placeholder="Enter 6-digit code" maxlength="6" pattern="[0-9]{6}" required
                style="text-align:center;font-size:24px;letter-spacing:8px;font-weight:700;">
              <div class="form-error" id="otpError"></div>
            </div>
            <button type="submit" class="btn btn-primary btn-block btn-lg" id="otpSubmitBtn">Verify & Login</button>
          </form>
          <div style="text-align:center;margin-top:16px;">
            <button class="btn btn-sm" style="background:none;color:var(--gray-500);text-decoration:underline;border:none;" onclick="app.requestResendOTP()">Resend OTP</button>
            <span style="color:var(--gray-300);margin:0 8px;">|</span>
            <button class="btn btn-sm" style="background:none;color:var(--gray-500);text-decoration:underline;border:none;" onclick="app.renderAdminLogin()">Change email</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('otpInput').focus();
  },

  async verifyOTP(e) {
    e.preventDefault();
    const otp = document.getElementById('otpInput').value.trim();
    if (!otp) return;

    const btn = document.getElementById('otpSubmitBtn');
    const errEl = document.getElementById('otpError');
    btn.disabled = true;
    btn.textContent = 'Verifying...';
    errEl.style.display = 'none';

    try {
      const res = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.adminEmail, otp })
      });
      const data = await res.json();
      if (!res.ok) {
        errEl.textContent = data.error;
        errEl.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Verify & Login';
        return;
      }
      this.adminToken = data.token;
      this.adminEmail = data.email;
      sessionStorage.setItem('cth_adminToken', data.token);
      sessionStorage.setItem('cth_adminEmail', data.email);
      this.renderAdmin();
    } catch {
      errEl.textContent = 'Connection error. Please try again.';
      errEl.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Verify & Login';
    }
  },

  async requestResendOTP() {
    try {
      await fetch('/api/admin/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.adminEmail })
      });
      const errEl = document.getElementById('otpError');
      errEl.textContent = 'New OTP sent. Check your email or server console.';
      errEl.style.display = 'block';
      errEl.style.color = 'var(--green-dark)';
    } catch { /* silent */ }
  },

  async verifyAdminSession() {
    try {
      const res = await fetch('/api/admin/session', {
        headers: { 'Authorization': `Bearer ${this.adminToken}` }
      });
      if (res.ok) {
        this.renderAdmin();
      } else {
        this.adminLogout();
      }
    } catch {
      this.adminLogout();
    }
  },

  adminLogout() {
    if (this.adminToken) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.adminToken}` }
      }).catch(() => {});
    }
    this.adminToken = null;
    this.adminEmail = null;
    sessionStorage.removeItem('cth_adminToken');
    sessionStorage.removeItem('cth_adminEmail');
    this.renderAdminLogin();
  },

  async renderAdmin() {
    document.getElementById('headerNav').style.display = 'flex';
    document.getElementById('userBadge').textContent = this.adminEmail || 'Admin';
    document.getElementById('headerNav').innerHTML = `
      <span class="user-badge" style="color:var(--green);">${this.adminEmail || 'Admin'}</span>
      <button class="btn btn-outline btn-sm" onclick="app.adminLogout()">Logout</button>
    `;

    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${this.adminToken}` }
      });
      if (res.status === 401) {
        this.adminLogout();
        return;
      }
      const users = await res.json();

      const totalLearners = users.length;
      const avgBestScore = users.length > 0
        ? Math.round(users.reduce((sum, u) => {
            const scores = u.days.filter(d => d.bestScore !== null).map(d => d.bestScore);
            return sum + (scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0);
          }, 0) / users.length)
        : 0;
      const totalAttempts = users.reduce((sum, u) => sum + u.days.reduce((s, d) => s + d.attempts, 0), 0);

      const rows = users.map(u => {
        const dayCells = u.days.map(d => {
          if (d.bestScore === null) return '<td><span class="score-badge none">--</span></td>';
          const cls = d.bestScore >= 80 ? 'high' : d.bestScore >= 60 ? 'mid' : 'low';
          return `<td><span class="score-badge ${cls}">${d.bestScore}% (${d.attempts})</span></td>`;
        }).join('');
        return `
          <tr>
            <td class="learner-name">${escapeHtml(u.name)}</td>
            <td>${escapeHtml(u.email)}</td>
            ${dayCells}
          </tr>
        `;
      }).join('');

      document.getElementById('app').innerHTML = `
        <div class="admin-header">
          <h2>Trainer Dashboard</h2>
          <button class="btn btn-secondary btn-sm" onclick="app.renderAdmin()">Refresh</button>
        </div>
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-value">${totalLearners}</div>
            <div class="stat-label">Learners</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${avgBestScore}%</div>
            <div class="stat-label">Avg Best Score</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${totalAttempts}</div>
            <div class="stat-label">Total Quiz Attempts</div>
          </div>
        </div>
        <div class="card" style="padding:0;overflow-x:auto;">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Day 1</th>
                <th>Day 2</th>
                <th>Day 3</th>
                <th>Day 4</th>
                <th>Day 5</th>
              </tr>
            </thead>
            <tbody>
              ${rows || '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--gray-500);">No learners registered yet.</td></tr>'}
            </tbody>
          </table>
        </div>
        <p style="margin-top:16px;font-size:12px;color:var(--gray-500);">Scores shown as: Best Score % (number of attempts)</p>
      `;
    } catch {
      document.getElementById('app').innerHTML = '<p>Error loading admin data.</p>';
    }
  }
};

document.addEventListener('DOMContentLoaded', () => app.init());
