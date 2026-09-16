import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

type JsonResponseOptions = {
  status?: number
}

export function jsonSuccess<T>(data: T, options?: JsonResponseOptions) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    {
      status: options?.status ?? 200,
    },
  )
}

export function jsonError(
  status: number,
  code: string,
  message: string,
  details?: unknown,
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details === undefined ? {} : { details }),
      },
    },
    { status },
  )
}

export function handleRouteError(error: unknown) {
  if (error instanceof SyntaxError) {
    return jsonError(400, 'INVALID_JSON', 'Request body must be valid JSON.')
  }

  if (error instanceof ZodError) {
    return jsonError(400, 'VALIDATION_ERROR', 'Request validation failed.', error.flatten())
  }

  if (error instanceof Error) {
    if (error.message.includes('DATABASE_URL')) {
      return jsonError(500, 'CONFIGURATION_ERROR', 'Database configuration is missing on the server.')
    }

    if (
      error.message.includes('positive integer') ||
      error.message.includes('non-negative integer')
    ) {
      return jsonError(400, 'VALIDATION_ERROR', error.message)
    }
  }

  return jsonError(500, 'DATABASE_ERROR', 'The database request could not be completed.')
}

export async function readJsonBody(request: Request) {
  const body = await request.text()
  return body ? JSON.parse(body) : {}
}
