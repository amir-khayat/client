import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Flashcard = (props) => {
  const { sessionId } = props;
  const { languageId } = useParams();


  const [languages, setLanguages] = useState({});

  const [flashcardInfo, setFlashcardInfo] = useState({
    word: '',
    translation: '',
    pronunciation_audio_url: '',
    definition: '',
    ai_generated_image_url: '',
    saved: false,
    user_id: sessionId,
    language_id: languageId
  });

  const [userData, setUserData] = useState({});

const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Fetch user's languages from the server
    fetch(`http://127.0.0.1:5000//languages/${languageId}`)
      .then((response) => response.json())
      .then((data) => {
        setLanguages(data);
        setLoaded(true);
      })
      .catch((error) => {
        console.log(error);
      });
      // handleNextWord()
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

  const handleNextWord = () => {
    const prompt = `Generate a word with ${languages.intensity} intensity level in the language ${languages.language}. Provide its translation and definition in ${userData.user_language}, along with an AI-generated image of the word and a pronunciation audio URL.`;
    const apiKey = "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"; // Replace with your actual API key

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "assistant", content: prompt }
        ]
      })
    })

      .then(response => response.json())
      .then(data => {
        console.log("aidata", data);
        // if (data.choices && data.choices.length > 0) {
        //   setFlashcardInfo((prevData) => ({
        //     ...prevData,
        //     word: data.choices[0].message.content,
        //     translation: data.choices[1].message.content,
        //     pronunciation_audio_url: data.choices[2].message.content,
        //     definition: data.choices[3].message.content,
        //     ai_generated_image_url: data.choices[4].message.content,
        //     saved: false
        //   }));
        // }
        setFlashcardInfo((prevData) => ({
          ...prevData,
          word: data.choices[0].message.content
        }));
      })
      .catch(error => {
        // Handle error
        console.log("aierror", error);
      });
  };

  useEffect ( () => {
    // Generate flashcard information using GPT-3 API
    if (Object.keys(languages).length > 0 && Object.keys(userData).length > 0) {
    handleNextWord();
    }
  }, [languages]);


  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:5000/add_flashcard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(flashcardInfo)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Flashcard added successfully");
          handleNextWord();
        } else {
          console.log("Error adding flashcard");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const handleSaveFlashcard = (e) => {
    e.preventDefault();
    // turn saved to to true and sent to database
    setFlashcardInfo((prevData) => ({
      ...prevData,
      saved: true,
    }));
    handleSubmit(e);
  };



  return (

    <div>
      <h1>Flashcard: {flashcardInfo.word} </h1>
      <p>Pronunciation Audio: {flashcardInfo.pronunciation_audio_url}</p>
      <p>Translation: {flashcardInfo.translation}</p>
      <p>Definition: {flashcardInfo.definition}</p>
      <p>AI-Generated Image: {flashcardInfo.ai_generated_image_url}</p>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="sessionId" value={sessionId} />
        <input type="hidden" name="word" value={flashcardInfo.word} />
        <input type="hidden" name="translation" value={flashcardInfo.translation} />
        <input type="hidden" name="pronunciation_audio_url" value={flashcardInfo.pronunciation_audio_url} />
        <input type="hidden" name="definition" value={flashcardInfo.definition} />
        <input type="hidden" name="ai_generated_image_url" value={flashcardInfo.ai_generated_image_url} />
        <button type="submit">Next Flashcard</button>
      </form>
      <button onClick={handleSaveFlashcard}>Save Flashcard</button>

    </div>
  );
};

export default Flashcard;
