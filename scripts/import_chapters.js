const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

console.log('开始导入章节数据...');

// 目标数据库路径
const sourceDbPath = '/Users/gb/Desktop/claude/memory-echo/docs/vibe_learning_platform/vibe_learning.db';
// 当前项目的 database_seed.json 路径
const targetSeedPath = path.join(__dirname, '..', 'database_seed.json');

// 连接到目标数据库
const sourceDb = new Database(sourceDbPath);

// 读取章节数据
const chapters = sourceDb.prepare(`
    SELECT id, chapter_number, title, subtitle, icon, color, "order"
    FROM chapters
    ORDER BY "order"
`).all();

console.log(`✅ 读取了 ${chapters.length} 个章节`);

// 读取课程数据
const lessons = sourceDb.prepare(`
    SELECT id, chapter_id, lesson_number, title, content, word_count, estimated_time
    FROM lessons
    ORDER BY chapter_id, lesson_number
`).all();

console.log(`✅ 读取了 ${lessons.length} 篇课程`);

// 关闭目标数据库连接
sourceDb.close();

// 准备写入的数据结构
const seedData = {
    chapters,
    lessons
};

// 写入到 database_seed.json 文件
fs.writeFileSync(targetSeedPath, JSON.stringify(seedData, null, 2), 'utf-8');

console.log(`✅ 数据已成功写入到 ${targetSeedPath}`);
console.log('\n数据导入完成！');
console.log('==========================================');
console.log(`章节总数: ${chapters.length}`);
console.log(`课程总数: ${lessons.length}`);
console.log('==========================================\n');