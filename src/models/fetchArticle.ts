import fs from 'fs/promises';
import Article from './Article';

async function fetchArticle(filePath:string, id: number): Promise<Article|null> {
   
    try{
        await fs.access(filePath);


            try {
                const content = await fs.readFile(filePath, 'utf-8');

               const [titleLine, dateLine, ...contentLines] = content.split('\n');

               const article: Article = {
                id: id, 
                title:  titleLine.replace(/^#\s*/, '').trim(), // Assumiing title is in the first line as # title
                date:  dateLine.trim(),
                content: contentLines.join('\n')
               }

               return article;

                
            } catch (error) {
                console.error(`Can't read file ${filePath}: `, error);
                return null;
                
            }

        }

    

    catch(e){
            console.error(`File not found in ${filePath}: `, e);
            return null;
    }
}

export default fetchArticle;