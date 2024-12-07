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
      completedTasks: '完了したタスク',
      categoryManager: 'カテゴリー管理',
      addCategory: 'カテゴリーを追加',
      newCategoryPlaceholder: '新しいカテゴリー名',
      confirmDeleteCategory: 'このカテゴリーを削除してもよろしいですか？',
      moveToCategory: 'カテゴリーに移動',
      noCategory: 'カテゴリーなし',
      copyTodo: 'タスクをコピー',
      pasteTodo: '貼り付け',
      events: 'イベント',
      addEvent: 'イベントを追加',
      editEvent: 'イベントを編集',
      eventTitle: 'イベント名',
      eventDescription: '説明',
      startTime: '開始時間',
      endTime: '終了時間',
      eventColor: '色',
      eventMemo: 'メモ',
      confirmDeleteEvent: 'このイベントを削除してもよろしいですか？',
      tasks: '個のタスク',
      more: '件以上'
    },
    settings: {
      system: 'システム',
      theme: 'テーマ',
      light: 'ライト',
      dark: 'ダーク',
      fontSize: 'フォントサイズ',
      calendar: {
        weekStart: '週の開始日',
        viewMode: '表示モード',
        viewModes: {
          month: '月表示',
          week: '週表示'
        },
        taskSort: 'タスクの並び順',
        showCompleted: '完了したタスクを表示',
        colorWeekend: '土日祝日の色分け',
        sortOptions: {
          priority: '優先度順',
          added: '追加順',
          time: '予定時間順'
        }
      },
      data: {
        title: 'データ管理',
        export: 'エクスポート',
        import: 'インポート',
        shareTitle: 'データの共有',
        generateShareCode: '共有コードを生成',
        shareCode: '共有コード',
        copy: 'コピー',
        copied: 'コピーしました',
        enterShareCode: '共有コードを入力',
        importShareCode: '共有コードを読み込む',
        exportSuccess: 'データをエクスポートしました',
        importSuccess: 'データを読み込みました',
        importError: 'データの読み込みに失敗しました',
        shareCodeGenerated: '共有コードを生成しました'
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
        hideUnearned: '未獲得の称号を非表示',
        reset: 'データのリセット',
        resetDescription: 'レベル、履歴、現在の目標を含むすべてのデータをリセットします',
        resetButton: 'リセット',
        resetConfirm: '本当にすべてのデータをリセットしますか？この操作は取り消せません。'
      }
    }
  }
};