import { images, videos } from './media-manifest.js?v=15'

const evidence = {
  testimony: { id: 'testimony-board', title: '3份证言', boundary: '真工资、真人见面、真技术建议——3个人各握着一块真实材料。可把这3块拼在一起，仍缺少“今天仍有授权”这一角。' },
  fullLetter: { id: 'full-letter', title: '第1期实习完整合作函', boundary: '被裁掉的页脚写着“合作期至5月”。这证明原合作已经到期，第2期实习招募不能继续沿用旧函件作为授权证明。至于谁在组织收费，还要继续查。' },
  consentText: { id: 'consent-text', title: '打码文风样本', boundary: '两种说话习惯已经并排放好。我可以记下“账号异常”，还不能把任何人的名字写在后面。' },
  registry: { id: 'company-registry', title: '公司公示与机构核验', boundary: '公司找得到，检测资格和研究院订单却找不到。钱和人的最后去向，仍要交给能查后台的人。' },
  boxMatch: { id: 'box-match', title: '缺角反光条对照', boundary: '同一只箱子把3处画面连上了。排班、账号和后台记录没对完以前，它只是连接线，不是姓名牌。' },
  refund: { id: 'refund-list', title: '退款清单与双账户', boundary: '公司账上的2笔写进了退款清单，沈舟个人账户里的借款没有。至少有2条钱路，不能只跟着一张表走。' },
  fakeVideo: { id: 'fake-video', title: '原片与冒名视频', boundary: '原片里我从没说过那句推荐。备用机位出现在伪片里，说明内部素材被碰过；是谁碰的，访问记录才有资格回答。' },
  replies: { id: 'official-replies', title: '三方具名答复', boundary: '恒微、研究院和学校分别说明了自己能够确认的范围。这些答复能拆掉含糊的“官方合作”，不能替我给某个人定罪。' },
  consent: { id: 'consent-matrix', title: '公开授权清单', boundary: '每段截图、录音和回执旁边都有当事人的选择：可公开、只交机构，或者不要使用。' }
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

function question(id, questionId, heading, text, key, progress, options, extra = {}) {
  return { id, kind: 'choice', questionId, heading, speaker: '调查选择', text, media: media(key), progress, options, ...extra }
}

function ending(id, title, text, education) {
  const endingMedia = {
    e1: 'endingClear', e2: 'endingClear', e3: 'linFinalEdit',
    e4: 'endingWitnessExit', e5: 'linFakeVideo', e6: 'linFakeVideo'
  }
  return { id, kind: 'ending', endingId: id.toUpperCase(), heading: title, speaker: '本轮结局', text, education, media: media(endingMedia[id] || 'end'), progress: 100 }
}

export const fullNodes = {
  intro01: card('intro01', '我剪过的那条片子', '林知夏（内心）', '4个月前，我为春季的第1期实习剪了一条报道。片中的学生确实到岗并收到工资，校友沈舟也确实在同期论坛上回答过技术问题。今天，这条旧片被改名为“第2期实习学员实录”，放到了一个新的收费报名页旁边。我得先查清，过去的真实经历被拿来替今天的什么作保。', 'lin', 'intro02', { kind: 'intro', source: '4个月前', progress: 0, nextLabel: '继续回想' }),
  intro02: card('intro02', '事情比我想的多', '林知夏（内心）', '一个新生停在实习名额费的付款页；一位老师已经付出科研检测款；一名学生借给恋人1.2万元；还有一张会动、会回答问题的脸。它们也许互不相干。现在还不能替它们连线。', 'castReference', 'intro03', { kind: 'intro', source: '后来', progress: 1, nextLabel: '看看我的记录' }),
  intro03: card('intro03', '临时建的几页记录', '林知夏（内心）', '人一多，名字就容易串。见过的人，我放进“人物”；一时说不清的项目、机构和行话，我随手记进“手记”。哪天觉得某句话不对，回来翻一眼，也许就能看出它换过意思。', 'victimMeeting', 'intro04', { kind: 'intro', source: '我的电脑桌面', progress: 2, nextLabel: '回到那天上午' }),
  intro04: card('intro04', '只是帮忙看一眼', '林知夏（内心）', '一，发生过的真事，不替今天的承诺作保。二，看见可疑之处，先记边界，再写名字。三，材料在我手里，也要问过当事人才能公开。每次决定都会留下后果，底部的人物、证据和状态会替我记着。', 'compare', 'a01', { kind: 'intro', source: '9月23日上午', progress: 3, nextLabel: '打开那条私信' }),

  q03intro: scene('q03intro', '第3幕｜3种证言', '林知夏（现场记录）', '我关掉摄像机，把授权清单放到桌上。许橙带来第1期实习工资记录，姜宁只展示愿意公开的聊天片段，宋岚带来2张付款回执。她们都说自己认识沈舟。', 'roundtablePlayer', 'q03voices', { chapter: 3, time: '9月24日上午', place: '校园活动室', source: '现场', progress: 20, orientation: { kicker: '转场｜第二天上午', route: '单独求证 → 经同意的3人座谈', goal: '比较3个人各自认识的“沈舟”，找出真经历如何共同支撑了一个假结论' }, nextLabel: '听3人的开场陈述' }),
  q03voices: card('q03voices', '同一张脸，3种认识', '座谈摘录', '第1期实习生许橙：“我拿到过工资，也被移出过群。”　宋岚的研究生姜宁：“我见过他本人，也听过他说漏嘴。”　教师宋岚：“他的分析帮过我，也可能骗了我。”', 'victimMeeting', 'q03', { source: '当事人证言', progress: 22, onEnter: { evidence: [evidence.testimony] } }),
  q03: question('q03', 'Q03', 'Q03｜你先听谁的？', '3位当事人各自讲出“我认识的沈舟”。第一段证言会影响你的初始印象，但其他2段不会消失。', 'victimMeeting', 23, [
    { letter: 'A', text: '先听许橙：真正领到工资的第1期实习', next: 'q03a' },
    { letter: 'B', text: '先听姜宁：真正见过本人的交往经历', next: 'q03b' },
    { letter: 'C', text: '先听宋岚：真正有效的技术建议', next: 'q03c' }
  ]),
  q03a: card('q03a', '先听许橙', '许橙', '“第1期实习的工资在5月17日真的到账了，所以第2期实习开始收名额费时，我没有立刻怀疑。我交费后等了4个月，一直没收到岗位安排，才开始意识到不对。我以前还把这个项目推荐给过学弟，所以越拖越不敢开口。”', 'xuSalary', 'q03all', { source: '第1份证言', progress: 24 }),
  q03b: card('q03b', '先听姜宁', '姜宁', '“5月以后我每月都见过他。他不是纯网络里的假人。9月20日吃饭，他突然提到宋老师的返修——我从没告诉过他我是谁的学生。”', 'jiangConsent', 'q03all', { source: '第1份证言', progress: 24 }),
  q03c: card('q03c', '先听宋岚', '宋岚', '“那张分析图确实帮我少走过弯路。也正因为这样，我没再追问：他现在到底有没有权限替研究院接单。”', 'song', 'q03all', { source: '第1份证言', progress: 24 }),
  q03all: card('q03all', '3段证言放到同一张桌上', '林知夏（内心）', '许橙证明第1期实习真的发过工资；姜宁证明她确实在线下见过沈舟；宋老师证明沈舟确实懂材料检测。但这3段真话都不能证明，沈舟现在仍有权代表企业招募实习生，或代表研究院承接检测。我们决定先去档案室查完整合作函。', 'roundtablePlayer', 'q04intro', { source: '证言对照', progress: 26, nextLabel: '去档案室查授权期限' }),

  q04intro: card('q04intro', '第4幕｜真文件也会骗人', '许橙', '“第1期实习工资来自恒微科技，第2期实习招募缴费却进了星桥。群里的合作函确实盖着章，可右下角像被裁掉了一行。”我带着截图离开活动室，陆鸣已在社团档案室等我。', 'compare', 'q04archive', { chapter: 4, time: '9月24日上午', place: '社团档案室', source: '物证', progress: 27, orientation: { kicker: '转场｜座谈之后', route: '3人证言 → 社团原始档案', goal: '确认合作函被裁掉的内容，并核验第2期实习招募收费是否仍获企业授权' }, nextLabel: '让陆鸣调出原件' }),
  q04archive: card('q04archive', '陆鸣调出完整存档', '陆鸣', '“场地是我核的，函我当时只见过这一页。完整页和未剪录像都在这里。你要拼，就拿去拼。”', 'luArchive', 'q04', { source: '原始存档', progress: 29 }),
  q04: question('q04', 'Q04', 'Q04｜核验第2期实习招募授权', '工资、缴费单、合作函都是真文件。你先用哪种方法查第2期实习招募授权？', 'compare', 30, [
    { letter: 'A', text: '放大裁切边缘，与社团完整页拼合，再向企业公开渠道复核', next: 'q04a', effects: { flags: { JOB: 1 }, evidence: [evidence.fullLetter] } },
    { letter: 'B', text: '直接向企业公开邮箱请求可引用的书面回复', next: 'q04b', effects: { flags: { JOB: 0 } } }
  ]),
  q04a: card('q04a', 'Q04 A｜先拼原页', '核对结果', '完整页下缘写着“合作期至5月”。一名正要付款的学生据此暂缓；企业正式回复仍需等待。离开档案室时，姜宁发来两组经打码的聊天：同一账号像换了一个人。', 'safe1', 'q05intro', { source: '选择结果', progress: 33, nextLabel: '查看姜宁授权的聊天' }),
  q04b: card('q04b', 'Q04 B｜等待权威书面回复', '邮箱回执', '企业自动回复“一个工作日内处理”。等待期间，被裁切的真函继续传播，一名学生先付款。离开档案室时，姜宁发来两组经打码的聊天：同一账号像换了一个人。', 'wait1', 'q05intro', { source: '选择结果', progress: 33, nextLabel: '查看姜宁授权的聊天' }),

  q05intro: card('q05intro', '第5幕｜真人账号里的两种人', '姜宁', '“你先别听我概括，直接看句子。前面谈实验时，他总把话说完整；借钱那晚，同一个账号开始省略标点、连发短句。”', 'jiangConsent', 'q05clue', { chapter: 5, time: '9月24日上午', place: '经授权的聊天核对', source: '当事人授权节选', progress: 34, orientation: { kicker: '线索切换｜从文件到语言习惯', route: '过期合作函 → 同一账号的两套说话方式', goal: '直接比较标点、句长和回复节奏，判断账号是否可能由多人接手' }, nextLabel: '继续查看越界信息', media: { type: 'chat', title: '沈舟', subtitle: '经姜宁授权的打码节选', messages: [
    { time: '5月26日 22:18', side: 'received', name: '沈舟', avatar: '沈', text: '这组曲线先不要截断。把空白对照和原始文件一起发我。' },
    { side: 'received', name: '沈舟', avatar: '沈', text: '今天看你没怎么吃东西。到宿舍后告诉我一声。' },
    { time: '9月17日 23:08', side: 'received', name: '沈舟', avatar: '沈', text: '宝 睡了吗' },
    { side: 'received', name: '沈舟', avatar: '沈', text: '临时周转一下嘛～' },
    { side: 'received', name: '沈舟', avatar: '沈', text: '12000 3天就还你' },
    { side: 'sent', name: '姜宁', avatar: '姜', text: '什么课题这么急？' },
    { side: 'received', name: '沈舟', avatar: '沈', text: '别担心呀～' }
  ] } }),
  q05clue: card('q05clue', '一句不该知道的话', '姜宁', '“更奇怪的是，他后来主动提到宋老师的返修。我没有告诉过他导师是谁。”', 'jiangConsent', 'q05', { source: '当事人授权节选', progress: 36, media: { type: 'chat', title: '沈舟', subtitle: '9月20日聊天节选', messages: [
    { time: '9月20日 19:46', side: 'received', name: '沈舟', avatar: '沈', text: '你们宋老师的返修，检测位我帮你盯着。' },
    { side: 'sent', name: '姜宁', avatar: '姜', text: '你怎么知道我是宋老师的学生？' },
    { side: 'received', name: '沈舟', avatar: '沈', text: '朋友圈不是有合影嘛' },
    { side: 'received', name: '沈舟', avatar: '沈', text: '别多想～' }
  ] } }),
  q05: question('q05', 'Q05', 'Q05｜验证账号是否多人使用', '同一账号前期常用完整长句和句号，借款时却变成秒回短句、空格和波浪号。姜宁不愿公开全部聊天，你怎样继续验证？', 'jiangConsent', 37, [
    { letter: 'A', text: '由她自选并打码片段，本地比较文风与回复时段，发布前逐句确认', next: 'q05a', effects: { flags: { TRUST: 1 }, evidence: [evidence.consentText] } },
    { letter: 'B', text: '不用文本工具，只把她口述的时间矛盾记成匿名证言', next: 'q05b', effects: { flags: { TRUST: 0 } } }
  ], { media: { type: 'chat', title: '文风对照', subtitle: '只显示已获授权片段', system: '相同头像与账号，不等于始终由同一人操作', messages: [
    { time: '技术话题｜平均18分钟回复', side: 'received', name: '沈舟', avatar: '沈', text: '先保留原始数据。误差来源需要逐项排除。' },
    { time: '借款话题｜连续秒回', side: 'received', name: '沈舟', avatar: '沈', text: '宝 在吗' },
    { side: 'received', name: '沈舟', avatar: '沈', text: '就周转3天～' },
    { side: 'received', name: '沈舟', avatar: '沈', text: '现在转一下嘛～' }
  ] } }),
  q05a: card('q05a', 'Q05 A｜本地打码分析', '分析结果', '技术话题回复较慢，习惯完整长句和句号；借款话题连续秒回，常省略标点并使用空格和波浪号。结论只写“存在显著文风差异”，不上传原文，也不指认具体操作者。', 'safe2', 'q06intro', { source: '经授权的线索', progress: 40, media: { type: 'chat', title: '本地文风对照', subtitle: '结论不上传原始私聊', system: '只能说明账号使用方式异常，不能单凭文风给具体人员定责', messages: [
    { side: 'received', name: '样本A｜技术话题', avatar: 'A', text: '先保留原始数据。误差来源需要逐项排除。' },
    { side: 'received', name: '样本B｜借款话题', avatar: 'B', text: '宝 在吗' },
    { side: 'received', name: '样本B｜借款话题', avatar: 'B', text: '现在转一下嘛～' }
  ] } }),
  q05b: card('q05b', 'Q05 B｜只留匿名时间线', '记录范围', '采访只保留时间矛盾和匿名证言。姜宁暴露更少，也意味着公开视频不会出现聊天对照；她仍可以独立报案。', 'preserve', 'q06intro', { source: '隐私优先', progress: 40 }),

  q06intro: scene('q06intro', '第6幕｜屏幕里那张脸', '取样确认回放', '聊天差异只能说明账号异常，不能说明技术如何实现。我们回到实验室重看门禁与视频：屏幕里的“沈舟”在回答问题，门外跑腿员却一边举着这张脸，一边操作另一台设备。', 'aiIdentityCheck', 'q06registry', { chapter: 6, time: '9月24日中午', place: '材料实验室', source: '游戏内演示', progress: 41, orientation: { kicker: '转场｜返回案发现场', route: '聊天文风异常 → 取样视频与门禁画面同步回放', goal: '不要只看“脸像不像”，而要核验订单、权限、设备和线下交接是否闭环' }, nextLabel: '核对公司与研究院记录' }),
  q06registry: card('q06registry', '公司存在，不等于有权检测', '公开信息核对', '星桥确实完成了公司登记，但公开范围只有技术咨询和会议服务，没有对应检测资质公示；研究院官网也查不到这笔订单。主体真实、账户真实，仍不能证明它有权承接这项检测。', 'verifyOfficial', 'q06', { source: '官方渠道', progress: 43, onEnter: { evidence: [evidence.registry] } }),
  q06: question('q06', 'Q06', 'Q06｜继续交接还是继续核验', '视频里的脸对答如流，壳公司的合同却接不了检测。你如何继续？', 'aiIdentityCheck', 44, [
    { letter: 'A', text: '停止交接，核验订单账户与资质，封存样品和空盒，并向期刊申请延期', next: 'q06a', effects: { flags: { RESEARCH: 1 } } },
    { letter: 'B', text: '再接一次视频，把订单号、地址和取样授权逐项问清并录下承诺', next: 'q06b', effects: { flags: { RESEARCH: 0 } } }
  ]),
  q06a: card('q06a', 'Q06 A｜先停交接', '宋岚', '“先停。样品封起来，尾款不付，延期邮件我现在就发。被骗经过和补救过程，也得如实写进说明。”', 'verifyOfficial', 'q07intro', { source: '选择结果', progress: 47 }),
  q06b: card('q06b', 'Q06 B｜再录一段承诺', '第二次通话', '对方给出更明确的地址和授权承诺，却仍没有可独立核验的订单号。通话成为新证据；正规检测安排又晚了数小时。', 'shencall', 'q07intro', { source: '选择结果', progress: 47 }),

  q07intro: card('q07intro', '第7幕｜隐形人', '林知夏（剪辑台前）', '我把论坛、咖啡店和实验楼画面按时间并排。每段中央都是不同事件，边缘却3次出现同一只橙色反光条缺角的配送箱。我们一直在看“沈舟”的脸，漏掉了替画面移动的人。', 'evidenceWall', 'q07name', { chapter: 7, time: '9月24日下午', place: '媒体办公室', source: '找相同', progress: 48, orientation: { kicker: '转场｜3路素材合并', route: '实验室回放 → 媒体办公室证据墙', goal: '寻找不同事件中重复出现的背景物与行动者，同时避免把线索直接写成定罪' }, nextLabel: '查配送箱对应的排班' }),
  q07name: card('q07name', '排班表给出一个名字', '陆鸣', '“5月论坛物料栏签的是唐遇。5月是普通工单，6月以后社团又见过他。但共享文件和账号记录，还得由学校、平台和警方依法核。”', 'runnerBox', 'q07', { source: '排班记录', progress: 51, onEnter: { evidence: [evidence.boxMatch] } }),
  q07: question('q07', 'Q07', 'Q07｜线索还是定罪', '3个场景都出现同一只缺角反光条的配送箱。现有材料能得出什么？', 'evidenceWall', 52, [
    { letter: 'A', text: '公开认定跑腿员就是唐遇，也是所有线上消息与AI视频的操作者', next: 'q07a', effects: { flags: { HIDDEN: 0 } } },
    { letter: 'B', text: '只标记“同一跑腿员连接3处”，申请核对排班、共享文件和账号记录', next: 'q07b', effects: { flags: { HIDDEN: 1 } } }
  ]),
  q07a: card('q07a', 'Q07 A｜指认快于证据', '两小时后的页面', '指认帖已删除，但截图正在传播。评论区开始搜索“唐遇”的宿舍；周衡把删帖声明截成“媒体先定罪后撤回”。', 'warn', 'q08intro', { source: '选择结果', progress: 55 }),
  q07b: card('q07b', 'Q07 B｜只写已知边界', '调查板', '板上只写“同一跑腿员连接三地”。姓名来自排班表，账号和责任仍标为待核；完整材料交由有权限的机构查询。', 'evidenceWall', 'q08intro', { source: '选择结果', progress: 55 }),

  q08intro: card('q08intro', '第8幕｜2条资金通道', '周衡', '证据墙刚整理完，周衡主动约我到校外咖啡馆。他把退款清单推过来：“许橙的2800元、宋老师的7.56万元，我可以让财务退。你把旧片撤掉，大家体面收场。”', 'zhouRefund', 'q08ledger', { chapter: 8, time: '9月24日下午', place: '校外咖啡馆', source: '当面会谈', progress: 56, orientation: { kicker: '转场｜对方主动接触', route: '证据墙 → 周衡提出的退款清单', goal: '分清退款、证据与报道口径，核对清单是否覆盖全部受害者和全部账户' }, nextLabel: '核对退款清单' }),
  q08ledger: card('q08ledger', '清单上缺了一笔', '林知夏（现场记录）', '清单列着许橙2800元、宋岚75600元和“对账中”的18600元；姜宁转入沈舟个人账户的12000元不在纸上。', 'money', 'q08', { source: '玩家所见', progress: 59, onEnter: { evidence: [evidence.refund] } }),
  q08: question('q08', 'Q08', 'Q08｜退款能否交换沉默', '周衡愿退2笔公司收款，但要求只发不点名的模糊更正并下架旧片。你如何回应？', 'money2', 60, [
    { letter: 'A', text: '指出公司与个人2条资金通道，退款由当事人决定，拒绝用报道口径交换', next: 'q08a', effects: { flags: { CLEAR: 1 } } },
    { letter: 'B', text: '先协助2位争取部分退款，暂发不点名的模糊更正', next: 'q08b', effects: { flags: { CLEAR: 0 } } }
  ]),
  q08a: card('q08a', 'Q08 A｜退款与报道分开', '林知夏', '“退款直接和当事人谈。我的文字必须对下一批人有用。”周衡当面确认两处数字，只承认处理公司账。', 'safe2', 'q09intro', { source: '选择结果', progress: 63 }),
  q08b: card('q08b', 'Q08 B｜小额退款到账', '群聊截图', '许橙的2800元当晚原路退回；宋岚的7.56万元对公首款仍被告知需要5个工作日处理，1.86万元个人垫付款则还在“对账中”。周衡把退款截图发进新生群：“正规项目才会退款。”', 'group', 'q09intro', { source: '选择结果', progress: 63 }),

  q09intro: card('q09intro', '第9幕｜我的脸替他们澄清', '林知夏（内心）', '谈判结束后，新生群弹出一段6秒视频：我的脸正说“星桥和沈舟已经核实”。我从没说过这句话，画面里却有社团共享盘从未公开的备用机位。', 'linFakeVideo', 'q09compare', { chapter: 9, time: '9月24日晚', place: '新生群', source: '冒名视频', progress: 64, orientation: { kicker: '突发事件｜谈判之后', route: '退款谈判 → 冒用我面孔的澄清视频', goal: '先确认视频被怎样拼接，再决定优先保全来源链还是阻止扩散' }, nextLabel: '把伪片与原片并排' }),
  q09compare: card('q09compare', '真素材，被剪成假结论', '原片对照', '原试片只说：“第1期实习工资属实；第2期实习招募和科研合作仍待分别核实。”伪片掐掉后半句，又拼入未公开角度。', 'compare', 'q09', { source: '游戏内演示', progress: 67, onEnter: { evidence: [evidence.fakeVideo] } }),
  q09: question('q09', 'Q09', 'Q09｜先保全还是先止扩散', 'AI冒名视频正在传播，其中有未公开的社团机位。你先做什么？', 'linFakeVideo', 68, [
    { letter: 'A', text: '封存原片与伪片，核对素材来源和时间，再提交完整证据包', next: 'q09a', effects: { flags: { FAKE: 1 } } },
    { letter: 'B', text: '先申请下架并发布简短冒名警报，随后再补原片和来源记录', next: 'q09b', effects: { flags: { FAKE: 0 } } }
  ]),
  q09a: card('q09a', 'Q09 A｜保住来源链', '提交记录', '原文件、伪片、未公开机位和发布时间已封存并提交。公开对照晚了数小时，但没有凭内部帧直接点名制作者。', 'preserve', 'q10intro', { source: '选择结果', progress: 71 }),
  q09b: card('q09b', 'Q09 B｜先发冒名警报', '平台回执', '下架申请和简短警报更早发出，一部分转发停止。原始文件与访问链稍后补交，当前还不能说明谁接触过内部素材。', 'warn', 'q10intro', { source: '选择结果', progress: 71 }),

  q10intro: card('q10intro', '第10幕｜3份答复，3种边界', '官方答复汇总', '第2天，3封具名回复先后到达：恒微只承认第1期实习，不承认后续收费招募；研究院确认沈舟已于2024年离职，院内也没有宋老师的检测订单；学校只批准过5月论坛当天的场地。这3份答复终于把“过去真实发生过”和“现在仍获授权”拆成了两件事。', 'luReplies', 'q10', { chapter: 10, time: '9月25日', place: '媒体办公室', source: '具名书面回复', progress: 73, orientation: { kicker: '转场｜次日官方回复到齐', route: '民间线索 → 企业、研究院、学校三方核验', goal: '选择发布时间，并在新一批关单前给后来的人留下可执行的核验路径' }, nextLabel: '决定发布节奏', onEnter: { evidence: [evidence.replies] } }),
  q10: question('q10', 'Q10', 'Q10｜完整发布还是分阶段预警', '3份答复今天到齐，今晚又有新一批关单。你怎样发布？', 'verifyOfficial', 75, [
    { letter: 'A', text: '等三方答复到齐，傍晚标出各自权限后发布具名更正', next: 'q10a', effects: { flags: { VERIFY: 1 } } },
    { letter: 'B', text: '中午先发具体风险与核验路径，傍晚追加三方答复', next: 'q10b', effects: { flags: { VERIFY: 0 } } }
  ]),
  q10a: card('q10a', 'Q10 A｜傍晚具名更正', '发布记录', '三方权限边界逐条引用，未查清的资金终点和个人责任仍标作线索；发布赶在当晚关单前。', 'safe2', 'm01', { source: '选择结果', progress: 78 }),
  q10b: card('q10b', 'Q10 B｜两阶段发布', '发布记录', '中午先发暂停付款和官方核验路径；傍晚再补三方具名答复。更早覆盖一批人，也承担二次传播成本。', 'warn', 'm01', { source: '选择结果', progress: 78 }),

  m01: scene('m01', '幕间｜学长的视频电话', '梁一舟（来电）', '发布准备到一半，梁一舟突然来电：“学姐，沈舟刚和我视频。他会挥手、会转头，群里那次宣讲真是本人吧？”录屏中的动作没有明显破绽。', 'shencall', 'm01b', { time: '9月25日傍晚', place: '视频来电', source: '游戏内演示', progress: 80, orientation: { kicker: '临时插曲｜发布前', route: '书面核验已完成 → 新生又收到“真人”视频', goal: '用可复现的独立回拨方法核验身份，不把动作测试当作真人证明' }, nextLabel: '指导梁一舟核验' }),
  m01b: card('m01b', '第1步｜动作测试也可能被通过', '林知夏', '“挥手和转头只能检查画面是否卡顿，不能证明屏幕后是谁。再问一件只有本人知道的事。”', 'shencall', 'm01c', { source: '固定演出', progress: 81 }),
  m01c: card('m01c', '第2步｜私人问题也可能被绕开', '视频里的沈舟', '“那天人多，我穿深色外套吧？改天请你吃饭。”答案模糊，却足以让人继续相信。', 'shencall', 'm01d', { source: '固定演出', progress: 82 }),
  m01d: card('m01d', '第3步｜挂断后独立回拨', '核验结果', '梁挂断，从姜宁留存的旧号码独立回拨。无人接听；刷新后，刚才的视频账号已把他拉黑。回拨无应答只是可疑信号，但转账必须停止。', 'verifyOfficial', 'q11intro', { source: '固定演出', progress: 84 }),

  q11intro: card('q11intro', '第11幕｜证词的所有权', '姜宁', '身份核验结束后，我逐一回访当事人确认公开视频范围。姜宁说：“我想让后来的人知道风险，但我不想把自己交给围观的人。如果我不授权，请连声音都不要放。”', 'consentInterview', 'q11consent', { chapter: 11, time: '9月25日晚', place: '授权确认', source: '当事人意愿', progress: 85, orientation: { kicker: '转场｜发布前授权确认', route: '证据已经够用 → 逐项确认哪些材料可以公开', goal: '在反诈教育效果与当事人隐私之间划出明确边界' }, nextLabel: '核对宋岚的授权范围' }),
  q11consent: card('q11consent', '持有材料，不等于获得公开权', '宋岚', '“完整材料可以给银行和警方。公开视频里，只放我确认过、打过码的部分。”', 'songReceipts', 'q11', { source: '公开边界', progress: 87, onEnter: { evidence: [evidence.consent] } }),
  q11: question('q11', 'Q11', 'Q11｜公开多少原件', '有人建议上传未打码的借款截图、合同回执和采访录音，供网友“破案”。你选择？', 'consentInterview', 88, [
    { letter: 'A', text: '只公开本人逐项同意的必要打码材料，其余交给有权限的机关', next: 'q11a', effects: { flags: { SAFE: 1 } } },
    { letter: 'B', text: '未经同意上传原件换取关注', next: 'e4', effects: { flags: { SAFE: 0 } } }
  ]),
  q11a: card('q11a', 'Q11 A｜证人继续合作', '授权清单', '姜宁的材料按Q05选择决定使用范围；合同、回执和录音逐项确认。完整原件由当事人决定交银行、学校或警方。', 'consentInterview', 'q12intro', { source: '选择结果', progress: 90 }),

  q12intro: scene('q12intro', '终幕｜双倒计时', '宋岚', '23:00，第2期实习招募距离关单只剩1小时，科研检测尾款也在被连续催缴。宋岚关掉来电：“教授职称可以下次再申报，论文可以延期；来路不明的数据一旦写进去，我解释不清。”', 'song', 'q12cut', { chapter: 12, time: '9月25日深夜', place: '校园媒体办公室', source: '现场', progress: 92, orientation: { kicker: '终幕｜2个倒计时同时逼近', route: '材料、答复与授权均已核对 → 剪出最终公开版本', goal: '在午夜前给出清楚、可核验、不过度指认的风险提示' }, nextLabel: '进入最终剪辑台' }),
  q12cut: card('q12cut', '重新剪开同一批真素材', '林知夏（操作记录）', '工资画面被放回“已核实：第1期实习”；收费页标成“待核实：第2期实习招募”；履历拆成“曾在研究院任职”和“目前没有授权”；屏幕里的脸与跑腿员之间，只保留一条“待核连接”。', 'linFinalEdit', 'q12', { source: '发布台', progress: 94 }),
  q12: question('q12', 'Q12', 'Q12｜午夜之前如何发布', '今晚批次即将关单，尾款催缴仍在继续。你怎样完成最终发布？', 'linFinalEdit', 95, [
    { letter: 'A', text: '今晚发布重剪、3类风险和核验路径；未查清的只标“线索”', next: '$ENDING' },
    { letter: 'B', text: '等1周，把所有视角剪成完整悬疑纪录片', next: '$ENDING' },
    { letter: 'C', text: '今晚只发“旧片信息不完整，请谨慎”的模糊更正', next: '$ENDING' }
  ]),

  e1: ending('e1', 'E1｜看见隐形人', '23:49，重剪版发布。梁一舟把提醒转给室友；宋岚关掉尾款弹窗，样品、合同与录屏分别进入期刊、科研办和警方的处置流程。1周后，警方按后台记录推进并案调查。', '反诈传播既要及时，也要明确每一份证据的适用边界。连接线索可以促成调查，但不能替代法律认定。'),
  e2: ending('e2', 'E2｜警报已经发出', '最终提醒仍在关单前发布，3类风险和官方核验路径可用。部分证据、止损时点或传播链仍有缺口；这些缺口会按照你本轮的实际选择逐条显示。', '谨慎、隐私保护和抢先预警都可能是正当选择。结局卡描述的是信息代价，不是道德评分。'),
  e3: ending('e3', 'E3｜迟到的完整真相', '1周后，多视角纪录片完整上线。真实发生过的第1期实习、真人沈舟、数字分身和背景中的跑腿员，第1次被放进了同一条时间线。但在这7个晚上里，新的收费批次仍在继续，面向更多人的风险预警来得太晚了。', '调查深度与发布时机需要并行设计。可以先发布经过核实的风险和求助路径，再继续完成长篇调查。'),
  e4: ending('e4', 'E4｜证人退出', '未经同意的原件进入公开传播。受影响者退出采访，林知夏下架材料、通知当事人并保存泄露记录。公开叙事线中断，当事人的独立求助渠道仍然存在。', '反诈不能以再次伤害受害者为代价。持有证据不等于拥有公开权，完整材料应交给有权限的机构。'),
  e5: ending('e5', 'E5｜借来的脸', '模糊更正没有解释第1期实习与第2期实习招募、真实技术与虚假授权的边界。星桥把“信息不完整”截成“媒体已澄清”，冒名视频继续在小群流转。', '更正需要指出具体风险和核验路径。含糊提醒容易被截取成新的信用背书。'),
  e6: ending('e6', 'E6｜被借用的脸（隐藏结局）', '你接受了模糊处理，又先发了缺少原片对照的冒名警报。一个月后，那段借林知夏的脸说“已核实”的视频脱离上下文，成了新生群里的宣传片。', 'AI冒名内容要及时止扩散，也要尽快补上原始文件、来源记录和清晰对照。')
}

export const earlyProgress = {
  a01: 4, a01b: 5, a02: 6, a02b: 7, a03: 8, a04: 8, a05: 9, a06: 9, q01: 10,
  b1a: 11, b1a2: 11, b1a3: 12, b1b: 12,
  c01: 13, c02: 13, c02b: 14, c03: 14, c04: 15, c05: 15, c06: 16, c07: 16,
  c07b: 17, c08: 17, c09: 17, c10: 18, c11: 18, q02: 18,
  b2a: 19, b2a2: 19, b2a3: 20, b2b: 19, b2b2: 20
}
