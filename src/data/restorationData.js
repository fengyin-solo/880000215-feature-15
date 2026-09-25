export const restorationNavigation = [
  { label: '修复总览', to: '/' },
  { label: '批次档案', to: '/batches' },
  { label: '任务清单', to: '/tasks' },
  { label: '无酸盒归档', to: '/archive' },
]

export const restorationHero = {
  title: '古籍虫蛀修复批次板',
  description:
    '聚焦修复批次、控湿参数和文献归档风险，适合作为修复工作室内部业务系统的前端原型。',
  backlogLabel: '待处理批次',
  backlogValue: '12 册',
  note: '高湿季节前优先清理虫道扩散页。',
}

export const restorationBatches = [
  {
    code: 'A-03',
    title: '明抄本县志残卷',
    pages: '17-29',
    risk: 'high',
    status: '补纸前',
    note: '虫道集中在装订线外沿。',
  },
  {
    code: 'B-11',
    title: '碑帖拓片册页',
    pages: '5-14',
    risk: 'medium',
    status: '控湿中',
    note: '需先降湿 48 小时，再进入纤维加固。',
  },
  {
    code: 'C-02',
    title: '戏曲抄本散页',
    pages: '1-9',
    risk: 'low',
    status: '归档前',
    note: '边角缺损明显，建议先做透明托裱。',
  },
  {
    code: 'D-04',
    title: '清刻本家谱残册',
    pages: '31-36',
    risk: 'medium',
    status: '归档前',
    note: '开本偏大，入盒前需核对大号盒位尺寸。',
  },
  {
    code: 'E-05',
    title: '地方志舆图散页',
    pages: '舆1-舆4',
    risk: 'high',
    status: '归档前',
    note: '第 3 幅托裱后尚未平整定型。',
  },
  {
    code: 'F-06',
    title: '民国契约文书',
    pages: '契1-契3',
    risk: 'low',
    status: '归档前',
    note: '尚未登记无酸盒盒号。',
  },
  {
    code: 'G-07',
    title: '佛经残卷一叶',
    pages: '残叶1',
    risk: 'low',
    status: '无酸盒暂存',
    note: '已入原盒 AF-Z-07，等待统一封存。',
  },
  {
    code: 'H-08',
    title: '活字本试墨页',
    pages: '12-15',
    risk: 'medium',
    status: '归档前',
    note: '登记盒号疑似与戏曲抄本重号。',
  },
  {
    code: 'I-09',
    title: '活字本目录页',
    pages: '目1-目4',
    risk: 'low',
    status: '已归档',
    note: '随大号盒 AF-D-02 封存入库。',
  },
]

export const restorationEnvironment = [
  {
    label: '相对湿度',
    value: '52%',
    note: '控制线 50% - 55%',
  },
  {
    label: '纸浆补配',
    value: '2 批',
    note: '桑皮纤维待过滤',
  },
  {
    label: '紫外检查',
    value: '4 页',
    note: '夜间统一复核霉斑残留',
  },
]

export const restorationSteps = [
  '拍照建档并标注虫蛀起止页。',
  '低压吸附除尘，保留边角碎纤维。',
  '喷雾回软后局部补纸，不做整页过度清洗。',
  '平整定型 8 小时后转入无酸盒暂存。',
]

export const restorationTasks = [
  {
    title: '明抄本县志残卷',
    stage: '补纸前',
    risk: 'high',
    owner: '韩澈',
    note: '虫道贯穿标题栏，需先固色。',
  },
  {
    title: '碑帖拓片册页',
    stage: '控湿中',
    risk: 'medium',
    owner: '陆宁',
    note: '边缘卷曲，可延后压平。',
  },
  {
    title: '戏曲抄本散页',
    stage: '归档前',
    risk: 'low',
    owner: '周恬',
    note: '托裱完成，等待入盒核位。',
  },
  {
    title: '清刻本家谱残册',
    stage: '归档前',
    risk: 'medium',
    owner: '韩澈',
    note: '开本偏大，需核对大号盒位。',
  },
  {
    title: '地方志舆图散页',
    stage: '归档前',
    risk: 'high',
    owner: '陆宁',
    note: '第 3 幅托裱后尚未平整。',
  },
  {
    title: '民国契约文书',
    stage: '归档前',
    risk: 'low',
    owner: '周恬',
    note: '尚未登记盒号。',
  },
  {
    title: '佛经残卷一叶',
    stage: '无酸盒暂存',
    risk: 'low',
    owner: '韩澈',
    note: '原盒 AF-Z-07，等待统一封存。',
  },
  {
    title: '活字本试墨页',
    stage: '归档前',
    risk: 'medium',
    owner: '陆宁',
    note: '盒号待核对，疑似与戏曲抄本重号。',
  },
  {
    title: '活字本目录页',
    stage: '已归档',
    risk: 'low',
    owner: '周恬',
    note: '随大号盒 AF-D-02 封存。',
  },
]

