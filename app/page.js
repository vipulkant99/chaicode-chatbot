"use client";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { LoaderOne } from "./_components/loader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // for tables, strikethrough, task lists
import rehypeHighlight from "rehype-highlight";

export default function Home() {
  const [chat, setChat] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [message, setMessage] = useState("");
  const [courses, setCourses] = useState();
  const [currentCourse, setCurrentCourse] = useState("");
  const aiMessageBufferRef = useRef("");
  const [loadingChat, setLoadingChat] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    //console.log("data is111: ");
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/get-courses");
        const data = await res.json();
        console.log("main data is:", data);

        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, []);

  const handleSend = async () => {
    setLoadingChat((val) => !val);

    if (!message.trim()) return;

    if (!currentCourse.trim()) {
      toast.error("Please Select one course to start chatting with bot.");
      return;
    }

    setChat((prev) => [
      ...prev,
      { user: "User", text: message },
      { user: "AI", text: "" },
    ]);
    aiMessageBufferRef.current = "";
    setMessage("");

    try {
      const res = await fetch("/api/user-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: message, currentCourse: currentCourse }), // message = user’s input
      });

      //const data = await res.json();
      // console.log("Chat response:", data);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            console.log("stream data is:", data.content);
            aiMessageBufferRef.current += data.content;

            setChat((prev) => {
              const updated = [...prev];
              // Find last AI message (or create one if it's the first AI response)
              if (
                updated.length > 0 &&
                updated[updated.length - 1].user === "AI"
              ) {
                updated[updated.length - 1].text = aiMessageBufferRef.current;
              } else {
                updated.push({ user: "AI", text: aiMessageBufferRef.current });
              }
              return updated;
            });
          }
        }
      }

      // setChat((prevChat) => [
      //   ...prevChat,
      //   { user: "User", text: message },
      //   { user: "AI", text: streamResponse },
      // ]);
      setLoadingChat((val) => !val);
    } catch (error) {
      toast.error(`Something went wrong error: ${error}`);
    }
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } h-screen p-4 overflow-hidden`}
    >
      <div className="flex justify-between items-center mb-4">
        <a
          href="https://www.imvkc.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-4xl font-bold cursor-pointer hover:bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:bg-clip-text hover:text-transparent hover:underline tracking-wide"
        >
          imvkc.in
        </a>
        <h1 className="text-2xl font-bold">ChaiCode Courses</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded-lg shadow bg-blue-500 text-white"
        >
          Toggle {darkMode ? "Light" : "Dark"} Mode
        </button>
      </div>

      <div className="flex flex-row gap-x-4 gap-y-0 h-[calc(100vh-theme(spacing.24))]">
        {/* Left Column */}
        <div className="flex w-1/5 flex-col items-center justify-center space-y-4 p-4 rounded-2xl shadow bg-white dark:bg-gray-800">
          <div>
            {!courses ? (
              <LoaderOne />
            ) : (
              courses.map((course, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentCourse(course.name)}
                  className={`${
                    course.name === currentCourse ? "bg-gray-700" : ""
                  } mt-4 py-3 px-8 font-semibold rounded-2xl text-xl uppercase cursor-pointer text-neutral-100`}
                >
                  <h1>{course.name}</h1>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column - Chat */}
        <div className="flex flex-col flex-1 rounded-2xl shadow bg-white dark:bg-gray-800">
          <div className="flex-1 overflow-y-auto min-h-0 space-y-2 p-4 mb-4">
            {chat.length === 0 ? (
              <h1 className="text-neutral-100/50 text-xl flex items-center justify-center h-full">
                First Please select anyone course before starting...
              </h1>
            ) : (
              chat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg w-1/2 break-words whitespace-pre-wrap ${
                    msg.user === "User"
                      ? "bg-blue-500 text-white self-end ml-auto"
                      : "bg-gray-300 dark:bg-gray-600 text-black dark:text-white self-start mr-auto"
                  }`}
                >
                  {msg.text !== "" ? (
                    <ReactMarkdown
                      children={msg.text}
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                    />
                  ) : (
                    <div className="py-2 flex gap-1 text-lg font-mono">
                      Typing <LoaderOne />
                    </div>
                  )}
                </div>
              ))
            )}
            {/* {loadingChat && } */}
            <div ref={chatEndRef} />
          </div>
          <div className="flex gap-2 p-4 shrink-0">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={loadingChat}
              className="px-4 py-2 rounded-lg shadow bg-blue-500 text-white cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
