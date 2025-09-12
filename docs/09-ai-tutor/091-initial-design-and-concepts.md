---
sidebar_position: 1
title: Initial Design & Core AI Concepts
---

# 9.1 The Initial Decisions and Core AI Concepts

The vision for the AI Tutor feature was to create a tailored, context-aware learning companion, requiring careful consideration of modern AI architectures, security, data storage, and technology stack choices.

---

## Architectural Approaches for AI Chat Integration

There are two primary methods for adding AI chat capabilities to a web application:

### Method 1: Direct Frontend-to-AI Communication

In this approach, the React frontend communicates directly with a large language model (LLM) provider.

- **How it Works:**  
  The user types a message, which the React component sends directly to the AI provider's servers (e.g., OpenAI or Google) using their SDK. The response is returned to the frontend and displayed to the user.

- **Pros:**  
  - Conceptually simple for basic chat functionality.

- **Cons:**  
  - **Security Risk:** Exposes the secret API key in the browser, making it vulnerable to theft and misuse.
  - **No History:** The AI does not retain conversation history unless managed manually on the client side, which adds complexity.
  - **Less Control:** Limits the ability to add custom logic, save conversations to a database, or moderate content before sending it to the AI.

### Method 2: Backend as a Proxy (Recommended)

This is the standard, secure, and professional approach for integrating an AI model.

- **How it Works:**  
  1. The user sends a message from the React app to the Express.js backend.
  2. The backend, with the secret AI API key securely stored in a `.env` file, receives the message.
  3. The server makes a request to the AI provider (e.g., Gemini API), including the user's message and any conversation history.
  4. The AI service responds to the backend.
  5. The backend can save the conversation to a database if desired, then sends the AI's response back to the React app for display.

- **Pros:**  
  - **Secure:** The API key never leaves the server.
  - **Conversation History:** The backend can manage and append conversation history, enabling multi-turn, stateful conversations.
  - **Full Control:** Enables custom logic, conversation storage, and business logic integration.

- **Cons:**  
  - Requires additional backend setup to create the necessary endpoints.

### Hybrid Storage Strategy: Temporary vs. Permanent Chats

A key product decision was how to balance user value with the cost of storing large amounts of chat data. The solution was a hybrid storage model:

- **Temporary Chats:**  
  "General" and "Problem-Specific" chats are stored in a dedicated `AiConversation` collection with a MongoDB TTL (Time-To-Live) index, automatically deleting conversations after 24 hours.

- **Permanent Chats:**  
  "Interview Mode" chats are stored permanently in a separate `InterviewSession` collection, allowing users to review their progress over time.

For general and problem-related chats, users are notified about chat expiration. For interview mode, chats are stored permanently. Users are also allowed to start new conversations, with a warning that old chats will be deleted.

### AI Model Selection and Feature Planning

- The project uses a free-tier AI model for different purposes, including general chat and problem-specific chat.
- For each problem, users can interact with the AI in two modes: general mode and interview mode.
- The system is designed to be up-to-date with modern AI concepts and frameworks, such as RAG, LangChain, LangGraph, and agents, to demonstrate familiarity with current AI technologies.

### Demystifying the AI Toolkit

A foundational understanding of the following AI concepts and technologies was essential for the project:

<details>
  <summary><strong>Large Language Model (LLM) – The "Brain"</strong></summary>
  <div>
    <p>
      <strong>General Explanation:</strong>  
      An LLM is like a super-intelligent librarian who has read nearly every book, article, and website in the world up to a certain date. It can answer questions, write essays, and hold conversations on a wide range of topics.
    </p>
    <p>
      <strong>Formal Definition:</strong>  
      A Large Language Model (LLM) is a deep learning model (typically a Transformer) pre-trained on massive text datasets. It can understand, process, and generate human-like text.
    </p>
    <p>
      <strong>Relevance:</strong>  
      The LLM is the core engine of the "Chat with AI" feature. In this project, Google's Gemini model serves as the AI's brain.
    </p>
  </div>
</details>

<details>
  <summary><strong>LangChain – The "Toolkit"</strong></summary>
  <div>
    <p>
      <strong>General Explanation:</strong>  
      LangChain is not an AI model, but a toolkit and framework that helps orchestrate complex, multi-step AI workflows. It allows chaining together different tools and managing conversation history.
    </p>
    <p>
      <strong>Formal Definition:</strong>  
      LangChain is an open-source framework for building applications powered by LLMs. It provides modular components ("chains" and "agents") to connect LLMs to external data, manage history, structure prompts, and build complex workflows.
    </p>
    <p>
      <strong>Relevance:</strong>  
      LangChain is used in the backend (`aiService.js`) to structure prompts, manage conversation history, and implement RAG by connecting to the database and passing relevant data to the AI.
    </p>
  </div>
</details>

<details>
  <summary><strong>RAG (Retrieval-Augmented Generation) – The "Open Book"</strong></summary>
  <div>
    <p>
      <strong>General Explanation:</strong>  
      RAG allows the AI to answer questions based on specific, private data (e.g., a user's problem database) by retrieving relevant information and augmenting the AI's prompt with it.
    </p>
    <p>
      <strong>Formal Definition:</strong>  
      Retrieval-Augmented Generation (RAG) is an architectural pattern that enhances an LLM's response by grounding it in external, context-specific data. It involves:
      <ol>
        <li><strong>Retrieval:</strong> Searching a knowledge base for relevant information.</li>
        <li><strong>Generation:</strong> Combining the retrieved data with the user's query and passing it to the LLM for a grounded response.</li>
      </ol>
    </p>
    <p>
      <strong>Relevance:</strong>  
      RAG is the cornerstone of the problem-specific chat. The backend controller for `/ai/problem-chat` retrieves the relevant problem from MongoDB and augments the AI's prompt, enabling focused, context-aware conversations.
    </p>
  </div>
</details>

---

With these foundational architectural and product decisions, the project is positioned to implement a secure, flexible, and cutting-edge AI Tutor feature that balances user experience, security, and modern AI best practices.