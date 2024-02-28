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
  const [isLoggedIn, setIsLoggedIn] = useState(false);   
  const [forceUpdate, setForceUpdate] = useState(0);
  const navigate = useNavigate();
 
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const editArticle = (article_id) => {
    setCurrentArticleId(article_id);
    //setCurrentArticleId(articleToEdit)
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

useEffect(() => {
  setIsLoggedIn(!!localStorage.getItem('token'));
}, []);

/*useEffect (() => {
  console.log("Current articles state:", articles)

}, [articles]);*/

  const postArticle = async (newArticle) => {
     //const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  //}

    try {
      setSpinnerOn(true);
      const { data } = await axiosWithAuth().post(articlesUrl, newArticle);
      //await axiosWithAuth().post(articlesUrl, newArticle);
      //await getArticles() //fetch and update article state
      //setArticles(prevArticles => [...prevArticles, data.article]);
      setArticles(currentArticles => [...currentArticles, data.newArticle]);
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
      setArticles(currentArticles => {
        return currentArticles.map(article => {
          if (article.article_is === articleToUpdate.article_id) {
            //returning updated article data
            return { ...article, ...articleToUpdate };
        }
        return article; //return unchanged article as-is
      })
    })
      setMessage(`Article updated successfully.`);
    } catch (error) {
      console.error('Error updating article:', error)
      setMessage(`Failed to update article: ${error.toString()}`);
    } finally {
      setSpinnerOn(false);
    }
  };
   
  const deleteArticle = async (article_id) => {
    console.log('Delete Article:', article_id);
    console.log("Articles before delete:", articles);  
    try {
      setSpinnerOn(true);
      await axiosWithAuth().delete(`/articles/${article_id}`);
      //await getArticles(); //Refresh articles list
      //setArticles(prevArticles => prevArticles.filter(article => article.article_id !== article_id));
      setArticles(currentArticles => currentArticles.filter(article => article.article_id !== article_id));
      setMessage(`Article deleted successfully.`);
      //await getArticles(); //Refresh articles list
    } catch (error) {
      console.error('Error deleting article:', error)
      setMessage(`Failed to delete article: ${error.toString()}`);
    } finally {
      setSpinnerOn(false);
    }
  }

  const updateArticleState = (updatedArticle) => {
    setArticles(currentArticles =>
      currentArticles.map(article =>
        article.article_id === updatedArticle.article_id ? updatedArticle: article
        )
        );
      };

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
  )
        }

        export default App;


