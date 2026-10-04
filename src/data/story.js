import { images, videos } from './media-manifest.js?v=9'
import { fullNodes, earlyProgress } from './full-story.js?v=9'

const evidence = {
  oldClip: { id: 'old-clip', title: '五月旧片', boundary: '能证明一期发过工资、沈舟本人参加过讲座；不能证明二期有岗位或科研检测获授权。' },
  signup: { id: 'signup-page', title: '二期报名页', boundary: '能证明收费话术、金额和收款户名；不能证明岗位一定兑现。' },
  contract: { id: 'research-contract', title: '外协合同与回执', boundary: '能证明星桥收款及学校付款流程；不能证明研究院存在订单或星桥有检测资质。' },
  emptyBox: { id: 'empty-box', title: '未启封采样盒', boundary: '能证明有人试图推进取样流程；不能单独证明跑腿员身份和法律责任。' }
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
  a01: scene('a01', '第一幕｜旧片的新名字', '林知夏（内心）', '导出进度停在87%。我正要重启软件，手机在桌边亮了一下。', 'lin', 'a01b', { chapter: 1, time: '9月23日上午', place: '校园媒体办公室', source: '现场', progress: 3 }),
  a01b: card('a01b', '一条陌生私信', '林知夏（内心）', '头像没见过。对方发来的封面，我却一眼认出——那是我五月拍的片子，只是标题变了。', 'linPhoneNatural', 'a02', { source: '玩家所见', progress: 5 }),
  a02: scene('a02', '新生的私信', '梁一舟（私信）', '学姐，能帮我看看是真的吗？他们说今晚零点锁本批名额，校友推荐价两千八。', 'liang', 'a02b', { chapter: 1, time: '9月23日上午', place: '新生宿舍', source: '聊天记录', progress: 7, media: { type: 'chat', title: '梁一舟', subtitle: '对方正在输入…', time: '09:41', messages: [
    { side: 'received', name: '梁一舟', avatar: '梁', text: '学姐，能帮我看看是真的吗？' },
    { side: 'received', name: '梁一舟', avatar: '梁', text: '他们说今晚零点锁本批名额，校友推荐价2800。' },
    { side: 'received', name: '梁一舟', avatar: '梁', attachment: { title: '二期报名页', note: '链接卡片｜请先核验来源' } }
  ] } }),
  a02b: card('a02b', '付款按钮前', '梁一舟（语音转写）', '我已经填到最后一步了。室友说名额过点就没，可我越看越觉得哪里不对。', 'liangDeadline', 'a03', { source: '当事人发送', progress: 9, media: { type: 'chat', title: '梁一舟', subtitle: '聊天记录', time: '09:43', messages: [
    { side: 'received', name: '梁一舟', avatar: '梁', text: '我已经填到最后一步了。' },
    { side: 'received', name: '梁一舟', avatar: '梁', text: '室友说名额过点就没，可我越看越觉得哪里不对。' },
    { side: 'sent', name: '林知夏', avatar: '林', text: '先别付款。把页面从头到尾录下来发我。' }
  ] } }),
  a03: card('a03', '旧片被用于二期招募', '报名群界面', '置顶消息把五月旧片改成了“二期学员实录”。片中的工资和讲座都是真的；它旁边的新收费页，却不在原片里。', 'fee', 'a04', { source: '屏幕证据', progress: 11, onEnter: { evidence: [evidence.signup] }, media: { type: 'chat', title: '2026新生互助群（87）', subtitle: '群聊', time: '09:36', system: '周衡修改了群公告', messages: [
    { side: 'received', name: '周衡', avatar: '周', text: '二期早鸟批次今晚24:00锁定。还没登记的同学尽快。' },
    { side: 'received', name: '周衡', avatar: '周', attachment: { title: '二期学员实录', note: '视频｜五月旧片重新命名' } },
    { side: 'received', name: '梁一舟', avatar: '梁', text: '这就是林学姐五月拍的那条吗？' }
  ] } }),
  a04: scene('a04', '梁一舟的求证', '梁一舟', '我不是信这张广告图，我是信你当时拍到的工资。群里还转了沈学长的宣讲视频——那次宣讲，也是他本人吧？', 'liang', 'a05', { progress: 12 }),
  a05: scene('a05', '暂缓付款', '林知夏（回复）', '片子是我拍的。先别付钱，把报名页从头到尾录下来，给我几个小时。', 'lin', 'a06', { source: '聊天记录', progress: 14 }),
  a06: card('a06', '证据边界｜一期不等于二期', '林知夏（内心）', '镜头里没有假工资，也没有假讲座。被偷换的是时间：一期发生过，不等于二期正在发生。', 'compare', 'q01', { source: '证据比对', progress: 17, onEnter: { evidence: [evidence.oldClip] } }),
  q01: {
    id: 'q01', kind: 'choice', questionId: 'Q01', heading: 'Q01｜旧片的新名字', speaker: '调查选择',
    text: '梁一舟说今晚零点要锁定“早鸟批次”名额费。旧片只证明一期发薪，你现在怎么做？',
    media: { type: 'image', src: images.compare, alt: '一期工资与讲座证据边界' }, progress: 20,
    options: [
      { letter: 'A', text: '立即发“二期尚未核实，请暂停付款”的临时提醒，给旧片补“一期限定”说明，并报送校方', next: 'b1a', effects: { flags: { PREWARN: 1 } } },
      { letter: 'B', text: '先让梁保存完整报名页与宣讲视频，取得第一份原始证据后再回应', next: 'b1b', effects: { flags: { PREWARN: 0 } } }
    ]
  },
  b1a: card('b1a', 'Q01 A｜先预警，再核实', '操作记录', '临时提醒已发布；旧片已补“一期限定”；材料已报送校方。梁一舟回复了一张关闭付款页的截图。', 'warn', 'b1a2', { source: '处置反馈', progress: 23 }),
  b1a2: card('b1a2', '群内回应', '周衡', '媒体博眼球而已。', 'group', 'b1a3', { progress: 25 }),
  b1a3: card('b1a3', 'PREWARN = 1', '林知夏（内心）', '暂缓付款，不等于提前给任何人定罪。但我的旧片，从此不能再当作一张无条件保票。', 'safe1', 'c01', { source: '选择结果', progress: 28 }),
  b1b: card('b1b', 'Q01 B｜先保存原始证据', '取证记录', '完整报名页、宣讲视频和收款户名已经保存。梁一舟暂时没付；录屏结束时，倒计时还在继续。', 'wait1', 'c01', { source: '处置反馈', progress: 28 }),

  c01: scene('c01', '第二幕｜十三万八的快捷通道', '宋岚（电话）', '知夏，你五月论坛的原片还留着吗？沈舟上台前后那几段，也一起发我。', 'song', 'c02', { chapter: 2, time: '9月23日下午', place: '材料实验室', source: '来电', progress: 32 }),
  c02: scene('c02', '一篇论文，三重期限', '宋岚', '返修二十五号就截止，月底职称材料也要封。我已经评了三次，这次真不想再拖。可审稿人偏偏要补那组关键数据。', 'song', 'c02b', { source: '当面陈述', progress: 35 }),
  c02b: card('c02b', '桌上的两张回执', '林知夏（现场记录）', '两张回执被推到我面前，空采样盒还在宋老师手边。她压低声音：“九万多已经出去了，好在样品还没交。”', 'songReceipts', 'c03', { source: '玩家所见', progress: 37 }),
  c03: scene('c03', '回放｜五月十八日校园讲座', '宋岚（看着原片）', '“就是这里。他没有回避误差控制，还把计算步骤写了出来。会后那张分析图，也确实帮我排除过一次实验偏差。”', 'lecture', 'c04', { time: '5月18日', place: '校园讲座', source: '原始视频', progress: 39 }),
  c04: scene('c04', '回忆｜九月上旬的承诺', '沈舟', '宋老师，研究院对公流程要两周，赶不上返修。星桥的合作通道走加急——综合机时加数据处理，合同价十三万八，承诺九月二十五日前交付全套数据。', 'shencall', 'c05', { time: '9月上旬', place: '视频来电', progress: 42 }),
  c05: card('c05', '对公首款', '付款回执', '九月十二日，学校财务向合同账户支付七万五千六百元。合同、公章和对公户名都能看见；研究院订单号一栏，却始终空着。', 'money', 'c06', { source: '屏幕证据', progress: 46, onEnter: { evidence: [evidence.contract] } }),
  c06: scene('c06', '回忆｜九月二十二日傍晚', '沈舟', '机时今晚锁定。锁位押金一万八千六，今晚不交，位子就让给下一家。交付时抵入尾款，发票来了冲抵。', 'shencall', 'c07', { time: '9月22日傍晚', place: '视频来电｜游戏内演示', progress: 49 }),
  c07: scene('c07', '空采样盒送达', '门禁监控回放', '九月二十二日21点17分，一名戴青蓝头盔的跑腿员把泡沫箱放在实验楼门口。镜头没有拍到他出示取样单。', 'runner', 'c07b', { time: '9月22日晚', place: '实验楼门口', source: '监控回放', progress: 52, onEnter: { evidence: [evidence.emptyBox] } }),
  c07b: card('c07b', '箱盖没有封签', '宋岚', '“押金是我自己垫的，这笔钱得去补报。可送来的只有箱子，正式取样单一张都没有，所以我没让他带走样品。”', 'runnerBox', 'c08', { source: '物证与证言', progress: 54 }),
  c08: scene('c08', '尚未交样', '宋岚', '正式取样单没到，样品不能交。', 'runner', 'c09', { progress: 55 }),
  c09: scene('c09', '宋岚的证言', '宋岚', '他懂实验，这点我没看错。我错的是把“懂”当成了“能替研究院安排”。我见过他本人，视频里也确实是那张脸。', 'song', 'c10', { progress: 59 }),
  c10: scene('c10', '取样视频回放｜游戏内演示', '沈舟', '对公排队两周，星桥先锁位。正式取样单明天到，让门口师傅把样品带走。', 'shencall', 'c11', { progress: 62 }),
  c11: card('c11', '账目对照', '核对结果', '合同总价十三万八，已付九万四千二，待付四万三千八百。付款数字能互相对应；研究院订单号、正式取样单和配送轨迹仍为空。', 'money2', 'q02', { source: '证据比对', progress: 66 }),
  q02: {
    id: 'q02', kind: 'choice', questionId: 'Q02', heading: 'Q02｜十三万八的快捷通道', speaker: '调查选择',
    text: '宋岚已付9.42万元，尾款4.38万正在被催缴。正式订单至今未出现，你建议她先做什么？',
    media: { type: 'image', src: images.money2, alt: '科研合同付款金额对照' }, progress: 70,
    options: [
      { letter: 'A', text: '保存视频与全部回执，从研究院官网独立核验，并立即联系银行、学校科研办与警方，咨询止付与样品保全', next: 'b2a', effects: { flags: { EARLY: 1 } } },
      { letter: 'B', text: '限时要求沈舟补正式订单、取样单和配送轨迹，同时准备独立核验', next: 'b2b', effects: { flags: { EARLY: 0 } } }
    ]
  },
  b2a: card('b2a', 'Q02 A｜独立核验与止损', '操作记录', '视频与回执已保存。官网电话正在接通，银行和科研办的处置编号分别记入证据册；未交出的样品仍在实验室。', 'verifyOfficial', 'b2a2', { source: '处置反馈', progress: 76 }),
  b2a2: scene('b2a2', '主动说明，争取补救', '宋岚', '先把样品保住。我需要的是能追溯的检测结果，不是谁一句保证。押金怎么付的，我去科研办说明。', 'song', 'b2a3', { progress: 81 }),
  b2a3: card('b2a3', 'EARLY = 1', '处置记录', '止付申请已提交；资金能否追回仍待银行核查。样品未离开实验室，外来数据也没有进入论文。', 'preserve', 'q03intro', { source: '选择结果', progress: 19 }),
  b2b: card('b2b', 'Q02 B｜要求补全材料', '林知夏（现场记录）', '临时取样单发来了。我和宋老师同时看向编号栏——空白。她没再回复私聊，转而拨通官网电话。', 'wait2', 'b2b2', { source: '玩家所见', progress: 19 }),
  b2b2: card('b2b2', 'EARLY = 0', '处置时间线', '独立核验比另一条路线晚了数小时。新增的是一份无院方编号的承诺；资金追回仍待银行和警方核查。', 'wait2', 'q03intro', { source: '选择结果', progress: 20 }),
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
