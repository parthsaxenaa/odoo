// Sample data
const sampleQuestions = [
    {
        id: 1,
        title: "How to join 2 columns in a data set to make a separate column in SQL?",
        description: "I need to combine two columns from a database table into a single column. What's the best approach for this in SQL? I'm working with MySQL and need to concatenate first_name and last_name columns.",
        tags: ["sql", "database", "mysql"],
        author: "AS",
        authorName: "Alex Smith",
        votes: 15,
        answers: 3,
        views: 245,
        timestamp: "2 hours ago"
    },
    {
        id: 2,
        title: "Best practices for JWT authentication in React applications",
        description: "I'm implementing JWT authentication in my React app. What are the security best practices I should follow? Should I store the token in localStorage or cookies?",
        tags: ["react", "jwt", "authentication", "security"],
        author: "MJ",
        authorName: "Maria Johnson",
        votes: 28,
        answers: 7,
        views: 432,
        timestamp: "5 hours ago"
    },
    {
        id: 3,
        title: "How to optimize React performance with large datasets",
        description: "My React app is slow when rendering large lists of data. What are the best optimization techniques? I've heard about virtualization and memoization but need practical examples.",
        tags: ["react", "performance", "optimization"],
        author: "DK",
        authorName: "David Kim",
        votes: 42,
        answers: 12,
        views: 1205,
        timestamp: "1 day ago"
    },
    {
        id: 4,
        title: "Understanding async/await vs Promises in JavaScript",
        description: "Can someone explain the differences between async/await and Promises? When should I use each approach? I'm getting confused about error handling and when to use which syntax.",
        tags: ["javascript", "async", "promises", "es6"],
        author: "SL",
        authorName: "Sarah Lee",
        votes: 35,
        answers: 8,
        views: 567,
        timestamp: "3 hours ago"
    }
];

// Add answers array to each question
sampleQuestions.forEach(q => { q.answersList = []; });

// Voting state (localStorage for demo)
function getVoteState() {
    return JSON.parse(localStorage.getItem('stackitVotes') || '{}');
}
function setVoteState(state) {
    localStorage.setItem('stackitVotes', JSON.stringify(state));
}

function canVote(itemType, itemId) {
    if (!isLoggedIn()) return false;
    const user = getCurrentUser();
    const state = getVoteState();
    return !(state[`${itemType}_${itemId}_${user.email}`]);
}
function recordVote(itemType, itemId, value) {
    const user = getCurrentUser();
    const state = getVoteState();
    state[`${itemType}_${itemId}_${user.email}`] = value;
    setVoteState(state);
}

// Persistence helpers
function saveQuestions() {
    localStorage.setItem('stackitQuestions', JSON.stringify(sampleQuestions));
}
function loadQuestions() {
    const data = localStorage.getItem('stackitQuestions');
    if (data) {
        const arr = JSON.parse(data);
        // Ensure answersList exists for each question
        arr.forEach(q => { if (!q.answersList) q.answersList = []; });
        return arr;
    }
    return null;
}

// On page load, load from localStorage or use sample data
let loadedQuestions = loadQuestions();
if (loadedQuestions) {
    sampleQuestions.length = 0;
    loadedQuestions.forEach(q => sampleQuestions.push(q));
}

// Save after any change
function addQuestion(q) {
    sampleQuestions.unshift(q);
    saveQuestions();
}
function addAnswer(q, a) {
    q.answersList.push(a);
    saveQuestions();
}
function updateQuestion(q) {
    saveQuestions();
}
function updateAnswer(q, a) {
    saveQuestions();
}

// DOM elements
const questionsGrid = document.getElementById('questionsGrid');
const searchInput = document.getElementById('searchInput');
const authModal = document.getElementById('authModal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const askQuestionForm = document.getElementById('askQuestionForm');

// Page sections
const homePage = document.getElementById('homePage');
const askQuestionPage = document.getElementById('askQuestionPage');
const questionDetailPage = document.getElementById('questionDetailPage');

// Display questions
function displayQuestions(questions) {
    questionsGrid.innerHTML = '';
    
    questions.forEach(question => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question-card';
        questionElement.onclick = () => showQuestionDetail(question);
        questionElement.innerHTML = `
            <div class="question-stats">
                <div class="stat">
                    <span class="number">${question.votes}</span>
                    <span class="label">votes</span>
                </div>
                <div class="stat">
                    <span class="number">${question.answers}</span>
                    <span class="label">answers</span>
                </div>
                <div class="stat">
                    <span class="number">${question.views}</span>
                    <span class="label">views</span>
                </div>
            </div>
            <div class="question-content">
                <h3 class="question-title">${question.title}</h3>
                <p class="question-description">${question.description}</p>
                <div class="question-meta">
                    <div class="tags">
                        ${question.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="author-info">
                        <span class="author-avatar">${question.author}</span>
                        <span class="author-name">${question.authorName}</span>
                        <span class="timestamp">${question.timestamp}</span>
                    </div>
                </div>
            </div>
        `;
        questionsGrid.appendChild(questionElement);
    });
}

