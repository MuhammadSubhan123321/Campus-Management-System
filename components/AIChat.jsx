
"use client";

import { useEffect, useRef, useState } from "react";

// ROBOT ICON
function RobotIcon({ size = 26 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M32 13V8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="32" cy="6" r="3" fill="currentColor" />

      <rect
        x="7"
        y="27"
        width="7"
        height="15"
        rx="3.5"
        fill="currentColor"
        opacity="0.65"
      />
      <rect
        x="50"
        y="27"
        width="7"
        height="15"
        rx="3.5"
        fill="currentColor"
        opacity="0.65"
      />

      <rect
        x="13"
        y="16"
        width="38"
        height="34"
        rx="12"
        stroke="currentColor"
        strokeWidth="3"
      />

      <circle cx="25" cy="31" r="3" fill="currentColor" />
      <circle cx="39" cy="31" r="3" fill="currentColor" />

      <path
        d="M24 39C26.5 42 29 43 32 43C35 43 37.5 42 40 39"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// SEND ICON
function SendIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M22 2L11 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I am your Campus Management System AI Assistant. How can I help you?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // AUTO SCROLL
  useEffect(() => {
    if (!isOpen) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading, isOpen]);

  // AUTO FOCUS
  useEffect(() => {
    if (!isOpen) return;

    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => clearTimeout(timeout);
  }, [isOpen]);

  // SEND MESSAGE
  async function handleSubmit(event) {
    event.preventDefault();

    const message = input.trim();

    if (!message || loading) return;

    setError("");

    const previousMessages = messages;

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: message,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history: previousMessages.slice(-12),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to get AI response."
        );
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.reply || "I could not generate a response.",
        },
      ]);
    } catch (error) {
      console.error("AI assistant request error:", error);

      setError(
        error.message ||
          "Unable to communicate with the AI assistant."
      );
    } finally {
      setLoading(false);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }

  return (
    <>
      {/* CHAT WINDOW */}
      {isOpen && (
        <div
          className="
            fixed bottom-24 right-6 z-50 flex
            h-[720px] w-[430px]
            max-h-[calc(100vh-7rem)] max-w-[calc(100vw-2rem)]
            flex-col overflow-hidden rounded-[28px]
            border border-gray-200 bg-white shadow-2xl
          "
        >
          {/* HEADER */}
          <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-12 w-12 items-center justify-center
                  rounded-2xl bg-indigo-100 text-indigo-600
                "
              >
                <RobotIcon size={29} />
              </div>

              <div>
                <h2 className="text-[17px] font-semibold text-gray-900">
                  Campus Management Assistant
                </h2>

                <div className="mt-0.5 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="
                flex h-9 w-9 items-center justify-center rounded-lg
                text-2xl text-gray-400 transition
                hover:bg-gray-100 hover:text-gray-700
              "
              aria-label="Close AI Assistant"
            >
              ×
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 space-y-5 overflow-y-auto bg-gray-50/70 px-5 py-5">
            {messages.map((message, index) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={index}
                  className={`flex items-end gap-2.5 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div
                      className="
                        mb-1 flex h-9 w-9 shrink-0 items-center
                        justify-center rounded-xl bg-indigo-100
                        text-indigo-600
                      "
                    >
                      <RobotIcon size={22} />
                    </div>
                  )}

                  <div
                    className={`
                      max-w-[82%] rounded-2xl px-4 py-3
                      text-[14px] leading-6
                      ${
                        isUser
                          ? "rounded-br-md bg-indigo-600 text-white"
                          : "rounded-bl-md border border-gray-200 bg-white text-gray-800 shadow-sm"
                      }
                    `}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* THINKING */}
            {loading && (
              <div className="flex items-end gap-2.5">
                <div
                  className="
                    flex h-9 w-9 shrink-0 items-center justify-center
                    rounded-xl bg-indigo-100 text-indigo-600
                  "
                >
                  <RobotIcon size={22} />
                </div>

                <div className="rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-4 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ERROR */}
          {error && (
            <div className="shrink-0 border-t border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* INPUT */}
          <form
            onSubmit={handleSubmit}
            className="shrink-0 border-t border-gray-200 bg-white px-5 pb-4 pt-4"
          >
            <div
              className="
                flex items-center gap-2 rounded-2xl border
                border-gray-300 bg-white p-2 shadow-sm transition
                focus-within:border-indigo-400
                focus-within:ring-2 focus-within:ring-indigo-100
              "
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about students, classes, teachers..."
                disabled={loading}
                autoComplete="off"
                className="
                  min-w-0 flex-1 bg-transparent px-2 py-2 text-sm
                  text-gray-900 outline-none placeholder:text-gray-400
                  disabled:cursor-not-allowed
                "
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="
                  flex h-11 w-11 shrink-0 items-center justify-center
                  rounded-xl bg-indigo-600 text-white transition
                  hover:bg-indigo-700 disabled:cursor-not-allowed
                  disabled:bg-gray-300
                "
                aria-label="Send message"
              >
                {loading ? "…" : <SendIcon />}
              </button>
            </div>

            <p className="mt-2.5 text-center text-[11px] text-gray-400">
              Answers are based on your portal access.
            </p>
          </form>
        </div>
      )}

      {/* FLOATING ROBOT BUTTON */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <>
            <span
              className="
                pointer-events-none absolute inset-0 animate-ping
                rounded-full bg-indigo-500 opacity-20
              "
            />
            <span
              className="
                pointer-events-none absolute -inset-2 rounded-full
                border border-indigo-400/30
                animate-[ping_2.4s_ease-out_infinite]
              "
            />
          </>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="
            relative flex h-16 w-16 items-center justify-center
            rounded-full bg-indigo-600 text-white shadow-xl
            shadow-indigo-200 transition duration-200
            hover:scale-105 hover:bg-indigo-700 active:scale-95
          "
          aria-label={
            isOpen ? "Close AI Assistant" : "Open AI Assistant"
          }
        >
          {isOpen ? (
            <span className="text-3xl font-light">×</span>
          ) : (
            <RobotIcon size={34} />
          )}
        </button>
      </div>
    </>
  );
}
