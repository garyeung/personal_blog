import MarkdownIt from "markdown-it";
import Article from "./Article";
import fs from 'fs/promises';

async function editArticle(article: Article, filePath: string) {
   try {
    
        await fs.access(filePath);

        try {
            const fileContent = `# ${article.title}\n${article.date}\n\n${article.content}`;

            await  fs.writeFile(filePath, fileContent, 'utf-8');

            console.log(`Article "${article.title}" has been successfully updated at ${filePath}`);
            
        } catch (error) {
            console.error(`Can't edit file "${filePath}":`, error);
        }
   } catch (error) {
        console.error(`Error accessing file ${filePath}: `,error)
   } 
}

export default editArticle;