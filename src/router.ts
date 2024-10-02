// router.ts
import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';

type RouteHandler = (req: IncomingMessage, res: ServerResponse, params: Record<string, string>) => Promise<void>;

type Middleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => void;

class Router {
    private routes: Map<string, {middleawres: Middleware[], handler:RouteHandler }>;

    constructor(){
        this.routes = new Map();
    }

    public addRoute(path: string, ...arges:( RouteHandler|Middleware)[]) {
        const handler = arges.pop() as RouteHandler;
        const middleawres = arges as Middleware[];

        this.routes.set(path, {middleawres, handler});
    }

    public async handleRequest(req: IncomingMessage, res: ServerResponse) {
        const parsedUrl = parse(req.url || '', true);
        const path = parsedUrl.pathname || '/';

        for (const [routePath, route] of this.routes) {
            const match = this.matchRoute(path, routePath);
            if (match) {
                try {
                    await this.runMiddlewares(req, res, route.middleawres, async () => {
                        await route.handler(req, res, match.params)
                    });
                } catch (error) {
                    console.error('Error handling request:', error);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                }
                return;
            }
        }

        // No matching route found
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }

    private async runMiddlewares(req: IncomingMessage, res: ServerResponse, middleawres: Middleware[], finalHander: () => Promise<void>){
        const runMiddleware = (index: number): Promise<void> => {
            if (index >= middleawres.length){
                return finalHander();
            }

            return new Promise<void>((resolve) =>{
                middleawres[index](req, res, () => {
                    resolve(runMiddleware(index+1))
                })
            })
        }

        await runMiddleware(0);
    }

    private matchRoute(path: string, routePath: string): { params: Record<string, string> } | null {
        const pathParts = path.split('/').filter(Boolean);
        const routeParts = routePath.split('/').filter(Boolean);

        if (pathParts.length !== routeParts.length) {
            return null;
        }

        const params: Record<string, string> = {};

        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
                params[routeParts[i].slice(1)] = pathParts[i];
            } else if (routeParts[i] !== pathParts[i]) {
                return null;
            }
        }

        return { params };
    }
}

export default new Router();