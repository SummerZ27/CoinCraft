import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";

const NewPostInput = (props) => {
  const [value, setValue] = useState("");

  // called whenever the user types in the new post input box
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // called when the user hits "Submit" for a new post
  const handleSubmit = (event) => {
    event.preventDefault();
    props.onSubmit && props.onSubmit(value);
    setValue("");
  };

  return (
    <div className="u-flex">
      <input
        type="text"
        placeholder={props.defaultText}
        value={value}
        onChange={handleChange}
        className="NewPostInput-input"
      />
      <button
        type="submit"
        className="NewPostInput-button u-pointer"
        value="Submit"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

const LLM = (props) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [runnable, setRunnable] = useState(false);

  const makeQuery = (q) => {
    setResponse("querying the model...");
    post("/api/query", { query: q })
      .then((res) => {
        setResponse(res.queryresponse);
      })
      .catch(() => {
        setResponse("error during query. check your server logs!");
        setTimeout(() => {
          setResponse("");
        }, 2000);
      });
  };

  if (!props.userId) {
    return <div>Log in before chatting with the LLM</div>;
  }
  return (
    <>
      <div className="llm-container">
        <h1>Query the LLM</h1>
        <NewPostInput defaultText={"what does Tony eat for breakfast?"} onSubmit={makeQuery} />
        <div>{response}</div>
      </div>
    </>
  );
};

export default LLM;
