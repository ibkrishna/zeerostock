*Tech Stack*
 Assignment A & Assignment B 

Frontend - React 18 + Axios 

Backend - Node.js + Express 

Database - In-memory array | MongoDB + Mongoose 

Dev tool - Nodemon 



*How to Run*

*Prerequisites*
- Node.js >= 16 → https://nodejs.org
- MongoDB (Assignment B only) → https://www.mongodb.com/try/download/community



*Assignment A — Search API + UI*

Terminal 1 — Backend:
bash
cd assignment-a/backend

npm install

npm run dev


Terminal 2 — Frontend:
bash
cd assignment-a/frontend

npm install

npm start

Open → http://localhost:3000



*Assignment B — Database API + UI*

Step 1 — Start MongoDB:
bash
# macOS

brew services start mongodb-community


# Linux
sudo systemctl start mongod

# Windows
mongod --dbpath "C:\data\db"


Terminal 1 — Backend:
bash
cd assignment-b/backend
npm install
npm run dev


Terminal 2 — Frontend:
bash
# macOS / Linux
cd assignment-b/frontend
npm install
PORT=3001 npm start

# Windows
cd assignment-b/frontend
npm install
set PORT=3001 && npm start

Open → http://localhost:3001


*Ports*

 Assignment A Backend - 5001 
 
 Assignment A Frontend - 3000 
 
Assignment B Backend -5002 

Assignment B Frontend - 3001 

 MongoDB  -27017 
