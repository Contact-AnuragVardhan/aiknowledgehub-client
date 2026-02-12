
# 🧠 AI Knowledge Hub – Frontend (Next.js)

This is the **frontend UI** for the **AI Knowledge Hub**, a full RAG-based document search and question‑answering system powered by a FastAPI backend with pgvector, BM25 search, and hybrid retrieval.

The UI allows users to:
- Register and log in
- Upload documents (PDF, DOCX, TXT)
- View list of ingested documents
- Select document(s) for querying
- Ask questions using hybrid BM25 + semantic RAG pipeline
- View LLM answers and supporting sources

---

## 🚀 Getting Started

### **1. Install dependencies**
```bash
npm install
# or yarn install
# or pnpm install
# or bun install
```

### **2. Start the development server**
```bash
npm run dev
```

Frontend will run at:

👉 http://localhost:3000

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME="AI Knowledge Hub"
```

If Wer backend uses JWT (recommended):

```
NEXT_PUBLIC_AUTH_MODE=jwt
```

---

## 🧩 Features & Usage

### **1. Login / Register**
The authentication screens allow users to create an account or log in.  
The UI sends API calls to:

- `POST /api/register`
- `POST /api/login`

Both endpoints return a JWT token which is stored client‑side.

---

### **2. Upload Documents**
Users can upload:
- `.pdf`
- `.docx`
- `.txt`

UI sends:

```
POST /api/ingest
Content-Type: multipart/form-data
file=<document>
```

Backend:
- Extracts text  
- Chunks it  
- Creates embeddings  
- Stores into pgvector  
- Generates BM25 full‑text index automatically  

---

### **3. View Documents List**
UI fetches:

```
GET /api/docs
```

This returns all document names stored for the logged-in user.

The UI displays:
- Uploaded documents
- Last updated date
- File type icons

---

### **4. Ask Questions (RAG Query)**
User enters a question + optionally selects a document.

UI calls:

```
POST /api/query
{
  "query": "Wer question",
  "doc_name": "optional_document_name"
}
```

Backend:
- Runs BM25 keyword search  
- Runs semantic embedding similarity search  
- Merges + dedupes results  
- Builds context  
- LLM (GPT‑4o‑mini) generates answer  
- Returns answer + list of sources  

UI renders:
- Answer in chat bubble format
- Sources with doc names
- Confidence indicators (optional)

---

## 🗂️ Project Structure

```
app/
 ├─ (auth)/            # login/register
 ├─ dashboard/         # home page after login
 ├─ ingest/            # upload UI
 ├─ query/             # ask questions
 ├─ components/        # shared UI elements
 ├─ lib/               # helper utilities
 └─ styles/            # global styles
```

---

## 🧪 Testing

```
npm run test
```

Or run lint:

```
npm run lint
```

---

## 📦 Deployment

We can deploy the UI on:

- **Vercel** 
- Netlify
- AWS Amplify
- Docker

## 📄 License

MIT License.

---
