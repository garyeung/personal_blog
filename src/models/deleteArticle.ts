import fs from 'fs/promises';

async function deleteArticle(filePath: string) {

    try {
        await fs.access(filePath);
       try {
           await fs.unlink(filePath);
           console.log(`Article at ${filePath} has been successfully deleted.`);

       } catch (error) {
            console.error(`Can't delete file at ${filePath}:`, error);
            throw error; // Re-throw the error for the caller to handle if needed
       }

    }
    catch (error) {
        console.error(`Can't access file at ${filePath}:`, error);
        throw error; // Re-throw the error for the caller to handle if needed
    } 
}

export default deleteArticle;