"use client";

import { useState } from "react";

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I am your Attendance Portal AI Assistant. How can I help you?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const message = input.trim();

    if (!message || loading) {
      return;
    }

    setError("");

    // Add user's message to chat
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: "user",
        content: message,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/assistant",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to get AI response."
        );
      }

      // Add AI response to chat
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      console.error(
        "Assistant request error:",
        error
      );

      setError(
        error.message ||
          "Failed to communicate with the AI assistant."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          AI Assistant
        </h1>

        <p className="mt-2 text-gray-600">
          Ask questions using the local AI assistant.
        </p>
      </div>

      {/* CHAT CONTAINER */}
      <div className="flex h-[650px] max-w-5xl flex-col rounded-xl border bg-white shadow-sm">
        {/* CHAT HEADER */}
        <div className="border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
              AI
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Attendance Assistant
              </h2>

              <p className="text-sm text-gray-500">
                Powered locally by Ollama
              </p>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          ))}

          {/* AI THINKING */}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-500">
                AI is thinking...
              </div>
            </div>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="mx-6 mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* INPUT */}
        <form
          onSubmit={handleSubmit}
          className="border-t p-4"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              placeholder="Ask the assistant..."
              disabled={loading}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 disabled:bg-gray-100"
            />

            <button
              type="submit"
              disabled={
                loading || !input.trim()
              }
              className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Thinking..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}