import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' }
export default function ArticleForm({
  postArticle,
  updateArticle,
  setCurrentArticleId,
  currentArticle,
  currentArticleId,
  articles
}) {
  const [values, setValues] = useState(initialFormValues)
  console.log('ArticleFormProps:, { currentArticle, updateArticle, setCurrentArticleId }')
  // ✨ where are my props? Destructure them here

  useEffect(() => {
    console.log('ArticleForm useEffect running, currentArticle', currentArticle);
    if (currentArticle) { // Check if currentArticle is truthy
      setValues({
        title: currentArticle.title,
        text: currentArticle.text,
        topic: currentArticle.topic,
      });
    } else {
      setValues(initialFormValues); // Reset the form to initial values if currentArticle is falsy
    }
  }, [currentArticle]); // Depend on currentArticle to run this effect
  
   
    // ✨ implement
    // Every time the `currentArticle` prop changes, we should check it for truthiness:
    // if it's truthy, we should set its title, text and topic into the corresponding
    // values of the form. If it's not, we should reset the form back to initial values.
  const onChange = evt => {
    const { id, value } = evt.target;
    console.log(`onChange??? Changing ${id}:`, value)//log input being changed
    setValues((preValues) => ({
      ...preValues,
      [id]: value,
    }));
  };
     
  const onSubmit = evt => {
    evt.preventDefault()
    // ✨ implement
    // We must submit a new post or update an existing one,
    // depending on the truthyness of the `currentArticle` prop.
    console.log('Submitting form:', currentArticle, values);
    if (currentArticle) {
      updateArticle({ ...values, article_id: currentArticle.article_id});
    } else {
      console.log('Attempting to post new article')
      postArticle(values);
    }
    setValues(initialFormValues); //resetting form submission
    setCurrentArticleId(null); //resetting current article ID to null after editing
  }


  const isDisabled = () => {
    return !values.title.trim() || !values.text.trim() || !values.topic.trim();
    // ✨ implement
    // Make sure the inputs have some values
  };


  const onCancelEdit = (evt) => {
    evt.preventDefault(); // Prevent form submission
    setValues(initialFormValues); // Reset form values
    setCurrentArticleId(null); // Clear the current article selection
  };


  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
   
      <form id="form" onSubmit={onSubmit}>
        <h2>{currentArticle ? "Edit" : "Create"} Article</h2>
        <input
          maxLength={50}
          onChange={onChange}
          value={values.title}
          placeholder="Enter title"
          id="title"
        />
        <textarea
          maxLength={200}
          onChange={onChange}
          value={values.text}
          placeholder="Enter text"
          id="text"
        />
        <select onChange={onChange} id="topic" value={values.topic}>
          <option value="">-- Select topic --</option>
          <option value="JavaScript">JavaScript</option>
          <option value="React">React</option>
          <option value="Node">Node</option>
        </select>
        <div className="button-group">
          <button disabled={isDisabled()} id="submitArticle">Submit</button>
          <button onClick={onCancelEdit}>Cancel edit</button>
        </div>
      </form>
    );
  }


// 🔥 No touchy: LoginForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
