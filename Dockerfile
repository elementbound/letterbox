FROM node:14.15

WORKDIR /letterbox

COPY bin ./bin/
COPY client ./client/
COPY data ./data/
COPY handlers ./handlers/
COPY public ./public/
COPY routes ./routes/
COPY scripts ./scripts/
COPY services ./services/
COPY .env.example ./
COPY .eslintrc.js ./
COPY app.js ./
COPY package-lock.json ./
COPY package.json ./
COPY webpack.config.cjs ./

RUN ls -la /letterbox

RUN npm install
RUN npm audit
RUN npm run build

ENTRYPOINT ["npm", "start"]