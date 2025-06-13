import { pool } from "../utils/database.js";

// get all categories
export async function getCategories() {
    const [rows] = await pool.query("SELECT * FROM category");
    return rows;
}

// filter articles by category
export async function getArticlesByCategory(id) {
    const [rows] = await pool.query(`
        SELECT 
            a.*, 
            j.name AS journalist,
            GROUP_CONCAT(c.name) AS categories
        FROM articles a
        JOIN journalists j ON j.id = a.journalist_id
        JOIN articles_categories ac ON ac.article_id = a.id
        JOIN category c ON c.id = ac.category_id
        WHERE a.id IN (
        SELECT article_id
        FROM articles_categories
        WHERE category_id = ?
        )
        GROUP BY a.id;
    `, [id]);
    return rows;
}