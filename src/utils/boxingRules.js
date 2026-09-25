import { acidFreeBoxSpecs } from '../data/restorationData'

// 盒号格式：AF-{盒型字母}-{两位序号}
const BOX_NUMBER_PATTERN = /^AF-([A-Z])-(\d{2})$/i

export function normalizeBoxNumber(value) {
  return String(value ?? '').trim().toUpperCase()
}

export function parseBoxNumber(value) {
  const match = normalizeBoxNumber(value).match(BOX_NUMBER_PATTERN)
  if (!match) {
    return null
  }

  const [, type, serial] = match
  return {
    type,
    serial: Number(serial),
    normalized: normalizeBoxNumber(value),
  }
}

export function getBoxSpec(value) {
  const parsed = parseBoxNumber(value)
  if (!parsed) {
    return null
  }
  return acidFreeBoxSpecs.find((spec) => spec.type === parsed.type) ?? null
}

// 取一批文献对象中最占位置的一件（宽、高分别取最大值）
export function entryMaxSize(pieces = []) {
  return pieces.reduce(
    (result, piece) => ({
      width: Math.max(result.width, piece.width),
      height: Math.max(result.height, piece.height),
    }),
    { width: 0, height: 0 },
  )
}

export function fitsBox(size, spec) {
  return size.width <= spec.maxWidth && size.height <= spec.maxHeight
}

// 入盒标准编码：
// box-required   已登记盒号
// box-type       盒号对应已登记盒型
// box-unique     盒号未与其它批次重号
// size-limit     尺寸不超过盒位上限
// flattened      整批对象均已平整
export const BOXING_CRITERIA = [
  {
    code: 'box-required',
    label: '已登记盒号',
  },
  {
    code: 'box-type',
    label: '盒型已登记',
  },
  {
    code: 'box-unique',
    label: '盒号未重号',
  },
  {
    code: 'size-limit',
    label: '尺寸未超盒位上限',
  },
  {
    code: 'flattened',
    label: '整批已平整',
  },
]

export function evaluateEntry(entry, occupiedBoxNumbers = []) {
  const boxNumber = normalizeBoxNumber(entry.boxNumber)
  const spec = getBoxSpec(boxNumber)
  const size = entryMaxSize(entry.pieces)
  const unflattened = (entry.pieces ?? []).filter((piece) => !piece.flattened)

  const isDuplicate =
    boxNumber !== '' &&
    occupiedBoxNumbers.some((occupied) => occupied === boxNumber)

  const checks = []

  checks.push({
    code: 'box-required',
    label: '已登记盒号',
    passed: boxNumber !== '',
    detail: boxNumber === '' ? '尚未登记无酸盒盒号' : `盒号 ${boxNumber}`,
  })

  checks.push({
    code: 'box-type',
    label: '盒型已登记',
    passed: Boolean(spec),
    detail: spec
      ? `${spec.label}（${spec.maxWidth} × ${spec.maxHeight} mm）`
      : boxNumber === ''
        ? '待登记盒号后核对盒型'
        : '盒号未匹配已登记盒型（Z / B / D）',
  })

  checks.push({
    code: 'box-unique',
    label: '盒号未重号',
    passed: !isDuplicate,
    detail: isDuplicate
      ? `盒号 ${boxNumber} 已分配给其它批次，不能重复入盒`
      : boxNumber === ''
        ? '待登记盒号后查重'
        : '未与其它批次重号',
  })

  checks.push({
    code: 'size-limit',
    label: '尺寸未超盒位上限',
    passed: Boolean(spec) && fitsBox(size, spec),
    detail: !spec
      ? '盒型未知，暂无法核对尺寸'
      : `${size.width} × ${size.height} mm，` +
        (fitsBox(size, spec)
          ? `未超 ${spec.label}上限 ${spec.maxWidth} × ${spec.maxHeight} mm`
          : `超过 ${spec.label}上限 ${spec.maxWidth} × ${spec.maxHeight} mm，请更换更大盒型`),
  })

  checks.push({
    code: 'flattened',
    label: '整批已平整',
    passed: unflattened.length === 0,
    detail:
      unflattened.length === 0
        ? `整批 ${entry.pieces?.length ?? 0} 件均已平整`
        : `${unflattened.length} 件尚未平整：${unflattened.map((piece) => piece.label).join('、')}`,
  })

  return {
    checks,
    passedChecks: checks.filter((check) => check.passed),
    failedChecks: checks.filter((check) => !check.passed),
    canBox: checks.every((check) => check.passed),
    size,
    spec,
  }
}

// 为一批尺寸为 size 的对象，找出一个未被占用的可用盒号：优先选能容纳的最小盒型
export function suggestBoxNumber(size, occupiedBoxNumbers = []) {
  const occupied = new Set(occupiedBoxNumbers)
  const candidates = acidFreeBoxSpecs
    .filter((spec) => fitsBox(size, spec))
    .sort((a, b) => a.maxWidth - b.maxWidth || a.maxHeight - b.maxHeight)

  for (const spec of candidates) {
    for (let serial = 1; serial <= 99; serial += 1) {
      const candidate = `AF-${spec.type}-${String(serial).padStart(2, '0')}`
      if (!occupied.has(candidate)) {
        return candidate
      }
    }
  }

  return ''
}
