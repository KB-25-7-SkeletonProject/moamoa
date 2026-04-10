const DEFAULT_USER_ID = 'u001'
const SESSION_USER_KEY = 'moamoa-user'
const TOKEN_KEY = 'token'

export function getStoredUser() {
  if (typeof window === 'undefined') {
    return null
  }

  const rawUser = window.sessionStorage.getItem(SESSION_USER_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser)
  } catch {
    return null
  }
}

export function getStoredUserId() {
  if (typeof window === 'undefined') {
    return DEFAULT_USER_ID
  }

  const sessionUserId = getStoredUser()?.id

  if (sessionUserId) {
    return sessionUserId
  }

  const tokenUserId = window.localStorage.getItem(TOKEN_KEY)

  if (tokenUserId) {
    return tokenUserId
  }

  return DEFAULT_USER_ID
}
