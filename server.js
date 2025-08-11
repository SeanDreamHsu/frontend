const http = require('http');

let settings = { service_fee_b2c: 0, service_fee_b2b: 0 };
let users = [
  { uid: '1', email: 'user1@example.com', role: 'b2c' },
  { uid: '2', email: 'user2@example.com', role: 'b2b' },
  { uid: '3', email: 'admin@example.com', role: 'admin' }
];

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch (err) {
        reject(err);
      }
    });
  });
}

function authenticate(req) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString());
  } catch (err) {
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  const user = authenticate(req);
  if (!user) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Unauthorized' }));
  }
  if (user.role !== 'admin') {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Forbidden' }));
  }

  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'GET' && url.pathname === '/api/admin/settings') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(settings));
  }

  if (req.method === 'PUT' && url.pathname === '/api/admin/settings') {
    try {
      const body = await parseBody(req);
      settings = { ...settings, ...body };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(settings));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(users));
  }

  const userMatch = url.pathname.match(/^\/api\/admin\/users\/(.+)$/);
  if (req.method === 'PUT' && userMatch) {
    try {
      const body = await parseBody(req);
      const uid = userMatch[1];
      const existing = users.find(u => u.uid === uid);
      if (!existing) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'User not found' }));
      }
      existing.role = body.role;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(existing));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
