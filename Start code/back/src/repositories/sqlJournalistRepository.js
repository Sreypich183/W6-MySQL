import { pool } from "../utils/database.js";

// display all articles of a specific journalist
export async function getArticlesByJournalist (id) {
    const [rows] = await pool.query(`
        SELECT 
            a.*, 
            j.name as journalist,
            GROUP_CONCAT(c.name) AS categories
        FROM articles a 
        JOIN journalists j ON j.id = a.journalist_id
        JOIN articles_categories ac ON ac.article_id = a.id
        JOIN category c ON c.id = ac.category_id
        WHERE a.id = ?
        GROUP BY a.id;
    `, [id]);
    return rows;
}