// Search functionality
function filterQuestions() {
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredQuestions = sampleQuestions.filter(question => {
        return question.title.toLowerCase().includes(searchTerm) ||
               question.description.toLowerCase().includes(searchTerm) ||
               question.tags.some(tag => tag.toLowerCase().includes(searchTerm));
    });
    
    displayQuestions(filteredQuestions);
}

// Navigation functions
function showHomePage() {
    homePage.classList.remove('hidden');
    askQuestionPage.classList.add('hidden');
    questionDetailPage.classList.add('hidden');
    displayQuestions(sampleQuestions);
}

function showAskQuestion() {
    homePage.classList.add('hidden');
    askQuestionPage.classList.remove('hidden');
    questionDetailPage.classList.add('hidden');
}

function showQuestionDetail(question, editAnswerId = null) {
    homePage.classList.add('hidden');
    askQuestionPage.classList.add('hidden');
    questionDetailPage.classList.remove('hidden');
    
    const questionDetailContent = document.getElementById('questionDetailContent');
    // Answers HTML
    let answersHTML = '';
    if (question.answersList.length === 0) {
        answersHTML = '<p class="no-answers">No answers yet. Be the first to answer!</p>';
    } else {
        answersHTML = question.answersList.map(answer => {
            if (editAnswerId === answer.id) {
                // Edit mode for this answer
                return `<form id="editAnswerForm">
                    <div id="editAnswerEditor" style="height: 100px;"></div>
                    <button type="submit" class="btn btn-primary" style="margin-top:1rem;">Save Changes</button>
                </form>`;
            }
            let editBtn = '';
            if (isLoggedIn() && getCurrentUser().email === answer.authorEmail) {
                editBtn = `<button class="btn btn-outline" onclick="showEditAnswerForm(sampleQuestions.find(q=>q.id===${question.id}), sampleQuestions.find(q=>q.id===${question.id}).answersList.find(a=>a.id===${answer.id}))">Edit</button>`;
            }
            return `<div class="answer-card">
                <div class="answer-header">
                    <span class="author-avatar">${answer.author}</span>
                    <span class="author-name">${answer.authorName}</span>
                    <span class="timestamp">${answer.timestamp}</span>
                    ${editBtn}
                </div>
                <div class="answer-content">${answer.content}</div>
                <div class="answer-votes">
                    <button class="vote-btn" onclick="voteAnswer(${question.id}, ${answer.id}, 'up')">&#8679;</button>
                    <span class="vote-count">${answer.votes}</span>
                    <button class="vote-btn" onclick="voteAnswer(${question.id}, ${answer.id}, 'down')">&#8681;</button>
                </div>
            </div>`;
        }).join('');
    }
    // Answer form (only for logged-in users)
    let answerFormHTML = '';
    if (isLoggedIn()) {
        answerFormHTML = `<form id="answerForm">
            <div id="answerEditor" style="height: 100px;"></div>
            <button type="submit" class="btn btn-primary" style="margin-top:1rem;">Post Answer</button>
        </form>`;
    } else {
        answerFormHTML = `<div class="no-answers">Sign in to post an answer.</div>`;
    }
    // Edit button for question
    let editQuestionBtn = '';
    if (isLoggedIn() && getCurrentUser().email === question.authorEmail) {
        editQuestionBtn = `<button class="btn btn-outline" onclick="showEditQuestionForm(sampleQuestions.find(q=>q.id===${question.id}))">Edit</button>`;
    }
    questionDetailContent.innerHTML = `
        <div class="question-detail-header">
            <button class="btn btn-secondary" onclick="showHomePage()">
                <i class="fas fa-arrow-left"></i>
                Back to Questions
            </button>
            ${editQuestionBtn}
        </div>
        <div class="question-detail">
            <div class="question-main">
                <h1 class="question-title">${question.title}</h1>
                <div class="question-meta">
                    <span class="timestamp">Asked ${question.timestamp}</span>
                    <span class="views">${question.views} views</span>
                </div>
                <div class="question-body">
                    <div>${question.description}</div>
                </div>
                <div class="question-tags">
                    ${question.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="question-author">
                    <span class="author-avatar">${question.author}</span>
                    <div class="author-info">
                        <span class="author-name">${question.authorName}</span>
                        <span class="author-reputation">1,234 reputation</span>
                    </div>
                </div>
            </div>
            <div class="question-actions">
                <button class="btn btn-outline" onclick="voteQuestion(${question.id}, 'up')">
                    <i class="fas fa-thumbs-up"></i>
                    Vote Up
                </button>
                <span style="margin:0 1rem; font-weight:bold;">${question.votes}</span>
                <button class="btn btn-outline" onclick="voteQuestion(${question.id}, 'down')">
                    <i class="fas fa-thumbs-down"></i>
                    Vote Down
                </button>
            </div>
        </div>
        <div class="answers-section">
            <h2>${question.answersList.length} Answer${question.answersList.length !== 1 ? 's' : ''}</h2>
            <div class="answers-list">${answersHTML}</div>
            <div class="answer-form">${answerFormHTML}</div>
        </div>
    `;
    // Initialize Quill for answer form
    if (isLoggedIn() && document.getElementById('answerEditor')) {
        const answerQuill = new Quill('#answerEditor', {
            theme: 'snow',
            placeholder: 'Write your answer...',
            modules: { toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean']
            ] }
        });
        document.getElementById('answerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const content = answerQuill.root.innerHTML;
            if (!content || content === '<p><br></p>') {
                alert('Answer cannot be empty.');
                return;
            }
            addAnswer(question, {
                id: Date.now(),
                content,
                author: currentUser.name ? currentUser.name[0].toUpperCase() : 'U',
                authorName: currentUser.name || currentUser.email,
                authorEmail: currentUser.email,
                votes: 0,
                timestamp: 'just now'
            });
            showQuestionDetail(question);
        });
    }
    // Initialize Quill for answer edit form
    if (isLoggedIn() && editAnswerId && document.getElementById('editAnswerEditor')) {
        const answer = question.answersList.find(a => a.id === editAnswerId);
        const editQuill = new Quill('#editAnswerEditor', {
            theme: 'snow',
            placeholder: 'Edit your answer...',
            modules: { toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean']
            ] }
        });
        editQuill.root.innerHTML = answer.content;
        document.getElementById('editAnswerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const content = editQuill.root.innerHTML;
            if (!content || content === '<p><br></p>') {
                alert('Answer cannot be empty.');
                return;
            }
            answer.content = content;
            updateAnswer(question, answer);
            showQuestionDetail(question);
        });
    }
}

