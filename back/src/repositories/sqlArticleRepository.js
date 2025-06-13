import { pool } from "../utils/database.js";

// Get all articles
export async function getArticles() {
    // TODO
    // from exercise 02
    // const [rows] = await pool.query("SELECT * FROM articles");
    // exercise 03 : display each article information and the journalist name, so we need to used join
    // const [rows] = await pool.query("SELECT a.*, j.name as journalist FROM articles a JOIN journalists j ON j.id = a.journalist_id");
    const [rows] = await pool.query(`
        SELECT a.*, j.name AS journalist,
            GROUP_CONCAT(c.name) AS categories
            FROM articles a
            JOIN journalists j ON j.id = a.journalist_id
            JOIN articles_categories ac ON ac.article_id = a.id
            JOIN category c ON c.id = ac.category_id
            GROUP BY a.id`);
    return rows;
}

// Get one article by ID
export async function getArticleById(id) {
    // TODO
    // exercise 02:
    // const [rows] = await pool.query("SELECT * FROM articles WHERE id = ?", [id]);

    // exercise 03: inside the articlePage component we need to display the journalist name, so we need to used join
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
    `, [id])
    const row = rows[0];
    row.categories = row.categories ? row.categories.split(',') : [];
    // updated version using join to display article information and journalist name for each article
    return row;
}

// Create a new article
export async function createArticle(article) {
    // TODO
    // const { title, content, journalist, category} = article;
    
    // const [result] = await pool.query(
    //     "INSERT INTO articles (title, content, journalist_id) VALUES (?, ?, ?)", 
    //     [title, content, journalist, category]
    // );
    // return { id: result.insertId, ...article };
    const { title, content, journalist, category } = article; // categories is expected to be an array

    // Insert the article
    const [result] = await pool.query(
        "INSERT INTO articles (title, content, journalist_id) VALUES (?, ?, ?)",
        [title, content, journalist]
    );

    const articleId = result.insertId;

    // Insert into articles_categories (many-to-many relationship)
    // if (Array.isArray(categories) && categories.length > 0) {
    //     const values = categories.map((categoryId) => [articleId, categoryId]);

    //     await pool.query(
    //         "INSERT INTO articles_categories (article_id, category_id) VALUES ?",
    //         [values]
    //     );
    // }
    await pool.query(
        "INSERT INTO articles_categories (article_id, category_id) VALUES (?, ?)",
        [articleId, category]
    )

    return { id: articleId, ...article };


}

// Update an article by ID
export async function updateArticle(id, updatedData) {
    // TODO
    const { title, content, journalist, category } = updatedData;
    const [result] = await pool.query(
        "UPDATE articles SET title = ?, content = ?, journalist_id = ?, category = ? WHERE id = ?", 
        [title, content, journalist, category, id]
    );
    return result;

}

// Delete an article by ID
export async function deleteArticle(id) {
    // TODO
    // const [result] = await pool.query("DELETE FROM articles WHERE id = ?", [id]);
  // First, delete from the join table
  await pool.query("DELETE FROM articles_categories WHERE article_id = ?", [id]);

  // Then delete the article itself
  await pool.query("DELETE FROM articles WHERE id = ?", [id]);
    
}