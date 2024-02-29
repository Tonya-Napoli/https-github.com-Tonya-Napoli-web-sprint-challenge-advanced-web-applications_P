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
          //.BrowserRouter as Router,
         // Link  
        } from 'react-router-dom';
import { getArticles } from '../../backend/helpers';


const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

// ✨ Research `useNavigate` in React Router v.6
//const navigate = useNavigate()
//const redirectToLogin = () => { /* ✨ implement */ }
//const redirectToArticles = () => { /* ✨ implement */ }

const App = () => {
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]);
  const [spinnerOn, setSpinnerOn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));  
  const navigate = useNavigate();
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const currentArticle = articles.find(article => article.article_id === currentArticleId);
  const editArticle = (article_id) => {
    setCurrentArticleId(article_id);
    console.log(`Current Article ID set to: ${article_id}`)
  }

  // Check token presence to manage access to private routes
  const isAuth = () => !!localStorage.getItem('token');

// ✨ Research `useNavigate` in React Router v.6
//const navigate = useNavigate()
//const redirectToLogin = () => { /* ✨ implement */ }
//const redirectToArticles = () => { /* ✨ implement */ 
  const redirectToArticles = () => navigate('/articles');
  const redirectToLogin = () => navigate('/login');

  // Login function
   //const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  //}
  const login = async (credentials) => {
    try {
      setSpinnerOn(true);
      const { data } = await axios.post(loginUrl, credentials);
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
  // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  
  const logout = () => {
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    setIsLoggedIn(false);
    redirectToLogin(); 
  };

  //fetch articles
  const getArticles = async () => {
    console.log(`getArticles called from ${articlesUrl}`)
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    try {
      setSpinnerOn(true);
      //const { data } = await axiosWithAuth().get(articlesUrl);
      const response = await axiosWithAuth().get(articlesUrl);
      const data = response.data;
      setArticles(data.articles);
      console.log('Articles successfully fetched:', data.articles);
      setMessage(data.message);
    } catch (error) {
      setMessage('Failed to fetch articles: ' + error.toString());
      if (error.response?.status === 401) {
         redirectToLogin();
      }
    } finally {
      setSpinnerOn(false);
    }
  };

useEffect(() => {
  if (isLoggedIn) {
    getArticles();
  }
}, [isLoggedIn]);

const postArticle = async (newArticle) => {
  try {
    setSpinnerOn(true);
    const response = await axiosWithAuth().post(articlesUrl, newArticle);
    const { message } = response.data;
    setArticles(currentArticles => [...currentArticles, response.data.article]);
    await getArticles(); // Update articles state with new article
    //console.log("postArticle, Articles after add:", articles);
    setMessage(message);
  } catch (error) {
    console.error('Error posting article:', error);
    setMessage(`Failed to add article: ${error.response?.data?.message || error.message}`);
  } finally {
    setSpinnerOn(false);
  }
};
   
  const updateArticle = async (articleToUpdate) => {
    try {
      setSpinnerOn(true);
      const response = await axiosWithAuth().put(`/articles/${articleToUpdate.article_id}`, articleToUpdate);
      const { message } = response.data;
      setArticles(currentArticles => currentArticles.map(article => 
        article.article_id === articleToUpdate.article_id ? { ...article, ...response.data.updatedArticle } : article
      ));
      await getArticles(); // Update articles state with updated article
      setMessage(message);
    } catch (error) {
      console.error('Error updating article:', error);
      setMessage(`Failed to update article: ${error.toString()}`);
    } finally {
      setSpinnerOn(false);
    }
  };
   
  const deleteArticle = async (article_id) => {
    try {
      setSpinnerOn(true);
      const response = await axiosWithAuth().delete(`/articles/${article_id}`);
      const { message } = response.data;
      await getArticles(); // Update articles state with deleted article
      setMessage(message);
    } catch (error) {
      console.error('Error deleting article:', error);
      setMessage(error.response?.data?.message || `Failed to delete article: ${error.message}`);
    } finally {
      setSpinnerOn(false);
    }
  };

    const updateArticleState = (updatedArticle) => {
    setArticles(currentArticles =>
      currentArticles.map(article =>
        article.article_id === updatedArticle.article_id ? updatedArticle: article
        )
        );
      };

      console.log("App.js, Current article in App.js:", currentArticle);

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
          <Route path="/login" element={<LoginForm login={login} />} />{/* <-- do not change this line */}
          <Route path="/articles" 
          element={
            <ProtectedRoute>
              <>
                <ArticleForm
                  articles={articles}
                  updateArticle= {updateArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  postArticle= {postArticle}
                  currentArticleId={articles.find(article => article.article_id === currentArticleId)}
                  currentArticle={currentArticle}
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
  )
        }

        export default App;


