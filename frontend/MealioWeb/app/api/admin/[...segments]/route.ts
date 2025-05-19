import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
const REMOTE = process.env.NEXT_PUBLIC_MEALIO_API_URL!

// central verify + role-check
async function verifyAdmin(req: NextRequest) {
  // get the cookie object
  const cookie = req.cookies.get('token');
  if (!cookie) {
    throw new NextResponse('Not authenticated', { status: 401 });
  }

  // extract the string value
  const token = cookie.value;

  const { payload } = await jwtVerify(token, SECRET)
  if (payload.role !== 'admin')
    throw new NextResponse('Forbidden', { status: 403 })

  return token
}

// universal proxy
async function handleProxy(req: NextRequest, segments: string[]) {
  const token = await verifyAdmin(req)
  const url = `${REMOTE}/admin/${segments.join('/')}`

  // forward headers & body
  const headers: Record<string,string> = {
    Authorization: `Bearer ${token}`
  }
  const contentType = req.headers.get('content-type')
  if (contentType) headers['Content-Type'] = contentType

  const init: RequestInit = {
    method: req.method,
    headers,
    // only forward a body for non-GET/HEAD verbs
    body: ['GET','HEAD'].includes(req.method) ? null : await req.text()
  }

  const remote = await fetch(url, init)
  const payload = await remote.text()
  const resp = new NextResponse(payload, { status: remote.status })
  remote.headers.forEach((v,k) => resp.headers.set(k,v))
  return resp
}

// *** Notice we declare params as a Promise and await it ***
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ segments: string[] }> }
) {
  const { segments } = await context.params
  return handleProxy(req, segments)
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ segments: string[] }> }
) {
  const { segments } = await context.params
  return handleProxy(req, segments)
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ segments: string[] }> }
) {
  const { segments } = await context.params
  return handleProxy(req, segments)
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ segments: string[] }> }
) {
  const { segments } = await context.params
  return handleProxy(req, segments)
}