# =========================
# 1. Frontend Build Stage
# =========================
FROM node:18 AS frontend-build

WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build


# =========================
# 2. Backend Stage
# =========================
FROM python:3.11-slim

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Python deps
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Backend code
COPY backend .

# Frontend build ins Backend kopieren
COPY --from=frontend-build /frontend/dist /app/static

# Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["sh", "-c", "python manage.py migrate && python manage.py collectstatic --noinput && nginx && python manage.py runserver 0.0.0.0:8000"]
