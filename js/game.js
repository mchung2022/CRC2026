/* js/game.js - Student Affairs Dilemma Game Engine */

document.addEventListener('DOMContentLoaded', () => {
  // Game State
  const state = {
    currentCase: 0,
    stats: {
      crc: 50,
      order: 50,
      prof: 50
    },
    choicesHistory: [] // To store choice descriptions for Sheet upload
  };

  // Case database (6 Cases mapped to Bloom levels)
  const cases = [
    {
      id: 1,
      bloom: "記憶 (Remembering) - 法規程序",
      title: "校長命令安全檢查",
      icon: "🔍",
      inquiry: "當校長命令對全班書包進行無預警的安全抽查以抓出電子菸，您會怎麼做？",
      description: "晨會上，校長指出近來吸食電子菸風氣蔓延，要求所有中學導師在第一堂課無預警搜查學生書包。根據公約第 16 條，兒童隱私權不受任意侵害。你面臨行政命令與人權防線的衝突。",
      choices: [
        {
          text: "遵照校長指示，立刻回班級動手抽查所有學生的書包與置物櫃。",
          effects: { crc: -25, order: +25, prof: -10 },
          desc: "全面搜包"
        },
        {
          text: "向行政溝通，表示應有具體攜帶事證且有家長或學生代表在場下，依法定程序才可檢查。",
          effects: { crc: +25, order: -10, prof: +25 },
          desc: "堅守法定程序"
        },
        {
          text: "推給班級幹部，要求班長和風紀委員去檢查並上報，自己在旁監看。",
          effects: { crc: -15, order: -15, prof: -20 },
          desc: "卸責學生幹部"
        }
      ]
    },
    {
      id: 2,
      bloom: "理解 (Understanding) - 表意權精神",
      title: "早自習存廢大會戰",
      icon: "⏰",
      inquiry: "學生會提案取消早自習，行政主管拍桌反對『學生太懶惰』，您在校務會議如何發言？",
      description: "國高中學生會提案「取消早自習、延後上學」。校務會議上，學務主任怒斥學生：「不早起讀書，只會睡覺，怎麼考得上大學！」CRC 第 12 條保障兒童表意權。你該如何發聲？",
      choices: [
        {
          text: "支持學務主任，發言強調晨讀是傳統美德，學生應配合團體紀律。",
          effects: { crc: -20, order: +20, prof: -10 },
          desc: "支持傳統紀律"
        },
        {
          text: "聲援學生，主張表意權保障其發言，並建議學校以「不記遲到、自主晨讀」進行為期半學期的試辦。",
          effects: { crc: +25, order: -5, prof: +25 },
          desc: "支持表意與配套試辦"
        },
        {
          text: "保持中立不發言，事後安撫學生幹部「大人的世界就是這樣」，叫他們隱忍。",
          effects: { crc: -10, order: 0, prof: -15 },
          desc: "消極行政中立"
        }
      ]
    },
    {
      id: 3,
      bloom: "應用 (Applying) - 實務生活規約",
      title: "冷風中的校外外套",
      icon: "🧥",
      inquiry: "女學生因生理期怕冷，在校服外加穿了自己的禦寒外套被記點，哭著求助，您如何處置？",
      description: "寒流來襲，小明因生理期體寒，在校服外套外加穿個人厚外套。糾察隊以違反「校服需穿在最外側」規定記點。小明哭訴校服外套根本不保暖。教育部早已規定嚴禁因服儀限制處分學生。",
      choices: [
        {
          text: "安撫她，但勸導「校規雖不盡人意，但為了班級秩序分，在校內還是先忍耐脫掉吧」。",
          effects: { crc: -20, order: +15, prof: -10 },
          desc: "勸導屈從校規"
        },
        {
          text: "氣憤地衝去學務處指責糾察教官違反教育部『低溫得自由添加校外防寒衣物』規定，引發辦公室爭吵。",
          effects: { crc: +15, order: -15, prof: +10 },
          desc: "直接衝突交涉"
        },
        {
          text: "給予暖暖包，並引用教育部函釋協助學生向學務處申請銷點，同時在校務會議提案修改服儀裁罰細則。",
          effects: { crc: +20, order: +5, prof: +25 },
          desc: "依法銷點與提案修正"
        }
      ]
    },
    {
      id: 4,
      bloom: "分析 (Analyzing) - 權利衝突解構",
      title: "家長要求查閱輔導紀錄",
      icon: "📝",
      inquiry: "家長懷疑孩子交友，強烈要求提供學生的輔導諮商紀錄，甚至威脅投訴局長信箱，您如何抉擇？",
      description: "班上小華近日情緒低落，在輔導室吐露家庭關係緊張與個人隱私。家長得知後要求導師調出諮商紀錄。小華強烈反對表示這會毀了親子關係。CRC 第 16 條保障兒童隱私權不受不法侵害。",
      choices: [
        {
          text: "擔心家長投訴影響學校評鑑，要求輔導室複印紀錄給家長，並表示家長有監護權理所當然。",
          effects: { crc: -30, order: +15, prof: -20 },
          desc: "提供輔導紀錄"
        },
        {
          text: "拒絕提供，表示輔導保密協定與學生隱私權高於監護權；主動邀請家長到校，在不洩漏隱私下進行親子溝通諮商。",
          effects: { crc: +25, order: -5, prof: +25 },
          desc: "捍衛隱私並協調親職"
        },
        {
          text: "告知家長「導師無權調閱，這是輔導室的事」，讓家長直接去吵輔導主任。",
          effects: { crc: -10, order: -10, prof: -15 },
          desc: "推拖互踢皮球"
        }
      ]
    },
    {
      id: 5,
      bloom: "評估 (Evaluating) - 規章體檢與平等",
      title: "後段班的校外教學限制",
      icon: "🚌",
      inquiry: "學務處為提升升學率提議「成績落後班級留在學校自習，取消校外教學」，您要如何表態？",
      description: "期末考前，學務處為提振後段班學力，提議成績落後的三個班級留校自習，不參加本次校外教學。你身為其中一個班級的導師。CRC 第 2 條禁止歧視，第 31 條保障遊戲與休閒權。",
      choices: [
        {
          text: "支持學務處，認為集中火力衝刺功課是為學生長遠前途著想，體諒行政用心。",
          effects: { crc: -25, order: +20, prof: -15 },
          desc: "支持留校衝刺成績"
        },
        {
          text: "強力反對，在學務會議評估此政策違反 CRC 的非歧視原則與受教權平等，侵害學生休息權，主張全體享有同等權利。",
          effects: { crc: +25, order: -10, prof: +20 },
          desc: "批判歧視捍衛平等"
        },
        {
          text: "提議讓落後班級的學生自行決定「自願留校」或「參加教學」，不強制要求。",
          effects: { crc: +10, order: -5, prof: +10 },
          desc: "彈性自願投票"
        }
      ]
    },
    {
      id: 6,
      bloom: "創造 (Creating) - 實踐共創方案",
      title: "新學期的班規訂定",
      icon: "🤝",
      inquiry: "新學期開始，為建立班級常規並實踐 CRC 的表意與參與，您決定如何制定班規？",
      description: "你是七年級新班級導師。開學首週要確立常規。這是一個從零開始共創民主校園的機會。CRC 第 12 條強調學生的意見應獲得成熟的看待與實施。",
      choices: [
        {
          text: "由導師親自草擬 20 條詳細的『生活公約與罰則』，開學第一天直接貼在布告欄，建立威信。",
          effects: { crc: -20, order: +25, prof: -10 },
          desc: "導師制定發布"
        },
        {
          text: "召開班會，分組讓學生討論『理想的教室環境』，引導其針對手機保管、發言等議題共創規範，並全員簽署契約。",
          effects: { crc: +25, order: +10, prof: +25 },
          desc: "引導學生民主共創"
        },
        {
          text: "完全不設限，告訴學生『我的班級完全自由』，沒有班規，一切由學生當下心情決定。",
          effects: { crc: +10, order: -35, prof: -25 },
          desc: "無規則自由放任"
        }
      ]
    }
  ];

  // DOM Elements
  const ui = {
    crcVal: document.getElementById('stat-crc-val'),
    crcBar: document.getElementById('stat-crc-bar'),
    orderVal: document.getElementById('stat-order-val'),
    orderBar: document.getElementById('stat-order-bar'),
    profVal: document.getElementById('stat-prof-val'),
    profBar: document.getElementById('stat-prof-bar'),
    bloomTag: document.getElementById('bloom-tag'),
    caseCounter: document.getElementById('case-counter'),
    title: document.getElementById('scenario-title'),
    icon: document.getElementById('scenario-icon'),
    inquiry: document.getElementById('inquiry-text'),
    desc: document.getElementById('scenario-description'),
    choices: document.getElementById('choices-container'),
    feed: document.getElementById('feed-list'),
    feedCount: document.getElementById('decision-count'),
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
   * Clamp values between 0 and 100
   */
  function clamp(val) {
    return Math.max(0, Math.min(100, val));
  }

  /**
   * Update HUD Statistics
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
   * Load Case Content
   */
  function loadCase(index) {
    if (index >= cases.length) {
      endGame();
      return;
    }

    const c = cases[index];
    ui.bloomTag.textContent = c.bloom;
    ui.caseCounter.textContent = `Case ${index + 1} / ${cases.length}`;
    ui.title.textContent = c.title;
    ui.icon.textContent = c.icon;
    ui.inquiry.textContent = c.inquiry;
    ui.desc.textContent = c.description;

    // Clear and build choices buttons
    ui.choices.innerHTML = '';
    c.choices.forEach((choice, choiceIdx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.setAttribute('data-prefix', `選項 ${String.fromCharCode(65 + choiceIdx)}`);
      btn.textContent = choice.text;
      
      btn.addEventListener('click', () => makeDecision(index, choice));
      ui.choices.appendChild(btn);
    });
  }

  /**
   * Handle Decision Event
   */
  function makeDecision(caseIdx, choice) {
    // 1. Update stats
    state.stats.crc = clamp(state.stats.crc + choice.effects.crc);
    state.stats.order = clamp(state.stats.order + choice.effects.order);
    state.stats.prof = clamp(state.stats.prof + choice.effects.prof);
    
    // Update UI Stats
    updateHUD();

    // 2. Append to log feed on the right
    if (state.choicesHistory.length === 0) {
      ui.feed.innerHTML = ''; // Clear template
    }

    const c = cases[caseIdx];
    const logItem = document.createElement('div');
    logItem.className = 'feed-item glass';
    logItem.innerHTML = `
      <div class="feed-item-title">${c.title}</div>
      <div class="feed-item-desc">選擇：${choice.desc}</div>
      <div style="display:flex; gap: 8px; margin-top:5px; font-size:0.75rem;">
        <span style="color:var(--accent-cyan)">CRC ${choice.effects.crc >= 0 ? '+' : ''}${choice.effects.crc}</span>
        <span style="color:var(--accent-purple)">秩序 ${choice.effects.order >= 0 ? '+' : ''}${choice.effects.order}</span>
        <span style="color:var(--accent-pink)">專業 ${choice.effects.prof >= 0 ? '+' : ''}${choice.effects.prof}</span>
      </div>
    `;
    ui.feed.appendChild(logItem);
    
    // Scroll feed to bottom
    ui.feed.scrollTop = ui.feed.scrollHeight;

    // Save choice metadata
    state.choicesHistory.push({
      caseTitle: c.title,
      chosenDesc: choice.desc
    });

    ui.feedCount.textContent = `${state.choicesHistory.length} 已解`;

    // 3. Move to next case
    state.currentCase++;
    loadCase(state.currentCase);
  }

  /**
   * Calculate final persona based on scores
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
        desc: "您是一位穩健、中庸的教育工作者。在處理人權與秩序的衝突時，您多能理性因應，不走極端。您願意聽取學生的意見，也能適度維持常規。如果您能再深入了解各項教育行政指導函釋，並更有意識地在日常班務中創造讓學生共創班規、自主決策的機會，您將能更好地釋放學生的主體性潛能！"
      };
    }
  }

  /**
   * End Game and open Modal
   */
  function endGame() {
    const finalPersona = determinePersona(state.stats.crc, state.stats.order, state.stats.prof);
    
    ui.personaTitle.textContent = finalPersona.title;
    ui.personaDesc.textContent = finalPersona.desc;
    
    ui.resCrc.textContent = `${state.stats.crc}%`;
    ui.resOrder.textContent = `${state.stats.order}%`;
    ui.resProf.textContent = `${state.stats.prof}%`;
    
    ui.endModal.classList.add('open');
  }

  /**
   * Submit game results to Google Sheets
   */
  ui.btnSubmit.addEventListener('click', async (e) => {
    e.preventDefault();

    const name = ui.playerName.value.trim();
    const sid = ui.playerId.value.trim();

    if (!name || !sid) {
      showStatus(ui.uploadStatus, '⚠️ 請填寫姓名與學長(號)！', 'error');
      return;
    }

    showStatus(ui.uploadStatus, '⏳ 傳送至 Google Sheet 中...', 'loading');
    ui.btnSubmit.disabled = true;

    // Build ChoicePath string
    const choicePathString = state.choicesHistory.map((h, i) => `C${i+1}:${h.chosenDesc}`).join(' -> ');

    const payload = {
      PlayerName: name,
      StudentID: sid,
      CRC_Score: state.stats.crc,
      Order_Score: state.stats.order,
      Professional_Score: state.stats.prof,
      Persona: ui.personaTitle.textContent,
      ChoicePath: choicePathString
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

  // Restart Button Game Reset
  ui.btnRestart.addEventListener('click', () => {
    state.currentCase = 0;
    state.stats.crc = 50;
    state.stats.order = 50;
    state.stats.prof = 50;
    state.choicesHistory = [];
    
    ui.playerName.value = '';
    ui.playerId.value = '';
    ui.btnSubmit.disabled = false;
    ui.uploadStatus.className = 'status-message';
    ui.uploadStatus.textContent = '';
    
    ui.feedCount.textContent = "0 已解";
    ui.feed.innerHTML = `
      <div class="feed-item" style="border: 1px dashed var(--glass-border); text-align: center; color: var(--text-muted); padding: 40px 10px;">
        暫無決策紀錄。請在左側做出您的第一個學務決策！
      </div>
    `;

    updateHUD();
    ui.endModal.classList.remove('open');
    loadCase(0);
  });

  // Initialize Game
  updateHUD();
  loadCase(0);
});
