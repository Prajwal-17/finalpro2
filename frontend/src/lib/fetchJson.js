/**
 * Lightweight JSON fetch wrapper for future integrations.
 * Keeps the logic minimal per project guidelines.
 */
export async function fetchJson(url, options = {}) {
  const { headers, ...rest } = options
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(headers ?? {}),
    },
    ...rest,
  })

  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`)
    error.status = response.status
    throw error
  }

  return response.json()
}

export default fetchJson

