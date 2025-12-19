// ========================================
// VIBE CODING - API-INTEGRATED LEARNING PLATFORM
// ========================================

const API_BASE = '/api';

class LearningPlatform {
    constructor() {
        this.chapters = [];
        this.currentChapter = null;
        this.currentLesson = null;
        this.progress = this.loadProgress();
        this.achievements = this.getAchievements();
        this.init();
    }

    async init() {
        this.showLoading();
        try {
            await this.loadChapters();
            this.updateProgress();
            this.showWelcomeScreen();
            this.createParticles();
        } catch (error) {
            console.error('Init failed:', error);
        } finally {
            this.hideLoading();
        }
    }

    // ========================================
    // PROGRESS MANAGEMENT
    // ========================================

    loadProgress() {
        const saved = localStorage.getItem('vibe_learning_progress');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            completedLessons: [],
            completedChapters: [],
            currentChapterId: null,
            currentLessonId: null,
            achievements: []
        };
    }

    saveProgress() {
        localStorage.setItem('vibe_learning_progress', JSON.stringify(this.progress));
    }

    // ========================================
    // ACHIEVEMENT SYSTEM
    // ========================================

    getAchievements() {
        return {
            'chapter-00': {
                badge: '🏅',
                title: '踏上征程',
                message: '恭喜你开启AI开发之旅！',
                quote: '千里之行，始于足下。 —— 老子'
            },
            'chapter-01': {
                badge: '🧠',
                title: '思维觉醒者',
                message: '你已经理解了AI时代的编程新范式！',
                quote: '真正的觉醒，不是学会编写代码，而是学会指挥AI。'
            },
            'chapter-02': {
                badge: '💎',
                title: '思维大师',
                message: '你已经建立了完整的产品思维和用户思维！',
                quote: '设计不只是外观和感觉，设计是如何工作的。 —— Steve Jobs'
            },
            'chapter-03': {
                badge: '🎯',
                title: 'AI调教师',
                message: '你已经掌握了提示词工程的核心技术！',
                quote: '语言是思想的工具，好的提示词是AI的钥匙。'
            },
            'chapter-04': {
                badge: '🚀',
                title: '独立开发者',
                message: '恭喜你完成了第一个完整的AI应用！',
                quote: '行动是成功的阶梯，行动越多，登得越高。'
            },
            'chapter-05': {
                badge: '⭐',
                title: '全栈工程师',
                message: '你已经具备了从构想到部署的完整能力！',
                quote: '优秀和卓越之间的差别在于细节。'
            },
            'chapter-99': {
                badge: '📖',
                title: '知识库管理员',
                message: '你已经建立了自己的知识体系！',
                quote: '知识就是力量。 —— Francis Bacon'
            },
            'chapter-101': {
                badge: '🌟',
                title: 'Vibe Master',
                message: '恭喜你完成了所有课程！',
                quote: '学习之路永无止境，继续前进吧！'
            }
        };
    }

    // ========================================
    // API CALLS
    // ========================================

    async loadChapters() {
        try {
            console.log('Loading chapters from:', `${API_BASE}/chapters`);
            const response = await fetch(`${API_BASE}/chapters`);
            const result = await response.json();
            console.log('Chapters response:', result);

            if (result.success) {
                this.chapters = result.data;
                console.log('Loaded', this.chapters.length, 'chapters');

                // Load lessons for each chapter
                for (let chapter of this.chapters) {
                    try {
                        const chapterResponse = await fetch(`${API_BASE}/chapters/${chapter.id}`);
                        const chapterResult = await chapterResponse.json();

                        if (chapterResult.success) {
                            chapter.lessons = chapterResult.data.lessons || [];
                            console.log(`Chapter ${chapter.id}: ${chapter.lessons.length} lessons`);
                        } else {
                            chapter.lessons = [];
                            console.warn(`Failed to load lessons for ${chapter.id}`);
                        }
                    } catch (err) {
                        chapter.lessons = [];
                        console.error(`Error loading lessons for ${chapter.id}:`, err);
                    }
                }

                console.log('Rendering chapter list...');
                this.renderChapterList();
                this.updateWelcomeStats();
            } else {
                throw new Error(result.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Failed to load chapters:', error);
            alert('加载章节失败: ' + error.message + '\n\n请检查:\n1. 服务器是否在运行\n2. 打开浏览器控制台查看详细错误');
        }
    }

    async markLessonComplete(lessonId, completed) {
        try {
            const response = await fetch(`${API_BASE}/lessons/${lessonId}/complete`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed })
            });

            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('Failed to mark lesson complete:', error);
            return false;
        }
    }

    // ========================================
    // RENDERING
    // ========================================

    renderChapterList() {
        const chapterList = document.getElementById('chapterList');
        chapterList.innerHTML = '';

        this.chapters.forEach((chapter, index) => {
            const isCompleted = this.progress.completedChapters.includes(chapter.id);
            const isLocked = index > 0 && !this.progress.completedChapters.includes(this.chapters[index - 1].id);
            const isActive = this.progress.currentChapterId === chapter.id;

            const chapterEl = document.createElement('div');
            chapterEl.className = `chapter-item ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''} ${isActive ? 'active' : ''}`;

            const lessonCount = chapter.lessons ? chapter.lessons.length : 0;
            const completedCount = chapter.lessons ? chapter.lessons.filter(l => this.progress.completedLessons.includes(l.id)).length : 0;

            chapterEl.innerHTML = `
                <div class="chapter-header">
                    <div class="chapter-icon" style="background: ${chapter.color}20;">
                        ${chapter.icon || '📖'}
                    </div>
                    <div class="chapter-info">
                        <div class="chapter-title">${chapter.title}</div>
                        <div class="chapter-meta">
                            <span class="chapter-status">
                                ${isCompleted ? '✅ 已完成' : isLocked ? '🔒 未解锁' : '📖 进行中'}
                            </span>
                            <span>${lessonCount} 篇文章</span>
                            ${completedCount > 0 ? `<span>${completedCount}/${lessonCount} 已完成</span>` : ''}
                        </div>
                    </div>
                </div>
            `;

            if (!isLocked) {
                chapterEl.addEventListener('click', () => this.loadChapter(chapter));
            }

            chapterList.appendChild(chapterEl);
        });
    }

    showWelcomeScreen() {
        document.getElementById('welcomeScreen').style.display = 'block';
        document.getElementById('chapterContent').style.display = 'none';
    }

    loadChapter(chapter) {
        this.currentChapter = chapter;
        this.progress.currentChapterId = chapter.id;
        this.saveProgress();

        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('chapterContent').style.display = 'block';

        this.renderChapter(chapter);
        this.renderChapterList();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderChapter(chapter) {
        const content = document.getElementById('lessonContent');

        // Calculate total word count and time
        const totalWords = chapter.lessons.reduce((sum, lesson) => sum + (lesson.word_count || 0), 0);
        const totalTime = chapter.lessons.reduce((sum, lesson) => sum + (lesson.estimated_time || 5), 0);

        content.innerHTML = `
            <div class="lesson-header">
                <div class="breadcrumb">
                    <span onclick="app.showWelcomeScreen()" style="cursor:pointer">🏠 首页</span>
                    <span>›</span>
                    <span>${chapter.title}</span>
                </div>
                <div class="lesson-title-section">
                    <h1>${chapter.icon || '📖'} ${chapter.title}</h1>
                    <p class="lesson-description">${chapter.subtitle || ''}</p>
                </div>
            </div>

            <div class="lesson-body">
                <div style="background: rgba(0, 217, 255, 0.1); padding: 1.5rem; border-radius: 1rem; border-left: 4px solid var(--cyber-blue); margin-bottom: 2rem;">
                    <h3 style="color: var(--cyber-blue); margin: 0 0 0.5rem 0;">📚 本章学习内容</h3>
                    <p style="color: var(--text-secondary); margin: 0;">
                        共 <strong>${chapter.lessons.length} 篇文章</strong> ·
                        约 <strong>${totalWords}</strong> 字 ·
                        预计学习时间 <strong>${totalTime} 分钟</strong>
                    </p>
                </div>

                ${this.renderLessonList(chapter)}

                <div style="background: rgba(0, 255, 157, 0.1); padding: 1.5rem; border-radius: 1rem; border-left: 4px solid var(--cyber-green); margin-top: 2rem;">
                    <h4 style="color: var(--cyber-green); margin-bottom: 0.5rem;">💡 学习建议</h4>
                    <ul style="color: var(--text-secondary); margin-left: 1.5rem;">
                        <li>边学边做，不要只是阅读</li>
                        <li>完成每篇文章后再继续下一篇</li>
                        <li>遇到问题先思考，再查阅资料</li>
                        <li>记录学习笔记和心得</li>
                    </ul>
                </div>
            </div>

            <div class="lesson-footer">
                <button class="cyber-btn cyber-btn-secondary" onclick="app.showWelcomeScreen()">
                    ← 返回首页
                </button>
                <button class="cyber-btn" onclick="app.completeChapter('${chapter.id}')">
                    完成本章 ✓
                </button>
            </div>
        `;
    }

    renderLessonList(chapter) {
        if (!chapter.lessons || chapter.lessons.length === 0) {
            return '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">本章暂无文章</p>';
        }

        const lessonItems = chapter.lessons.map(lesson => {
            const isCompleted = this.progress.completedLessons.includes(lesson.id);

            return `
                <div class="lesson-item ${isCompleted ? 'completed' : ''}" onclick="app.loadLesson('${lesson.id}')">
                    <div>
                        <div class="lesson-title">${lesson.lesson_number}. ${lesson.title}</div>
                        <div class="lesson-meta">
                            <span>${lesson.word_count || 0} 字</span>
                            <span>约 ${lesson.estimated_time || 5} 分钟</span>
                        </div>
                    </div>
                    <div class="lesson-status">
                        ${isCompleted ? '✅' : '📄'}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div style="margin: 2rem 0;">
                <h2 style="color: var(--cyber-blue); margin-bottom: 1.5rem;">📝 文章列表</h2>
                <div class="lesson-list">
                    ${lessonItems}
                </div>
            </div>
        `;
    }

    async loadLesson(lessonId) {
        this.showLoading();

        try {
            const response = await fetch(`${API_BASE}/lessons/${lessonId}`);
            const result = await response.json();

            if (result.success) {
                const lesson = result.data;
                this.currentLesson = lesson;
                this.progress.currentLessonId = lesson.id;
                this.saveProgress();

                this.renderLesson(lesson);
            }
        } catch (error) {
            console.error('Failed to load lesson:', error);
            this.showError('加载文章失败');
        } finally {
            this.hideLoading();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderLesson(lesson) {
        const content = document.getElementById('lessonContent');

        const isCompleted = this.progress.completedLessons.includes(lesson.id);

        content.innerHTML = `
            <div class="lesson-header">
                <div class="breadcrumb">
                    <span onclick="app.showWelcomeScreen()" style="cursor:pointer">🏠 首页</span>
                    <span>›</span>
                    <span onclick="app.loadChapter(app.currentChapter)" style="cursor:pointer">${this.currentChapter.title}</span>
                    <span>›</span>
                    <span>${lesson.title}</span>
                </div>
                <div class="lesson-title-section">
                    <h1>${lesson.title}</h1>
                    <p class="lesson-description">
                        ${lesson.word_count || 0} 字 · 约 ${lesson.estimated_time || 5} 分钟阅读
                    </p>
                </div>
            </div>

            <div class="lesson-body">
                ${this.formatContent(lesson.content)}
            </div>

            <div class="lesson-footer">
                <button class="cyber-btn cyber-btn-secondary" onclick="app.loadChapter(app.currentChapter)">
                    ← 返回章节
                </button>
                <button class="cyber-btn ${isCompleted ? 'cyber-btn-secondary' : ''}" onclick="app.toggleLessonComplete('${lesson.id}')">
                    ${isCompleted ? '✓ 已完成' : '标记为已完成'}
                </button>
            </div>
        `;
    }

    formatContent(content) {
        if (!content) return '';

        // 检查是否包含Markdown标题语法
        const hasMarkdownHeadings = /^#{1,6}\s+/m.test(content) || /\n#{1,6}\s+/m.test(content);

        // 检查是否是富文本HTML（包含块级元素如h1-h6, div, table等，而不仅仅是p标签）
        const hasRichHTML = /<(h[1-6]|div|table|pre|blockquote|ul|ol)\b[^>]*>/i.test(content);

        // 如果有Markdown标题或者没有富HTML标签，则作为Markdown处理
        if (hasMarkdownHeadings || !hasRichHTML) {
            // 先清理可能包裹的p标签
            let cleanContent = content
                .replace(/^<p>/i, '')
                .replace(/<\/p>$/i, '')
                .replace(/<p>/gi, '\n\n')
                .replace(/<\/p>/gi, '');

            // 使用marked解析Markdown
            if (typeof marked !== 'undefined') {
                marked.setOptions({
                    breaks: true,
                    gfm: true,
                    headerIds: false,
                    mangle: false
                });

                const renderer = new marked.Renderer();

                renderer.heading = function(text, level) {
                    return `<h${level}>${text}</h${level}>`;
                };

                renderer.code = function(code, language) {
                    return `<pre><code class="language-${language || 'plaintext'}">${code}</code></pre>`;
                };

                renderer.table = function(header, body) {
                    return `<table>
                        <thead>${header}</thead>
                        <tbody>${body}</tbody>
                    </table>`;
                };

                renderer.paragraph = function(text) {
                    return `<p>${text}</p>`;
                };

                marked.setOptions({ renderer });

                try {
                    return marked.parse(cleanContent);
                } catch (error) {
                    console.error('Markdown parsing error:', error);
                    return cleanContent.replace(/\n/g, '<br>');
                }
            }
        }

        // 如果是富文本HTML（从TinyMCE编辑器来的），直接返回
        return content;
    }

    async toggleLessonComplete(lessonId) {
        const isCompleted = this.progress.completedLessons.includes(lessonId);
        const newState = !isCompleted;

        // Update backend
        const success = await this.markLessonComplete(lessonId, newState);

        if (success) {
            // Update local progress
            if (newState) {
                if (!this.progress.completedLessons.includes(lessonId)) {
                    this.progress.completedLessons.push(lessonId);
                }
            } else {
                this.progress.completedLessons = this.progress.completedLessons.filter(id => id !== lessonId);
            }

            this.saveProgress();
            this.updateProgress();

            // Re-render current view
            if (this.currentLesson) {
                this.renderLesson(this.currentLesson);
            }
        }
    }

    completeChapter(chapterId) {
        if (!this.progress.completedChapters.includes(chapterId)) {
            this.progress.completedChapters.push(chapterId);
            this.saveProgress();
            this.updateProgress();
            this.renderChapterList();

            const chapter = this.chapters.find(c => c.id === chapterId);
            if (chapter) {
                this.showAchievement(chapterId);
            }
        } else {
            // Already completed
            this.showWelcomeScreen();
        }
    }

    showAchievement(chapterId) {
        const achievement = this.achievements[chapterId];

        if (!achievement) {
            this.showWelcomeScreen();
            return;
        }

        document.getElementById('achievementBadge').textContent = achievement.badge;
        document.getElementById('achievementTitle').textContent = achievement.title;
        document.getElementById('achievementMessage').textContent = achievement.message;
        document.getElementById('achievementQuote').textContent = achievement.quote;

        document.getElementById('achievementModal').classList.add('show');

        if (!this.progress.achievements.includes(chapterId)) {
            this.progress.achievements.push(chapterId);
            this.saveProgress();
        }
    }

    updateProgress() {
        const totalChapters = this.chapters.length;
        const completedCount = this.progress.completedChapters.length;
        const percentage = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;

        document.getElementById('totalProgress').textContent = `${percentage}%`;
        document.getElementById('totalProgressBar').style.width = `${percentage}%`;
        document.getElementById('achievementCount').textContent = this.progress.achievements.length;

        const totalLessons = this.chapters.reduce((sum, ch) => sum + (ch.lessons ? ch.lessons.length : 0), 0);
        const completedLessons = this.progress.completedLessons.length;
        document.getElementById('completedLessons').textContent = `${completedLessons}/${totalLessons}`;
    }

    updateWelcomeStats() {
        const totalLessons = this.chapters.reduce((sum, ch) => sum + (ch.lessons ? ch.lessons.length : 0), 0);
        document.getElementById('welcomeTotalLessons').textContent = totalLessons;
    }

    // ========================================
    // PARTICLES EFFECT
    // ========================================

    createParticles() {
        const container = document.getElementById('particles');
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 3 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = ['#00d9ff', '#b600ff', '#ff006b', '#00ff9d'][Math.floor(Math.random() * 4)];
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.opacity = Math.random() * 0.5;
            particle.style.filter = 'blur(1px)';
            particle.style.animation = `float ${Math.random() * 10 + 10}s infinite ease-in-out`;

            container.appendChild(particle);
        }

        // Add float animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% {
                    transform: translate(0, 0) scale(1);
                }
                25% {
                    transform: translate(20px, -30px) scale(1.1);
                }
                50% {
                    transform: translate(-20px, -60px) scale(0.9);
                }
                75% {
                    transform: translate(30px, -30px) scale(1.05);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ========================================
    // LOADING & ERROR HANDLING
    // ========================================

    showLoading() {
        document.getElementById('loadingOverlay').classList.add('show');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('show');
    }

    showError(message) {
        alert(message);
    }
}

// ========================================
// GLOBAL FUNCTIONS
// ========================================

function startLearning() {
    if (app.chapters.length > 0) {
        const firstChapter = app.chapters[0];
        app.loadChapter(firstChapter);
    }
}

function closeAchievement() {
    document.getElementById('achievementModal').classList.remove('show');
}

function continueNextChapter() {
    closeAchievement();

    const currentIndex = app.chapters.findIndex(c => c.id === app.currentChapter.id);
    if (currentIndex < app.chapters.length - 1) {
        const nextChapter = app.chapters[currentIndex + 1];
        app.loadChapter(nextChapter);
    } else {
        app.showWelcomeScreen();
        setTimeout(() => {
            alert('🎉 恭喜你完成了所有章节的学习！你已经是一个真正的Vibe Coding开发者了！');
        }, 300);
    }
}

// ========================================
// SETTINGS FUNCTIONS
// ========================================

function openSettings() {
    document.getElementById('settingsModal').classList.add('show');
    // Load current font size
    const currentSize = localStorage.getItem('vibe_font_size') || 'medium';
    setFontSize(currentSize, false); // Don't save, just apply UI
}

function closeSettings() {
    document.getElementById('settingsModal').classList.remove('show');
}

function setFontSize(size, save = true) {
    // Apply font size via data attribute (CSS will handle the actual sizing)
    document.body.setAttribute('data-font-size', size);

    // Update button states
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.size === size) {
            btn.classList.add('active');
        }
    });

    // Save to localStorage
    if (save) {
        localStorage.setItem('vibe_font_size', size);
    }
}

function resetSettings() {
    setFontSize('medium');
}

// Load font size on page load
function loadFontSize() {
    const savedSize = localStorage.getItem('vibe_font_size') || 'medium';
    setFontSize(savedSize, false);
}

// ========================================
// INITIALIZE
// ========================================

let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new LearningPlatform();
    loadFontSize(); // Load saved font size
});
