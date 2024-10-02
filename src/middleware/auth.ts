import { IncomingMessage, ServerResponse } from 'http';

function auth(req: IncomingMessage, res: ServerResponse, next: ()=> void){
    const authHeader = req.headers.authorization;

    if(!authHeader){

        res.writeHead(401, {"www-authenticate": "Basic realm='Admin Area'"});

        res.end('Unauthorized');
        return;
    }

    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    
    const user = auth[0];
    const pass = auth[1];

    if(user === 'admin' && pass === 'password'){
        next();
    }

    else{
        res.writeHead(401, {"www-authenticate": "Basic realm='Admin Area'"});

        res.end('Unauthorized');
        return;
    }
}

export default auth;