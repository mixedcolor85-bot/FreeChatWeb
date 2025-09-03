FROM node:20-alpine

# 작업 디렉토리 생성
RUN mkdir -p /app /app/logs /app/uploads
WORKDIR /app

# 백엔드 패키지 설치
COPY backend/package.json ./package.json
COPY backend/package-lock.json ./package-lock.json
RUN npm install

# 전체 소스 복사
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# 포트 노출
EXPOSE 3000

# 앱 실행
CMD ["node", "backend/app.js"]