// Modal functions
function showAuthModal() {
    authModal.classList.add('show');
}

function closeAuthModal() {
    authModal.classList.remove('show');
}

function showSignupForm() {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
}

function showLoginForm() {
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
}

// Notification functions
function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.classList.toggle('show');
}

let quill;
let currentUser = null;

function isLoggedIn() {
    return !!localStorage.getItem('stackitUser');
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('stackitUser'));
}

function setCurrentUser(user) {
    localStorage.setItem('stackitUser', JSON.stringify(user));
    currentUser = user;
}

function logoutUser() {
    localStorage.removeItem('stackitUser');
    currentUser = null;
    updateAuthUI();
    showHomePage();
}

function updateAuthUI() {
    const userAvatar = document.getElementById('userAvatar');
    const navbarUsername = document.getElementById('navbarUsername');
    const logoutBtn = document.getElementById('logoutBtn');
    if (isLoggedIn()) {
        const user = getCurrentUser();
        navbarUsername.textContent = user.name || user.email;
        logoutBtn.classList.remove('hidden');
    } else {
        navbarUsername.textContent = '';
        logoutBtn.classList.add('hidden');
    }
}

// Form handlers
function handleLogin(event) {
    event.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;
    // For demo, any email/password is accepted
    setCurrentUser({ email, name: email.split('@')[0] });
    updateAuthUI();
    closeAuthModal();
}

