import { images, videos } from './media-manifest.js?v=15'
import { fullNodes, earlyProgress } from './full-story.js?v=15'

const evidence = {
  oldClip: { id: 'old-clip', title: '5月论坛旧片', boundary: '片子能证明第1期实习确实发过工资，沈舟也确实参加过当时的讲座。它不能证明后来的第2期实习招募真实存在，更不能证明研究院授权了检测委托。' },
  signup: { id: 'signup-page', title: '第2期实习报名页', boundary: '页面上留着2800元名额费、截止倒计时和收款户名。但岗位是否存在、企业是否授权，还要从独立渠道核实。' },
  contract: { id: 'research-contract', title: '外协合同与回执', boundary: '学校确实走了付款流程，星桥也确实收了钱。可订单号那一栏仍是空的，研究院还没有开口。' },
  emptyBox: { id: 'empty-box', title: '未启封采样盒', boundary: '盒子到了，样品还在宋老师手里。送盒子的人是谁、替谁来，镜头没有拍清。' }
}

function scene(id, heading, speaker, text, mediaKey, next, extra) {
  const hasVideo = Boolean(videos[mediaKey])
  return Object.assign({
    id, kind: 'scene', heading, speaker, text,
    media: { type: hasVideo ? 'video' : 'image', src: hasVideo ? videos[mediaKey] : images[mediaKey], poster: images[mediaKey], alt: `${heading}剧情画面` },
    audioId: id, next
  }, extra || {})
}

function card(id, heading, speaker, text, mediaKey, next, extra) {
  return Object.assign({
    id, kind: 'card', heading, speaker, text,
    media: { type: 'image', src: images[mediaKey], alt: `${heading}证据卡` },
    audioId: id, next
  }, extra || {})
}

