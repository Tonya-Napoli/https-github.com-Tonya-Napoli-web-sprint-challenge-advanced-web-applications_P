import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import { update } from 'lodash'
import axiosWithAuth from '../axios/index2'
import axios from 'axios'


const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()

  const redirectToLogin = () => {                                 /* ✨ implement */ 
    navigate("/login") 
  }                                   
  const redirectToArticles = () => {
    navigate("/articles")                                         /* ✨ implement */ 
  }

  const logout = () => {
                                                                  // ✨ implement
    // If a token is in local storage it should be removed,
    localStorage.removeItem('token');
    // and a message saying "Goodbye!" should be set in its proper state.
    setMessage("Goodbye!")
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    redirectToLogin();
    
  }

  const login = async ({ username, password }) => {
                                                                  // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage('');
    setSpinnerOn(true);

    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    try {
      const response = await axios.post(loginUrl, {username, password});
      localStorage.setItem('token', response.data.token);//storing handshake
      setMessage(response.data.message);//success message
      redirectToArticles();//enter articles page
    } catch (error) {
      setMessage(`Login failed:  `+ error.toString());
    } finally {
      setSpinnerOn(false);
    }
  }

  const getArticles = async () => {
                                                                    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage('');
    setSpinnerOn(true);

    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    
    try {
      

      const response = await axiosWithAuth().get(articlesUrl);
      setArticles(response.data.articles);
      setMessage(`Articles loaded successfully`);
    } catch (error) {
      setMessage(`Articles failed to load:  `+ error.toString());
      if(error.response && error.response.status === 401) {
        redirectToLogin();
  }
} finally {
  setSpinnerOn(false);
}
  };

  const postArticle = async (article) => {
    setMessage('');
    setSpinnerOn(true);
                                                                                   // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.

    try {
      const response = await axiosWithAuth().post(articlesUrl, article);
      setArticles(prevArticles => [...prevArticles, response.data.article ])
      setMessage(`Article posted successfully`);
      redirectToArticles();
    } catch (error) {
      setMessage(`Article failed to post:  `+ error.toString());
  }   finally {
    setSpinnerOn(false);  
  }
};

  const updateArticle = async ({ article_id, article }) => {
    setMessage('');
    setSpinnerOn(true);
                                                                                      // ✨ implement
    // You got this!
    try {
      await axiosWithAuth().put(`${articlesUrl}/${article_id}`, article);
      setMessage('Article updated successfully');
      getArticles(); //refresh the articles list to reflect the update
    } catch (error) {
      setMessage(`Failed to update article: ${error.toString()}`);
  }   finally {
    setSpinnerOn(false);
  }
}

  const deleteArticle = async (article_id) => {
                                                                                       // ✨ implement
    setMessage('');
    setSpinnerOn(true);

    try {
      await axiosWithAuth().delete(`${articlesUrl}/${article_id}`);
      setArticles (prevArticles => prevArticles.filter(article => article.article_id !== article_id));//removing article from state
    } catch (error) {
      setMessage(`Failed to delete article: ${error.toString()}`);
  }   finally {
    setSpinnerOn(false);
  }
};

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/login" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm 
                
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
                postArticle={postArticle}
                currentArticleId={articles.find(article => article.article_id === currentArticleId)}
               />
              <Articles 
                articles={articles} 
                getArticles={getArticles}
                deleteArticle={deleteArticle} 
                setCurrentArticleId={setCurrentArticleId}
                
                />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
