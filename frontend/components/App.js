import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosWithAuth from '../axios';
import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import ArticleForm from './ArticleForm';
import Spinner from './Spinner';
import ProtectedRoute from './ProtectedRoute';
import {  NavLink, 
          Routes, 
          Route, 
          useNavigate, 
          Navigate,
          BrowserRouter as Router,
          Link  } from 'react-router-dom';
import { set } from 'lodash';
import { getArticles } from '../../backend/helpers';

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

  useEffect(() => {
    if (isAuth()) getArticles();
  }, []);

  const postArticle = async (article) => {
    try {
      setSpinnerOn(true);
      const response = await axiosWithAuth().post('/articles', article);
      setArticles([...articles, response.data.article]);
      setMessage('Article added successfully.');
      getArticles(); //Refresh articles list
    } catch (error) { 
      setMessage(`Failed to add article: ${error.toString()}`);
    } finally {
      setSpinnerOn(false);
    }
  };
    
  const updateArticle = async ({ article_id, article }) => {
    try {
      setSpinnerOn(true);
      const response = await axiosWithAuth().put(`/articles/${article_id}`, article);
      setMessage(`Article updated successfully.`);
      getArticles(); //Refresh articles list
    } catch (error) {
      setMessage(`Failed to update article: ${error.toString()}`);
    } finally {
      setSpinnerOn(false);
    }
  };
   

  const deleteArticle = async (article_id) => {
    try {
      setSpinnerOn(true);
      axiosWithAuth().delete(`/articles/${article_id}`);
      setMessage(`Article deleted successfully.`);
      getArticles(); //Refresh articles list
    } catch (error) {
      setMessage(`Failed to delete article: ${error.toString()}`);
    } finally {
      setSpinnerOn(false);
    }
  }

  return (
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout</button>
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
                  updateArticle={() => {}}
                  setCurrentArticleId={setCurrentArticleId}
                  postArticle={() => {}}
                  currentArticleId={currentArticleId}
                />
                <Articles
                  articles={articles}
                  getArticles={getArticles}
                  deleteArticle={() => {}}
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

