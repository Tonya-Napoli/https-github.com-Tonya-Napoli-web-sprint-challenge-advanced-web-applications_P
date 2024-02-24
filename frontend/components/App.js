import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosWithAuth from '../axios';
import Articles from './Articles';
import LoginForm from './LoginForm';
import ArticleForm from './ArticleForm';
import Message from './Message';
import Spinner from './Spinner';
import ProtectedRoute from './ProtectedRoute';
import {  NavLink, 
          Routes, 
          Route, 
          useNavigate, 
          Navigate,
          BrowserRouter as Router,
          Link  } from 'react-router-dom';
//import { set } from 'lodash';
import { getArticles } from '../../backend/helpers';
//import { get, update } from 'lodash';

const App = () => {
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [spinnerOn, setSpinnerOn] = useState(false);
  const navigate = useNavigate();

  // Check token presence to manage access to private routes
  const isAuth = () => !!localStorage.getItem('token');

  // Navigate to articles after login
  const redirectToArticles = () => navigate('/articles');

  // Navigate to login
  const redirectToLogin = () => navigate('/login');

  // Login function
  const login = async (credentials) => {
    try {
      setSpinnerOn(true);
      const { data } = await axios.post('http://localhost:9000/api/login', credentials);
      localStorage.setItem('token', data.token);
      console.log('Login response:', data);
      setMessage(data.message);
      setIsLoggedIn(true);
      redirectToArticles();
    } catch (error) {
      setMessage('Login failed: ' + error.toString());
    } finally {
      setSpinnerOn(false);
    }
  };

  // Logout function
  const logout = () => {
    redirectToLogin();
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    setIsLoggedIn(false);
  };

  const getArticles = async () => {
    try {
      setSpinnerOn(true);
      const { data } = await axiosWithAuth().get('/articles');
      setArticles(data.articles);
      console.log('Articles successfully fetched:', data.articles);
      setMessage(data.message);
    } catch (error) {
      setMessage('Failed to fetch articles: ' + error.toString());
      if (error.response?.status === 401) redirectToLogin();
    } finally {
      setSpinnerOn(false);
    }
  };
const [isLoggedIn, setIsLoggedIn] = useState(false);
useEffect(() => {
  if (isLoggedIn) {
    getArticles();
  }
}, [isLoggedIn]);

useEffect(() => {
  setIsLoggedIn(!!localStorage.getItem('token'));
}, []);

useEffect (() => {
  console.log("Current articles state:", articles)

}, [articles]);

  const postArticle = async (newArticle) => {
    try {
      setSpinnerOn(true);
      const { data } = await axiosWithAuth().post('/articles', newArticle);
      setArticles(prevArticles => [...prevArticles, data.article]);
      console.log("postArticle, Articles after add:", articles)
      setMessage('Article added successfully.');
    } catch (error) {
      console.error('Error posting article:', error) 
      setMessage(`Failed to add article: ${error.toString()}`);
    } finally {
      setSpinnerOn(false);
    }
  };
    
  const updateArticle = async (articleToUpdate) => {
    console.log('Edit Article:', articleToUpdate);
    try {
      setSpinnerOn(true);
      const { data } = await axiosWithAuth().put(`/articles/${articleToUpdate.article_id}`, articleToUpdate);
      setMessage(`Article updated successfully.`);
      await getArticles(); //Refresh articles list
    } catch (error) {
      console.error('Error updating article:', error)
      setMessage(`Failed to update article: ${error.toString()}`);
    } finally {
      setSpinnerOn(false);
    }
  };
   
  const deleteArticle = async (article_id) => {
    console.log('Delete Article:', article_id);
    console.log("Articles after delete:", articles);  
    try {
      setSpinnerOn(true);
      await axiosWithAuth().delete(`/articles/${article_id}`);
      setArticles(prevArticles => prevArticles.filter(article => article.article_id !== article_id));
      setMessage(`Article deleted successfully.`);
      await getArticles(); //Refresh articles list
    } catch (error) {
      console.error('Error deleting article:', error)
      setMessage(`Failed to delete article: ${error.toString()}`);
    } finally {
      setSpinnerOn(false);
    }
  }

  return (
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? '0.25' : '1' }}>
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/login">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
          
        </nav>
        <Routes>
          <Route path="/login" element={<LoginForm login={login} />} />
          <Route path="/articles" 
          element={
            <ProtectedRoute>
              <>
                <ArticleForm
                  updateArticle= {updateArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  postArticle= {postArticle}
                  currentArticleId={articles.find(article => article.article_id === currentArticleId)}
                />
                <Articles
                  getArticles={getArticles}
                  articles={articles}
                  deleteArticle= {deleteArticle}
                  setCurrentArticleId={setCurrentArticleId}
                />
              </>
              </ProtectedRoute>
          }
          />
          <Route path="*" element={<Navigate replace to="/login" />} />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
};

export default App;

