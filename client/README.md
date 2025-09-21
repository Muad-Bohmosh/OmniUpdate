# OmniUpdate Client Documentation

## Overview

The OmniUpdate Client is a standalone component that enables applications to automatically check for, download, and install updates from an OmniUpdate server.
It's designed to be simple to integrate and use.

## 📋 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Muad-Bohmosh/OmniUpdate.git
cd OmniUpdate/"Package Updates client"

# Install dependencies
npm install axios tar
```

### Using command Line Interface

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `UPDATE_SERVER_URL` | OmniUpdate server URL | `http://localhost:3000` |

### Command Line Usage

```bash
# Update to latest version
node Update.js

# Update to specific version
node Update.js 2.1.0

# Check for updates
node Update.js --check

# List available versions
node Update.js --list

# Use custom server
UPDATE_SERVER_URL=http://your-server.com:3000 node Updates.js
```


### Basic Usage

```javascript
const UpdateClient = require('./Updates-Client');
const client = new UpdateClient('http://your-update-server.com:3000');

// Check for updates
const hasUpdate = await client.checkForUpdate();
if (hasUpdate) {
    await client.update('LATEST');
}
```

## 📁 File Structure

```
/Project-directory/
├── Package Updates client/   # Client Component
│   ├── Updates-Client.js     # Main client class
│   └── TARer.js              # Archive utility (for extraction)
│   └── Update.js              # Terminal commands
└── app/                      # Current application (will be replaced)
└── version.txt               # Tracks currently installed version
```

## 🔧 API Reference

### UpdateClient Class

#### Constructor
```javascript
new UpdateClient(serverUrl, appPath = '../app')
```
- `serverUrl`: URL of the OmniUpdate server (e.g., `http://localhost:3000`)
- `appPath`: Path to the application directory (default: `../app`)

#### Methods

##### `async update(version = 'LATEST')`
Downloads and installs the specified version.

```javascript
// Update to latest version
await client.update('LATEST');

// Update to specific version
await client.update('2.1.0');
```

##### `async checkForUpdate()`
Checks if a newer version is available.

```javascript
const updateAvailable = await client.checkForUpdate();
if (updateAvailable) {
    console.log('Update available!');
}
```

##### `getCurrentVersion()`
Returns the currently installed version.

```javascript
const currentVersion = client.getCurrentVersion();
console.log(`Current version: ${currentVersion}`);
```

##### `async getAvailableVersions()`
Fetches all available versions from the server.

```javascript
const versions = await client.getAvailableVersions();
console.log('Available versions:', versions);
```

## 🚀 Usage Examples

### Example 1: Basic Update Check
```javascript
const UpdateClient = require('./Updates-Client');

async function checkAndUpdate() {
    const client = new UpdateClient('http://localhost:3000');

    if (await client.checkForUpdate()) {
        console.log('Update available, installing...');
        await client.update('LATEST');
        console.log('Update completed successfully!');
    } else {
        console.log('No updates available.');
    }
}

checkAndUpdate();
```

### Example 2: Scheduled Updates
```javascript
const UpdateClient = require('./Updates-Client');

class AutoUpdater {
    constructor() {
        this.client = new UpdateClient('http://your-server.com:3000');
        this.updateInterval = 24 * 60 * 60 * 1000; // 24 hours
    }

    start() {
        setInterval(() => this.checkForUpdates(), this.updateInterval);
        this.checkForUpdates(); // Check immediately on start
    }

    async checkForUpdates() {
        try {
            if (await this.client.checkForUpdate()) {
                console.log('Update found, installing...');
                await this.client.update('LATEST');
                console.log('Update completed. Restarting application...');
                process.exit(0); // Exit for application restart
            }
        } catch (error) {
            console.error('Update check failed:', error.message);
        }
    }
}

// Start auto-updater
new AutoUpdater().start();
```

## 🐛 Troubleshooting

### Common Issues

1. **Connection refused**
   ```bash
   # Check if server is running
   curl http://localhost:3000/health

   # Verify URL
   export UPDATE_SERVER_URL=http://correct-url:3000
   ```

2. **Permission denied**
   ```bash
   # Ensure write permissions to app directory
   chmod +w ../app
   ```

3. **Version not found**
   ```bash
   # Check available versions
   node Updates-Client.js --list
   ```

### Debug Mode

Enable verbose logging by setting environment variable:
```bash
export DEBUG_OMNIUPDATE=true
node Updates-Client.js
```

## 📋 Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `ECONNREFUSED` | Cannot connect to server | Check server URL and status |
| `ENOTFOUND` | Server not found | Verify network connectivity |
| `EACCES` | Permission denied | Check file permissions |
| `ENOENT` | File/directory not found | Verify paths exist |
| `ETAR` | Archive extraction failed | Check archive integrity |

## 🔍 Monitoring

The client creates log files in the client directory:

- `update.log`: General update operations
- `error.log`: Error messages and failures
- `version.txt`: Currently installed version

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Verify server connectivity
3. Ensure proper file permissions
4. Check the log files for detailed error information

## 📄 License

Part of the OmniUpdate project under Apache License 2.0.

---

**Note**: The client is designed to work with an OmniUpdate host server. Ensure your host server is properly configured and running before using the client.
