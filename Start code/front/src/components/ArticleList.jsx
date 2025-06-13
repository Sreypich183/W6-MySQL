import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArticles, removeArticle, getCategories, getArticleByJournalist, getArticlesByCategory } from "../services/api";
import { Link } from "react-router-dom";

//
// ArticleList component
//
export default function ArticleList() {
  
  const { journalistId, categoryId } = useParams();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState([]);
  const isFilter = journalistId || categoryId;


  const navigate = useNavigate();

  useEffect(() => {
  
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      
      // to handle when to display articles by journalist or category or all articles
      try {
        await fetchCategories();
        if (isFilter) {
          if (journalistId) {
            await fetchArticlesByJournalist(journalistId);
          } else if (categoryId) {
            await fetchArticlesByCategory(categoryId);
          }
        } else {
          await fetchArticles();
        }
      } catch (err) {
        setError("Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [journalistId, categoryId]);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      setError("Failed to load articles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // fetch categories
  const fetchCategories = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories. Pkease try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArticlesByJournalist = async (id) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getArticleByJournalist(id);
      setArticles(data);
    } catch (err) {
      setError("Failed to load articles by journalist. Pkease try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArticlesByCategory = async (id) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getArticlesByCategory(id);
      setArticles(data);
    } catch (err) {
      setArticles([]);
      setError("Failed to load articles by category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArticle = async (id) => {
    setIsLoading(true);
    setError("");
    try {
      await removeArticle(id);
      await fetchArticles(); // refresh the list
    } catch (err) {
      setError("Failed to delete article.");
    } finally {
      setIsLoading(false);
    }
  };

  

  const handleView = (id) => navigate(`/articles/${id}`);

  const handleEdit = (id) => navigate(`/articles/${id}/edit`);




  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {journalistId && articles[0] && (
        <h2 className="journalist">{articles[0].journalist}</h2>
      )}
      <div className="category-dropdown">
          <select
          value={categoryId || ""}
            onChange={(e) => e.target.value === "All" ? navigate(`/articles`) : navigate(`/categories/${e.target.value}/articles`)}
          >
            <option value="" disabled>Select a category</option>
            <option value="All">All</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      {categoryId && (
        <h2 className="journalist">
          {
            categories.find((category) => category.id.toString() === categoryId)?.name
          }
        </h2>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="article-list">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={deleteArticle}
          />
        ))}
      </div>
    </>
  );
}

function ArticleCard({ article, onView, onEdit, onDelete }) {
  return (
    <div className="article-card">
      <div className="article-title">{article.title}</div>
      {/* <div className="article-author">By {article.journalist}</div> */}
      <div className="article-author">By <Link to={`/journalists/${article.journalist_id}/articles`}>{article.journalist}</Link>
      </div>
      <div className="categories">
        {(article.categories || "").split(',').map((category, index) => (
          <button 
            className="button-tertiary" 
            key={index}
            onClick={() => navigate(`/categories/${category.id}/articles`)}
            >{category}</button>
        ))}
      </div>
      <div className="article-actions">
        <button className="button-tertiary" onClick={() => onEdit(article.id)}>
          Edit
        </button>
        <button
          className="button-tertiary"
          onClick={() => onDelete(article.id)}
        >
          Delete
        </button>
        <button className="button-secondary" onClick={() => onView(article.id)}>
          View
        </button>
      </div>
    </div>
  );
}