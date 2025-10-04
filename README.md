# SoftWire India - Coming Soon Page

A modern, animated coming soon page for SoftWire India - an AI innovation and software development company. Features stunning AI-themed animations, particle effects, and responsive design.

## 🌟 Features

- **Modern Design**: Clean, professional UI with AI-themed visual elements
- **Particle System**: Dynamic particle effects with neural network connections
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Interactive Animations**: Smooth transitions, typing effects, and hover animations
- **Countdown Timer**: Real-time countdown to launch date
- **Email Subscription**: Capture leads with animated form submission
- **Performance Optimized**: Lazy loading, efficient animations, and fast loading times
- **Accessibility**: WCAG compliant with keyboard navigation support
- **PWA Ready**: Service worker and offline capabilities
- **Analytics Ready**: Built-in event tracking and user interaction monitoring

## 🚀 Live Demo

Visit the live site: [https://www.softwireindia.com](https://www.softwireindia.com)

## ☁️ Deployment Options

### Google Cloud Platform (Recommended)
- **Fast**: Global CDN distribution
- **Secure**: Automatic SSL certificates
- **Scalable**: Auto-scaling based on traffic
- **Reliable**: 99.95% uptime SLA

**Quick Deploy:**
```bash
# Windows
deploy-gcp.bat

# Mac/Linux
./deploy-gcp.sh
```

### Alternative Platforms
- **Render.com**: Auto-deploy from GitHub
- **Netlify**: Static site hosting
- **Vercel**: Edge network deployment
- **GitHub Pages**: Free hosting for open source

## 📁 Project Structure

```
softwireindia/
├── index.html              # Main landing page
├── auth-simple.html        # Clean authentication page (login/register)
├── css/
│   └── style.css           # Complete stylesheet with animations
├── js/
│   ├── main.js             # Core application logic
│   ├── particles.js        # Particle system and effects
│   └── animations.js       # Typing animation utilities
├── images/                 # Favicon and image assets
├── app.yaml               # Google Cloud Platform deployment
├── render.yaml            # Render.com deployment config
├── package.json           # Project dependencies
└── README.md              # Documentation
```

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Animations**: CSS animations, Canvas API, requestAnimationFrame
- **Responsive**: CSS Grid, Flexbox, Media Queries
- **Performance**: Intersection Observer API, Lazy Loading
- **PWA**: Service Worker, Web App Manifest
- **Deployment**: Static hosting (Render.com ready)

## 🎨 Design Features

### Visual Elements

- AI-themed neural network animations
- Floating particle system with dynamic connections
- Gradient backgrounds with smooth transitions
- Glassmorphism effects on cards and containers
- Pulsing elements and loading animations

### Interactive Elements

- Magnetic cursor effect (desktop)
- Smooth scrolling navigation
- Hover animations on interactive elements
- Touch gesture support (mobile)
- Keyboard navigation support

### Performance Features

- Adaptive particle count based on device performance
- Efficient animation loops with RAF
- Lazy loading for images and heavy content
- Optimized CSS animations
- Reduced motion support for accessibility

## 🚀 Deployment on Render.com

### Prerequisites
- Render.com account
- GitHub repository with your code

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/Shuvendu29/softwireindia.git
   git push -u origin main
   ```

2. **Deploy on Render**
   - Go to [Render.com](https://render.com)
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure the deployment:
     - **Name**: `softwireindia`
     - **Branch**: `main`
     - **Build Command**: Leave empty (static site)
     - **Publish Directory**: `.` (root directory)

3. **Custom Domain Setup**
   - In Render dashboard, go to your deployed site
   - Navigate to "Settings" → "Custom Domains"
   - Add your domain: `softwireindia.com`
   - Configure DNS records with your domain provider (BigRock):
     - Add CNAME record: `www` → `your-site.onrender.com`
     - Add ALIAS/A record: `@` → Render's IP address

### DNS Configuration for BigRock.com

1. **Login to BigRock Domain Panel**
   - Go to BigRock.com
   - Login to your account
   - Navigate to "Domain Management"

2. **Update DNS Records**
   ```
   Type: CNAME
   Name: www
   Value: your-site-name.onrender.com
   TTL: 3600
   
   Type: A
   Name: @
   Value: [Render's IP - check Render docs for current IP]
   TTL: 3600
   ```

3. **SSL Certificate**
   - Render automatically provides SSL certificates
   - Your site will be accessible via HTTPS

## 📱 Local Development

### Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/softwireindia.git
   cd softwireindia
   ```

2. **Serve locally**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using Live Server (VS Code extension)
   # Right-click index.html → "Open with Live Server"
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint code
npm run lint
```

## 🚀 Deployment Guides

### Google Cloud Platform
Comprehensive deployment guide: [`GOOGLE_CLOUD_DEPLOYMENT.md`](GOOGLE_CLOUD_DEPLOYMENT.md)

**Quick Commands:**
```bash
# Deploy to Google Cloud
./deploy-gcp.sh              # Linux/Mac
deploy-gcp.bat               # Windows

# Setup custom domain
./setup-domain-gcp.sh        # Linux/Mac
setup-domain-gcp.bat         # Windows
```

### Render.com
Alternative deployment guide: [`DEPLOYMENT.md`](DEPLOYMENT.md)

**Features:**
- Auto-deploy from GitHub
- Free SSL certificates
- Custom domain support
- Global CDN

## 🎯 Customization

### Update Launch Date
Edit the countdown date in `js/main.js`:
```javascript
this.countdownDate = new Date('2025-08-01T00:00:00').getTime();
```

### Modify Colors
Update CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #0066cc;
    --secondary-color: #00a8ff;
    --accent-color: #ff6b6b;
    /* ... */
}
```

### Add Your Logo
Replace the neural network logo in `index.html`:
```html
<div class="logo-icon">
    <img src="images/your-logo.png" alt="SoftWire India Logo" />
</div>
```

### Email Integration
Replace the mock email service in `js/main.js`:
```javascript
async submitEmail(email) {
    const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    return response.json();
}
```

## 📊 Analytics Integration

### Google Analytics
Add to `index.html` head section:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Custom Event Tracking
Events are automatically tracked:
- Email subscriptions
- Button clicks
- Section visibility
- Performance metrics

## 🔧 Performance Optimization

### Lighthouse Score Targets
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 95+
- **SEO**: 100

### Optimization Techniques
- Minified CSS/JS
- Optimized images (WebP format)
- Lazy loading for all non-critical resources
- Efficient animation loops
- Reduced JavaScript bundle size

## 🎨 Browser Support

- **Chrome**: 70+
- **Firefox**: 65+
- **Safari**: 12+
- **Edge**: 79+
- **Mobile**: iOS 12+, Android 8+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Font: [Inter](https://fonts.google.com/specimen/Inter) by Google Fonts
- Mono Font: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)
- Icons: Custom SVG icons
- Inspiration: Modern AI and tech company websites

## 📞 Support

For support, email contact@softwireindia.com or create an issue in the repository.

---

**Made with ❤️ by SoftWire India**
