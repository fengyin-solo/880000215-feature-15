export function riskMeta(risk) {
  const map = {
    high: {
      label: '高',
      tone: 'high',
    },
    medium: {
      label: '中',
      tone: 'medium',
    },
    low: {
      label: '低',
      tone: 'low',
    },
  }

  return map[risk] ?? map.low
}

export function archiveStatusMeta(status) {
  const map = {
    待入盒: {
      label: '待入盒',
      tone: 'pending',
    },
    暂存: {
      label: '暂存',
      tone: 'staged',
    },
    已入盒: {
      label: '已入盒',
      tone: 'completed',
    },
  }

  return map[status] ?? map['待入盒']
}

export function formatSize(size) {
  return `${size.length} × ${size.width} × ${size.thickness} cm`
}
