# DocFlow - GitBook-like Documentation Platform

A modern, full-stack documentation platform built with Next.js and NestJS, inspired by GitBook.

## 🚀 Features

- **📝 Markdown Editor**: Real-time markdown editor with live preview
- **👥 User Management**: Authentication and user profiles
- **📄 Document Management**: Create, edit, and organize documents
- **🎨 Modern UI**: Clean, responsive design with Tailwind CSS
- **🔒 Authentication**: JWT-based authentication system
- **📱 Responsive**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with Pages Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Context** - State management

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type-safe backend development
- **MikroORM** - TypeScript ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Passport.js** - Authentication middleware
- **Swagger** - API documentation

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📋 Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- Git

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/selimkurts/gitbook.git
cd gitbook
```

### 2. Run with Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 3. Access the application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs

## 🏗️ Project Structure

```
gitbook/
├── client/                 # Next.js frontend
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── lib/               # Utilities and API client
│   └── public/            # Static assets
├── backend/               # NestJS backend
│   ├── src/
│   │   ├── modules/       # Feature modules
│   │   ├── core/          # Core functionality
│   │   └── config/        # Configuration
│   └── mikro-orm.config.ts
├── scripts/               # Build scripts
└── docker-compose.yml     # Docker orchestration
```

## 🔧 Development

### Frontend Development
```bash
cd client
npm install
npm run dev
```

### Backend Development
```bash
cd backend
npm install
npm run start:dev
```

### Database Migrations
```bash
cd backend
npm run migration:create
npm run migration:up
```

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up -d

# Rebuild services
docker-compose build

# View logs
docker-compose logs -f [service-name]

# Stop services
docker-compose down

# Development mode with file watching
docker-compose -f docker-compose.dev.yml up -d
```

## 📱 Pages

- **Homepage** (`/`) - Landing page
- **Login** (`/login`) - User authentication
- **Signup** (`/signup`) - User registration  
- **Dashboard** (`/dashboard`) - Document management
- **Editor** (`/editor`) - Markdown document editor
- **Pricing** (`/pricing`) - Pricing information

## 🔐 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile

### Documents
- `GET /documents` - List documents
- `POST /documents` - Create document
- `GET /documents/:id` - Get document
- `PUT /documents/:id` - Update document
- `DELETE /documents/:id` - Delete document

## 🌟 Features Implemented

- ✅ User authentication (JWT)
- ✅ Document CRUD operations
- ✅ Markdown editor with live preview
- ✅ Responsive design
- ✅ Docker containerization
- ✅ API documentation (Swagger)
- ✅ Input validation
- ✅ Error handling
- ✅ Loading states

## 🚀 Deployment

The application is containerized and can be deployed to any Docker-compatible platform:

- **Production**: `docker-compose up -d`
- **Development**: `docker-compose -f docker-compose.dev.yml up -d`

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and NestJS**