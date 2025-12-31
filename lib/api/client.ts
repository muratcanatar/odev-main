export interface ApiErrorShape {
  message: string
  status?: number
  details?: unknown
}

export class ApiError extends Error {
  status?: number
  details?: unknown

  constructor({ message, status, details }: ApiErrorShape) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}

export interface ApiFetchOptions extends RequestInit {
  timeoutMs?: number
}

const DEFAULT_TIMEOUT_MS = 8000

export async function apiFetch<TResponse>(path: string, options: ApiFetchOptions = {}): Promise<TResponse> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, signal, headers, ...rest } = options
  const controller = new AbortController()

  const timeout = setTimeout(() => controller.abort("timeout"), timeoutMs)
  if (signal) {
    signal.addEventListener("abort", () => controller.abort(signal.reason), { once: true })
  }

  try {
    const response = await fetch(path, {
      ...rest,
      headers: {
        Accept: "application/json",
        ...headers,
      },
      signal: controller.signal,
    })

    const contentType = response.headers.get("content-type")
    const isJson = contentType?.includes("application/json")
    const payload = isJson ? await response.json() : await response.text()

    if (!response.ok) {
      const message = typeof payload === "string" ? payload : payload?.message ?? "Request failed"
      throw new ApiError({ message, status: response.status, details: payload })
    }

    return payload as TResponse
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError({ message: "Request timed out", details: error })
    }

    throw new ApiError({ message: "Network request failed", details: error })
  } finally {
    clearTimeout(timeout)
  }
}
