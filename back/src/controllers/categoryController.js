import * as sqlCategoryRepository from "../repositories/sqlCategoryRepository.js";

export async function getCategories(req, res) {
    try {
        const data = await sqlCategoryRepository.getCategories();
        res.json(data);
    } catch (error) {
        console.error("Error fetching Categories:", error);
        res.status(500).json({ message: "Server error" });
    }
    
};

export async function getArticlesByCategory(req, res) {
    try {
        const data = await sqlCategoryRepository.getArticlesByCategory(req.params.id);
        res.json(data);
    } catch (err) {
        console.error("Error fetching articles by category:", error);
        res.status(500).json({ message: "Server error" });
    }
    
};