function handleSignup(event) {
    event.preventDefault();
    const name = signupForm.querySelector('input[placeholder="Enter your full name"]').value;
    const email = signupForm.querySelector('input[type="email"]').value;
    const password = signupForm.querySelector('input[type="password"]').value;
    setCurrentUser({ email, name });
    updateAuthUI();
    closeAuthModal();
}

// Question actions
function voteQuestion(questionId, voteType) {
    if (!isLoggedIn()) {
        showAuthModal();
        return;
    }
    if (!canVote('q', questionId)) {
        alert('You have already voted on this question.');
        return;
    }
    const q = sampleQuestions.find(q => q.id === questionId);
    if (q) {
        q.votes += (voteType === 'up' ? 1 : -1);
        recordVote('q', questionId, voteType);
        showQuestionDetail(q);
    }
}

function voteAnswer(questionId, answerId, voteType) {
    if (!isLoggedIn()) {
        showAuthModal();
        return;
    }
    if (!canVote('a', answerId)) {
        alert('You have already voted on this answer.');
        return;
    }
    const q = sampleQuestions.find(q => q.id === questionId);
    if (q) {
        const a = q.answersList.find(a => a.id === answerId);
        if (a) {
            a.votes += (voteType === 'up' ? 1 : -1);
            recordVote('a', answerId, voteType);
            showQuestionDetail(q);
        }
    }
}

function showAnswerForm() {
    if (!isLoggedIn()) {
        showAuthModal();
        return;
    }
    console.log('Show answer form');
    // Add answer form logic here
    alert('Answer form coming soon!');
}

// Edit logic
let editingQuestionId = null;
let editingAnswerId = null;

function showEditQuestionForm(question) {
    editingQuestionId = question.id;
    askQuestionPage.classList.remove('hidden');
    homePage.classList.add('hidden');
    questionDetailPage.classList.add('hidden');
    document.getElementById('questionTitle').value = question.title;
    document.getElementById('questionTags').value = question.tags.join(', ');
    if (quill) quill.root.innerHTML = question.description;
    // Change submit button to 'Save Changes'
    const btn = askQuestionForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
}

function showEditAnswerForm(question, answer) {
    editingAnswerId = answer.id;
    showQuestionDetail(question, answer.id);
}

// Event listeners
searchInput.addEventListener('input', filterQuestions);

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === authModal) {
        closeAuthModal();
    }
});

// Close notification dropdown when clicking outside
window.addEventListener('click', (event) => {
    const dropdown = document.getElementById('notificationDropdown');
    if (!event.target.closest('.notification-container')) {
        dropdown.classList.remove('show');
    }
});

// Handle ask question form submission
if (askQuestionForm) {
    askQuestionForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!isLoggedIn()) {
            showAuthModal();
            return;
        }
        const title = document.getElementById('questionTitle').value;
        const tags = document.getElementById('questionTags').value;
        const description = quill ? quill.root.innerHTML : '';
        document.getElementById('questionDescription').value = description;
        if (editingQuestionId) {
            // Edit mode
            const q = sampleQuestions.find(q => q.id === editingQuestionId);
            if (q) {
                q.title = title;
                q.tags = tags.split(',').map(t => t.trim());
                q.description = description;
                updateQuestion(q);
            }
            editingQuestionId = null;
            // Restore button
            const btn = askQuestionForm.querySelector('button[type="submit"]');
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Post Question';
        } else {
            // Add new question
            addQuestion({
                id: sampleQuestions.length + 1,
                title,
                description,
                tags: tags.split(',').map(t => t.trim()),
                author: currentUser.name ? currentUser.name[0].toUpperCase() : 'U',
                authorName: currentUser.name || currentUser.email,
                authorEmail: currentUser.email,
                votes: 0,
                answersList: [],
                views: 0,
                timestamp: 'just now'
            });
        }
        askQuestionForm.reset();
        if (quill) quill.setContents([]);
        showHomePage();
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Quill
    if (document.getElementById('questionDescriptionEditor')) {
        quill = new Quill('#questionDescriptionEditor', {
            theme: 'snow',
            placeholder: 'Provide more details about your question...',
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image'],
                    ['clean']
                ]
            }
        });
    }
    // Restore user
    if (isLoggedIn()) {
        currentUser = getCurrentUser();
    }
    updateAuthUI();
    showHomePage();
});