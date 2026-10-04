import { images, videos } from './media-manifest.js?v=8'

const evidence = {
  testimony: { id: 'testimony-board', title: '三份证言', boundary: '能证明三人分别接触过真实的工资、真人和技术建议；不能证明三条承诺来自同一权限身份。' },
  fullLetter: { id: 'full-letter', title: '完整一期合作函', boundary: '能证明合作期只到五月；不能单独证明二期收费由谁组织。' },
  consentText: { id: 'consent-text', title: '打码文风样本', boundary: '能提示账号可能由多人使用；不能凭文风直接认定具体操作者。' },
  registry: { id: 'company-registry', title: '公司公示与机构核验', boundary: '能说明公示范围、订单与授权均不匹配；不能替代警方对资金和人员责任的调查。' },
  boxMatch: { id: 'box-match', title: '缺角反光条对照', boundary: '能提示同一跑腿链连接三处；不能单独证明姓名、账号操作者或法律责任。' },
  refund: { id: 'refund-list', title: '退款清单与双账户', boundary: '能看出公司款与个人借款分属两条通道；不能据此确认全部资金终点。' },
  fakeVideo: { id: 'fake-video', title: '原片与冒名视频', boundary: '能证明林知夏从未说过完整推荐语；内部机位只提示素材来源，不能直接点名制作者。' },
  replies: { id: 'official-replies', title: '三方具名答复', boundary: '分别限定企业、研究院和学校的授权边界；不对个人罪责作结论。' },
  consent: { id: 'consent-matrix', title: '公开授权清单', boundary: '明确哪些材料可公开、哪些仅可交银行、学校或警方。' }
}

function media(key, type = 'image') {
  const src = type === 'video' ? videos[key] : images[key]
  return { type, src, poster: images[key], alt: '剧情画面' }
}

function scene(id, heading, speaker, text, key, next, extra = {}) {
  const type = videos[key] ? 'video' : 'image'
  return { id, kind: 'scene', heading, speaker, text, media: media(key, type), audioId: id, next, ...extra }
}

function card(id, heading, speaker, text, key, next, extra = {}) {
  return { id, kind: 'card', heading, speaker, text, media: media(key), audioId: id, next, ...extra }
}

function question(id, questionId, heading, text, key, progress, options) {
  return { id, kind: 'choice', questionId, heading, speaker: '调查选择', text, media: media(key), progress, options }
}

function ending(id, title, text, education) {
  return { id, kind: 'ending', endingId: id.toUpperCase(), heading: title, speaker: '本轮结局', text, education, media: media('end'), progress: 100 }
}

