const http = require('http')
const fs = require('fs')
const path = require('path')
const { URL } = require('url')

const PORT = process.env.PORT || 3000
const DB_PATH = path.join(__dirname, 'db.json')

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })

  res.end(JSON.stringify(payload))
}

function loadDatabase() {
  const raw = fs.readFileSync(DB_PATH, 'utf8')
  return JSON.parse(raw)
}

function saveDatabase(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

function normalizeRecord(record) {
  return {
    ...record,
    amount: Number(record.amount || 0),
  }
}

function sendNotFound(res) {
  return sendJson(res, 404, {
    message: '요청한 경로를 찾을 수 없습니다.',
  })
}

function getUserIdFromRequest(req) {
  const auth = req.headers.authorization || ''

  if (auth.startsWith('Bearer ')) {
    return auth.slice(7).trim()
  }

  return null
}

function collectBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (error) {
        reject(error)
      }
    })

    req.on('error', reject)
  })
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://localhost:${PORT}`)
  const pathname = requestUrl.pathname

  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {})
  }

  if (req.method === 'GET' && pathname === '/api/health') {
    return sendJson(res, 200, { ok: true })
  }

  if (req.method === 'POST' && pathname === '/api/login') {
    try {
      const { email, password } = await collectBody(req)

      if (!email || !password) {
        return sendJson(res, 400, {
          message: '이메일과 비밀번호를 모두 입력해주세요.',
        })
      }

      const db = loadDatabase()
      const user = db.users.find(
        (item) => item.email === email && item.password === password
      )

      if (!user) {
        return sendJson(res, 401, {
          message: '이메일 또는 비밀번호가 올바르지 않습니다.',
        })
      }

      const attendances = (db.attendances || [])
        .filter((item) => item.userId === user.id)
        .map((item) => item.date)

      return sendJson(res, 200, {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        attendances,
      })
    } catch (error) {
      return sendJson(res, 500, {
        message: '로그인 처리 중 오류가 발생했습니다.',
      })
    }
  }

  if (req.method === 'GET' && pathname === '/categories') {
    const db = loadDatabase()
    return sendJson(res, 200, db.categories || [])
  }

  if (req.method === 'GET' && pathname === '/records') {
    const db = loadDatabase()
    const queryUserId = requestUrl.searchParams.get('userId')
    const authUserId = getUserIdFromRequest(req)
    const requestedUserId = queryUserId || authUserId
    const records = (db.records || []).map(normalizeRecord)

    const filteredRecords = requestedUserId
      ? records.filter((record) => record.userId === requestedUserId)
      : records

    return sendJson(res, 200, filteredRecords)
  }

  if (pathname.startsWith('/records')) {
    const db = loadDatabase()
    const records = db.records || []
    const recordId = pathname.split('/')[2]

    if (req.method === 'GET' && recordId) {
      const record = records.find((item) => item.id === recordId)

      if (!record) {
        return sendNotFound(res)
      }

      return sendJson(res, 200, normalizeRecord(record))
    }

    if (req.method === 'POST' && pathname === '/records') {
      try {
        const payload = await collectBody(req)
        const nextRecord = normalizeRecord(payload)

        records.push(nextRecord)
        db.records = records
        saveDatabase(db)

        return sendJson(res, 201, nextRecord)
      } catch (error) {
        return sendJson(res, 400, {
          message: '내역 저장 중 오류가 발생했습니다.',
        })
      }
    }

    if (req.method === 'PATCH' && recordId) {
      try {
        const payload = await collectBody(req)
        const recordIndex = records.findIndex((item) => item.id === recordId)

        if (recordIndex === -1) {
          return sendNotFound(res)
        }

        const updatedRecord = normalizeRecord({
          ...records[recordIndex],
          ...payload,
        })

        records[recordIndex] = updatedRecord
        db.records = records
        saveDatabase(db)

        return sendJson(res, 200, updatedRecord)
      } catch (error) {
        return sendJson(res, 400, {
          message: '내역 수정 중 오류가 발생했습니다.',
        })
      }
    }

    if (req.method === 'DELETE' && recordId) {
      const recordIndex = records.findIndex((item) => item.id === recordId)

      if (recordIndex === -1) {
        return sendNotFound(res)
      }

      records.splice(recordIndex, 1)
      db.records = records
      saveDatabase(db)

      return sendJson(res, 200, { ok: true })
    }
  }

  return sendNotFound(res)
})

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Set a different PORT and try again.`)
    console.error(`Example: $env:PORT=3003; node .\\server.js`)
    process.exit(1)
  }

  console.error(error)
  process.exit(1)
})

server.listen(PORT, () => {
  console.log(`MOAMOA backend listening on http://localhost:${PORT}`)
})
