import { faGem, faPaperPlane, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const Assistant = () => {
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const userId = "someUserId"; // This should be dynamic, either from context, localStorage, or passed down as a prop

  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const fetchChatHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/get');
      const result = await response.json();
      setChatHistory(result);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const sendChat = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Prepare the form data
    const formData = new FormData();
    formData.append('user_id', userId); // Add userId to the form data
    formData.append('message', inputText);
    if (file) formData.append('output_image', file); // Only append the file if it exists

    try {
      const response = await fetch('http://localhost:5000/api/chat/create', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setChatHistory([
          ...chatHistory,
          {
            chat_id: result.chat_id,
            user_id: result.user_id,
            message: result.message,
            output_image: result.output_image, // Assuming the server returns a valid image URL
            created_at: result.created_at,
          },
        ]);
        setInputText('');
        setFile(null);
      } else {
        console.error('Error creating chat:', result);
      }
    } catch (error) {
      console.error('Error sending chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = async (chat_id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/delete`, {
        method: 'DELETE',
        body: JSON.stringify({ chat_id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        setChatHistory(chatHistory.filter(chat => chat.chat_id !== chat_id));
      } else {
        console.error('Error deleting chat:', result);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="md:w-[95%] mx-auto flex h-[95%] gap-2">
        <div className="bg-[#465c7a] w-[20%] h-full rounded-xl hidden md:block">
          <div className="flex items-center justify-between p-2">
            <Link to="/" className="flex items-center">
              <img src="assets/images/Logo.png" className="w-1/4" alt="Logo" />
              <h1>AiRoomify</h1>
            </Link>
            <h2 className="bg-[#004adb] text-center w-5 h-5 rounded-full">
              8
            </h2>
          </div>
          <ul className="w-[90%] mx-auto">
            <li>
              <h2 className="uppercase">Today</h2>
              <div className="w-full mt-2 flex flex-col gap-2">
                {chatHistory.length > 0 && chatHistory.map(chat => (
                  <div key={chat.chat_id} className="flex items-center gap-2">
                    <Link className="bg-[#73818a] p-2 rounded-full w-full">
                      {chat.message}
                    </Link>
                    <button
                      className="text-red-500"
                      onClick={() => deleteChat(chat.chat_id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {/* <div className="bg-[#73818a] p-2 rounded-full w-full">
                  <p className="">Modern Room</p>
                </div> */}
              </div>
            </li>
          </ul>
        </div>
        <div className="bg-[#465c7a] w-full md:w-[80%] h-full rounded-xl flex flex-col items-center justify-center relative">
          <div className="absolute top-2 left-2 flex items-center gap-2 md:hidden">
            <FontAwesomeIcon icon={faGem} />
            <h2>Chat Name</h2>
          </div>
          <div className="h-[85%] w-full overflow-auto overflow-x-hidden">
            {chatHistory.length > 0 && chatHistory.map((chat) => (
              <div key={chat.chat_id} className="message">
                <p>{chat.message}</p>
                {chat.output_image && (
                  <img 
                    src={chat.output_image} 
                    alt="chat response" 
                    className="w-full max-w-[300px] rounded-xl object-cover" 
                  />
                )}
              </div>
            ))}
            {/* <div className="w-[30%] p-2 rounded-xl bg-[#13293D] ml-auto mr-5">
              <img src="assets/images/BeforeImage.webp" alt="Before Image"/>
              <p>Convert this room into a modern room with white theme</p>
            </div>
            <div className="w-[30%] p-2 rounded-xl bg-[#13293D] ml-3">
              <img src="assets/images/AfterImage.webp" alt="After Image"/>
            </div> */}
          </div>
          <form className="w-[75%] mt-2 nb-2" onSubmit={sendChat}>
            <div className="w-full rounded-full flex items-center border border-white bg-[#73818a]">
              <div className="relative flex items-center">
                <input
                  type="file"
                  className="absolute border border-white w-8 opacity-0 rounded-full"
                  onChange={handleFileChange}
                />
                <FontAwesomeIcon icon={faPlus} className="bg-[#73818a] p-2 rounded-full" />
              </div>
              <input
                type="text"
                className="p-2 w-full bg-transparent outline-none placeholder:text-white"
                placeholder="Enter your prompt"
                value={inputText}
                onChange={handleTextChange}
              />
              <FontAwesomeIcon
                icon={faPaperPlane}
                className="p-2 rounded-full"
                type="submit"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
