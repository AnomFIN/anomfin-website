# Global Group Oy Website

Professional website for Global Group Oy, a Finnish datacenter and network infrastructure company providing enterprise-grade hosting, fiber optic installation, and technical field services.

## Company Profile

**Global Group Oy** specializes in mission-critical infrastructure services:

- **🏢 Datacenter Operations**: High-availability hosting, colocation, and cloud infrastructure
- **🌐 Fiber Optic Networks**: Professional fiber installation, maintenance, and high-speed connectivity  
- **⚙️ Technical Field Services**: On-site installation, maintenance, and emergency support
- **🔧 Network Infrastructure**: Enterprise networking solutions, security, and monitoring

## Website Features

### Professional B2B Platform
- Clean Nordic design optimized for business clients
- Mobile-responsive layout with professional aesthetics
- Service portfolio with detailed capability descriptions
- Contact forms for quotes and service requests

### Technical Infrastructure
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (no dependencies)
- **Backend**: Optional PHP 7.4+ with MySQL/MariaDB support
- **Deployment**: GitHub Pages compatible (static) or full PHP hosting
- **Admin Panel**: Professional management interface at `/admin.php`

## Quick Start

### Static Deployment (GitHub Pages)
1. Fork this repository
2. Enable Pages in repository Settings → Pages → Deploy from branch `main`
3. Your site will be available at `https://[username].github.io/[repository-name]/`

### Full PHP Deployment
```bash
# Requirements: PHP 7.4+, MySQL/MariaDB (optional)
git clone [repository-url]
cp config/settings-defaults.php data/settings.json
# Configure web server to serve from repository root
# Access admin panel at /admin.php (password: globalgroup2026)
```

## Admin Panel

Access the admin panel at `/admin.php` to manage:

- **Company Information**: Contact details, address, business info
- **Website Status**: System health, file permissions, security status  
- **Link Shortener**: Optional URL shortening service for campaigns
- **Security Settings**: Authentication, session management
- **Site Configuration**: Core website settings and preferences

**Default admin password**: `globalgroup2026` (change in `config/admin.config.php`)

## Configuration

### Core Settings
Website settings are stored in `data/settings.json` and managed via admin panel:
```json
{
  "site": {
    "company_name": "Global Group Oy",
    "contact_email": "info@globaltech.fi", 
    "contact_phone": "+358 40 123 4567",
    "address": "Teollisuuskatu 1, 00100 Helsinki"
  }
}
```

### Optional Features
- **Link Shortener**: Database-backed URL shortening (requires MySQL/MariaDB)
- **Contact Forms**: Form submissions with email notifications  
- **Analytics**: Basic visitor tracking and metrics
- **Security Suite**: Login protection and session management

## Development

### Local Development
```bash
# Start PHP development server  
php -S localhost:8000

# Or use any web server pointing to repository root
# Access site: http://localhost:8000
# Admin panel: http://localhost:8000/admin.php
```

### File Structure
```
/
├── index.html          # Main homepage
├── admin.php          # Admin panel (new professional interface)
├── asetukset.php      # Legacy admin (redirects to admin.php)
├── config/            # Configuration files
│   ├── admin.config.php    # Admin panel settings
│   └── settings-defaults.php  # Default site configuration
├── css/
│   └── style.css      # Main stylesheet (Nordic professional design)
├── js/
│   └── script.js      # Site functionality
├── assets/            # Images and media
├── api/               # Backend API endpoints (optional)
└── data/              # JSON data storage
```

## Professional Branding

The website uses a clean Nordic design system:

- **Colors**: Professional blue (#2563eb), clean grays, white background
- **Typography**: Inter font family for modern, readable text
- **Layout**: Grid-based responsive design with ample whitespace
- **Components**: Professional cards, forms, and navigation
- **Logo**: Clean geometric network symbol representing connectivity

## Security

- **Admin Authentication**: Password-protected admin panel with session management
- **CSRF Protection**: Form submissions protected against cross-site request forgery
- **Input Validation**: All user inputs validated and sanitized
- **HTTPS Ready**: Designed for secure HTTPS deployment
- **File Permissions**: Proper file security and access controls

## Support & Maintenance

For technical support or customization requests:
- **Email**: info@globaltech.fi
- **Documentation**: See admin panel help section
- **Updates**: Configuration changes via admin panel
- **Hosting**: Compatible with most PHP hosting providers

## License

This website is proprietary software of Global Group Oy. All rights reserved.

---

**Global Group Oy** - Professional Infrastructure Services  
*Datacenter • Fiber • Network Solutions*

Last updated: $(date +'%Y-%m-%d')