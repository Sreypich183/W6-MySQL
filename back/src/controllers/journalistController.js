import * as sqlJournalistRepository from "../repositories/sqlJournalistRepository.js"

export async function getArticlesByJournalist(req, res) {
    try {
        const articles = await sqlJournalistRepository.getArticlesByJournalist(req.params.id);
        res.json(articles);
    } catch (error) {
        console.error("Error fetching articles by Journalist:", error);
        res.status(500).json({ message: "Server error" });
    }
}