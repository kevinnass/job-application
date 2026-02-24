export const parseJsonSafely = (val: any) => {
  if (typeof val !== 'string') return val
  try {
    return JSON.parse(val)
  } catch (e) {
    return val
  }
}

export const formatProposedSalary = (val: any) => {
  if (!val) return '—'
  const parsed = parseJsonSafely(val)
  
  if (typeof parsed === 'object' && parsed !== null) {
    const { min, max, currency = '€', frequency = 'an' } = parsed
    const freqLabel = frequency === 'jour' ? '/ j' : frequency === 'mois' ? '/ m' : ''
    
    if (min && max) {
      return `${min} - ${max}${currency}${freqLabel}`
    } else if (min || max) {
      return `${min || max}${currency}${freqLabel}`
    }
  }
  
  return String(parsed)
}

export const formatSkills = (val: any): string[] => {
  if (!val) return []
  const parsed = parseJsonSafely(val)
  
  if (Array.isArray(parsed)) {
    return parsed.map(s => String(s).trim())
  }
  
  if (typeof parsed === 'string') {
    return parsed.split(',').map(s => s.trim()).filter(Boolean)
  }
  
  return []
}

export const formatCompanyInfo = (val: any) => {
  if (!val) return '—'
  const parsed = parseJsonSafely(val)
  
  if (typeof parsed === 'object' && parsed !== null) {
    // Try to find a readable description or join keys
    if (parsed.description) return parsed.description
    if (parsed.sectors) return Array.isArray(parsed.sectors) ? parsed.sectors.join(', ') : parsed.sectors
    if (parsed.location) return parsed.location
    
    // Fallback to joining first level string values
    return Object.values(parsed)
      .filter(v => typeof v === 'string')
      .join(' · ')
  }
  
  return String(parsed)
}

export const formatMissions = (val: any) => {
  if (!val) return '—'
  const parsed = parseJsonSafely(val)
  
  if (Array.isArray(parsed)) {
    return parsed.join('\n• ').replace(/^/, '• ')
  }
  
  if (typeof parsed === 'object' && parsed !== null) {
    return Object.values(parsed).filter(v => typeof v === 'string').join('\n')
  }
  
  return String(parsed)
}
