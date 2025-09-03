"use client";
import { useEffect, useRef, useState } from "react";
import { LoaderOne } from "./_components/loader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // for tables, strikethrough, task lists
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { MenuIcon, Send, SendHorizonal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourses,
  sendMessages,
  setCurrentCourse,
  setMessage,
  toggleModal,
} from "./_store/userSlice";
import { useTheme } from "next-themes";

export default function Home() {
  const aiMessageBufferRef = useRef("");
  const chatEndRef = useRef(null);
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();

  const {
    chat,
    message,
    courses,
    currentCourse,
    loadingChat,
    showModal,
    courseStatus,
  } = useSelector((state) => state.userChat);

  function changeTheme() {
    console.log("dark is", theme);
    setTheme(theme === "dark" ? "light" : "dark");
  }
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    dispatch(fetchCourses());
  }, []);

  const handleSend = async () => {
    dispatch(sendMessages({ message, currentCourse, aiMessageBufferRef }));
  };

  // const handleSend = async () => {
  //   setLoadingChat((val) => !val);

  //   if (!message.trim()) return;

  //   if (!currentCourse.trim()) {
  //     toast.error("Please Select one course to start chatting with bot.");
  //     return;
  //   }

  //   setChat((prev) => [
  //     ...prev,
  //     { role: "user", content: message },
  //     { role: "assistant", content: "" },
  //   ]);
  //   aiMessageBufferRef.current = "";
  //   setMessage("");

  //   try {
  //     const res = await fetch("/api/user-chat", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ query: message, currentCourse: currentCourse }), // message = user’s input
  //     });

  //     //const data = await res.json();
  //     // console.log("Chat response:", data);

  //     const reader = res.body.getReader();
  //     const decoder = new TextDecoder();

  //     while (true) {
  //       const { done, value } = await reader.read();

  //       if (done) break;

  //       const chunk = decoder.decode(value);
  //       const lines = chunk.split("\n\n");

  //       for (const line of lines) {
  //         if (line.startsWith("data: ")) {
  //           const data = JSON.parse(line.slice(6));
  //           console.log("stream data is:", data.content);
  //           aiMessageBufferRef.current += data.content;

  //           setChat((prev) => {
  //             const updated = [...prev];
  //             // Find last AI message (or create one if it's the first AI response)
  //             if (
  //               updated.length > 0 &&
  //               updated[updated.length - 1].user === "AI"
  //             ) {
  //               updated[updated.length - 1].text = aiMessageBufferRef.current;
  //             } else {
  //               updated.push({ user: "AI", text: aiMessageBufferRef.current });
  //             }
  //             return updated;
  //           });
  //         }
  //       }
  //     }

  //     // setChat((prevChat) => [
  //     //   ...prevChat,
  //     //   { user: "User", text: message },
  //     //   { user: "AI", text: streamResponse },
  //     // ]);
  //     setLoadingChat((val) => !val);
  //   } catch (error) {
  //     toast.error(`Something went wrong error: ${error}`);
  //   }
  // };

  return (
    <div
      className={`dark:bg-neutral-950 dark:text-white bg-neutral-50 text-neutral-950 h-screen p-4 overflow-hidden `}
    >
      <div className="flex justify-between items-center mb-4">
        <img
          src={theme === "dark" ? "chaicode-white.svg" : "chaicode-black.svg"}
          alt="chaiCode"
          className="w-50 h-10"
        />
        <a
          href="https://www.imvkc.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-4xl font-bold cursor-pointer hover:bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:bg-clip-text hover:text-transparent hover:underline tracking-wide"
        >
          imvkc.in
        </a>
        <button
          onClick={() => changeTheme()}
          className={`p-2 rounded-lg dark:hover:bg-neutral-800 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 transition-colors`}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="flex flex-row h-[calc(100vh-theme(spacing.24))]">
        {/* Left Column */}
        <div
          className={`flex flex-col items-center justify-center space-y-4 p-4 shadow bg-neutral-100 dark:bg-neutral-900 
          ${showModal ? "w-1/5" : "hidden"}`}
        >
          <div>
            {courseStatus !== "success" ? (
              <LoaderOne />
            ) : (
              courses.map((course, index) => (
                <div
                  key={index}
                  onClick={() => dispatch(setCurrentCourse(course.name))}
                  className={`${
                    course.name === currentCourse
                      ? "dark:bg-neutral-700 bg-neutral-300"
                      : ""
                  } mt-4 py-3 px-8 font-semibold rounded-xl text-xl uppercase cursor-pointer dark:text-neutral-100 dark:hover:bg-neutral-600 text-neutral-900 hover:bg-neutral-200`}
                >
                  <h1>{course.name}</h1>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="relative flex items-top">
          <div className="w-0.5 h-full right-0 bg-gradient-to-b dark:from-neutral-900 via-orange-400 dark:to-neutral-900" />
          <div
            onClick={() => dispatch(toggleModal(!showModal))}
            className="absolute size-10 rounded-full -left-5 -top-5 bg-gradient-to-b from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 flex items-center justify-center"
          >
            <MenuIcon className="text-black dark:text-white" />
          </div>
        </div>

        {/* Right Column - Chat */}
        <div className="flex flex-col flex-1 shadow bg-white dark:bg-neutral-900">
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
                    msg.role === "user"
                      ? "bg-blue-500 text-white self-end ml-auto"
                      : "bg-neutral-300 dark:bg-neutral-600 text-black dark:text-white self-start mr-auto"
                  }`}
                >
                  {msg.content !== "" ? (
                    <div className="text-sm leading-relaxed">
                      {console.log(
                        "stram data is",
                        msg.content.replace(/\n{3,}/g, "\n\n").trim()
                      )}
                      <ReactMarkdown
                        children={msg.content
                          .replace(/\n{3,}/g, "\n\n")
                          .replace(/\n+$/, "")
                          .trim()}
                        remarkPlugins={[remarkGfm]}
                        //rehypePlugins={[rehypeRaw]}
                        components={{
                          p: ({ node, ...props }) => (
                            <p
                              className="text-neutral-800 dark:text-neutral-200"
                              {...props}
                            />
                          ),
                          h1: ({ node, ...props }) => (
                            <h1 className="text-2xl font-bold" {...props} />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2 className="text-xl font-semibold" {...props} />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3 className="text-lg font-semibold" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc list-inside" {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol
                              className="list-decimal list-inside"
                              {...props}
                            />
                          ),
                          table: ({ node, ...props }) => (
                            <div className="overflow-x-auto">
                              <table
                                className="min-w-full border-collapse border border-neutral-300 dark:border-neutral-700"
                                {...props}
                              />
                            </div>
                          ),
                          thead: ({ node, ...props }) => (
                            <thead
                              className="bg-neutral-100 dark:bg-neutral-800"
                              {...props}
                            />
                          ),
                          tbody: ({ node, ...props }) => <tbody {...props} />,
                          tr: ({ node, ...props }) => (
                            <tr
                              className="border-b border-neutral-200 dark:border-neutral-700"
                              {...props}
                            />
                          ),
                          th: ({ node, ...props }) => (
                            <th
                              className="border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-left font-semibold bg-neutral-50 dark:bg-neutral-800"
                              {...props}
                            />
                          ),
                          td: ({ node, ...props }) => (
                            <td
                              className="border border-neutral-300 dark:border-neutral-700 px-3 py-2"
                              {...props}
                            />
                          ),
                          code({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            const codeString = String(children);
                            const [copied, setCopied] = useState(false);

                            const handleCopy = () => {
                              navigator.clipboard.writeText(codeString);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 1500); // Reset after 1.5s
                            };

                            return !inline && match ? (
                              <div className="relative group">
                                <SyntaxHighlighter
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                  customStyle={{
                                    borderRadius: "0.5rem",
                                    padding: "1rem",
                                    fontSize: "0.9rem",
                                    overflowX: "auto",
                                  }}
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                                <button
                                  onClick={handleCopy}
                                  className={`absolute top-2 right-2 px-2 py-1 text-xs rounded 
        bg-neutral-700 text-white transition-opacity duration-300 
        opacity-0 group-hover:opacity-100`}
                                >
                                  {copied ? "✅ Copied!" : "📋 Copy code"}
                                </button>
                              </div>
                            ) : (
                              <code
                                className="bg-neutral-800 text-neutral-100 px-1 py-0.5 rounded"
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                        }}
                      />
                    </div>
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
          <div className="flex items-end justify-end gap-2 p-4 shrink-0 border rounded-lg ml-2.5">
            <textarea
              className="relative flex-1 p-2 border-none resize-none overflow-y-auto dark:bg-neutral-900 dark:text-white"
              placeholder="Type a message..."
              style={{ border: "none", outline: "none", maxHeight: "192px" }}
              value={message}
              onChange={(e) => {
                dispatch(setMessage(e.target.value));

                // Auto-resize with max height
                e.target.style.height = "auto";
                const scrollHeight = e.target.scrollHeight;
                const maxHeight = 6 * 24; // 6 rows * ~24px per line
                e.target.style.height = `${Math.min(
                  scrollHeight,
                  maxHeight
                )}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={loadingChat}
              className="absolute mr-2.5 size-10 p-2.5 flex items-center justify-center rounded-full shadow bg-neutral-950 text-white cursor-pointer self-end"
            >
              <SendHorizonal />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
