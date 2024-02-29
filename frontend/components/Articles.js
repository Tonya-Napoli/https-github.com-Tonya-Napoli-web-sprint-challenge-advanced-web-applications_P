import React from 'react';
import PT from 'prop-types';

export default function Articles({ articles, deleteArticle, setCurrentArticleId }) {
  // Check if there's a valid token, and if not, redirect to login (Handled in parent component or protected route)
  
  return (
    <div className="articles">
      <h2>Articles</h2>
      {articles.length === 0 ? (
        'No articles yet'
      ) : (
        articles.map(article => (
          <div className="article" key={article.article_id}>
            <div>
              <h3>{article.title}</h3>
              <p>{article.text}</p>
              <p>Topic: {article.topic}</p>
            </div>
            <div>
              <button onClick={() => deleteArticle(article.article_id)}>Delete</button>
              <button onClick={() => {
              console.log(`Editing article with ID: ${article.article_id}`);
                setCurrentArticleId(article.article_id);
                }}>Edit</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Prop types for validation
Articles.propTypes = {
  articles: PT.arrayOf(PT.shape({
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })).isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
};

