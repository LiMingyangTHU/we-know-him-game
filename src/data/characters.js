export const characters = [
  {
    id: 'lin', name: '林知夏', role: '校园媒体学生｜玩家视角',
    portrait: './assets/characters/01-lin.webp', unlock: ['intro01'],
    known: '五月论坛短片的拍摄与剪辑者。旧片被挪用后，她开始核对素材、授权和当事人证言。'
  },
  {
    id: 'liang', name: '梁一舟', role: '大一新生｜准备报名者',
    portrait: './assets/characters/09-liang.webp', unlock: ['a02'],
    known: '收到“零点锁名额”催促后向林知夏求证，付款状态会受玩家选择影响。'
  },
  {
    id: 'zhou', name: '周衡', role: '星桥青年实践计划负责人',
    portrait: './assets/characters/03-zhou.webp', unlock: ['a03'],
    known: '管理二期招募群和公司收款，常以项目延续、退款和体面处理来维护项目可信度。'
  },
  {
    id: 'song', name: '宋岚', role: '材料学教师｜论文返修中',
    portrait: './assets/characters/08-song.webp', unlock: ['c01'],
    known: '正赶论文返修与职称申报节点，已为所谓加急检测付款，但样品仍在实验室。'
  },
  {
    id: 'shen', name: '沈舟', role: '校友｜曾从事材料研究工作',
    portrait: './assets/characters/02-shen.webp', unlock: ['c03'],
    known: '参加过五月校园讲座，确实懂技术；他当前是否有权安排检测，需要独立核验。'
  },
  {
    id: 'xu', name: '许橙', role: '一期实习生',
    portrait: './assets/characters/06-xu.webp', unlock: ['q03intro'],
    known: '一期真实领到过工资，也因这段真实经历相信了后续二期项目。'
  },
  {
    id: 'jiang', name: '姜宁', role: '宋岚的研究生',
    portrait: './assets/characters/07-jiang.webp', unlock: ['q03intro'],
    known: '与沈舟有持续私人往来和借款纠纷，只同意在明确授权范围内提供聊天材料。'
  },
  {
    id: 'lu', name: '陆鸣', role: '五月论坛承办人',
    portrait: './assets/characters/05-lu.webp', unlock: ['q04archive'],
    known: '保管五月活动的完整合作函、排班表和未剪素材，能说明活动当时的授权边界。'
  },
  {
    id: 'tang', name: '唐遇', role: '配送与物料跑腿员',
    portrait: './assets/characters/04-tang.webp', unlock: ['q07name'],
    known: '名字出现在五月论坛物料排班表上；他与后来多个场景的关系仍需依法核查。'
  }
]

export function unlockedCharacters(visited = []) {
  const seen = new Set(visited)
  return characters.filter(person => person.unlock.some(nodeId => seen.has(nodeId)))
}
