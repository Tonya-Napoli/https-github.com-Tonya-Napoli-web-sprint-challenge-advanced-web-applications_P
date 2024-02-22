import React, { useState, useEffect } from 'react';
import { NavLink, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';

import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import ArticleForm from './ArticleForm';
import Spinner from './Spinner';

// axiosWithAuth implementation
import axiosWithAuth from '../axios';

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
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    redirectToLogin();
  };

  // Fetch articles
  const fetchArticles = async () => {
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
    if (isAuth()) fetchArticles();
  }, []);

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
          <button onClick={fetchArticles}>Fetch Articles</button>
        </nav>
        <Routes>
          <Route path="/login" element={<LoginForm login={login} />} />
          <Route path="/articles" element={
            isAuth() ? (
              <>
                <ArticleForm
                  updateArticle={() => {}}
                  setCurrentArticleId={setCurrentArticleId}
                  postArticle={() => {}}
                  currentArticleId={currentArticleId}
                />
                <Articles
                  articles={articles}
                  getArticles={fetchArticles}
                  deleteArticle={() => {}}
                  setCurrentArticleId={setCurrentArticleId}
                />
              </>
            ) : (
              <Navigate replace to="/login" />
            )
          } />
          <Route path="*" element={<Navigate replace to="/login" />} />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
};

export default App;