export const fullNodes = {
  intro01: card('intro01', '调查档案｜你的身份', '林知夏，校园媒体学生', '你曾剪过一条五月校园论坛短片。四个月后，这条由真实工资、真实讲座和真实人物组成的旧片，被重新用来替新的收费项目背书。你要核清它现在证明什么，又不能证明什么。', 'lin', 'intro02', { kind: 'intro', source: '无剧透背景', progress: 0 }),
  intro02: card('intro02', '已知背景｜三类风险', '调查提示', '本案涉及实习收费、科研外协、私人借款与AI冒名视频。它们起初看起来互不相干。你将通过当事人证言、原始文件和官方渠道判断它们是否存在联系。', 'castReference', 'intro03', { kind: 'intro', source: '无剧透背景', progress: 1 }),
  intro03: card('intro03', '人物工具｜不必一次记住所有人', '调查提示', '你会陆续遇到新生梁一舟、教师宋岚、校友沈舟等人。人物首次登场后，底部“人物”会记录他的头像、公开身份和当前已知信息；遇到名字与线索对不上时，可以随时回来核对。', 'victimMeeting', 'intro04', { kind: 'intro', source: '无剧透背景', progress: 2 }),
  intro04: card('intro04', '游戏规则｜证据有边界', '调查提示', '选择会改变止损时间、证据完整度和公开方式。同一份材料往往只能证明一件事。请区分“真实发生过”“现在仍获授权”和“能够公开指认”。', 'compare', 'a01', { kind: 'intro', source: '开始调查', progress: 3 }),

  q03intro: scene('q03intro', '第三幕｜三种证言', '林知夏（现场记录）', '九月二十四日上午，活动室不录屏。三个人同意坐下，但每个人都保留跳过问题和另行授权公开的权利。', 'victimMeeting', 'q03voices', { chapter: 3, time: '9月24日上午', place: '校园活动室', source: '现场', progress: 20 }),
  q03voices: card('q03voices', '同一张脸，三种认识', '座谈摘录', '许橙：“我拿到过工资，也被移出过群。”　姜宁：“我见过他本人，也听过他说漏嘴。”　宋岚：“他的分析帮过我，也可能骗了我。”', 'victimMeeting', 'q03', { source: '当事人证言', progress: 22, onEnter: { evidence: [evidence.testimony] } }),
  q03: question('q03', 'Q03', 'Q03｜你先听谁的？', '三位当事人各自讲出“我认识的沈舟”。第一段证言会影响你的初始印象，但其他两段不会消失。', 'victimMeeting', 23, [
    { letter: 'A', text: '先听许橙：真正领到工资的一期实习', next: 'q03a' },
    { letter: 'B', text: '先听姜宁：真正见过本人的交往经历', next: 'q03b' },
    { letter: 'C', text: '先听宋岚：真正有效的技术建议', next: 'q03c' }
  ]),
  q03a: card('q03a', '先听许橙', '许橙', '“五月十七日工资真的到账了。所以六月二期收费时，我没怀疑。我还把一期推荐给过学弟——二期四个月没消息，我才不敢继续沉默。”', 'group', 'q03all', { source: '第一证言', progress: 24 }),
  q03b: card('q03b', '先听姜宁', '姜宁', '“五月以后我每月都见过他。他不是纯网络里的假人。九月二十日吃饭，他突然提到宋老师的返修——我从没告诉过他我是谁的学生。”', 'jiangConsent', 'q03all', { source: '第一证言', progress: 24 }),
  q03c: card('q03c', '先听宋岚', '宋岚', '“那张分析图确实帮我少走过弯路。也正因为这样，我没再追问：他现在到底有没有权限替研究院接单。”', 'song', 'q03all', { source: '第一证言', progress: 24 }),
  q03all: card('q03all', '三段证言全部保留', '林知夏（内心）', '真工资、真人见面、真技术建议。每一句都可能是真的；它们拼在一起，却不能自动生成一份今天仍有效的授权。', 'victimMeeting', 'q04intro', { source: '证言对照', progress: 26 }),

  q04intro: card('q04intro', '第四幕｜真文件也会骗人', '许橙', '“一期工资来自恒微科技，二期缴费却进了星桥。合作函盖着真章，但右下角像被裁过。”', 'compare', 'q04archive', { chapter: 4, time: '9月24日上午', place: '社团档案室', source: '物证', progress: 27 }),
  q04archive: card('q04archive', '陆鸣调出完整存档', '陆鸣', '“场地是我核的，函我当时只见过这一页。完整页和未剪录像都在这里。你要拼，就拿去拼。”', 'luArchive', 'q04', { source: '原始存档', progress: 29 }),
  q04: question('q04', 'Q04', 'Q04｜核验二期授权', '工资、缴费单、合作函都是真文件。你先用哪种方法查二期授权？', 'compare', 30, [
    { letter: 'A', text: '放大裁切边缘，与社团完整页拼合，再向企业公开渠道复核', next: 'q04a', effects: { flags: { JOB: 1 }, evidence: [evidence.fullLetter] } },
    { letter: 'B', text: '直接向企业公开邮箱请求可引用的书面回复', next: 'q04b', effects: { flags: { JOB: 0 } } }
  ]),
  q04a: card('q04a', 'Q04 A｜先拼原页', '核对结果', '完整页下缘写着“合作期至五月”。一名正要付款的学生据此暂缓；企业正式回复仍需等待。', 'safe1', 'q05intro', { source: '选择结果', progress: 33 }),
  q04b: card('q04b', 'Q04 B｜等待权威书面回复', '邮箱回执', '企业自动回复“一个工作日内处理”。证据将更权威；等待期间，被裁切的真函继续以“官方合作”名义传播，一名学生先付款。', 'wait1', 'q05intro', { source: '选择结果', progress: 33 }),

  q05intro: card('q05intro', '第五幕｜真人账号里的两种人', '姜宁', '“九月十七日他借一万二，说课题结题款被卡住，三天就还。后来我才想起，那个课题去年已经结题。”', 'jiangConsent', 'q05clue', { chapter: 5, time: '9月24日上午', place: '活动室', source: '有限证言', progress: 34 }),
  q05clue: card('q05clue', '一句不该知道的话', '姜宁', '“九月二十日吃饭，他忽然说‘你们宋老师的返修，检测位我帮你盯着’。我没告诉过他导师是谁，但朋友圈里有课题组合影，我也抱怨过导师被返修折腾。”', 'jiangConsent', 'q05', { source: '当事人证言', progress: 36 }),
  q05: question('q05', 'Q05', 'Q05｜验证账号是否多人使用', '姜宁愿意说明借款，但不愿公开全部聊天。你怎样验证“账号不止一双手”？', 'jiangConsent', 37, [
    { letter: 'A', text: '由她自选并打码片段，本地比较文风与回复时段，发布前逐句确认', next: 'q05a', effects: { flags: { TRUST: 1 }, evidence: [evidence.consentText] } },
    { letter: 'B', text: '不用文本工具，只把她口述的时间矛盾记成匿名证言', next: 'q05b', effects: { flags: { TRUST: 0 } } }
  ]),
  q05a: card('q05a', 'Q05 A｜本地打码分析', '分析结果', '技术话题回复慢、长句、少标点；排期与汇款话题秒回、短句、常用波浪号。结果只写“存在文风差异”，不上传原文，也不指认操作者。', 'safe2', 'q06intro', { source: '经授权的线索', progress: 40 }),
  q05b: card('q05b', 'Q05 B｜只留匿名时间线', '记录范围', '采访只保留时间矛盾和匿名证言。姜宁暴露更少，也意味着公开视频不会出现聊天对照；她仍可以独立报案。', 'preserve', 'q06intro', { source: '隐私优先', progress: 40 }),

  q06intro: scene('q06intro', '第六幕｜屏幕里那张脸', '取样确认回放', '屏幕里的“沈舟”知道论文期限、样品类别和上次讨论内容；门外跑腿员举着同一张脸的手机，拇指却在另一台设备上移动。', 'sampleConfirm', 'q06registry', { chapter: 6, time: '9月24日中午', place: '材料实验室', source: '游戏内演示', progress: 41 }),
  q06registry: card('q06registry', '公司存在，权限不存在', '公开信息核对', '星桥注册仅半年，公示范围包含技术咨询和会议服务，没有对应检测资质公示；研究院官网也查不到这笔订单。', 'verifyOfficial', 'q06', { source: '官方渠道', progress: 43, onEnter: { evidence: [evidence.registry] } }),
  q06: question('q06', 'Q06', 'Q06｜继续交接还是继续核验', '视频里的脸对答如流，壳公司的合同却接不了检测。你如何继续？', 'sampleConfirm', 44, [
    { letter: 'A', text: '停止交接，核验订单账户与资质，封存样品和空盒，并向期刊申请延期', next: 'q06a', effects: { flags: { RESEARCH: 1 } } },
    { letter: 'B', text: '再接一次视频，把订单号、地址和取样授权逐项问清并录下承诺', next: 'q06b', effects: { flags: { RESEARCH: 0 } } }
  ]),
  q06a: card('q06a', 'Q06 A｜先停交接', '宋岚', '“先停。样品封起来，尾款不付，延期邮件我现在就发。被骗经过和补救过程，也得如实写进说明。”', 'verifyOfficial', 'q07intro', { source: '选择结果', progress: 47 }),
  q06b: card('q06b', 'Q06 B｜再录一段承诺', '第二次通话', '对方给出更明确的地址和授权承诺，却仍没有可独立核验的订单号。通话成为新证据；正规检测安排又晚了数小时。', 'shencall', 'q07intro', { source: '选择结果', progress: 47 }),

  q07intro: card('q07intro', '第七幕｜隐形人', '四格回放', '论坛两个机位、咖啡店窗外、实验楼门口：三处画面边缘都出现一只橙色反光条缺角的配送箱。此前所有人都只盯着画面中央的脸。', 'deliveryBoxRef', 'q07name', { chapter: 7, time: '9月24日下午', place: '媒体办公室', source: '找相同', progress: 48 }),
  q07name: card('q07name', '排班表给出一个名字', '陆鸣', '“五月论坛物料栏签的是唐遇。五月是普通工单，六月以后社团又见过他。但共享文件和账号记录，还得由学校、平台和警方依法核。”', 'runnerBox', 'q07', { source: '排班记录', progress: 51, onEnter: { evidence: [evidence.boxMatch] } }),
  q07: question('q07', 'Q07', 'Q07｜线索还是定罪', '三个场景都出现同一只缺角反光条的配送箱。现有材料能得出什么？', 'deliveryBoxRef', 52, [
    { letter: 'A', text: '公开认定跑腿员就是唐遇，也是所有线上消息与AI视频的操作者', next: 'q07a', effects: { flags: { HIDDEN: 0 } } },
    { letter: 'B', text: '只标记“同一跑腿员连接三处”，申请核对排班、共享文件和账号记录', next: 'q07b', effects: { flags: { HIDDEN: 1 } } }
  ]),
  q07a: card('q07a', 'Q07 A｜指认快于证据', '两小时后的页面', '指认帖已删除，但截图正在传播。评论区开始搜索“唐遇”的宿舍；周衡把删帖声明截成“媒体先定罪后撤回”。', 'warn', 'q08intro', { source: '选择结果', progress: 55 }),
  q07b: card('q07b', 'Q07 B｜只写已知边界', '调查板', '板上只写“同一跑腿员连接三地”。姓名来自排班表，账号和责任仍标为待核；完整材料交由有权限的机构查询。', 'preserve', 'q08intro', { source: '选择结果', progress: 55 }),

  q08intro: card('q08intro', '第八幕｜两条资金通道', '周衡', '“许橙的两千八、宋老师的七万五，我可以让财务退款。押金还在对账。你的视频帮过我，现在也可以帮大家体面收场。”', 'zhouRefund', 'q08ledger', { chapter: 8, time: '9月24日下午', place: '校外咖啡馆', source: '当面会谈', progress: 56 }),
  q08ledger: card('q08ledger', '清单上缺了一笔', '林知夏（现场记录）', '清单列着许橙2800元、宋岚75600元和“对账中”的18600元；姜宁转入沈舟个人账户的12000元不在纸上。', 'money', 'q08', { source: '玩家所见', progress: 59, onEnter: { evidence: [evidence.refund] } }),
  q08: question('q08', 'Q08', 'Q08｜退款能否交换沉默', '周衡愿退两笔公司收款，但要求只发不点名的模糊更正并下架旧片。你如何回应？', 'money2', 60, [
    { letter: 'A', text: '指出公司与个人两条资金通道，退款由当事人决定，拒绝用报道口径交换', next: 'q08a', effects: { flags: { CLEAR: 1 } } },
    { letter: 'B', text: '先协助两位争取部分退款，暂发不点名的模糊更正', next: 'q08b', effects: { flags: { CLEAR: 0 } } }
  ]),
  q08a: card('q08a', 'Q08 A｜退款与报道分开', '林知夏', '“退款直接和当事人谈。我的文字必须对下一批人有用。”周衡当面确认两处数字，只承认处理公司账。', 'safe2', 'q09intro', { source: '选择结果', progress: 63 }),
  q08b: card('q08b', 'Q08 B｜小额退款到账', '群聊截图', '许橙的2800元当晚原路退回；宋岚对公款仍称需五个工作日。周衡把退款截图发进新生群：“正规项目才会退款。”', 'group', 'q09intro', { source: '选择结果', progress: 63 }),

  q09intro: card('q09intro', '第九幕｜你的脸替他们澄清', '林知夏（内心）', '六秒视频里，我的脸说：“星桥和沈舟已经核实。”我从没说过这句话。画面却混入了社团共享盘里从未公开的备用机位。', 'linFakeVideo', 'q09compare', { chapter: 9, time: '9月24日晚', place: '新生群', source: '冒名视频', progress: 64 }),
  q09compare: card('q09compare', '真素材，被剪成假结论', '原片对照', '原试片只说：“一期工资属实；二期和科研合作仍待分别核实。”伪片掐掉后半句，又拼入未公开角度。', 'compare', 'q09', { source: '游戏内演示', progress: 67, onEnter: { evidence: [evidence.fakeVideo] } }),
  q09: question('q09', 'Q09', 'Q09｜先保全还是先止扩散', 'AI冒名视频正在传播，其中有未公开的社团机位。你先做什么？', 'linFakeVideo', 68, [
    { letter: 'A', text: '封存原片与伪片，核对素材来源和时间，再提交完整证据包', next: 'q09a', effects: { flags: { FAKE: 1 } } },
    { letter: 'B', text: '先申请下架并发布简短冒名警报，随后再补原片和来源记录', next: 'q09b', effects: { flags: { FAKE: 0 } } }
  ]),
  q09a: card('q09a', 'Q09 A｜保住来源链', '提交记录', '原文件、伪片、未公开机位和发布时间已封存并提交。公开对照晚了数小时，但没有凭内部帧直接点名制作者。', 'preserve', 'q10intro', { source: '选择结果', progress: 71 }),
  q09b: card('q09b', 'Q09 B｜先发冒名警报', '平台回执', '下架申请和简短警报更早发出，一部分转发停止。原始文件与访问链稍后补交，当前还不能说明谁接触过内部素材。', 'warn', 'q10intro', { source: '选择结果', progress: 71 }),

  q10intro: card('q10intro', '第十幕｜三份答复，三种边界', '官方答复汇总', '恒微科技：只合作过一期，未授权二期收费。研究院：沈舟2024年离职，无检测预约权限和该订单。学校：只批准五月活动场地，不给后续收费项目背书。', 'luReplies', 'q10', { chapter: 10, time: '9月25日', place: '媒体办公室', source: '具名书面回复', progress: 73, onEnter: { evidence: [evidence.replies] } }),
  q10: question('q10', 'Q10', 'Q10｜完整发布还是分阶段预警', '三份答复今天到齐，今晚又有新一批关单。你怎样发布？', 'verifyOfficial', 75, [
    { letter: 'A', text: '等三方答复到齐，傍晚标出各自权限后发布具名更正', next: 'q10a', effects: { flags: { VERIFY: 1 } } },
    { letter: 'B', text: '中午先发具体风险与核验路径，傍晚追加三方答复', next: 'q10b', effects: { flags: { VERIFY: 0 } } }
  ]),
  q10a: card('q10a', 'Q10 A｜傍晚具名更正', '发布记录', '三方权限边界逐条引用，未查清的资金终点和个人责任仍标作线索；发布赶在当晚关单前。', 'safe2', 'm01', { source: '选择结果', progress: 78 }),
  q10b: card('q10b', 'Q10 B｜两阶段发布', '发布记录', '中午先发暂停付款和官方核验路径；傍晚再补三方具名答复。更早覆盖一批人，也承担二次传播成本。', 'warn', 'm01', { source: '选择结果', progress: 78 }),

  m01: scene('m01', '幕间｜学长的视频电话', '梁一舟（来电）', '“学姐！沈舟学长刚跟我视频了。群里那次宣讲也是他本人吧？”录屏里的脸挥手、转头，动作没有破绽。', 'shencall', 'm01b', { time: '9月25日傍晚', place: '视频来电', source: '游戏内演示', progress: 80 }),
  m01b: card('m01b', '第一步｜动作测试也可能被通过', '林知夏', '“挥手和转头只能检查画面是否卡顿，不能证明屏幕后是谁。再问一件只有本人知道的事。”', 'shencall', 'm01c', { source: '固定演出', progress: 81 }),
  m01c: card('m01c', '第二步｜私人问题也可能被绕开', '视频里的沈舟', '“那天人多，我穿深色外套吧？改天请你吃饭。”答案模糊，却足以让人继续相信。', 'shencall', 'm01d', { source: '固定演出', progress: 82 }),
  m01d: card('m01d', '第三步｜挂断后独立回拨', '核验结果', '梁挂断，从姜宁留存的旧号码独立回拨。无人接听；刷新后，刚才的视频账号已把他拉黑。回拨无应答只是可疑信号，但转账必须停止。', 'verifyOfficial', 'q11intro', { source: '固定演出', progress: 84 }),

  q11intro: card('q11intro', '第十一幕｜证词的所有权', '姜宁', '“我想让后来的人知道风险，但我不想把自己交给围观的人。如果我不授权公开，请连我的声音都不要放进去。”', 'victimMeeting', 'q11consent', { chapter: 11, time: '9月25日晚', place: '授权确认', source: '当事人意愿', progress: 85 }),
  q11consent: card('q11consent', '持有材料，不等于获得公开权', '宋岚', '“完整材料可以给银行和警方。公开视频里，只放我确认过、打过码的部分。”', 'songReceipts', 'q11', { source: '公开边界', progress: 87, onEnter: { evidence: [evidence.consent] } }),
  q11: question('q11', 'Q11', 'Q11｜公开多少原件', '有人建议上传未打码的借款截图、合同回执和采访录音，供网友“破案”。你选择？', 'victimMeeting', 88, [
    { letter: 'A', text: '只公开本人逐项同意的必要打码材料，其余交给有权限的机关', next: 'q11a', effects: { flags: { SAFE: 1 } } },
    { letter: 'B', text: '未经同意上传原件换取关注', next: 'e4', effects: { flags: { SAFE: 0 } } }
  ]),
  q11a: card('q11a', 'Q11 A｜证人继续合作', '授权清单', '姜宁的材料按Q05选择决定使用范围；合同、回执和录音逐项确认。完整原件由当事人决定交银行、学校或警方。', 'preserve', 'q12intro', { source: '选择结果', progress: 90 }),

  q12intro: scene('q12intro', '终幕｜双倒计时', '宋岚', '“电话让他打，我不接了。教授可以再评，论文也可以延期；来路不明的数据一旦写进去，我解释不清。”', 'song', 'q12cut', { chapter: 12, time: '9月25日深夜', place: '校园媒体办公室', source: '现场', progress: 92 }),
  q12cut: card('q12cut', '重新剪开同一批真素材', '林知夏（操作记录）', '工资被放回“一期事实”；收费页标成“二期待核”；履历拆成“曾任职”和“现无授权”；屏幕里的脸与跑腿员只标“待核连接”。', 'linFinalEdit', 'q12', { source: '发布台', progress: 94 }),
  q12: question('q12', 'Q12', 'Q12｜午夜之前如何发布', '今晚批次即将关单，尾款催缴仍在继续。你怎样完成最终发布？', 'linFinalEdit', 95, [
    { letter: 'A', text: '今晚发布重剪、三类风险和核验路径；未查清的只标“线索”', next: '$ENDING' },
    { letter: 'B', text: '等一周，把所有视角剪成完整悬疑纪录片', next: '$ENDING' },
    { letter: 'C', text: '今晚只发“旧片信息不完整，请谨慎”的模糊更正', next: '$ENDING' }
  ]),

  e1: ending('e1', 'E1｜看见隐形人', '零点前十一分钟，重剪版发布。梁一舟把提醒转给室友；宋岚关掉尾款弹窗，样品、合同与录屏分别进入期刊、科研办和警方的处置流程。一周后，警方按后台记录推进并案调查。', '反诈传播既要及时，也要明确每一份证据的适用边界。连接线索可以促成调查，但不能替代法律认定。'),
  e2: ending('e2', 'E2｜警报已经发出', '最终提醒仍在关单前发布，三类风险和官方核验路径可用。部分证据、止损时点或传播链仍有缺口；这些缺口会按照你本轮的实际选择逐条显示。', '谨慎、隐私保护和抢先预警都可能是正当选择。结局卡描述的是信息代价，不是道德评分。'),
  e3: ending('e3', 'E3｜迟到的完整真相', '一周后，多视角纪录片完整上线，真一期、真人沈舟、数字分身和背景跑腿员第一次被讲清。七晚过去，新的收费批次仍在继续；延迟的是面向更多人的预警。', '调查深度与发布时机需要并行设计。可以先发布经过核实的风险和求助路径，再继续完成长篇调查。'),
  e4: ending('e4', 'E4｜证人退出', '未经同意的原件进入公开传播。受影响者退出采访，林知夏下架材料、通知当事人并保存泄露记录。公开叙事线中断，当事人的独立求助渠道仍然存在。', '反诈不能以再次伤害受害者为代价。持有证据不等于拥有公开权，完整材料应交给有权限的机构。'),
  e5: ending('e5', 'E5｜借来的脸', '模糊更正没有解释一期与二期、真实技术与虚假授权的边界。星桥把“信息不完整”截成“媒体已澄清”，冒名视频继续在小群流转。', '更正需要指出具体风险和核验路径。含糊提醒容易被截取成新的信用背书。'),
  e6: ending('e6', 'E6｜被借用的脸（隐藏结局）', '你接受了模糊处理，又先发了缺少原片对照的冒名警报。一个月后，那段借林知夏的脸说“已核实”的视频脱离上下文，成了新生群里的宣传片。', 'AI冒名内容要及时止扩散，也要尽快补上原始文件、来源记录和清晰对照。')
}

export const earlyProgress = {
  a01: 4, a01b: 5, a02: 6, a02b: 7, a03: 8, a04: 8, a05: 9, a06: 9, q01: 10,
  b1a: 11, b1a2: 11, b1a3: 12, b1b: 12,
  c01: 13, c02: 13, c02b: 14, c03: 14, c04: 15, c05: 15, c06: 16, c07: 16,
  c07b: 17, c08: 17, c09: 17, c10: 18, c11: 18, q02: 18,
  b2a: 19, b2a2: 19, b2a3: 20, b2b: 19, b2b2: 20
}
