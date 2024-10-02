import MarkdownIt from "markdown-it";
import Article from "./Article";
import fs from 'fs/promises';
import path from "path";
import fetchAllArticles from "./fetchAllArticles";

async function addArticle(article: Article, folderPath:string) {
   
    try {
        await fs.access(folderPath);

        try{
           const content = article.content.replace(/\r\n/g, '\n')  // Convert Windows line endings to Unix
                                          .replace(/\r/g, '\n');   // Convert remaining CR to LF
           const fileContent = `# ${article.title}\n${article.date}\n\n${content}`;

            const articles = await fetchAllArticles(folderPath);

            const id = articles.length? Math.max(...articles.map( a => a.id)) +1 :1;

            article.id = id;
            const fileName = id.toString()+".md";
            const filePath = path.join(folderPath, fileName)

            // Write the file
            await  fs.writeFile(filePath, fileContent, 'utf-8');

            console.log(`Article "${article.title}" has been successfully written to ${filePath}`);
        }
        catch (error) {
            console.error(`Can't write file for article "${article.title}":`, error);
        }
        
    }catch(e){
        console.error(`Error accessing folder ${folderPath}: `,e)
    }
}

export default addArticle;