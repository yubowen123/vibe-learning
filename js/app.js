// 学习平台核心应用
class LearningPlatform {
    constructor() {
        this.currentChapter = null;
        this.currentLesson = null;
        this.progress = this.loadProgress();
        this.init();
    }

    init() {
        this.renderChapterList();
        this.updateProgress();
        this.showWelcomeScreen();
    }

    // 加载进度
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

    // 保存进度
    saveProgress() {
        localStorage.setItem('vibe_learning_progress', JSON.stringify(this.progress));
    }

    // 渲染章节列表
    renderChapterList() {
        const chapterList = document.getElementById('chapterList');
        chapterList.innerHTML = '';

        learningData.chapters.forEach((chapter, index) => {
            const isCompleted = this.progress.completedChapters.includes(chapter.id);
            const isLocked = index > 0 && !this.progress.completedChapters.includes(learningData.chapters[index - 1].id);
            const isActive = this.progress.currentChapterId === chapter.id;

            const chapterEl = document.createElement('div');
            chapterEl.className = `chapter-item ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''} ${isActive ? 'active' : ''}`;

            chapterEl.innerHTML = `
                <div class="chapter-header">
                    <div class="chapter-icon" style="background: ${chapter.color}20;">
                        ${chapter.icon}
                    </div>
                    <div class="chapter-info">
                        <div class="chapter-title">${chapter.title}</div>
                        <div class="chapter-meta">
                            <span class="chapter-status">
                                ${isCompleted ? '✅ 已完成' : isLocked ? '🔒 未解锁' : '📖 进行中'}
                            </span>
                            <span>${chapter.estimatedTime}</span>
                            <span>${chapter.difficulty}</span>
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

    // 显示欢迎屏幕
    showWelcomeScreen() {
        document.getElementById('welcomeScreen').style.display = 'block';
        document.getElementById('lessonContent').style.display = 'none';
    }

    // 加载章节
    loadChapter(chapter) {
        this.currentChapter = chapter;
        this.progress.currentChapterId = chapter.id;
        this.saveProgress();

        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('lessonContent').style.display = 'block';

        this.renderLesson(chapter);
        this.renderChapterList();
    }

    // 渲染课程
    renderLesson(chapter) {
        const content = document.getElementById('lessonContent');

        content.innerHTML = `
            <div class="lesson-header">
                <div class="lesson-nav">
                    <div class="breadcrumb">
                        <span onclick="app.showWelcomeScreen()" style="cursor:pointer">🏠 首页</span>
                        <span>›</span>
                        <span>${chapter.title}</span>
                    </div>
                </div>
                <div class="lesson-title-section">
                    <h1>${chapter.icon} ${chapter.title}</h1>
                    <p class="lesson-description">${chapter.description}</p>
                </div>
            </div>

            <div class="lesson-body">
                <div class="chapter-intro">
                    <h2>📚 本章学习内容</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
                        预计学习时间：<strong>${chapter.estimatedTime}</strong> |
                        难度等级：<strong>${chapter.difficulty}</strong>
                    </p>

                    <div class="key-points">
                        <h3>💡 核心要点</h3>
                        <ul>
                            ${chapter.keyPoints ? chapter.keyPoints.map(point => `<li>${point}</li>`).join('') : ''}
                        </ul>
                    </div>

                    ${this.renderActionSteps(chapter)}
                </div>

                <div class="chapter-content">
                    <h2>📖 详细内容</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                        这个章节包含了深入的理论知识和实践指导，建议您完整阅读并跟随操作。
                    </p>

                    <div class="content-tips" style="background: #eff6ff; padding: 1.5rem; border-radius: 0.75rem; border-left: 4px solid var(--primary); margin-bottom: 2rem;">
                        <h4 style="color: var(--primary); margin-bottom: 0.5rem;">💡 学习建议</h4>
                        <ul style="color: var(--text-secondary); margin-left: 1.5rem;">
                            <li>边学边做，不要只是阅读</li>
                            <li>完成每个操作步骤后再继续</li>
                            <li>遇到问题先思考，再查阅资料</li>
                            <li>记录学习笔记和心得</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="lesson-footer">
                <button class="btn btn-secondary" onclick="app.showWelcomeScreen()">
                    ← 返回首页
                </button>
                <button class="btn btn-primary" onclick="app.completeChapter('${chapter.id}')">
                    完成本章 ✓
                </button>
            </div>
        `;
    }

    // 渲染操作步骤
    renderActionSteps(chapter) {
        if (!chapter.lessons || chapter.lessons.length === 0) {
            return '';
        }

        const firstLesson = chapter.lessons[0];
        if (!firstLesson.actionSteps) {
            return '';
        }

        return `
            <div class="action-steps">
                <h3>🎯 实践步骤</h3>
                <p style="color: #92400e; margin-bottom: 1rem;">
                    请按照以下步骤完成本章的学习任务：
                </p>
                ${firstLesson.actionSteps.map((step, index) => `
                    <div class="step-item">
                        <div class="step-number">${index + 1}</div>
                        <div class="step-content">
                            <h4>${step.title}</h4>
                            <p>${step.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // 完成章节
    completeChapter(chapterId) {
        if (!this.progress.completedChapters.includes(chapterId)) {
            this.progress.completedChapters.push(chapterId);
            this.saveProgress();
            this.updateProgress();
            this.renderChapterList();

            // 显示成就卡片
            const chapter = learningData.chapters.find(c => c.id === chapterId);
            if (chapter) {
                this.showAchievement(chapter);
            }
        }
    }

    // 显示成就卡片
    showAchievement(chapter) {
        const modal = document.getElementById('achievementModal');
        const achievement = chapter.achievement;

        document.getElementById('achievementBadge').textContent = achievement.badge;
        document.getElementById('achievementTitle').textContent = achievement.title;
        document.getElementById('achievementMessage').textContent = achievement.message;
        document.getElementById('achievementQuote').textContent = achievement.quote;

        modal.classList.add('show');

        // 保存成就
        if (!this.progress.achievements.includes(chapter.id)) {
            this.progress.achievements.push(chapter.id);
            this.saveProgress();
        }
    }

    // 更新进度
    updateProgress() {
        const totalChapters = learningData.chapters.length;
        const completedCount = this.progress.completedChapters.length;
        const percentage = Math.round((completedCount / totalChapters) * 100);

        document.getElementById('totalProgress').textContent = `${percentage}%`;
        document.getElementById('totalProgressBar').style.width = `${percentage}%`;
        document.getElementById('achievementCount').textContent = this.progress.achievements.length;
        document.getElementById('completedLessons').textContent = `${completedCount}/${totalChapters}`;
    }
}

// 全局函数
function startLearning() {
    const firstChapter = learningData.chapters[0];
    app.loadChapter(firstChapter);
}

function closeAchievement() {
    document.getElementById('achievementModal').classList.remove('show');
}

function continueNextChapter() {
    closeAchievement();

    const currentIndex = learningData.chapters.findIndex(c => c.id === app.currentChapter.id);
    if (currentIndex < learningData.chapters.length - 1) {
        const nextChapter = learningData.chapters[currentIndex + 1];
        app.loadChapter(nextChapter);
    } else {
        app.showWelcomeScreen();
        alert('🎉 恭喜你完成了所有章节的学习！你已经是一个真正的Vibe Coding开发者了！');
    }
}

// 初始化应用
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new LearningPlatform();
});
