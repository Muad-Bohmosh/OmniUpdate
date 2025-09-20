# OmniUpdate Server

A lightweight, self-hosted solution for versioned software distribution. OmniUpdate Server provides a RESTful API for serving application versions as compressed tar archives.

## 🌟 Features

- **Version Management**: Automatically scans and sorts application versions
- **Secure Distribution**: Stream tar.gz archives with proper security validation
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

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Muad-Bohmosh/OmniUpdate.git
   cd OmniUpdate/"Package Updates"
   ```

2. **Install dependencies**
   ```bash
   npm install express tar
   ```

3. **Set up your application versions**
   ```bash
   # Create version folders in the app directory
   mkdir -p ../app/{1.0.0,1.1.0,2.0.0}
   # Add your application files to each version folder
   ```

### Running the Server

```bash
# Run on default port (3000)
node Updates-Server.js

# Run on a specific port
PORT=8080 node Updates-Server.js
```

Server will start on the specified port (default: 3000)

## 📡 API Endpoints

### GET `/versions`
Returns a list of all available versions.

**Response:**
```json
{
  "versions": ["2.1.0", "2.0.0", "1.1.0", "1.0.0"],
  "latest": "2.1.0"
}
```

### GET `/updates?version={version}`
Downloads a specific version as a tar.gz archive.

**Parameters:**
- `version`: Specific version number or "LATEST"

**Response:**
- Streams the tar.gz archive with appropriate headers

### GET `/health`
Server health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2023-07-15T10:30:00.000Z",
  "versions": ["2.1.0", "2.0.0", "1.1.0", "1.0.0"]
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |

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

OmniUpdate Server automatically:
- Discovers version folders in the app directory
- Sorts versions numerically (newest first)
- Validates version format (X.Y.Z)

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

**Apache License 2.0 Summary:**
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Patent use allowed
- ✅ Private use allowed
- ✅ Must include copyright notice
- ✅ Must include license copy
- ✅ State changes made
- ❌ No trademark rights granted
- ❌ No warranty provided

For full license terms, please see the [LICENSE](LICENSE) file.

## 🆘 Support

- 📖 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/Muad-Bohmosh/OmniUpdate/issues)
- 💬 [Discussions](https://github.com/Muad-Bohmosh/OmniUpdate/discussions)

## 🙏 Acknowledgments

- Built with Express.js and Node.js
- Uses tar for archive operations
- Inspired by modern software update systems

---

**OmniUpdate Server** - Simplify your software distribution. 🚀
