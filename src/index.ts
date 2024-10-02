// server.ts
import http from 'http';
import router from './controllers/blogController';

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    router.handleRequest(req, res);
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});