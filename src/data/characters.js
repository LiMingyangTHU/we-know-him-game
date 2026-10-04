export const characters = [
  {
    id: 'lin', name: '林知夏', role: '校园媒体学生｜我的身份',
    portrait: './assets/characters/01-lin.webp', unlock: ['intro01'],
    known: '我拍摄并剪出了5月论坛的旧片。它被挪用后，我开始逐一核对素材、授权和当事人证言。'
  },
  {
    id: 'liang', name: '梁一舟', role: '大一新生｜准备报名者',
    portrait: './assets/characters/09-liang.webp', unlock: ['a02'],
    known: '他在“零点锁名额”的付款页前来问我。我最先从他发来的封面认出了5月旧片。'
  },
  {
    id: 'zhou', name: '周衡', role: '星桥青年实践计划负责人',
    portrait: './assets/characters/03-zhou.webp', unlock: ['a03'],
    known: '我最先在第2期实习招募群里看到他。他管群、催缴和处理退款，说起第1期实习时总像项目仍在正常延续。'
  },
  {
    id: 'song', name: '宋岚', role: '材料学教师｜论文返修中',
    portrait: './assets/characters/08-song.webp', unlock: ['c01'],
    known: '她联系我索取5月未剪原片。她要在9月25日前补交论文检测数据，还要赶月底的教授职称申报。13.8万元检测合同已付9.42万元，样品仍在实验室。'
  },
  {
    id: 'shen', name: '沈舟', role: '校友｜曾从事材料研究工作',
    portrait: './assets/characters/02-shen.webp', unlock: ['c03'],
    known: '我5月拍到他在讲座上答疑，技术细节说得很准。他现在还能不能代表研究院安排检测，我还没核实。'
  },
  {
    id: 'xu', name: '许橙', role: '第1期实习生',
    portrait: './assets/characters/06-xu.webp', unlock: ['q03intro'],
    known: '她告诉我，第1期实习真的到岗、也真的收到过工资。正因为这段经历是真的，她才信了后来的第2期实习招募。'
  },
  {
    id: 'jiang', name: '姜宁', role: '宋岚的研究生',
    portrait: './assets/characters/07-jiang.webp', unlock: ['q03intro'],
    known: '她是宋老师的研究生，也和“沈舟”保持过私人往来。她愿意给我看部分聊天，但公开到哪一句，必须由她决定。'
  },
  {
    id: 'lu', name: '陆鸣', role: '5月论坛承办人',
    portrait: './assets/characters/05-lu.webp', unlock: ['q04archive'],
    known: '他把5月活动的完整合作函、排班表和未剪素材交给我核对。这些存档只能说明当时发生过什么。'
  },
  {
    id: 'tang', name: '唐遇', role: '配送与物料跑腿员',
    portrait: './assets/characters/04-tang.webp', unlock: ['q07name'],
    known: '我先在5月物料排班表里看到这个名字，后来又在几段画面里看见相似的配送箱。这些只是连接线索，还不能说明他做了什么。'
  }
]

export function unlockedCharacters(visited = []) {
  const seen = new Set(visited)
  return characters.filter(person => person.unlock.some(nodeId => seen.has(nodeId)))
}
