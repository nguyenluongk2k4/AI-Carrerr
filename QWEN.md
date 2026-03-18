# AI Career Guidance Platform (Hành Trang Số)

## Project Overview

**Hành Trang Số** is an AI-powered career guidance platform designed for Vietnamese high school students (grades 10–12) and parents. The platform provides personalized recommendations for:

- Career paths and university majors
- University selection based on admission scores, tuition, and location
- Study roadmaps and progress tracking
- AI chatbot advisor using RAG (Retrieval-Augmented Generation)

### Architecture

The project follows a **monorepo structure** with two main components:

| Component | Path | Technology |
|-----------|------|------------|
| **Frontend** | `AI_Carreer_FE/` | Vite + React + TypeScript + Material-UI + Tailwind CSS |
| **Backend** | `AI_Carreer/` | Python + FastAPI + LangChain + ChromaDB + HuggingFace Embeddings |

### Backend Architecture (DDD)

The Python backend follows **Domain-Driven Design (DDD)** principles:

```
AI_Carreer/
├── src/
│   ├── domain/          # Entities, value objects, domain services
│   ├── application/     # Use cases and ports
│   ├── infrastructure/  # Persistence and external integrations
│   └── interfaces/      # HTTP controllers and routes
├── embed.py             # Data ingestion script (creates ChromaDB)
├── run_api.py           # FastAPI entrypoint
├── chatbot.py           # RAG chatbot CLI
├── data.json            # Knowledge base (Vietnamese education data)
├── data_2.json          # Additional knowledge base
└── chroma_db/           # Generated vector database
```

### Frontend Structure

```
AI_Carreer_FE/
├── src/
│   ├── app/
│   │   ├── pages/       # Main screens (Landing, Assessment, Results, Universities, Roadmap, Premium)
│   │   ├── components/  # Reusable UI components
│   │   ├── data/        # Static data and constants
│   │   ├── utils/       # Utility functions
│   │   └── routes.tsx   # Route configuration
│   └── styles/          # Global styles
├── apps/
│   └── api/             # API contracts and domain interfaces (DDD-style)
└── vite.config.ts       # Vite configuration with Tailwind CSS
```

## Building and Running

### Frontend Setup

```bash
# Navigate to frontend directory
cd AI_Carreer_FE

# Install dependencies
npm install

# Start development server (Vite hot reload)
npm run dev

# Build for production
npm run build
```

### Backend Setup

```bash
# Navigate to backend directory
cd AI_Carreer

# Install Python dependencies
python -m pip install -r requirements.txt

# Build vector database (run once or after data changes)
python embed.py

# Start FastAPI server
python run_api.py
```

### Environment Configuration

Backend requires `AI_Carreer/.env` with the following variables:

```env
# LLM Provider: "gemini" or "openai"
LLM_PROVIDER=gemini

# Google Gemini API Key
GOOGLE_API_KEY=your_api_key_here

# OpenAI API Key (if using openai provider)
OPENAI_API_KEY=your_openai_api_key

# Model names (optional)
GEMINI_MODEL=gemini-2.5-flash
OPENAI_MODEL=gpt-4o-mini

# Data paths
DATA_FILE=data.json
CHROMA_DB_PATH=./chroma_db
```

## Core Features

### 1. Career Assessment
- Personality tests
- Interest evaluation
- Ability assessment

### 2. Academic Data Input
- GPA/exam scores
- Subject combinations (A00, A01, D01...)
- Financial capability
- Geographic preferences

### 3. AI Career Matching
- Compatibility scoring between student profile and majors
- Explanation of recommendations

### 4. University Recommendation
- Filtered by admission score, tuition, location
- Admission probability estimation (High/Medium/Low)

### 5. Financial Planning
- Yearly tuition estimates
- Total 4-year cost projection

### 6. Career Roadmap (Premium)
- Month-by-month study plans
- Skill improvement suggestions
- Progress tracking toward target scores

### 7. AI Chat Advisor
- RAG-based chatbot using ChromaDB vector store
- Answers questions about majors, universities, and study advice

## User Flow

```
Landing Page
  → Career Assessment
  → Input Academic Data
  → AI Analysis
  → Recommended Majors
  → Recommended Universities
  → Admission Probability
  → Financial Estimation
  → Career Roadmap
  → Progress Tracking
```

## Development Conventions

### TypeScript/React (Frontend)
- **Indentation**: 2 spaces
- **Components**: `PascalCase`
- **Variables/Functions**: `camelCase`
- **File extension**: `.tsx` for React components
- **Path alias**: `@/` maps to `src/`

### Python (Backend)
- **Indentation**: 4 spaces
- **Naming**: `snake_case`
- **DDD boundaries**: Keep `domain`, `application`, `infrastructure`, `interfaces` clean

### Git Commits
- Use concise, imperative messages
- Prefer Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
- PRs should include: summary, scope (FE/BE), testing notes, UI screenshots (for frontend changes)

## Key Dependencies

### Frontend
- React 18.3.1
- Vite 6.3.5
- Material-UI 7.3.5
- Radix UI primitives
- React Router 7.13.0
- Tailwind CSS 4.1.12
- Motion (animation library)
- Recharts (data visualization)

### Backend
- FastAPI >= 0.110.0
- LangChain >= 0.2.0
- ChromaDB >= 0.5.0
- HuggingFace Transformers (sentence-transformers >= 3.0.0)
- Google Generative AI (langchain-google-genai)
- python-dotenv >= 1.0.0

## Testing

**Note**: No automated test framework is currently configured.

- Frontend: No `test` script in `package.json`
- Backend: No `pytest` configuration

If adding tests, introduce a clear test runner and document the command in this file.

## Important Notes

### Vector Database
- `chroma_db/` is **generated content**
- Re-run `python embed.py` after modifying `data.json` or `data_2.json`
- Delete existing `chroma_db/` if you encounter errors (script handles this automatically)

### Security
- Never commit real API keys to version control
- Store sensitive configuration in `AI_Carreer/.env`

### Design Philosophy
- Simple for students to use
- Data-driven recommendations
- Explainable AI (must explain why recommendations are made)
- Actionable output (always provide next steps)
- Core concept: **Gap Analysis + Career Roadmap**

## Integration Points

| Frontend Page | Backend API Endpoint |
|---------------|---------------------|
| Assessment | `/quiz/start`, `/quiz/answer` |
| Results | Career matching engine |
| Universities | University recommendation API |
| Roadmap | `/roadmap/generate` |
| AI Chat Assistant | `/advisor/ask` (RAG pipeline) |

## Troubleshooting

### ChromaDB Lock Error
If `python embed.py` fails with "PermissionError":
1. Close any running instances of `chatbot.py` or the API server
2. Manually delete `AI_Carreer/chroma_db/` folder
3. Re-run `python embed.py`

### Frontend Build Issues
1. Clear `node_modules`: `rm -rf node_modules`
2. Reinstall: `npm install`
3. Clear Vite cache: `rm -rf node_modules/.vite`
4. Rebuild: `npm run build`
