import Article  from "./Article";
import path from "path";
import fs from 'fs/promises';

async function fetchAllArticles(folderPath:string){
    const articles: Article[] = [];

    try{
        await fs.access(folderPath).catch(async () => {
            await fs.mkdir(folderPath, {recursive:true});
        })

        const fileNames = ((await fs.readdir(folderPath)).filter(file => file.endsWith(".md")));

        for(const fileName of fileNames){
            const filePath = path.join(folderPath, fileName);

            try{
                const fileContent = await fs.readFile(filePath, 'utf-8');

               const [titleLine, dateLine, ...contentLines] = fileContent.split('\n');

               const article: Article = {
                id:  parseInt(fileName.replace('.md', ""),10),
                title:  titleLine.replace(/^#\s*/, '').trim(), // Assumiing title is in the first line as # title
                date:  dateLine.trim(),
                content: contentLines.join('\n')
               }
               
               articles.push(article);
            }
           catch (error) {
                if (error instanceof Error) {
                    console.error(`Error reading file ${fileName}:`, error.message);
                } else {
                    console.error(`Error reading file ${fileName}:`, error);
                }
            }
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error accessing folder ${folderPath}:`, error.message);
        } else {
            console.error(`Error accessing folder ${folderPath}:`, error);
        }

    }

    articles.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime(); // Descending order
    });

    return articles;
}

export default fetchAllArticles;