const KEY = 'HalalVestss-zakat-result'
export const saveZakatResult = (r) => { try { sessionStorage.setItem(KEY, JSON.stringify(r)) } catch {} }
export const getZakatResult = () => {
  try { return JSON.parse(sessionStorage.getItem(KEY)) } catch { return null }
}
export const clearZakatResult = () => { try { sessionStorage.removeItem(KEY) } catch {} }
