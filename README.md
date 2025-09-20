# OmniUpdate

A lightweight, self-hosted solution for versioned software distribution and automated updates. OmniUpdate provides both server and client components for seamless application version management.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![License](https://img.shields.io/badge/License-Apache%202.0-blue)

## 🌟 Features

- **Version Management**: Automatically scans and sorts application versions
- **Secure Distribution**: Stream tar.gz archives with proper security validation
- **Auto-Update Client**: Intelligent client that downloads and applies updates
- **RESTful API**: Clean endpoints for version discovery and downloads
- **Cross-Platform**: Works on any system with Node.js
- **Lightweight**: Minimal dependencies, easy to deploy

## 📦 Use Cases

- Desktop application auto-updates
- Mobile app patch distribution
- IoT device firmware updates
- Internal tool deployment
- Game client version management
- Enterprise software distribution

## 🏗️ Architecture

### Version Host Server Structure
```
/Project-directory/
├── Package Updates/           # Server Component
│   ├── Updates-Server.js     # Main server file
│   └── TARer.js              # Archive utility
└── app/                      # Application versions (hosted on server)
    ├── 1.0.0/               # Versioned application folders
    ├── 1.1.0/
    ├── 2.0.0/
    └── 2.1.0/
```

### Client Application Structure
```
/Project-directory/
├── Package Updates client/   # Client Component
│   ├── Updates-Client.js     # Main client file
│   └── TARer.js              # Archive utility
└── app/                      # Current application (will be replaced during updates)
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Server Setup**
   ```bash
   # On your version host server
   git clone https://github.com/Muad-Bohmosh/OmniUpdate.git
   cd OmniUpdate/"Package Updates"
   npm install express tar
   ```

2. **Client Setup**
   ```bash
   # On client machines
   git clone https://github.com/Muad-Bohmosh/OmniUpdate.git
   cd OmniUpdate/"Package Updates client"
   npm install axios tar
   ```

3. **Prepare Application Versions (on server)**
   ```bash
   # Create version folders in the server's app directory
   mkdir -p ../app/{1.0.0,1.1.0,2.0.0}
   # Add your application files to each version folder
   ```

### Running the Server

```bash
cd "Package Updates"
# Set port via environment variable (optional)
export PORT=3000
node Updates-Server.js
```

Server will start on `http://localhost:3000` (or specified PORT)

### Using the Client

```bash
cd "Package Updates client"
# Set server URL (if different from default)
export UPDATE_SERVER_URL=http://your-server.com:3000

# Update to latest version
node Updates-Client.js

# Update to specific version
node Updates-Client.js 2.0.0

# Check for updates without applying
node Updates-Client.js --check
```

## 📡 API Endpoints

### Server Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/versions` | GET | List all available versions |
| `/updates?version={version}` | GET | Download specific version as tar.gz |
| `/health` | GET | Server health check |

### Client Commands

```bash
# Basic update to latest
node Updates-Client.js

# Update to specific version
node Updates-Client.js 1.2.3

# Check for updates without applying
node Updates-Client.js --check

# Set custom server URL
export UPDATE_SERVER_URL=http://your-server.com:3000
node Updates-Client.js
```

## 🔧 Configuration

### Environment Variables

**Server:**
- `PORT`: Server port (default: 3000) - *Optional for now*

**Client:**
- `UPDATE_SERVER_URL`: Server URL (default: http://localhost:3000)

### Version Format

Versions should follow semantic versioning format: `X.Y.Z`
- Example: `1.0.0`, `2.1.3`, `1.0.0-beta.1`

## 🛡️ Security Features

- Directory traversal protection
- Path validation and sanitization
- Secure file handling
- Error handling and validation
- CORS support for cross-origin requests

## 📊 Version Management

OmniUpdate automatically:
- Discovers version folders in the server's app directory
- Sorts versions numerically (newest first)
- Validates version format (X.Y.Z)
- Tracks currently installed version on client

## 🔄 Update Process

1. **Check**: Client queries server for available versions
2. **Download**: Client downloads the selected version as tar.gz
3. **Verify**: Client validates the downloaded archive
4. **Replace**: Client safely replaces the current application
5. **Record**: Client records the new version in version.txt

## 🧪 Testing

```bash
# Test server endpoints
curl http://localhost:3000/versions
curl http://localhost:3000/health

# Test download
curl http://localhost:3000/updates?version=LATEST -o update.tar.gz
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/Muad-Bohmosh/OmniUpdate/issues)
- 💬 [Discussions](https://github.com/Muad-Bohmosh/OmniUpdate/discussions)

## 🙏 Acknowledgments

- Built with Express.js and Node.js
- Uses tar for archive operations
- Inspired by modern software update systems
