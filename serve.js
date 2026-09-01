const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = 8532;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.mp4': 'video/mp4',
  '.svg': 'image/svg+xml'
};

http.createServer((req, res) => {
  let filePath = decodeURIComponent(req.url.split('?')[0]);
  if (filePath === '/') filePath = '/index.html';
  const full = path.join(root, filePath);
  if (!full.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); }

  fs.stat(full, (err, stat) => {
    if (err || !stat.isFile()) { res.writeHead(404); return res.end('Not found: ' + filePath); }
    const ext = path.extname(full).toLowerCase();
    const range = req.headers.range;
    if (range && ext === '.mp4') {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunkSize = (end - start) + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': mime[ext]
      });
      fs.createReadStream(full, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream', 'Content-Length': stat.size, 'Accept-Ranges': 'bytes' });
      fs.createReadStream(full).pipe(res);
    }
  });
}).listen(port, () => console.log('Serving on http://localhost:' + port));
