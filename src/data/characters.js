export const characters = [
  {
    id: 'lin', name: '林知夏', role: '校园媒体学生｜我的身份',
    portrait: './assets/characters/01-lin.webp', unlock: ['intro01'],
    known: '我是校园媒体的学生。5月那条论坛短片由我拍摄、剪辑；今天有人把它换了标题，放到了新的实习报名页旁边。'
  },
  {
    id: 'liang', name: '梁一舟', role: '大一新生｜准备报名者',
    portrait: './assets/characters/09-liang.webp', unlock: ['a02'],
    known: '刚入学的新生。他看到第2期实习报名页和“今晚锁名额”的提醒，付款前把链接转来问我。'
  },
  {
    id: 'zhou', name: '周衡', role: '星桥公司负责人｜实习招募群管理员',
    portrait: './assets/characters/03-zhou.webp', unlock: ['a03'],
    known: '我在第2期实习招募群看到他发公告、解释收费和名额安排。5月的第1期实习也有星桥参与；这次是否得到企业授权，我还没查清。'
  },
  {
    id: 'song', name: '宋岚', role: '材料学教师｜论文返修中',
    portrait: './assets/characters/08-song.webp', unlock: ['c01'],
    known: '她正在赶论文返修，也要准备教授职称申报。她找我要5月讲座的未剪原片，想核对当时沈舟介绍的身份。'
  },
  {
    id: 'shen', name: '沈舟', role: '校友｜5月论坛讲者',
    portrait: './assets/characters/02-shen.webp', unlock: ['c03'],
    known: '5月论坛上，我拍到他当面回答材料检测问题，宋老师也认得他。至于他现在在哪里任职、能否代表机构接单，我还要另查。'
  },
  {
    id: 'xu', name: '许橙', role: '第1期实习生',
    portrait: './assets/characters/06-xu.webp', unlock: ['q03intro'],
    known: '她参加过5月的第1期实习。我在座谈会上见到她带来的工资记录；她说后来又报名了第2期实习。'
  },
  {
    id: 'jiang', name: '姜宁', role: '宋岚的研究生',
    portrait: './assets/characters/07-jiang.webp', unlock: ['q03intro'],
    known: '宋老师的研究生。她说自己在线下见过沈舟，也愿意让我看一小部分聊天；哪些能公开，她要逐句确认。'
  },
  {
    id: 'lu', name: '陆鸣', role: '5月论坛承办人',
    portrait: './assets/characters/05-lu.webp', unlock: ['q04archive'],
    known: '他负责5月论坛的社团活动联络和存档。我去找他时，他从档案柜里调出了合作函完整页和未剪素材。'
  },
  {
    id: 'tang', name: '唐遇', role: '5月论坛物料签收人',
    portrait: './assets/characters/04-tang.webp', unlock: ['q07name'],
    known: '我在陆鸣的5月物料排班表上看到这个名字。几段画面里出现了相似的配送箱，但镜头没拍清人，我还不能把姓名和画面里的跑腿员直接画等号。'
  }
]

export function unlockedCharacters(visited = []) {
  const seen = new Set(visited)
  return characters.filter(person => person.unlock.some(nodeId => seen.has(nodeId)))
}
