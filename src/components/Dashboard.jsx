import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = (props) => {
  const { sessionId } = props;
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    user_language: ''
  });
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    // Fetch user's languages from the server
    fetch(`http://127.0.0.1:5000/languages/user/${sessionId}`)
      .then((response) => response.json())
      .then((data) => {
        setLanguages(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [sessionId]);

  useEffect(() => {
    // Fetch user data from the server
    fetch(`http://127.0.0.1:5000/users/${sessionId}`)
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [sessionId]);

  return (
    <div>
      {/* Display user's first name here */}
      <h1>Hello, {userData.first_name}</h1>

      <Link to={`/addlanguage/${sessionId}`}>Add Language</Link>
      <br />
      <Link to={`/profile/${sessionId}`}>Profile</Link>

      <h2>Your Languages:</h2>
      <ul>
        {languages.map((language) => (
          <li key={language.id}>
            <Link to={`/flashcard/${language.id}`}>{language.language} | {language.intensity}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
