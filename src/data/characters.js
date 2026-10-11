// The dossier records only what Lin Zhixia has encountered by this point.
// Updates are observations, never a verdict or a prompt about what to check next.
export const characters = [
  {
    id: 'lin', name: '林知夏', role: '校园媒体学生',
    portrait: './assets/characters/01-lin.webp', unlock: ['intro01'],
    known: '我在校园媒体做拍摄和剪辑。5月那条论坛短片是我做的；今天，我看见它换了名字，出现在一张收费报名页旁边。',
    updates: [
      { id: 'lin-fake-video', at: 'q09intro', summary: '新生群出现了一段用我面孔说话的视频。', known: '新生群里出现一段用我面孔说话的短视频。片中还有社团没有公开过的备用机位。' }
    ]
  },
  {
    id: 'liang', name: '梁一舟', role: '大一新生',
    portrait: './assets/characters/09-liang.webp', unlock: ['a02'],
    known: '他在付款前把第2期实习报名链接转给我。群里说今晚锁名额，页面标着2800元。',
    updates: [
      { id: 'liang-paused-warning', at: 'b1a3', summary: '梁一舟退出了付款页。', known: '我发出暂停付款的提醒后，他关掉了付款页，还把提醒转给室友。' },
      { id: 'liang-paused-record', at: 'b1b', summary: '梁一舟先保存了报名材料。', known: '他把报名页、宣讲视频和收款户名保存下来，发给我核对。录屏结束时，付款倒计时还在走。' }
    ]
  },
  {
    id: 'zhou', name: '周衡', role: '第2期实习招募群管理员',
    portrait: './assets/characters/03-zhou.webp', unlock: ['a03'],
    known: '我在第2期实习招募群看见他发的公告。报名页上的名额费收款方是星桥。',
    updates: [
      { id: 'zhou-refund-meeting', at: 'q08intro', summary: '周衡带来一份退款清单。', role: '招募群管理员｜星桥退款联系人', known: '周衡约我在校外咖啡馆见面，递来星桥的退款清单。他说可以处理许橙和宋老师的两笔款，也提出撤掉旧片。' }
    ]
  },
  {
    id: 'song', name: '宋岚', role: '材料学教师',
    portrait: './assets/characters/08-song.webp', unlock: ['c01'],
    known: '她来电说通过“沈舟”办了一笔加急检测，正式订单和取样单还没到，问我能否带来5月讲座的原片。',
    updates: [
      { id: 'song-receipts', at: 'c02b', summary: '宋老师给我看了合同与付款回执。', known: '她赶着论文返修，也在准备教授职称申报。我看了她的合同和2张回执：学校付了7.56万元，她本人又垫了1.86万元。样品仍在实验室。' },
      { id: 'song-official-reply', at: 'q10intro', summary: '研究院回信提到了宋老师的检测订单。', known: '她赶着论文返修和教授职称申报。我见过合同与付款回执：学校付了7.56万元，她个人垫了1.86万元，样品仍在实验室。研究院的具名回复写明，院内没有这笔检测订单。' }
    ]
  },
  {
    id: 'shen', name: '沈舟', role: '校友｜5月论坛讲者',
    portrait: './assets/characters/02-shen.webp', unlock: ['c03'],
    known: '我5月拍到他本人在论坛上回答材料检测问题。宋老师记得他当时讲过的分析方法。',
    updates: [
      { id: 'shen-official-reply', at: 'q10intro', summary: '研究院确认了沈舟的任职时间。', role: '校友｜研究院前工程师', known: '研究院的具名回复写明：沈舟曾在院里工作，已于2024年离职。我保存的5月讲座原片拍到了他本人。' }
    ]
  },
  {
    id: 'xu', name: '许橙', role: '第1期实习生',
    portrait: './assets/characters/06-xu.webp', unlock: ['q03intro'],
    known: '她参加过5月的第1期实习，带着那时的工资记录来和我座谈。',
    updates: [
      { id: 'xu-first-testimony', at: 'q03a', summary: '许橙讲了第2期实习报名后的经历。', role: '第1期实习生｜第2期报名者', known: '她告诉我，第1期实习确实发过工资。后来她为第2期实习交了2800元，等了4个月仍没收到岗位安排。' },
      { id: 'xu-refund-list', at: 'q08intro', summary: '退款清单列出了许橙的报名费。', role: '第1期实习生｜第2期报名者', known: '我看过她的第1期实习工资记录。周衡带来的退款清单里，列着她为第2期实习支付的2800元。' }
    ]
  },
  {
    id: 'jiang', name: '姜宁', role: '宋岚的研究生',
    portrait: './assets/characters/07-jiang.webp', unlock: ['q03intro'],
    known: '她是宋老师的研究生，说自己在线下见过沈舟。座谈时，她只给我看了愿意展示的聊天片段。',
    updates: [
      { id: 'jiang-chat', at: 'q05intro', summary: '姜宁给我看了两段不同时期的聊天。', known: '她选出并打码了两段聊天给我看：5月谈实验时，沈舟的回复较长；9月借钱时，同一账号连发短句。' },
      { id: 'jiang-transfer', at: 'q08ledger', summary: '退款清单里没有姜宁的转账。', known: '她给我看过两段打码聊天，又拿出了向沈舟个人账户转出的12000元记录。周衡带来的星桥退款清单里没有这笔钱。' }
    ]
  },
  {
    id: 'lu', name: '陆鸣', role: '5月论坛承办人',
    portrait: './assets/characters/05-lu.webp', unlock: ['q04archive'],
    known: '我去社团档案室找他。他调出了5月论坛的合作函完整页和未剪素材。',
    updates: [
      { id: 'lu-roster', at: 'q07name', summary: '陆鸣找出了5月物料排班表。', known: '陆鸣翻出5月论坛的物料排班表给我看，其中有唐遇的签收名。他还记得6月以后在社团见过唐遇。' }
    ]
  },
  {
    id: 'tang', name: '唐遇', role: '5月论坛物料签收人',
    portrait: './assets/characters/04-tang.webp', unlock: ['q07name'],
    known: '我在5月论坛的物料排班表上看到唐遇这个名字。陆鸣说，6月以后社团也见过他。',
    updates: []
  }
]

export function unlockedCharacters(visited = []) {
  const seen = new Set(visited)
  return characters.filter(person => person.unlock.some(nodeId => seen.has(nodeId))).map(person => {
    const active = person.updates.filter(update => seen.has(update.at))
    const profile = active.reduce((current, update) => ({ ...current, role: update.role || current.role, known: update.known, updated: true, lastUpdateId: update.id }), { ...person, updated: false })
    if (person.id === 'xu' && seen.has('q03a') && seen.has('q08intro')) profile.known += ' 她还告诉我，交费后等了4个月，始终没有收到岗位安排。'
    return profile
  })
}

export function characterUpdatesAt(nodeId, visited = []) {
  const seen = new Set(visited)
  return characters.filter(person => person.unlock.some(id => seen.has(id))).flatMap(person =>
    person.updates.filter(update => update.at === nodeId).map(update => ({ ...update, personId: person.id, name: person.name, portrait: person.portrait }))
  )
}
