import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import { Eta } from 'eta';
import fetchAllArticles from "../models/fetchAllArticles";
import router  from "../router";
import Article from "../models/Article";
import addArticle from "../models/addArticle";
import editArticle from "../models/editArticle";
import deleteArticle from "../models/deleteArticle";
import fetchArticle from "../models/fetchArticle";
import MarkdownIt from "markdown-it";
import formatDate from "../formatDate";
import auth from "../middleware/auth";

const articlesFolder = path.join(__dirname, '../../articles');
const viewsFolder = path.join(__dirname, '../views');

const eta = new Eta({views: viewsFolder});
const md = new MarkdownIt();

async function renderTemplate(res: ServerResponse, template: string, data: any) {
    const html = await eta.renderAsync(template,data);
    res.writeHead(200, {'Content-Type': 'text/html'});

    res.end(html);
    
};

// Home page
router.addRoute('/', async (req: IncomingMessage, res: ServerResponse) => {
    try {
        const articleList = await fetchAllArticles(articlesFolder);
        const articles = articleList.map(article => ({
          ...article, // Spread the existing properties of the article
          date: formatDate(article.date) // Format the date using the formatDate function
        }));

        await renderTemplate(res, 'home', { articles });
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error fetching articles');
    }
});

// Single article page
router.addRoute('/article/:id', async (req: IncomingMessage, res: ServerResponse, params: {[id:string]:string} ) => {
    const id = parseInt(params.id, 10);
    try {
        const filePath = path.join(articlesFolder, `${id}.md`);

        const article = await fetchArticle(filePath, id);

        if (article) {
            article.date = formatDate(article.date);
            article.content = md.render(article.content);
            await renderTemplate(res, 'article', { article });
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Article not found');
        }
    } catch (error) {
        console.error('Error fetching article:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error fetching article');
    }
});

// Admin page
router.addRoute('/admin', auth, async (req: IncomingMessage, res: ServerResponse) => {
    try {
        const articleList = await fetchAllArticles(articlesFolder);
        const articles = articleList.map(article => ({
          ...article, // Spread the existing properties of the article
          date: formatDate(article.date) // Format the date using the formatDate function
        }));
        await renderTemplate(res, 'admin', { articles });
    } catch (error) {
        console.error('Error fetching articles for admin:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error fetching articles for admin');
    }
});

router.addRoute('/admin/add', auth, async (req: IncomingMessage, res: ServerResponse) => {

    if(req.method === "GET"){
        await renderTemplate(res, 'new', {});
    }
    else if (req.method === 'POST'){
        let body = '';

        req.on('data', chunk =>{
            body += chunk.toString();
        });

        req.on('end', async () => {
            const formData = new URLSearchParams(body);
            const title =  formData.get('title') || '';
            const date =  formData.get('date') || '';
            const content = formData.get("content") || "" 

            const article: Article = {
                id: 0,
                title,
                date,
                content
            };

            try {
                await addArticle(article, articlesFolder);
                 res.writeHead(302, {'Location': '/admin'}); // Fixed typo in 'Location'
                res.end();
                
            } catch (error) {
                console.error('Error adding article:', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                
                res.end(`Error adding article: ${(error instanceof Error)?error.message:error}`);
            }
        })
    }
})

// Edit article page
router.addRoute('/admin/edit/:id', auth, async (req: IncomingMessage, res: ServerResponse, params: {[id:string]:string}) => {
    const id = parseInt(params.id, 10);
    const filePath = path.join(articlesFolder, `${id}.md`)
    if (req.method === 'GET') {
        try {
            const article = await fetchArticle(filePath,id);
            if (article) {
                await renderTemplate(res, 'edit', { article, id: params.id});
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Article not found');
            }
        } catch (error) {
            console.error('Error fetching article for editing:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error fetching article for editing');
        }
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const formData = new URLSearchParams(body);
            const article: Article = {
                id:id,
                title: formData.get('title') || '',
                date: formData.get('date') || '',
                content: formData.get('content') || ''
            };
            try {
                await editArticle(article, filePath);
                res.writeHead(302, { 'Location': '/admin' });
                res.end();
            } catch (error) {
                console.error('Error editing article:', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error editing article');
            }
        });
    }
});

// Delete article
router.addRoute('/admin/delete/:id', auth, async (req: IncomingMessage, res: ServerResponse, params: {[id:string]:string}) => {
    if (req.method === 'POST') {
        try {
            const filePath = path.join(articlesFolder, params.id+'.md')
            await deleteArticle(filePath);
            res.writeHead(302, { 'Location': '/admin' });
            res.end();
        } catch (error) {
            console.error('Error deleting article:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error deleting article');
        }
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
});
export default router;
