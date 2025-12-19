const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

console.log('初始化数据库...');

// 创建数据库
const db = new Database('vibe_learning.db');

// 创建表结构
db.exec(`
    DROP TABLE IF EXISTS lessons;
    DROP TABLE IF EXISTS chapters;

    CREATE TABLE chapters (
        id TEXT PRIMARY KEY,
        chapter_number TEXT NOT NULL,
        title TEXT NOT NULL,
        subtitle TEXT,
        icon TEXT,
        color TEXT,
        \`order\` INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE lessons (
        id TEXT PRIMARY KEY,
        chapter_id TEXT NOT NULL,
        lesson_number INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        word_count INTEGER DEFAULT 0,
        estimated_time INTEGER DEFAULT 5,
        completed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
    );

    CREATE INDEX idx_lessons_chapter ON lessons(chapter_id);
    CREATE INDEX idx_lessons_completed ON lessons(completed);
`);

console.log('✅ 表结构创建完成');

// 读取种子数据
const seedDataPath = path.join(__dirname, '..', 'database_seed.json');
const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));

// 插入章节数据
const insertChapter = db.prepare(`
    INSERT INTO chapters (id, chapter_number, title, subtitle, icon, color, \`order\`)
    VALUES (@id, @chapter_number, @title, @subtitle, @icon, @color, @order)
`);

const insertMany = db.transaction((chapters) => {
    for (const chapter of chapters) {
        insertChapter.run(chapter);
    }
});

insertMany(seedData.chapters);
console.log(`✅ 插入了 ${seedData.chapters.length} 个章节`);

// 插入文章数据
const insertLesson = db.prepare(`
    INSERT INTO lessons (id, chapter_id, lesson_number, title, content, word_count, estimated_time, completed)
    VALUES (@id, @chapter_id, @lesson_number, @title, @content, @word_count, @estimated_time, 0)
`);

const insertLessons = db.transaction((lessons) => {
    for (const lesson of lessons) {
        insertLesson.run(lesson);
    }
});

insertLessons(seedData.lessons);
console.log(`✅ 插入了 ${seedData.lessons.length} 篇文章`);

// 验证数据
const chapterCount = db.prepare('SELECT COUNT(*) as count FROM chapters').get();
const lessonCount = db.prepare('SELECT COUNT(*) as count FROM lessons').get();

console.log('\n数据库初始化完成！');
console.log('==========================================');
console.log(`章节总数: ${chapterCount.count}`);
console.log(`文章总数: ${lessonCount.count}`);
console.log('==========================================\n');

db.close();
