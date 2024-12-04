export const translations = {
  ja: {
    common: {
      calendar: 'カレンダー',
      achievements: '実績',
      timer: 'タイマー',
      settings: '設定',
      save: '保存',
      cancel: 'キャンセル'
    },
    calendar: {
      weekdays: ['日', '月', '火', '水', '木', '金', '土'],
      today: '今日',
      addTask: '新しいタスクを追加',
      priority: {
        high: '高',
        medium: '中',
        low: '低'
      },
      memo: 'メモ',
      incompleteTasks: '未完了のタスク',
      completedTasks: '完了したタスク'
    },
    settings: {
      system: 'システム',
      theme: 'テーマ',
      light: 'ライト',
      dark: 'ダーク',
      language: '言語',
      fontSize: 'フォントサイズ',
      inProgress: '設定項目は準備中です',
      calendar: {
        weekStart: '週の開始日',
        todoMemo: 'メモの表示',
        taskSort: 'タスクの並び順',
        showCompleted: '完了したタスクを表示',
        sortOptions: {
          priority: '優先度順',
          added: '追加順',
          time: '予定時間順'
        }
      },
      timer: {
        size: 'タイマーサイズ',
        clockMode: '時計表示モード',
        breakPresets: '休憩時間プリセット',
        addPreset: '新しいプリセットを追加',
        removePreset: 'プリセットを削除',
        addPresetPrompt: '休憩時間（分）を入力してください（1-60）：'
      }
    },
    timer: {
      timerTitle: 'タイマー',
      task: 'タスク',
      minutes: '分',
      breakTime: '休憩時間',
      todaysTodos: '今日のTodo',
      stopwatch: 'ストップウォッチ',
      elapsed: '経過時間',
      noTasks: '今日のタスクはありません',
      endTime: '終了時刻',
      overtime: '延長中'
    },
    achievements: {
      level: 'レベル',
      combo: 'コンボ',
      days: '日',
      complete: '達成',
      abandon: 'あきらめる',
      badges: '称号',
      tabs: {
        goals: '目標',
        badges: '称号',
        history: '履歴',
        graphs: 'グラフ'
      },
      acquiredAt: '獲得日時: {{date}}',
      timeLeft: '残り {{days}}日 {{hours}}時間 {{minutes}}分',
      setGoal: {
        daily: '今日の目標を設定する',
        weekly: '今週の目標を設定する',
        monthly: '今月の目標を設定する',
        final: '最終目標を設定する'
      },
      goalForm: {
        title: '目標の設定',
        titleLabel: 'タイトル',
        descriptionLabel: '説明',
        setDeadline: '期限を設定する'
      },
      reflection: {
        title: 'ふりかえり',
        abandonTitle: 'あきらめた理由',
        keep: 'キープ',
        problem: 'プロブレム',
        try: 'トライ',
        score: '達成度',
        points: '点'
      },
      history: {
        title: '目標の履歴'
      },
      graphs: {
        title: 'グラフ',
        noData: 'データがありません',
        needMoreData: 'グラフを表示するには、より多くのデータが必要です',
        totalExp: '累計経験値',
        gainedExp: '獲得経験値',
        level: 'レベル推移',
        dailyStudyTime: '日別学習時間',
        monthlyStudyTime: '月別学習時間',
        yearlyStudyTime: '年別学習時間',
        dailyScore: '日別達成度',
        monthlyScore: '月別達成度'
      },
      settings: {
        title: '実績の設定',
        graphPeriod: 'グラフの表示期間',
        periodAll: 'すべて',
        periodYear: '1年',
        periodMonth: '1ヶ月',
        periodWeek: '1週間',
        hideUnearned: '未獲得の称号を非表示',
        reset: 'データのリセット',
        resetDescription: 'レベル、履歴、現在の目標を含むすべてのデータをリセットします',
        resetButton: 'リセット',
        resetConfirm: '本当にすべてのデータをリセットしますか？この操作は取り消せません。'
      },
      badge: {
        '1': {
          title: 'スタートライン',
          description: '課題に一つ取り組む'
        },
        '2': {
          title: 'コンボ達成',
          description: '2日連続でコンボ'
        },
        '3': {
          title: 'ミニゴール',
          description: '初めて目標を達成する'
        },
        '4': {
          title: '初級者',
          description: 'Lv5になる'
        },
        '5': {
          title: '一夜漬け',
          description: '深夜（23-5時）に勉強する'
        },
        '6': {
          title: '計画者',
          description: '今月の目標を達成する'
        },
        '7': {
          title: '継続',
          description: '30日連続コンボ'
        },
        '8': {
          title: '成長の実感',
          description: 'Lv20になる'
        },
        '9': {
          title: '受験生',
          description: '一度だけ11時間勉強する'
        },
        '10': {
          title: '100点満点',
          description: '目標達成で100点をつける'
        },
        '11': {
          title: '神',
          description: 'Lv100になる'
        }
      }
    }
  },
  en: {
    common: {
      calendar: 'Calendar',
      achievements: 'Achievements',
      timer: 'Timer',
      settings: 'Settings',
      save: 'Save',
      cancel: 'Cancel'
    },
    calendar: {
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      today: 'Today',
      addTask: 'Add new task',
      priority: {
        high: 'High',
        medium: 'Medium',
        low: 'Low'
      },
      memo: 'Memo',
      incompleteTasks: 'Incomplete Tasks',
      completedTasks: 'Completed Tasks'
    },
    settings: {
      system: 'System',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      language: 'Language',
      fontSize: 'Font Size',
      inProgress: 'Settings are in preparation',
      calendar: {
        weekStart: 'Week Start',
        todoMemo: 'Show Memo',
        taskSort: 'Task Sort',
        showCompleted: 'Show Completed Tasks',
        sortOptions: {
          priority: 'By Priority',
          added: 'By Added Date',
          time: 'By Estimated Time'
        }
      },
      timer: {
        size: 'Timer Size',
        clockMode: 'Clock Mode',
        breakPresets: 'Break Time Presets',
        addPreset: 'Add New Preset',
        removePreset: 'Remove Preset',
        addPresetPrompt: 'Enter break time in minutes (1-60):'
      }
    },
    timer: {
      timerTitle: 'Timer',
      task: 'Task',
      minutes: 'min',
      breakTime: 'Break Time',
      todaysTodos: "Today's Todos",
      stopwatch: 'Stopwatch',
      elapsed: 'Elapsed time',
      noTasks: 'No tasks for today',
      endTime: 'End Time',
      overtime: 'Overtime'
    },
    achievements: {
      level: 'Level',
      combo: 'Combo',
      days: 'days',
      complete: 'Complete',
      abandon: 'Abandon',
      badges: 'Badges',
      tabs: {
        goals: 'Goals',
        badges: 'Badges',
        history: 'History',
        graphs: 'Graphs'
      },
      acquiredAt: 'Acquired: {{date}}',
      timeLeft: '{{days}}d {{hours}}h {{minutes}}m remaining',
      setGoal: {
        daily: "Set Today's Goal",
        weekly: "Set This Week's Goal",
        monthly: "Set This Month's Goal",
        final: 'Set Final Goal'
      },
      goalForm: {
        title: 'Set Goal',
        titleLabel: 'Title',
        descriptionLabel: 'Description',
        setDeadline: 'Set Deadline'
      },
      reflection: {
        title: 'Reflection',
        abandonTitle: 'Reason for Abandonment',
        keep: 'Keep',
        problem: 'Problem',
        try: 'Try',
        score: 'Achievement Score',
        points: 'points'
      },
      history: {
        title: 'Goal History'
      },
      graphs: {
        title: 'Graphs',
        noData: 'No Data Available',
        needMoreData: 'More data is needed to display graphs',
        totalExp: 'Total Experience',
        gainedExp: 'Gained Experience',
        level: 'Level Progress',
        dailyStudyTime: 'Daily Study Time',
        monthlyStudyTime: 'Monthly Study Time',
        yearlyStudyTime: 'Yearly Study Time',
        dailyScore: 'Daily Score',
        monthlyScore: 'Monthly Score'
      },
      settings: {
        title: 'Achievement Settings',
        graphPeriod: 'Graph Period',
        periodAll: 'All',
        periodYear: '1 Year',
        periodMonth: '1 Month',
        periodWeek: '1 Week',
        hideUnearned: 'Hide Unearned Badges',
        reset: 'Reset Data',
        resetDescription: 'Reset all data including level, history, and current goals',
        resetButton: 'Reset',
        resetConfirm: 'Are you sure you want to reset all data? This action cannot be undone.'
      },
      badge: {
        '1': {
          title: 'Starting Line',
          description: 'Take on your first task'
        },
        '2': {
          title: 'Combo Achieved',
          description: '2 days combo streak'
        },
        '3': {
          title: 'Mini Goal',
          description: 'Complete your first goal'
        },
        '4': {
          title: 'Beginner',
          description: 'Reach Level 5'
        },
        '5': {
          title: 'Night Owl',
          description: 'Study during night time (11PM-5AM)'
        },
        '6': {
          title: 'Planner',
          description: 'Complete monthly goal'
        },
        '7': {
          title: 'Persistence',
          description: '30 days combo streak'
        },
        '8': {
          title: 'Growth',
          description: 'Reach Level 20'
        },
        '9': {
          title: 'Student',
          description: 'Study for 11 hours in one day'
        },
        '10': {
          title: 'Perfect Score',
          description: 'Get 100 points on goal completion'
        },
        '11': {
          title: 'God',
          description: 'Reach Level 100'
        }
      }
    }
  }
};