// 归档阶段：归档前（待入盒）→ 无酸盒暂存 → 已归档
export const ARCHIVE_STATUS = {
  PENDING: 'pre-archive',
  STAGED: 'staged',
  ARCHIVED: 'archived',
}

export const ARCHIVE_STATUS_LABELS = {
  [ARCHIVE_STATUS.PENDING]: '归档前',
  [ARCHIVE_STATUS.STAGED]: '无酸盒暂存',
  [ARCHIVE_STATUS.ARCHIVED]: '已归档',
}

// 无酸盒盒型规格，尺寸单位 mm，盒号格式 AF-{盒型}-{两位序号}
export const acidFreeBoxSpecs = [
  {
    type: 'Z',
    label: '小号无酸盒',
    maxWidth: 320,
    maxHeight: 230,
  },
  {
    type: 'B',
    label: '标准无酸盒',
    maxWidth: 380,
    maxHeight: 270,
  },
  {
    type: 'D',
    label: '大号无酸盒',
    maxWidth: 450,
    maxHeight: 320,
  },
]

function buildPieces(batchCode, labels, size, unflattened = []) {
  return labels.map((label, index) => ({
    id: `${batchCode}-p${index + 1}`,
    label,
    width: size.width,
    height: size.height,
    flattened: !unflattened.includes(label),
  }))
}

const pageLabels = (start, end, prefix = '第', suffix = '页') => {
  const labels = []
  for (let page = start; page <= end; page += 1) {
    labels.push(`${prefix}${page}${suffix}`)
  }
  return labels
}

export const archiveEntries = [
  {
    id: 'entry-c02',
    batchCode: 'C-02',
    title: '戏曲抄本散页',
    boxNumber: 'AF-B-04',
    locked: false,
    status: ARCHIVE_STATUS.PENDING,
    stagedAt: null,
    archivedAt: null,
    pieces: buildPieces('C-02', pageLabels(1, 9), { width: 305, height: 220 }),
  },
  {
    id: 'entry-d04',
    batchCode: 'D-04',
    title: '清刻本家谱残册',
    boxNumber: 'AF-D-03',
    locked: false,
    status: ARCHIVE_STATUS.PENDING,
    stagedAt: null,
    archivedAt: null,
    pieces: buildPieces('D-04', pageLabels(31, 36), { width: 468, height: 336 }),
  },
  {
    id: 'entry-e05',
    batchCode: 'E-05',
    title: '地方志舆图散页',
    boxNumber: 'AF-Z-09',
    locked: false,
    status: ARCHIVE_STATUS.PENDING,
    stagedAt: null,
    archivedAt: null,
    pieces: buildPieces(
      'E-05',
      pageLabels(1, 4, '舆图 ', '幅'),
      { width: 300, height: 212 },
      ['舆图 3幅'],
    ),
  },
  {
    id: 'entry-f06',
    batchCode: 'F-06',
    title: '民国契约文书',
    boxNumber: '',
    locked: false,
    status: ARCHIVE_STATUS.PENDING,
    stagedAt: null,
    archivedAt: null,
    pieces: buildPieces('F-06', pageLabels(1, 3, '契约 ', '号'), {
      width: 286,
      height: 198,
    }),
  },
  {
    id: 'entry-h08',
    batchCode: 'H-08',
    title: '活字本试墨页',
    boxNumber: 'AF-B-04',
    locked: false,
    status: ARCHIVE_STATUS.PENDING,
    stagedAt: null,
    archivedAt: null,
    pieces: buildPieces('H-08', pageLabels(12, 15), { width: 260, height: 186 }),
  },
  {
    // 已存在批次：沿用原盒号，暂存中，盒号不允许被自动改写
    id: 'entry-g07',
    batchCode: 'G-07',
    title: '佛经残卷一叶',
    boxNumber: 'AF-Z-07',
    locked: true,
    status: ARCHIVE_STATUS.STAGED,
    stagedAt: '2026-09-22T10:30:00',
    archivedAt: null,
    pieces: buildPieces('G-07', ['残叶 1'], { width: 312, height: 222 }),
  },
  {
    // 已存在批次：沿用原盒号，已完成入盒封存
    id: 'entry-i09',
    batchCode: 'I-09',
    title: '活字本目录页',
    boxNumber: 'AF-D-02',
    locked: true,
    status: ARCHIVE_STATUS.ARCHIVED,
    stagedAt: '2026-09-18T09:15:00',
    archivedAt: '2026-09-20T16:05:00',
    pieces: buildPieces('I-09', pageLabels(1, 4, '目录 ', '页'), {
      width: 402,
      height: 286,
    }),
  },
]
