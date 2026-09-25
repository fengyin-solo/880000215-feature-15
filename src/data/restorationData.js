export const restorationNavigation = [
  { label: '修复总览', to: '/' },
  { label: '批次档案', to: '/batches' },
  { label: '任务清单', to: '/tasks' },
  { label: '归档清单', to: '/archive' },
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
    archiveStatus: '待入盒',
    boxNo: 'HX-102',
    note: '虫道贯穿标题栏，需先固色。',
  },
  {
    title: '碑帖拓片册页',
    stage: '控湿中',
    risk: 'medium',
    owner: '陆宁',
    archiveStatus: '待入盒',
    boxNo: 'HX-102',
    note: '边缘卷曲，可延后压平。',
  },
  {
    title: '戏曲抄本散页',
    stage: '归档前',
    risk: 'low',
    owner: '周恬',
    archiveStatus: '暂存',
    boxNo: 'HX-101',
    note: '等待封套尺寸确认。',
  },
  {
    title: '道藏辑要零册',
    stage: '归档前',
    risk: 'low',
    owner: '沈昀',
    archiveStatus: '待入盒',
    boxNo: '',
    note: '新登记对象，等待分配无酸盒。',
  },
]

// 无酸盒盒位上限（厘米），待入盒对象任一边超出即不允许入盒
export const archiveBoxLimit = {
  length: 42,
  width: 32,
  thickness: 6,
}

export const archiveStatuses = ['待入盒', '暂存', '已入盒']

export const archiveObjects = [
  {
    id: 'OBJ-300',
    batchCode: 'B-04',
    title: '古琴谱残册',
    pages: '3-8',
    boxNo: 'HX-099',
    size: { length: 26, width: 19, thickness: 2 },
    flattened: true,
    status: '已入盒',
    stagedAt: '2026-09-15 10:20',
    completedAt: '2026-09-18 16:40',
  },
  {
    id: 'OBJ-301',
    batchCode: 'C-02',
    title: '戏曲抄本散页',
    pages: '1-9',
    boxNo: 'HX-101',
    size: { length: 28, width: 21, thickness: 3 },
    flattened: true,
    status: '暂存',
    stagedAt: '2026-09-24 09:30',
    completedAt: '',
  },
  {
    id: 'OBJ-302',
    batchCode: 'B-11',
    title: '碑帖拓片册页',
    pages: '5-14',
    boxNo: 'HX-102',
    size: { length: 46, width: 33, thickness: 4 },
    flattened: true,
    status: '待入盒',
    stagedAt: '',
    completedAt: '',
  },
  {
    id: 'OBJ-303',
    batchCode: 'A-03',
    title: '明抄本县志残卷',
    pages: '17-29',
    boxNo: 'HX-102',
    size: { length: 30, width: 22, thickness: 5 },
    flattened: false,
    status: '待入盒',
    stagedAt: '',
    completedAt: '',
  },
  {
    id: 'OBJ-304',
    batchCode: 'D-07',
    title: '道藏辑要零册',
    pages: '1-6',
    boxNo: '',
    size: { length: 24, width: 18, thickness: 2 },
    flattened: true,
    status: '待入盒',
    stagedAt: '',
    completedAt: '',
  },
]
