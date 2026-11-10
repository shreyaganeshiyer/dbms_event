# -------- these are the react vite init-----

npm create vite@latest . -- --template react
npm install

# ----------these are the dependencies to install -----

# Frontend

npm install react-router-dom lucide-react @monaco-editor/react recharts

# Backend

npm install express cors mysql2 dotenv

# Styling (Tailwind v3)

npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

# Run both frontend and backend simultaneously

for frontend : npm run dev

for backend node server/index.js

makesure there exists a valid database with correct name
