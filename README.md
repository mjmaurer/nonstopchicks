# Cornell Bird Cams TV

A single-page React Router Framework (v7) application acting as an immersive "TV Station" for the Cornell Lab Bird Cams. The app uses react-tv-player to render a full-screen video experience that aggregates data from the YouTube Data API.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 📺 Full-screen TV experience with react-tv-player
- 🔴 Live stream support from Cornell Bird Cams
- 📼 Recorded video browsing by species categories
- 🎮 Arrow-key navigation optimized for TV devices
- 💾 Server-side caching (2-hour TTL) to preserve YouTube API quotas
- 🎨 Custom UI overlay with mode switching and filtering
- 🔒 TypeScript throughout
- 🐳 Docker deployment ready
- 📖 [React Router v7 Framework](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies (note the legacy peer deps flag for react-tv-player compatibility):

```bash
npm install --legacy-peer-deps
```

### Configuration

To use real YouTube data, set your YouTube Data API v3 key:

```bash
export YOUTUBE_API_KEY=your_api_key_here
```

If no API key is provided, the app will use mock data for demonstration.

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
