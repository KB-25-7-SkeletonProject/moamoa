const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3002
const DB_PATH = path.join(__dirname, 'db.json')

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })

  res.end(JSON.stringify(payload))
}

function loadDatabase() {
  const raw = fs.readFileSync(DB_PATH, 'utf8')
  return JSON.parse(raw)
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
  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {})
  }

  if (req.method === 'GET' && req.url === '/api/health') {
    return sendJson(res, 200, { ok: true })
  }

  if (req.method === 'POST' && req.url === '/api/login') {
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

  return sendJson(res, 404, {
    message: '요청한 경로를 찾을 수 없습니다.',
  })
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