const nodes = {
  a01: scene('a01', '第1幕｜旧片的新名字', '林知夏（内心）', '导出进度停在87%。我正要重启软件，手机在桌边亮了一下。陌生新生发来的封面，正是我4个月前剪过的那条片子。', 'lin', 'a01b', { chapter: 1, time: '9月23日上午', place: '校园媒体办公室', source: '现场', progress: 3, orientation: { kicker: '案件起点｜9月23日上午', route: '你的旧片 → 新生正在打开的付款页', goal: '先确认旧片被怎样改名，再判断是否需要立即提醒停付' }, nextLabel: '查看陌生私信' }),
  a01b: card('a01b', '1条陌生私信', '林知夏（内心）', '头像没见过。对方发来的封面，我却一眼认出——那是我5月拍的片子，只是标题变了。', 'linPhoneNatural', 'a02', { source: '玩家所见', progress: 5 }),
  a02: scene('a02', '新生的私信', '梁一舟（私信）', '学姐，能帮我看看是真的吗？他们说今晚零点锁本批名额，校友推荐价2800元。', 'liang', 'a02b', { chapter: 1, time: '9月23日上午', place: '新生宿舍', source: '聊天记录', progress: 7, media: { type: 'chat', title: '梁一舟', subtitle: '对方正在输入…', time: '09:41', messages: [
    { side: 'received', name: '梁一舟', avatar: '梁', text: '学姐，你帮我看一眼，这个靠谱吗？' },
    { side: 'received', name: '梁一舟', avatar: '梁', text: '群里说今晚0点就锁名额，校友推荐价2800元。' },
    { side: 'received', name: '梁一舟', avatar: '梁', attachment: { title: '第2期实习报名页', note: '链接卡片｜请先核验来源' } }
  ] } }),
  a02b: card('a02b', '付款按钮前', '梁一舟（语音转写）', '我已经填到最后一步了。室友说名额过点就没，可我越看越觉得哪里不对。', 'liangDeadline', 'a03', { source: '当事人发送', progress: 9, media: { type: 'chat', title: '梁一舟', subtitle: '聊天记录', time: '09:43', messages: [
    { side: 'received', name: '梁一舟', avatar: '梁', text: '我都填到付款这一步了。' },
    { side: 'received', name: '梁一舟', avatar: '梁', text: '室友催我快点，说过了今晚就没名额……可我越看越不踏实。' },
    { side: 'sent', name: '林知夏', avatar: '林', text: '先别付。把报名页从头到尾录一遍发我。' }
  ] } }),
  a03: card('a03', '旧片被改成“第2期实习实录”', '报名群界面', '我翻回群公告才理清两件事：第1期实习是春季举办的免费线下项目，有学生真正到岗，也收到了恒微科技发放的工资。第2期实习招募是6月以后才出现的收费项目，要先交2800元名额费。现在，群里把第1期实习的旧片改名后放在第2期实习付款页旁边，却没有说明新项目是否仍由原企业授权。', 'fee', 'a04', { source: '屏幕证据', progress: 11, onEnter: { evidence: [evidence.signup] }, media: { type: 'chat', title: '2026新生互助群（87）', subtitle: '群聊', time: '09:36', system: '周衡修改了群公告', messages: [
    { side: 'received', name: '周衡', avatar: '周', text: '第2期实习早鸟批次今晚24:00截止。还没登记的同学尽快。' },
    { side: 'received', name: '周衡', avatar: '周', attachment: { title: '第2期实习学员实录', note: '视频｜5月旧片重新命名' } },
    { side: 'received', name: '梁一舟', avatar: '梁', text: '这就是林学姐5月拍的那条吗？' }
  ] } }),
  a04: scene('a04', '梁一舟的求证', '梁一舟', '我不是信这张广告图，我是信你当时拍到的工资。群里还转了沈舟学长的宣讲视频——就是5月论坛里回答技术问题的那位校友。那次出镜，也是他本人吧？', 'liang', 'a05', { progress: 12 }),
  a05: scene('a05', '暂缓付款', '林知夏（回复）', '片子是我拍的。先别付钱，把报名页从头到尾录下来，给我几个小时。', 'lin', 'a06', { source: '聊天记录', progress: 14 }),
  a06: card('a06', '证据边界｜旧经历不能替新项目作保', '林知夏（内心）', '镜头里的工资和讲座都是真的，但它们只能证明第1期实习发生过。第2期实习招募是一个新的收费项目；在企业确认之前，旧片不能替它证明岗位和授权真实存在。', 'compare', 'q01', { source: '证据比对', progress: 17, onEnter: { evidence: [evidence.oldClip] } }),
  q01: {
    id: 'q01', kind: 'choice', questionId: 'Q01', heading: 'Q01｜旧片的新名字', speaker: '调查选择',
    text: '梁一舟说，第2期实习的“早鸟批次”今晚零点截止。我手里的旧片只能证明第1期实习发过工资，现在应该怎么做？',
    media: { type: 'image', src: images.compare, alt: '第1期实习工资与讲座的证据边界' }, progress: 20,
    options: [
      { letter: 'A', text: '立即发布“第2期实习招募尚未核实，请暂停付款”，同时注明旧片只记录第1期实习，并向学校报告', next: 'b1a', effects: { flags: { PREWARN: 1 } } },
      { letter: 'B', text: '先让梁保存完整报名页与宣讲视频，取得第一份原始证据后再回应', next: 'b1b', effects: { flags: { PREWARN: 0 } } }
    ]
  },
  b1a: card('b1a', 'Q01 A｜先预警，再核实', '操作记录', '临时提醒已发布；旧片已注明“本片仅记录第1期实习”；材料已报送校方。梁一舟回复了退出付款页的截图。', 'warn', 'b1a2', { source: '处置反馈', progress: 23 }),
  b1a2: card('b1a2', '群内回应', '周衡', '媒体博眼球而已。', 'group', 'b1a3', { progress: 25 }),
  b1a3: card('b1a3', '选择结果｜梁一舟暂停付款', '林知夏（内心）', '梁一舟暂时安全了，但收费页仍在群里传播。就在这时，宋岚老师来电，也问起片中的“沈舟”。同一条旧片，正把我带向另一笔更大的钱。', 'safe1', 'c01', { source: '选择结果', progress: 28, nextLabel: '接听宋老师来电' }),
  b1b: card('b1b', '选择结果｜证据已保存，倒计时仍在走', '取证记录', '完整报名页、宣讲视频和收款户名已经保存。梁一舟暂时没有付款。录屏刚结束，宋岚老师来电，也问起片中的“沈舟”——这次牵涉的金额是13.8万元。', 'wait1', 'c01', { source: '处置反馈', progress: 28, nextLabel: '接听宋老师来电' }),

  c01: scene('c01', '第2幕｜13.8万元的“加急通道”', '宋岚（电话）', '知夏，你5月论坛的原片还留着吗？我通过“沈舟”办了一笔13.8万元的加急检测，已经付了9.42万元，但正式订单和取样单还没到。你把沈舟上台前后的原片带来，我想先确认视频里的人。', 'transitionLab', 'c02', { chapter: 2, time: '9月23日下午', place: '前往材料实验室', source: '来电', progress: 32, orientation: { kicker: '转场｜4小时后', route: '校园媒体办公室 → 材料实验室', goal: '先理清宋老师为什么信任沈舟，再核对13.8万元合同、已付款项和缺失的手续' }, nextLabel: '进入实验室' }),
  c02: scene('c02', '论文返修和职称申报撞在了一起', '宋岚', '论文已经过初审，审稿人要求我补一组关键材料检测数据，9月25日前必须交回返修稿。教授职称申报也在9月底截止，这篇论文是我的重要成果。正规预约排不上，沈舟才提出通过星桥走“合作加急通道”。', 'song', 'c02b', { source: '当面陈述', progress: 35 }),
  c02b: card('c02b', '桌上的2张回执', '林知夏（现场记录）', '我把2张回执摊开：学校财务先向星桥的合同账户支付7.56万元；后来对方又以“锁定机时”为由，让宋老师个人垫付1.86万元。合计已付9.42万元，但样品还在她手里，正式订单、取样单和研究院编号都没有出现。', 'songReceipts', 'c03', { source: '玩家所见', progress: 37 }),
  c03: scene('c03', '影像回放｜5月18日校园讲座', '宋岚（看着原片）', '“就是这里。他没有回避误差控制，还把计算步骤写了出来。会后那张分析图，也确实帮我排除过一次实验偏差。”这段是5月留下的同期录像。', 'lecture', 'c04', { time: '5月18日', place: '校园讲座', source: '原始视频', progress: 39, presentation: { type: 'playback', icon: '▶', label: '原片回放', note: '5月18日同期录像，可核对真实发生过的讲座', cue: true, cueTitle: '播放5月原片', cueSubtitle: '5月18日 · 校园讲座 · 同期录像' }, nextLabel: '听宋岚回忆后续联系' }),
  c04: scene('c04', '回忆重现｜9月上旬的承诺', '沈舟（宋岚回忆中的来电）', '宋老师，研究院的正规对公流程至少要2周，赶不上你9月25日的返修。星桥和院里有合作加急通道，综合机时和数据处理总共13.8万元，保证9月25日前交全部数据。', 'shencall', 'c05', { time: '9月上旬', place: '视频来电', source: '根据宋岚证言重现', progress: 42, presentation: { type: 'flashback', icon: '↶', label: '回忆重现', note: '根据宋岚证言重现，并非当时保存的同期录像', cue: true, cueTitle: '进入宋岚的回忆', cueSubtitle: '时间切换至9月上旬 · 以下为证言重现，并非同期录像' }, nextLabel: '回到现在核对付款回执' }),
  c05: card('c05', '回到现在｜核对对公首款', '付款回执', '9月12日，学校财务根据星桥的合同，向对公账户支付了7.56万元首款。合同、公章和收款户名都能对上，但“研究院订单号”一栏是空的，附件中也没有研究院出具的委托或授权。', 'money', 'c06', { source: '屏幕证据', progress: 46, presentation: { type: 'record', icon: '▤', label: '现实证据', note: '已退出回忆，正在核对现场取得的付款材料' }, onEnter: { evidence: [evidence.contract] }, nextLabel: '继续听9月22日的经过' }),
  c06: scene('c06', '再次进入回忆｜9月22日傍晚', '沈舟（宋岚回忆中的来电）', '机时今晚就锁定。你先个人垫付1.86万元机时保留费，就能保住这个位置。这笔钱会计入13.8万元合同款，后面补发票，交数据时只需再付4.38万元。', 'shencall', 'c07', { time: '9月22日傍晚', place: '视频来电', source: '根据宋岚证言重现', progress: 49, presentation: { type: 'flashback', icon: '↶', label: '回忆重现', note: '宋岚复述1.86万元个人垫付的催缴过程，并非同期录像', cue: true, cueTitle: '再次进入回忆', cueSubtitle: '时间切换至9月22日傍晚 · 1.86万元个人垫付催缴' }, nextLabel: '切换到当晚门禁监控' }),
  c07: scene('c07', '回到现实证据｜门禁监控', '门禁监控回放', '画面时间码显示9月22日21:17：1名戴青蓝头盔的跑腿员把泡沫箱放在实验楼门口。镜头没有拍到他出示取样单。', 'runner', 'c07b', { time: '9月22日21:17', place: '实验楼门口', source: '门禁监控原始记录', progress: 52, presentation: { type: 'playback', icon: '▶', label: '监控回放', note: '已退出回忆，正在查看带时间码的门禁记录', cue: true }, onEnter: { evidence: [evidence.emptyBox] }, nextLabel: '检查送达的采样盒' }),
  c07b: card('c07b', '箱盖没有封签', '宋岚', '“1.86万元机时保留费是我个人垫付的，我本来打算拿发票去补报。可对方只送来一个空采样箱，箱盖没有封签，也没有正式取样单。所以我没让他带走样品。”', 'runnerBox', 'c08', { source: '物证与证言', progress: 54 }),
  c08: scene('c08', '样品还在，事情还有补救空间', '宋岚', '正式取样单没到，样品不能交。只要样品和原始数据还在，我就还能申请返修延期，重新安排正规检测。', 'runner', 'c09', { progress: 55 }),
  c09: scene('c09', '宋岚的证言', '宋岚', '他懂实验，这点我没看错。我错的是把“懂”当成了“能替研究院安排”。我见过他本人，视频里也确实是那张脸。', 'song', 'c10', { progress: 59 }),
  c10: scene('c10', '影像回放｜取样确认视频', '视频里的沈舟', '对公排队两周，星桥先锁位。正式取样单明天到，让门口师傅把样品带走。', 'shencall', 'c11', { source: '已保存的取样确认视频', progress: 62, presentation: { type: 'playback', icon: '▶', label: '视频回放', note: '这是已保存的视频材料，不是正在发生的通话', cue: true, cueTitle: '播放取样确认视频', cueSubtitle: '已保存材料 · 注意区分画面中的脸与真实权限' }, nextLabel: '核对账目与缺失材料' }),
  c11: card('c11', '账目对照', '核对结果', '13.8万元合同中，学校已支付7.56万元，宋老师个人又垫付1.86万元，合计已付9.42万元，对方正在催收剩余的4.38万元。金额可以互相勾连，但研究院订单号、正式取样单和可核验的配送记录仍然不存在。', 'money2', 'q02', { source: '证据比对', progress: 66 }),
  q02: {
    id: 'q02', kind: 'choice', questionId: 'Q02', heading: 'Q02｜13.8万元的“加急通道”', speaker: '调查选择',
    text: '宋老师已付9.42万元，对方正在催缴剩余的4.38万元。正式订单、取样单和研究院授权至今都没有出现，我应该建议她先做什么？',
    media: { type: 'image', src: images.money2, alt: '科研合同付款金额对照' }, progress: 70,
    options: [
      { letter: 'A', text: '保存视频与全部回执，从研究院官网独立核验，并立即联系银行、学校科研办与警方，咨询止付与样品保全', next: 'b2a', effects: { flags: { EARLY: 1 } } },
      { letter: 'B', text: '限时要求沈舟补正式订单、取样单和配送轨迹，同时准备独立核验', next: 'b2b', effects: { flags: { EARLY: 0 } } }
    ]
  },
  b2a: card('b2a', 'Q02 A｜独立核验与止损', '操作记录', '视频与回执已保存。官网电话正在接通，银行和科研办的处置编号分别记入证据册；未交出的样品仍在实验室。', 'verifyOfficial', 'b2a2', { source: '处置反馈', progress: 76 }),
  b2a2: scene('b2a2', '主动说明，争取补救', '宋岚', '先把样品保住。我需要的是能追溯的检测结果，不是谁的一句保证。论文我会申请延期，1.86万元个人垫付款和整个签约经过，我现在就去向科研办说明。', 'song', 'b2a3', { progress: 81 }),
  b2a3: card('b2a3', '选择结果｜样品保住，资金等待核查', '处置记录', '止付申请已提交；资金能否追回仍待银行核查。宋岚留下样品和回执。第二天上午，我把她请到活动室，与另外2位见过“沈舟”的当事人分别核对记忆。', 'preserve', 'q03intro', { source: '选择结果', progress: 19, nextLabel: '前往3人座谈' }),
  b2b: card('b2b', 'Q02 B｜要求补全材料', '林知夏（现场记录）', '临时取样单发来了。我和宋老师同时看向编号栏——空白。她没再回复私聊，转而拨通官网电话。', 'wait2', 'b2b2', { source: '玩家所见', progress: 19 }),
  b2b2: card('b2b2', '选择结果｜多了一份承诺，也多等了数小时', '处置时间线', '新取样单仍没有院方编号，宋岚终于改拨官网电话。第二天上午，我把她请到活动室，与另外2位见过“沈舟”的当事人分别核对记忆。', 'wait2', 'q03intro', { source: '选择结果', progress: 20, nextLabel: '前往3人座谈' }),
  ...fullNodes
}

Object.entries(earlyProgress).forEach(([id, progress]) => {
  if (nodes[id]) nodes[id].progress = progress
})

const story = {
  id: 'we-know-him-final',
  title: '我们都认识他',
  subtitle: '校园反诈互动推理游戏',
  startId: 'intro01',
  nodes,
  questionCount: 12,
  implementedQuestionCount: 12
}

export default story
