# DocFlow - GitBook-like Documentation Platform

DocFlow is a modern, intelligent documentation platform inspired by [GitBook](https://www.gitbook.com/). Built with Next.js, TypeScript, and Tailwind CSS, it provides a comprehensive solution for creating, managing, and publishing beautiful documentation.

## 🚀 Features

### Core Features
- **📝 Markdown Editor**: Rich markdown editor with live preview
- **🎨 Beautiful UI**: Modern, responsive design with dark mode support
- **📊 Dashboard**: Document management with analytics and insights
- **🔐 Authentication**: User registration and login system
- **📱 Responsive**: Works perfectly on desktop, tablet, and mobile
- **⚡ Fast**: Built with Next.js for optimal performance

### Advanced Features (Planned)
- **🤖 AI-Powered**: Intelligent content suggestions and optimization
- **🔗 Git Integration**: Sync with GitHub/GitLab repositories
- **📈 Analytics**: Detailed insights into document performance
- **🔒 Access Control**: Role-based permissions and authentication
- **🌐 API Documentation**: Automatic API doc generation
- **🔄 Version Control**: Document versioning and history
- **🌍 Multi-language**: Internationalization support

## 🏗️ Project Structure

```
client/
├── pages/                    # Pages Router directory
│   ├── _app.tsx             # Custom App component
│   ├── _document.tsx        # Custom Document component
│   ├── index.tsx            # Landing page
│   ├── signup.tsx           # User registration
│   ├── login.tsx            # User authentication
│   ├── dashboard.tsx        # Main dashboard
│   ├── editor.tsx           # Document editor
│   └── api/                 # API routes
│       └── hello.ts         # Example API endpoint
├── styles/                  # Global styles
│   └── globals.css          # Tailwind CSS configuration
├── public/                  # Static assets
└── next.config.ts           # Next.js configuration
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with Pages Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons (SVG)
- **Fonts**: Geist (Google Fonts)
- **State Management**: React Hooks
- **Form Handling**: Controlled components

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Available Pages

### Public Pages
- **Home** (`/`) - Landing page with features and pricing
- **Sign Up** (`/signup`) - User registration form
- **Login** (`/login`) - User authentication

### Protected Pages
- **Dashboard** (`/dashboard`) - Document management interface
- **Editor** (`/editor`) - Markdown document editor

### API Routes
- **Hello** (`/api/hello`) - Example API endpoint

## 🎨 Design System

### Colors
- **Primary**: Blue (`#2563eb`)
- **Secondary**: Gray (`#6b7280`)
- **Success**: Green (`#10b981`)
- **Warning**: Yellow (`#f59e0b`)
- **Error**: Red (`#ef4444`)

### Typography
- **Headings**: Geist Sans (Bold)
- **Body**: Geist Sans (Regular)
- **Code**: Geist Mono (Regular)

## 🔧 Development

### Code Style
- **Indentation**: Tabs
- **Quotes**: Single quotes
- **Semicolons**: Omitted
- **Line Length**: 80 characters
- **TypeScript**: Strict mode enabled

### File Naming
- **Components**: PascalCase (`Dashboard.tsx`)
- **Pages**: kebab-case (`user-profile.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)

### Component Structure
```typescript
import { useState } from 'react'
import Head from 'next/head'

interface ComponentProps {
	title: string
	description?: string
}

export default function Component({ title, description }: ComponentProps) {
	const [state, setState] = useState('')

	const handleClick = () => {
		// Handle click
	}

	return (
		<>
			<Head>
				<title>{title}</title>
				{description && <meta name="description" content={description} />}
			</Head>
			<div>
				{/* Component content */}
			</div>
		</>
	)
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Configure for Next.js static export
- **AWS Amplify**: Connect repository and deploy
- **Docker**: Use provided Dockerfile

## 📈 Roadmap

### Phase 1: Core Features ✅
- [x] Landing page
- [x] User authentication
- [x] Basic dashboard
- [x] Markdown editor
- [x] Responsive design

### Phase 2: Advanced Features 🚧
- [ ] Backend API integration
- [ ] Database setup
- [ ] Real-time collaboration
- [ ] File upload system
- [ ] Search functionality

### Phase 3: Enterprise Features 📋
- [ ] Team management
- [ ] Advanced analytics
- [ ] Custom domains
- [ ] SSO integration
- [ ] API documentation generator

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [GitBook](https://www.gitbook.com/)
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)

---

**Made with ❤️ for the developer community**
