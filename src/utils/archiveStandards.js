// 无酸盒入盒标准：逐条判定并返回未满足的条件，供清单页标出
export const BOXING_RULES = [
  { key: 'flattened', label: '整批对象平整定型完成' },
  { key: 'size', label: '尺寸不超过盒位上限' },
  { key: 'boxNo', label: '盒号已分配且全清单唯一' },
]

export function sizeExceedsLimit(size, limit) {
  return (
    size.length > limit.length ||
    size.width > limit.width ||
    size.thickness > limit.thickness
  )
}

export function hasDuplicateBoxNo(item, items) {
  if (!item.boxNo) return false
  return items.some((peer) => peer.id !== item.id && peer.boxNo === item.boxNo)
}

export function evaluateBoxing(item, items, limit) {
  const failures = []
  if (!item.flattened) failures.push('整批尚未平整')
  if (sizeExceedsLimit(item.size, limit)) failures.push('尺寸超过盒位上限')
  if (!item.boxNo) failures.push('盒号未分配')
  else if (hasDuplicateBoxNo(item, items)) failures.push('盒号重复')
  return failures
}

// 取下一个可用盒号；只读取现有盒号，调用方负责不覆盖已有盒号
export function nextBoxNo(items, prefix = 'HX') {
  const used = new Set(items.map((item) => item.boxNo).filter(Boolean))
  const serials = [...used]
    .map((boxNo) => Number(String(boxNo).replace(`${prefix}-`, '')))
    .filter((num) => Number.isInteger(num))
  let serial = serials.length ? Math.max(...serials) + 1 : 101
  while (used.has(`${prefix}-${serial}`)) serial += 1
  return `${prefix}-${serial}`
}
