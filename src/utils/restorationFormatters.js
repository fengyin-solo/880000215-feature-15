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

const stageToneMap = {
  归档前: 'pending',
  无酸盒暂存: 'staged',
  已归档: 'archived',
  补纸前: 'work',
  控湿中: 'work',
}

export function stageMeta(stage) {
  return {
    label: stage,
    tone: stageToneMap[stage] ?? 'neutral',
  }
}

export function formatDateTime(iso) {
  if (!iso) {
    return ''
  }

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }

  const pad = (value) => String(value).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}
