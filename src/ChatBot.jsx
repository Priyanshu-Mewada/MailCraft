import React, { useState, useRef, useEffect } from "react";  // ← import useRef, useEffect
import axios from "axios";
import { systemPrompt } from "./systemPrompt";
import Header from "./Header";

const ChatBot = () => {
  const URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";
  const API_KEY = "AIzaSyCVIDIw7UTYc-8HuL3yyOQQw7N-qwEh7ug";

  const [inputData, setInputData] = useState("");
  const [messages, setMessages] = useState([]);

  // 1️⃣ Create a ref for the dummy “end” element
  const messagesEndRef = useRef(null);

  // 2️⃣ useEffect to scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInput = (e) => {
    setInputData(e.target.value);
  };

  const getdata = () => {
    const userText = inputData.trim();
    if (!userText) return;

    setMessages((prev) => [...prev, { from: "user", text: userText }]);
    setInputData("");

    axios
      .post(`${URL}${API_KEY}`, {
        contents: [{ parts: [{ text: systemPrompt }, { text: userText }] }],
      })
      .then((res) => {
        const aiText =
          res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No response from API";
        setMessages((prev) => [...prev, { from: "ai", text: aiText }]);
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          { from: "ai", text: "Error: Unable to fetch response." },
        ]);
      });
  };

  return (
    <div className="mx-auto h-screen bg-[#f7f7f7] flex flex-col">
      <Header />

      {/* Chat history */}
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`my-2 flex ${
              m.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-xl font-semibold ${
                m.from === "user"
                  ? "bg-[#333] text-white"
                  : "bg-white text-[#333] whitespace-pre-wrap"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {/* 3️⃣ Dummy div that we scroll into view */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="w-full p-4 bg-[#f7f7f7]">
        <form
          className="flex items-center gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            getdata();
          }}
        >
          <input
            className="flex-grow p-4 bg-white rounded-lg outline-none"
            type="text"
            placeholder="Ask AI"
            value={inputData}
            onChange={handleInput}
          />
          <button
            type="submit"
            className="bg-[#333] text-white font-bold p-3 rounded-lg hover:scale-95 transition"
            disabled={!inputData.trim()}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
