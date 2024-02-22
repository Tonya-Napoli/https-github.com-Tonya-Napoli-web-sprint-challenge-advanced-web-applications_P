import React, {useState, useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import PT from 'prop-types';
import axiosWithAuth from '../axios';

export default function Articles({getArticles, deleteArticle, setCurrentArticleId, currentArticleId, setMessage, message}) {

  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await axiosWithAuth().get('/articles');
        setArticles(data.articles); // Adjust according to the actual structure of the response
        console.log('Articles successfully fetched:', data.articles);
        if (setMessage) setMessage('Articles loaded successfully.');
      } catch (error) {
        console.error('Failed to fetch articles:', error);
        if (setMessage) setMessage('Articles failed to load: ' + error.toString());
      }
    };

    fetchArticles();
  }, []);
  
  return (
    <div className="articles">
      <h2>Articles</h2>
      {
        articles.length === 0
          ? 'No articles yet'
          : articles.map(art => (
              <div className="article" key={art.article_id}>
                <div>
                  <h3>{art.title}</h3>
                  <p>{art.text}</p>
                  <p>Topic: {art.topic}</p>
                </div>
                <div>
                  <button onClick={() => setCurrentArticleId(art.article_id)}>Edit</button>
                  <button onClick={() => deleteArticle(art.article_id)}>Delete</button>
                </div>
              </div>
            ))
      }
    </div>
  );
}

Articles.propTypes = {
  articles: PT.arrayOf(PT.shape({
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number, // can be undefined or null
};

  
// 🔥 No touchy: Articles expects the following props exactly:
Articles.propTypes = {
  articles: PT.arrayOf(PT.shape({ // the array can be empty
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number, // can be undefined or null
}
