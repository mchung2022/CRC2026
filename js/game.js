/* js/game.js - CRC Multistage Classroom Adventure Engine */

document.addEventListener('DOMContentLoaded', () => {
  // Game state
  const state = {
    stage: 1, // 1 to 4
    currentQ: 0, // Current question index within stage
    stats: {
      crc: 50,
      order: 50,
      prof: 50
    },
    choicesHistory: [],
    shortAnswers: {
      sa1: '',
      sa2: '',
      covenant: ''
    },
    logs: []
  };

  // Stage definition map
  const stagesInfo = [
    { num: 1, badge: "階段一：法規知識奠基", node: 'node-1' },
    { num: 2, badge: "階段二：衝突抉擇現場", node: 'node-2' },
    { num: 3, badge: "階段三：規章體檢批判", node: 'node-3' },
    { num: 4, badge: "階段四：民主共創未來", node: 'node-4' }
  ];

  // Stage 1 Database: Multiple Choice (4) & Matching Board (1)
  const stage1Questions = [
    {
      type: "mc",
      badge: "記憶 - 核心概念",
      title: "1.1 CRC 四大基本原則選拔",
      prompt: "根據兒童權利公約 (CRC)，下列何者【不屬於】公約所規定的四大基本原則？",
      description: "CRC具有四項靈魂基本原則，做為所有條文解釋的指導方針。身為未來教師，您必須準確識別它們。",
      options: [
        { text: "A. 禁止歧視原則 (Non-discrimination)", correct: false },
        { text: "B. 兒童最佳利益原則 (Best interests of the child)", correct: false },
        { text: "C. 尊重兒童意見/表意權原則 (Respect for the views of the child)", correct: false },
        { text: "D. 班級紀律與絕對服從原則 (Discipline and absolute obedience)", correct: true }
      ],
      feedback: {
        success: "答對了！『絕對服從』是威權管理的觀念，CRC 主張學生是『權利的主體』而非順從的客體。",
        fail: "答錯囉。A、B、C 都是 CRC 明文規定的核心基本原則，『絕對服從』非公約內容。"
      },
      effects: { success: { crc: +5, prof: +10 }, fail: { crc: -5, prof: -5 } }
    },
    {
      type: "mc",
      badge: "理解 - 國內效力",
      title: "1.2 公約施行法的法律位階",
      prompt: "中華民國於 2014 年通過《兒童權利公約施行法》，該法明定 CRC 條文具有何種效力？",
      description: "師培生必須了解國際公約在台灣國內法律體系中的實際位階，這將影響您如何看待『校規』的法律限界。",
      options: [
        { text: "A. 僅具有行政指導與政策建議的參考性質", correct: false },
        { text: "B. 具有與國內法律同等的法律效力，校規牴觸者無效", correct: true },
        { text: "C. 效力低於各級中學自治所訂定的校規與獎懲辦法", correct: false },
        { text: "D. 僅適用於司法機關，教育行政機關不受其拘束", correct: false }
      ],
      feedback: {
        success: "答對了！施行法第 2 條明定公約條文具有國內法律效力。任何校規牴觸公約即屬無效。",
        fail: "答錯了。施行法賦予了 CRC 國內法律效力，高於所有學校自治校規。"
      },
      effects: { success: { crc: +5, prof: +10 }, fail: { crc: -5, prof: -5 } }
    },
    {
      type: "mc",
      badge: "記憶 - 適用年齡",
      title: "1.3 CRC 的兒童定義範疇",
      prompt: "根據 CRC 第 1 條，公約所保障的『兒童』是指幾歲以下之人？",
      description: "明確掌握適用對象。中學生在法律上到底算不算是兒童？這攸關我們輔導管教的態度。",
      options: [
        { text: "A. 未滿 12 歲之人 (僅限小學以下)", correct: false },
        { text: "B. 未滿 15 歲之人 (僅限義務教育階段)", correct: false },
        { text: "C. 未滿 18 歲之人 (除非適用法律規定更低)", correct: true },
        { text: "D. 僅限未滿 6 歲的學齡前幼兒", correct: false }
      ],
      feedback: {
        success: "答對了！CRC 定義兒童為未滿 18 歲之人。國中生、高中生皆屬於公約完整保障的範疇！",
        fail: "答錯了。CRC 規定 18 歲以下皆為兒童。因此中學生皆是公約的保護主體。"
      },
      effects: { success: { crc: +5, prof: +5 }, fail: { crc: -5, prof: -5 } }
    },
    {
      type: "mc",
      badge: "理解 - 管教紅線",
      title: "1.4 法定合理管教手段邊界",
      prompt: "教育部《學校訂定教師輔導與管教學生辦法注意事項》中，對於『罰站』處分的明文限制為何？",
      description: "日常班級管理中，『罰站』是常見管教手段。但您知道法律規定的最高額度與規範是什麼嗎？",
      options: [
        { text: "A. 教師得隨意罰站，無任何時間與地點限制", correct: false },
        { text: "B. 每次不得超過一堂課，每日累計不得超過兩小時，且需有安全照看", correct: true },
        { text: "C. 可以強制全班連坐處罰罰站，不受時間限制", correct: false },
        { text: "D. 只要不體罰，可以罰站至放學，並沒收其午餐", correct: false }
      ],
      feedback: {
        success: "答對了！法定限制每次不超過一堂課，每日不超過兩小時，且不可株連全班或於危險環境進行。",
        fail: "答錯了。法定明確限制每次限一堂課、每日累計限兩小時，且必須遵守比例原則。"
      },
      effects: { success: { crc: +5, order: +5, prof: +10 }, fail: { crc: -5, order: -5, prof: -5 } }
    },
    {
      type: "matching",
      badge: "應用 - 條文配對",
      title: "1.5 CRC 條文與校園場景配對戰",
      prompt: "請將左側的「CRC 條文項目」與右側「校園具體實踐場景」進行配對連接：",
      description: "點選左側卡牌，再點選右側對應的實踐場景，成功配對 4 組即可過關。",
      leftItems: [
        { id: "art12", text: "第 12 條 表意權" },
        { id: "art16", text: "第 16 條 隱私權" },
        { id: "art28", text: "第 28 條 受教權" },
        { id: "art31", text: "第 31 條 休息與遊戲權" }
      ],
      rightItems: [
        { matchId: "art16", text: "搜查包包須符合合理懷疑、有證人在場且全程錄影之法定程序" },
        { matchId: "art12", text: "設置服裝儀容委員會時，應有一定比例之學生代表出席共同決策" },
        { matchId: "art31", text: "禁止為了衝刺學力而強制剝奪學生下課時間或限制後段班參加校外教學" },
        { matchId: "art28", text: "學校不得因學生服儀違規或成績退步而對其採取禁止上課、考試之處分" }
      ]
    }
  ];

  // Stage 2 Database: Scenario Decisions (4)
  const stage2Questions = [
    {
      type: "scenario",
      badge: "應用 - 隱私保障",
      title: "2.1 突發安全檢查命令",
      prompt: "校長以防範電子菸為由，要求您在第一堂課無預警對全班書包與置物櫃進行安全檢查，您如何決策？",
      description: "校長在晨會上大發雷霆，要求各班導師立刻無預警普查學生私人財產。然而無差別檢查侵害隱私，違反 CRC 第 16 條及教育部安全檢查程序說明。",
      choices: [
        {
          text: "A. 配合校長指示，以導師威信當場要求全班把書包放在桌上翻查。",
          effects: { crc: -25, order: +25, prof: -10 },
          desc: "配合威權普查書包"
        },
        {
          text: "B. 發信向學務處提出，安全檢查須具備「合理懷疑特定對象攜帶違禁品」之要件，且須有家長/學生代表在場錄影，才得依法定程序實施。",
          effects: { crc: +25, order: -10, prof: +25 },
          desc: "堅守法規搜包程序"
        },
        {
          text: "C. 交給風紀股長與班長私下幫忙搜查，導師佯裝不知情，避免承擔責任。",
          effects: { crc: -15, order: -15, prof: -25 },
          desc: "推諉職責予學生幹部"
        }
      ]
    },
    {
      type: "scenario",
      badge: "理解 - 表意精神",
      title: "2.2 延後上學提案公聽會",
      prompt: "學生會提案取消早自習、延後上學。行政主管在會議上以「學生太懶散」反對，您在校務會議如何表態？",
      description: "中學生自主權提高，提案要求依自主權延後上學。主管機關強烈捍衛傳統秩序。CRC 第 12 條保障學生有權參與影響其自身利益的行政決策。",
      choices: [
        {
          text: "A. 支持學校行政端，發言贊同晨讀對升學率的必要性，要求學生專注課業。",
          effects: { crc: -20, order: +20, prof: -10 },
          desc: "捍衛晨讀傳統"
        },
        {
          text: "B. 聲援學生，主張表意權應受重視，且延後上學有助生理睡眠；發言提案「先以班級為單位進行配套試辦，收集親師生多方意見」。",
          effects: { crc: +25, order: +5, prof: +25 },
          desc: "支持表意並提倡科學試辦"
        },
        {
          text: "C. 保持沉默，會議表決時棄權。事後跟學生說「這不是我們能決定的，少管閒事」。",
          effects: { crc: -10, order: 0, prof: -20 },
          desc: "消極迴避爭議"
        }
      ]
    },
    {
      type: "scenario",
      badge: "應用 - 生活規約",
      title: "2.3 嚴冬裡的服儀衝突",
      prompt: "女學生生理期體寒，在校服外加穿了自己的大衣被糾察記點扣分，哭著向您求助，您如何解決？",
      description: "學校仍有過時規定「禦寒外套不得穿在最外側」。學生生理期極度怕冷，加穿了便服大衣被記點。教育部已三令五申低溫特報時學生得自由添加校外防寒衣物，且不可因服儀違規記過。",
      choices: [
        {
          text: "A. 告訴她校規就是校規，以大局為重：「在校內先忍一下脫掉，進教室再穿，不要害班上被扣秩序分。」",
          effects: { crc: -25, order: +20, prof: -15 },
          desc: "要求服從不合理服儀校規"
        },
        {
          text: "B. 氣憤地衝去學務處當眾與教官拍桌爭吵，要求立刻撤銷點數，導致行政關係破裂。",
          effects: { crc: +15, order: -20, prof: +5 },
          desc: "情緒化與教官交涉"
        },
        {
          text: "C. 提供熱水暖包，引用教育部規範協助學生填寫銷點單；同時在服儀委員會上提案修正「過時的外套外穿條款」。",
          effects: { crc: +20, order: +10, prof: +25 },
          desc: "依法銷點與提案修正"
        }
      ]
    },
    {
      type: "scenario",
      badge: "分析 - 輔導保密",
      title: "2.4 家長索取輔導會談紀錄",
      prompt: "家長懷疑孩子交損友或涉戀愛，強烈要求導師提供輔導談話與晤談紀錄，甚至威脅投訴，您如何選擇？",
      description: "學生在晤談時向您傾訴與父母的衝突及個人性傾向，並要求保密。家長態度強硬，認為身為監護人有絕對知情權。隱私權與監護權產生劇烈拉鋸。",
      choices: [
        {
          text: "A. 息事寧人，認為父母是監護人本應知情，將紀錄複印或把學生說的悄悄話全部透露給家長。",
          effects: { crc: -30, order: +15, prof: -25 },
          desc: "洩漏晤談隱私以安撫家長"
        },
        {
          text: "B. 拒絕提供，重申晤談保密協定與 CRC 隱私權保障；改為主動約家長面談，在不透露隱私的前提下，引導親子關係重整。",
          effects: { crc: +25, order: -5, prof: +25 },
          desc: "捍衛隱私並轉化為輔導親職"
        },
        {
          text: "C. 回應家長「這是輔導室的事，導師沒紀錄」，把皮球完全丟給專輔老師去處理。",
          effects: { crc: -10, order: -10, prof: -15 },
          desc: "推拖責任給專輔單位"
        }
      ]
    }
  ];

  // Stage 3 Database: Short Answer Evaluation (2)
  const stage3Questions = [
    {
      type: "sa",
      badge: "評估 - 規章體檢 (50字以上)",
      title: "3.1 評估「連坐留校勞役」校規",
      prompt: "【規章評估】請閱讀以下校規片段，評估其是否符合 CRC 精神，並寫下您的批判意見：",
      description: "【校規摘錄】：「班級內若有三人以上遲到，該班級當週放學需全班留校進行愛校服務（打掃環境）一小時，以資督促。」",
      placeholder: "請分析此規定在『禁止歧視/非連坐原則』、『受教/休息權』或『比例原則』上存在何種人權缺失，並提出具體批判... (最少輸入 50 字)",
      targetKey: "sa1",
      minChars: 50
    },
    {
      type: "sa",
      badge: "評估 - 管理風格 (50字以上)",
      title: "3.2 沒收財產班規體檢",
      prompt: "【班規評估】請評估以下班規的適法性，並寫下您的專業修正方案：",
      description: "【班規摘錄】：「上課期間若發出手機鈴聲或玩手機，一律沒收該部手機，由導師代保管至學期末，並通報記警告一次。」",
      placeholder: "請評估沒收至學期末是否侵害財產權？是否符合比例原則？如果您是導師，您會如何修改此班規？... (最少輸入 50 字)",
      targetKey: "sa2",
      minChars: 50
    }
  ];

  // Stage 4 Database: Order & Vision Creation (2)
  const stage4Questions = [
    {
      type: "sorting",
      badge: "創造 - 修復式正義",
      title: "4.1 修復式對話排序戰",
      prompt: "請將下列「修復式正義對話」的引導步驟，依據合理順序進行排列：",
      description: "當學生發生衝突時，傳統上是以記過處分；修復式正義則強調關係修復。點選下方步驟以重建正確的對話排序（共 5 步）：",
      correctOrder: [
        "還原事件：『發生了什麼事？』",
        "同理感受：『你當時在想什麼？現在怎麼想？』",
        "看見傷害：『這件事影響了誰？造成什麼傷害？』",
        "尋求彌補：『我們要怎麼做才能修補這個傷害？』",
        "共創協定：『共同商定修復行動並予以執行。』"
      ]
    },
    {
      type: "sa",
      badge: "創造 - 專業願景 (30字以上)",
      title: "4.2 CRC 自治願景宣告",
      prompt: "恭喜您即將通關！請在此設計您的未來班級經營核心理念宣言：",
      description: "請結合 CRC 的基本原則，創造出一句您在未來進入中學擔任導師時，自我期許的核心經營宣言。",
      placeholder: "我承諾在未來的班級經營中... (最少輸入 30 字，例如：視學生為權利主體，引導其民主討論，建立溫暖且具備法治素養的學習環境。)",
      targetKey: "covenant",
      minChars: 30
    }
  ];

  // DOM Elements
  const ui = {
    badge: document.getElementById('stage-badge'),
    crcVal: document.getElementById('stat-crc-val'),
    crcBar: document.getElementById('stat-crc-bar'),
    orderVal: document.getElementById('stat-order-val'),
    orderBar: document.getElementById('stat-order-bar'),
    profVal: document.getElementById('stat-prof-val'),
    profBar: document.getElementById('stat-prof-bar'),
    taskProgress: document.getElementById('task-progress'),
    progressText: document.getElementById('progress-text'),
    logFeed: document.getElementById('log-feed'),
    contentArea: document.getElementById('game-content-area'),
    endModal: document.getElementById('end-modal'),
    personaTitle: document.getElementById('persona-title'),
    personaDesc: document.getElementById('persona-desc'),
    resCrc: document.getElementById('res-crc'),
    resOrder: document.getElementById('res-order'),
    resProf: document.getElementById('res-prof'),
    btnRestart: document.getElementById('btn-restart'),
    btnSubmit: document.getElementById('btn-submit-score'),
    playerName: document.getElementById('player-name'),
    playerId: document.getElementById('player-id'),
    uploadStatus: document.getElementById('upload-status')
  };

  /**
   * Clamp stat values
   */
  function clamp(val) {
    return Math.max(0, Math.min(100, val));
  }

  /**
   * Update HUD metrics and progress bar animations
   */
  function updateHUD() {
    ui.crcVal.textContent = `${state.stats.crc}%`;
    ui.crcBar.style.width = `${state.stats.crc}%`;

    ui.orderVal.textContent = `${state.stats.order}%`;
    ui.orderBar.style.width = `${state.stats.order}%`;

    ui.profVal.textContent = `${state.stats.prof}%`;
    ui.profBar.style.width = `${state.stats.prof}%`;
  }

  /**
   * Get active questions list based on active stage
   */
  function getActiveQuestions() {
    switch (state.stage) {
      case 1: return stage1Questions;
      case 2: return stage2Questions;
      case 3: return stage3Questions;
      case 4: return stage4Questions;
      default: return [];
    }
  }

  /**
   * Update Stage Navigation Map nodes
   */
  function syncStageMap() {
    stagesInfo.forEach(stage => {
      const node = document.getElementById(stage.node);
      if (!node) return;
      node.className = 'step-node';
      
      if (state.stage === stage.num) {
        node.classList.add('active');
      } else if (state.stage > stage.num) {
        node.classList.add('completed');
      }
    });

    const currentStageInfo = stagesInfo.find(s => s.num === state.stage);
    if (currentStageInfo) {
      ui.badge.textContent = currentStageInfo.badge;
    }
  }

  /**
   * Add text record to log feed
   */
  function addLog(title, choiceText, effects) {
    if (state.logs.length === 0) {
      ui.logFeed.innerHTML = '';
    }

    const logItem = document.createElement('div');
    logItem.className = 'log-item glass';
    logItem.innerHTML = `
      <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 2px;">${title}</div>
      <div style="color: var(--text-muted); font-size: 0.7rem; margin-bottom: 4px;">結果：${choiceText}</div>
      <div style="display: flex; gap: 8px; font-size: 0.65rem;">
        <span style="color: var(--accent-cyan)">CRC ${effects.crc >= 0 ? '+' : ''}${effects.crc}</span>
        <span style="color: var(--accent-purple)">秩序 ${effects.order >= 0 ? '+' : ''}${effects.order}</span>
        <span style="color: var(--accent-pink)">專業 ${effects.prof >= 0 ? '+' : ''}${effects.prof}</span>
      </div>
    `;
    ui.logFeed.appendChild(logItem);
    ui.logFeed.scrollTop = ui.logFeed.scrollHeight;

    state.logs.push({ title, choiceText });
  }

  /**
   * Load active question and render corresponding HTML templates
   */
  function loadQuestion() {
    const activeQuestions = getActiveQuestions();
    syncStageMap();

    // Verify if stage is completed
    if (state.currentQ >= activeQuestions.length) {
      if (state.stage < 4) {
        state.stage++;
        state.currentQ = 0;
        loadQuestion();
      } else {
        triggerEndGame();
      }
      return;
    }

    const q = activeQuestions[state.currentQ];

    // Sync task progress indicator
    const percent = (state.currentQ / activeQuestions.length) * 100;
    ui.taskProgress.style.width = `${percent}%`;
    ui.progressText.textContent = `已完成 ${state.currentQ} / ${activeQuestions.length} 題`;

    // Render workspace based on question types
    switch (q.type) {
      case 'mc':
        renderMultipleChoice(q);
        break;
      case 'matching':
        renderMatching(q);
        break;
      case 'scenario':
        renderScenario(q);
        break;
      case 'sa':
        renderShortAnswer(q);
        break;
      case 'sorting':
        renderSorting(q);
        break;
    }
  }

  /**
   * Render Multiple Choice Question
   */
  function renderMultipleChoice(q) {
    ui.contentArea.innerHTML = `
      <span class="q-badge">Level 1: MC 選擇題 (記憶/理解)</span>
      <h2 class="q-title">${q.title}</h2>
      <p class="q-description">${q.description}</p>
      <div class="q-prompt-box">
        <span>❓</span>
        <span><b>問題：</b>${q.prompt}</span>
      </div>
      <div class="options-list" id="mc-options-container">
        <!-- Render buttons -->
      </div>
    `;

    const optionsContainer = document.getElementById('mc-options-container');
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt.text;
      
      btn.addEventListener('click', () => {
        // Apply feedback and effects
        let chosenStatus = opt.correct ? q.feedback.success : q.feedback.fail;
        let chosenEffects = opt.correct ? q.effects.success : q.effects.fail;

        // Apply stat changes
        state.stats.crc = clamp(state.stats.crc + (chosenEffects.crc || 0));
        state.stats.order = clamp(state.stats.order + (chosenEffects.order || 0));
        state.stats.prof = clamp(state.stats.prof + (chosenEffects.prof || 0));
        updateHUD();

        addLog(q.title, opt.correct ? "答對" : "答錯", chosenEffects);

        // Record history
        state.choicesHistory.push(`MC [${q.title}]: ${opt.correct ? 'PASS' : 'FAIL'}`);

        // Show brief visual feedback modal/alert then advance
        ui.contentArea.innerHTML = `
          <div style="text-align: center; padding: 40px 15px;">
            <div style="font-size: 3rem; margin-bottom: 15px;">${opt.correct ? '🎉' : '❌'}</div>
            <h2 style="color: #fff; margin-bottom: 15px;">${opt.correct ? '解答正確！' : '回答錯誤'}</h2>
            <div class="reflect-box" style="text-align: left; max-width: 600px; margin: 0 auto 20px auto; padding: 15px;">
              <p>${chosenStatus}</p>
            </div>
            <button class="btn btn-primary" id="btn-next-mc" style="padding: 8px 25px;">下一題 &rarr;</button>
          </div>
        `;
        document.getElementById('btn-next-mc').focus();
        document.getElementById('btn-next-mc').addEventListener('click', () => {
          state.currentQ++;
          loadQuestion();
        });
      });

      optionsContainer.appendChild(btn);
    });
  }

  /**
   * Render Matching Question (Click to connect)
   */
  function renderMatching(q) {
    ui.contentArea.innerHTML = `
      <span class="q-badge">Level 1: Matching 配合連連看</span>
      <h2 class="q-title">${q.title}</h2>
      <p class="q-description">${q.description}</p>
      <div class="q-prompt-box">
        <span>❓</span>
        <span><b>規則：</b>${q.prompt}</span>
      </div>
      
      <div class="matching-container">
        <!-- Left items column -->
        <div class="matching-column" id="match-col-left"></div>
        <!-- Right items column -->
        <div class="matching-column" id="match-col-right"></div>
      </div>
      
      <div style="text-align: right; margin-top: 25px;">
        <button class="btn btn-primary" id="btn-next-match" disabled style="padding: 8px 25px;">請完成配對關卡...</button>
      </div>
    `;

    const leftCol = document.getElementById('match-col-left');
    const rightCol = document.getElementById('match-col-right');
    const nextBtn = document.getElementById('btn-next-match');

    let selectedLeft = null;
    let selectedRight = null;
    let matchesCount = 0;

    // Shuffle array helper to randomize right items for matching game challenge
    const shuffledRightItems = [...q.rightItems].sort(() => Math.random() - 0.5);

    // Render Left Columns
    q.leftItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'matching-card';
      card.textContent = item.text;
      card.setAttribute('data-id', item.id);
      
      card.addEventListener('click', () => {
        if (card.classList.contains('matched')) return;
        
        // Remove selection from previous left cards
        const allLeftCards = leftCol.querySelectorAll('.matching-card');
        allLeftCards.forEach(c => c.classList.remove('selected'));
        
        card.classList.add('selected');
        selectedLeft = item.id;
        
        checkMatch();
      });
      leftCol.appendChild(card);
    });

    // Render Right Columns
    shuffledRightItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'matching-card';
      card.textContent = item.text;
      card.setAttribute('data-match-id', item.matchId);
      
      card.addEventListener('click', () => {
        if (card.classList.contains('matched')) return;
        
        // Remove selection from previous right cards
        const allRightCards = rightCol.querySelectorAll('.matching-card');
        allRightCards.forEach(c => c.classList.remove('selected'));
        
        card.classList.add('selected');
        selectedRight = item.matchId;
        
        checkMatch();
      });
      rightCol.appendChild(card);
    });

    function checkMatch() {
      if (selectedLeft && selectedRight) {
        const leftCard = leftCol.querySelector(`[data-id="${selectedLeft}"]`);
        const rightCard = rightCol.querySelector(`[data-match-id="${selectedRight}"]`);

        if (selectedLeft === selectedRight) {
          // Success Match
          leftCard.className = 'matching-card matched';
          rightCard.className = 'matching-card matched';
          matchesCount++;

          // Stats bonus
          state.stats.crc = clamp(state.stats.crc + 5);
          state.stats.prof = clamp(state.stats.prof + 5);
          updateHUD();

          if (matchesCount === q.leftItems.length) {
            nextBtn.disabled = false;
            nextBtn.textContent = '完成配對！進入下一關 &rarr;';
            nextBtn.focus();
            addLog(q.title, "成功完成所有條文配對", { crc: +20, order: 0, prof: +20 });
            state.choicesHistory.push(`Matching [${q.title}]: COMPLETE`);
          }
        } else {
          // Wrong Match - Visual Feedback shake / warning color
          leftCard.classList.remove('selected');
          rightCard.classList.remove('selected');
          
          // Flash wrong border
          leftCard.style.borderColor = '#ff8787';
          rightCard.style.borderColor = '#ff8787';
          setTimeout(() => {
            leftCard.style.borderColor = '';
            rightCard.style.borderColor = '';
          }, 800);
        }
        selectedLeft = null;
        selectedRight = null;
      }
    }

    nextBtn.addEventListener('click', () => {
      state.currentQ++;
      loadQuestion();
    });
  }

  /**
   * Render Scenario Question
   */
  function renderScenario(q) {
    ui.contentArea.innerHTML = `
      <span class="q-badge">Level 2: Scenario 情境決策題</span>
      <h2 class="q-title">${q.title}</h2>
      <p class="q-description">${q.description}</p>
      <div class="q-prompt-box">
        <span>❓</span>
        <span><b>探究思辨：</b>${q.prompt}</span>
      </div>
      <div class="options-list" id="scenario-options">
        <!-- Choices Injected here -->
      </div>
    `;

    const optionsContainer = document.getElementById('scenario-options');
    q.choices.forEach((choice, choiceIdx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = choice.text;
      
      btn.addEventListener('click', () => {
        // Apply stats change
        state.stats.crc = clamp(state.stats.crc + choice.effects.crc);
        state.stats.order = clamp(state.stats.order + choice.effects.order);
        state.stats.prof = clamp(state.stats.prof + choice.effects.prof);
        updateHUD();

        addLog(q.title, choice.desc, choice.effects);
        state.choicesHistory.push(`Scenario [${q.title}]: ${choice.desc}`);

        state.currentQ++;
        loadQuestion();
      });

      optionsContainer.appendChild(btn);
    });
  }

  /**
   * Render Short Answer / Critique Question (Evaluating / Creating)
   */
  function renderShortAnswer(q) {
    ui.contentArea.innerHTML = `
      <span class="q-badge">Level 3-4: Short Answer 規章批判與共創簡答</span>
      <h2 class="q-title">${q.title}</h2>
      <p class="q-description">${q.description}</p>
      <div class="q-prompt-box">
        <span>❓</span>
        <span><b>任務要求：</b>${q.prompt}</span>
      </div>
      <div class="short-answer-container">
        <textarea id="sa-textarea" class="form-input" style="height: 140px; resize: none;" placeholder="${q.placeholder}"></textarea>
        <div class="textarea-limit-info" id="textarea-counter">目前字數: 0 / 最少字數: ${q.minChars}</div>
      </div>
      <div style="text-align: right; margin-top: 20px;">
        <button class="btn btn-primary" id="btn-next-sa" disabled style="padding: 8px 25px;">請輸入符合字數要求之內容...</button>
      </div>
    `;

    const textarea = document.getElementById('sa-textarea');
    const counter = document.getElementById('textarea-counter');
    const nextBtn = document.getElementById('btn-next-sa');

    // Restore text if already entered (in case they back up or reload)
    textarea.value = state.shortAnswers[q.targetKey] || '';
    checkTextareaLength();

    textarea.addEventListener('input', checkTextareaLength);

    function checkTextareaLength() {
      const len = textarea.value.trim().length;
      counter.textContent = `目前字數: ${len} / 最少字數: ${q.minChars}`;
      
      if (len >= q.minChars) {
        nextBtn.disabled = false;
        nextBtn.textContent = '完成，進入下一步 &rarr;';
        counter.style.color = '#51cf66';
      } else {
        nextBtn.disabled = true;
        nextBtn.textContent = '請輸入符合字數要求之內容...';
        counter.style.color = 'var(--text-muted)';
      }
    }

    nextBtn.addEventListener('click', () => {
      state.shortAnswers[q.targetKey] = textarea.value.trim();
      addLog(q.title, "已完成書面批判與答覆", { crc: +10, order: 0, prof: +15 });
      state.choicesHistory.push(`ShortAnswer [${q.title}]: COMPLETED`);

      state.currentQ++;
      loadQuestion();
    });
  }

  /**
   * Render Sorting Question (Stage 4)
   */
  function renderSorting(q) {
    ui.contentArea.innerHTML = `
      <span class="q-badge">Level 4: Sorting 修復式對話排序</span>
      <h2 class="q-title">${q.title}</h2>
      <p class="q-description">${q.description}</p>
      <div class="q-prompt-box">
        <span>❓</span>
        <span><b>步驟目標：</b>${q.prompt}</span>
      </div>
      
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px;">
        <!-- Left Side: Interactive Buttons -->
        <div>
          <h4 style="font-size: 0.8rem; margin-bottom: 8px; color: var(--accent-orange);">⚠️ 隨機步驟（點擊依序加入右側對話中）：</h4>
          <div class="matching-column" id="sort-items-pool"></div>
        </div>
        <!-- Right Side: User ordered List -->
        <div class="glass" style="padding: 15px; display: flex; flex-direction: column;">
          <h4 style="font-size: 0.8rem; margin-bottom: 8px; color: var(--accent-cyan);">📋 您的對話引導排序（需按順序）：</h4>
          <div class="matching-column" id="sort-user-list" style="flex-grow: 1; border: 1px dashed var(--glass-border); border-radius: 6px; padding: 10px;">
            <div style="text-align: center; color: var(--text-muted); font-size: 0.75rem; padding: 30px 10px;" id="sort-placeholder">點擊左側開始對話排序...</div>
          </div>
        </div>
      </div>
      
      <div style="text-align: right; margin-top: 20px;">
        <button class="btn btn-primary" id="btn-next-sort" disabled style="padding: 8px 25px;">請排列正確的對話步驟...</button>
      </div>
    `;

    const poolContainer = document.getElementById('sort-items-pool');
    const userContainer = document.getElementById('sort-user-list');
    const placeholder = document.getElementById('sort-placeholder');
    const nextBtn = document.getElementById('btn-next-sort');

    let currentOrder = [];

    // Shuffle source items pool
    const shuffledSource = [...q.correctOrder].sort(() => Math.random() - 0.5);

    // Render Pool
    shuffledSource.forEach(item => {
      const card = document.createElement('div');
      card.className = 'matching-card';
      card.textContent = item;
      
      card.addEventListener('click', () => {
        if (card.classList.contains('selected')) return;

        card.classList.add('selected');
        currentOrder.push(item);
        
        // Hide placeholder
        placeholder.style.display = 'none';

        // Add to user list container
        const userCard = document.createElement('div');
        userCard.className = 'matching-card matched';
        userCard.innerHTML = `<span style="font-weight:700; color:var(--accent-cyan); margin-right:5px;">Step ${currentOrder.length}</span> ${item}`;
        
        userCard.addEventListener('click', () => {
          // Allow removing item if they made a mistake
          userCard.remove();
          card.classList.remove('selected');
          
          currentOrder = currentOrder.filter(i => i !== item);
          
          // Re-index remaining elements inside user list container
          const allUserItems = userContainer.querySelectorAll('.matching-card');
          allUserItems.forEach((c, index) => {
            // Keep the text node and change Step number prefix
            c.querySelector('span').textContent = `Step ${index + 1}`;
          });

          if (currentOrder.length === 0) {
            placeholder.style.display = 'block';
          }
          nextBtn.disabled = true;
          nextBtn.textContent = '請排列正確的對話步驟...';
        });

        userContainer.appendChild(userCard);
        verifySorting();
      });

      poolContainer.appendChild(card);
    });

    function verifySorting() {
      if (currentOrder.length === q.correctOrder.length) {
        // Verify if user order matches correct order exactly
        let allCorrect = true;
        for (let i = 0; i < q.correctOrder.length; i++) {
          if (currentOrder[i] !== q.correctOrder[i]) {
            allCorrect = false;
            break;
          }
        }

        if (allCorrect) {
          nextBtn.disabled = false;
          nextBtn.textContent = '排序正確！進入下一步 &rarr;';
          nextBtn.focus();
          addLog(q.title, "成功完成修復式對話排序", { crc: +15, order: +5, prof: +20 });
          state.choicesHistory.push(`Sorting [${q.title}]: COMPLETE`);
        } else {
          nextBtn.disabled = true;
          nextBtn.textContent = '順序不正確，請點選右側以取消移除，重新排序。';
        }
      }
    }

    nextBtn.addEventListener('click', () => {
      state.currentQ++;
      loadQuestion();
    });
  }

  /**
   * End Game State persona determination
   */
  function determinePersona(crc, order, prof) {
    if (crc >= 70 && prof >= 70 && order >= 55) {
      return {
        title: "🛡️ 民主教育領航員 (Democratic Navigator)",
        desc: "恭喜！您具備極高的 CRC 人權理念與專業教師素養。在面對棘手的學務衝突時，您不仰賴威權命令，而是透過民主對話、法源分析與配套機制來兼顧校園基本秩序。您深諳「學生的自主權」是教育的終極目標，而非行政便利的祭品，是未來校園最需要的 CRC 典範教師！"
      };
    } else if (crc < 55 && order >= 70) {
      return {
        title: "⚔️ 鐵血秩序守護者 (Iron Order Guardian)",
        desc: "您的決策傾向於維護傳統的校園秩序與集體利益。您認為在學生身心尚未成熟前，必須藉由嚴謹的常規與老師的威權來維持學習品質。然而，部分決策已牴觸《兒童權利公約》中關於隱私權與表意權的底線。建議您深入思考：當秩序變成了唯一的教育目標，是否可能無意中侵害了孩子的人格發展空間？"
      };
    } else if (crc >= 70 && order < 55) {
      return {
        title: "🕊️ 人權至上理想家 (Human Rights Idealist)",
        desc: "您有著滿腔的人權熱血，將保障學生權益與自主權視為至高無上的準則，勇於對抗不合理的體制與行政命令。不過，在部分情境中，缺乏適當的配套措施，可能導致班級管理陷入混亂或與同儕行政團隊關係緊繃。請記住，民主是需要有規則保護的；如何在法律與常規下，設計合理的配套，將是您教師專業成長的下一個重點。"
      };
    } else {
      return {
        title: "⚖️ 溫和教育實踐者 (Moderate Practitioner)",
        desc: "您職掌穩健、中庸的教育信念。在處理人權與秩序的衝突時，您多能理性因應，不走極端。您願意聽取學生的意見，也能適度維持常規。如果您能再深入了解各項教育行政指導函釋，並更有意識地在日常班務中創造讓學生共創班規、自主決策的機會，您將能更好地釋放學生的主體性潛能！"
      };
    }
  }

  /**
   * Final Screen Trigger
   */
  function triggerEndGame() {
    const finalPersona = determinePersona(state.stats.crc, state.stats.order, state.stats.prof);
    
    ui.personaTitle.textContent = finalPersona.title;
    ui.personaDesc.textContent = finalPersona.desc;
    
    ui.resCrc.textContent = `${state.stats.crc}%`;
    ui.resOrder.textContent = `${state.stats.order}%`;
    ui.resProf.textContent = `${state.stats.prof}%`;
    
    // Auto fill default dummy progress fill
    ui.taskProgress.style.width = `100%`;
    ui.progressText.textContent = `闖關任務全數完成！`;

    ui.endModal.classList.add('open');
  }

  /**
   * Handle result submission to Google Sheets
   */
  ui.btnSubmit.addEventListener('click', async (e) => {
    e.preventDefault();

    const name = ui.playerName.value.trim();
    const sid = ui.playerId.value.trim();

    if (!name || !sid) {
      showStatus(ui.uploadStatus, '⚠️ 請填寫姓名與學號！', 'error');
      return;
    }

    showStatus(ui.uploadStatus, '⏳ 上傳資料至 Google Sheet 中...', 'loading');
    ui.btnSubmit.disabled = true;

    const choicePathString = state.choicesHistory.join(' -> ');

    const payload = {
      PlayerName: name,
      StudentID: sid,
      CRC_Score: state.stats.crc,
      Order_Score: state.stats.order,
      Professional_Score: state.stats.prof,
      Persona: ui.personaTitle.textContent,
      ChoicePath: choicePathString,
      // Extra fields for Stage 3 & 4 Short Answers
      ShortAnswer1: state.shortAnswers.sa1,
      ShortAnswer2: state.shortAnswers.sa2,
      CovenantStatement: state.shortAnswers.covenant
    };

    const result = await ConfigManager.sendData('game_scores', payload);

    if (result.success) {
      showStatus(ui.uploadStatus, '✅ 成果成功上傳至 Google 試算表！', 'success');
    } else if (result.reason === 'api_url_not_configured') {
      showStatus(ui.uploadStatus, 'ℹ️ 已模擬儲存！(若需寫入Google Sheet，請先設定入口網頁的API網址)', 'success');
      ui.btnSubmit.disabled = false;
    } else {
      showStatus(ui.uploadStatus, `❌ 上傳失敗: ${result.error || '網絡異常'}`, 'error');
      ui.btnSubmit.disabled = false;
    }
  });

  function showStatus(element, message, type) {
    if (!element) return;
    element.className = 'status-message';
    
    if (type === 'success') {
      element.classList.add('status-success');
    } else if (type === 'error') {
      element.classList.add('status-error');
    } else if (type === 'loading') {
      element.classList.add('status-loading');
    }
    
    element.textContent = message;
  }

  // Restart trigger
  ui.btnRestart.addEventListener('click', () => {
    state.stage = 1;
    state.currentQ = 0;
    state.stats.crc = 50;
    state.stats.order = 50;
    state.stats.prof = 50;
    state.choicesHistory = [];
    state.logs = [];
    state.shortAnswers = { sa1: '', sa2: '', covenant: '' };

    ui.playerName.value = '';
    ui.playerId.value = '';
    ui.btnSubmit.disabled = false;
    ui.uploadStatus.className = 'status-message';
    ui.uploadStatus.textContent = '';

    ui.logFeed.innerHTML = `
      <div style="color: var(--text-muted); text-align: center; padding: 20px 0; font-size: 0.8rem;">
        暫無日誌。通關答題後會在此即時更新您的決策影響。
      </div>
    `;

    updateHUD();
    ui.endModal.classList.remove('open');
    loadQuestion();
  });

  // Start game on load
  updateHUD();
  loadQuestion();
});
