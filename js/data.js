// 学习平台数据
const learningData = {
  "chapters": [
    {
      "id": "chapter-00",
      "chapterId": "00-preface",
      "title": "序章：找到你的位置",
      "icon": "🎯",
      "color": "#6B7280",
      "difficulty": "入门",
      "estimatedTime": "10分钟",
      "description": "了解Vibe Coding的起点，明确学习目标",
      "achievement": {
        "badge": "🏅",
        "title": "踏上征程",
        "message": "你已经迈出了学习AI开发的第一步！",
        "quote": "千里之行，始于足下。 —— 老子"
      },
      "lessons": [
        {
          "id": "lesson-00-01",
          "title": "找到你的位置",
          "description": "认识自己，了解Vibe Coding适合什么样的人",
          "keyPoints": [
            "理解Vibe Coding的学习对象",
            "明确自己的学习目标",
            "建立正确的学习心态"
          ],
          "actionSteps": [
            {
              "title": "思考：我为什么要学习AI开发？",
              "description": "写下你的学习动机，可以是想做产品、找工作、或纯粹好奇"
            },
            {
              "title": "评估：我现在的技术水平",
              "description": "诚实评估自己的起点，零基础也完全OK"
            },
            {
              "title": "设定：我的学习目标",
              "description": "设定一个具体的目标，比如「完成一个待办清单应用」"
            }
          ]
        }
      ]
    },
    {
      "id": "chapter-01",
      "chapterId": "01-awakening",
      "title": "第1章：觉醒 - 从码农到指挥官",
      "icon": "⚡",
      "color": "#3B82F6",
      "difficulty": "基础",
      "estimatedTime": "2小时",
      "description": "理解AI时代的编程新范式，转变思维方式",
      "achievement": {
        "badge": "🧠",
        "title": "思维觉醒者",
        "message": "恭喜你完成思维转变！你已经理解了AI时代编程的本质。",
        "quote": "真正的觉醒，不是学会编写代码，而是学会指挥AI。"
      },
      "keyPoints": [
        "理解2025年编程世界的变化",
        "掌握Vibe Coding vs Spec Coding的区别",
        "破除6大常见编程迷信",
        "选择合适的AI编程工具"
      ],
      "lessons": []
    },
    {
      "id": "chapter-02",
      "chapterId": "02-mindset",
      "title": "第2章：心法 - 核心思维",
      "icon": "🧠",
      "color": "#8B5CF6",
      "difficulty": "核心",
      "estimatedTime": "4小时",
      "description": "建立产品思维和用户思维，学会思考问题本质",
      "achievement": {
        "badge": "💎",
        "title": "思维大师",
        "message": "你已经掌握了产品思维的精髓！好的产品源于深刻的思考。",
        "quote": "好的产品源于深刻的思考，而非复杂的代码。"
      },
      "keyPoints": [
        "掌握JTBD（Jobs To Be Done）框架",
        "学会Pre-mortem预演失败",
        "理解真正的MVP（最小可行产品）",
        "建立三维用户画像"
      ],
      "lessons": []
    },
    {
      "id": "chapter-03",
      "chapterId": "03-technique",
      "title": "第3章：技术 - 从想法到产品",
      "icon": "🛠️",
      "color": "#10B981",
      "difficulty": "核心",
      "estimatedTime": "4小时",
      "description": "掌握提示词工程和AI对话技巧",
      "achievement": {
        "badge": "🎯",
        "title": "AI调教师",
        "message": "你已经掌握了与AI对话的艺术！提示词工程就是新时代的编程语言。",
        "quote": "优秀的提示词工程师，就是优秀的产品经理。"
      },
      "keyPoints": [
        "理解上下文（Context）的重要性",
        "掌握SCAFF提示词框架",
        "学会Few-shot和Chain of Thought技巧",
        "编写高质量PRD文档"
      ],
      "lessons": []
    },
    {
      "id": "chapter-04",
      "chapterId": "04-practice-0-to-1",
      "title": "第4章：实战 - 从0到1开发个人工具",
      "icon": "💻",
      "color": "#F59E0B",
      "difficulty": "实战",
      "estimatedTime": "6小时",
      "description": "动手实践，完成第一个完整项目",
      "achievement": {
        "badge": "🚀",
        "title": "独立开发者",
        "message": "恭喜你创造了属于自己的第一个产品！你已经不是初学者了！",
        "quote": "你已经不是初学者了，你是一个能够独立创造的开发者。"
      },
      "keyPoints": [
        "用AI搭建项目框架",
        "实现添加、删除、完成功能",
        "处理本地数据存储",
        "Debug调试技巧"
      ],
      "lessons": []
    },
    {
      "id": "chapter-05",
      "chapterId": "05-advanced",
      "title": "第5章：精进 - 从「能用」到「好用」",
      "icon": "🚀",
      "color": "#EF4444",
      "difficulty": "进阶",
      "estimatedTime": "5小时",
      "description": "学习版本管理、部署和安全最佳实践",
      "achievement": {
        "badge": "⭐",
        "title": "全栈工程师",
        "message": "你的项目已经上线！你已经是一个真正的全栈开发者了！",
        "quote": "卓越不是终点，而是一种习惯。 —— 亚里士多德"
      },
      "keyPoints": [
        "使用GitHub Desktop管理版本",
        "部署到Vercel/Zeabur",
        "安全性最佳实践",
        "持续优化和迭代"
      ],
      "lessons": []
    },
    {
      "id": "chapter-06",
      "chapterId": "99-appendix",
      "title": "附录：工具箱",
      "icon": "📚",
      "color": "#6366F1",
      "difficulty": "参考",
      "estimatedTime": "随时查阅",
      "description": "速查清单、常见问题和资源推荐",
      "achievement": {
        "badge": "📖",
        "title": "知识库管理员",
        "message": "你已经掌握了完整的知识体系！",
        "quote": "真正的智慧，是知道在哪里找到答案。"
      },
      "lessons": []
    }
  ]
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = learningData;
}
