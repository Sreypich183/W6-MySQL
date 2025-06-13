import { Router } from "express";
import { getCategories, getArticlesByCategory } from "../controllers/categoryController.js";

const categoryRouter = Router();
categoryRouter.get("/", getCategories);
categoryRouter.get("/:id/articles", getArticlesByCategory);


export default categoryRouter;