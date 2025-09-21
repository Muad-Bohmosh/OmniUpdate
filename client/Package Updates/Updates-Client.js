/**
 * Update Client for Application Version Management
 *
 * This client connects to the update server, downloads specified versions,
 * replaces the current application, and tracks the installed version.
 *
 * Directory Structure:
 * /Project-directory/
 * ├── Package Updates client/
 * │   └── Updates-Client.js      ← This file
 * │   └── TARer.js               ← Required for tar operations
 * |   └── update.js              ← Command Line Interface
 * └── app/                       ← Current app (will be replaced)
 * └── version.txt                ← Tracks currently installed version
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const tar = require('tar');
const { createTarArchive } = require('./TARer');

class UpdateClient {
    constructor(serverUrl, appPath = '../app') {
        this.serverUrl = serverUrl;
        this.appPath = path.resolve(appPath);
        this.versionFile = path.join(path.dirname(this.appPath), 'version.txt');
    }

    /**
     * Gets the current installed version from version.txt
     * @returns {string|null} Current version or null if not found
     */
    getCurrentVersion() {
        try {
            if (fs.existsSync(this.versionFile)) {
                return fs.readFileSync(this.versionFile, 'utf8').trim();
            }
        } catch (error) {
            console.error('Error reading version file:', error.message);
        }
        return null;
    }

    /**
     * Fetches available versions from the server
     * @returns {Promise<Array>} Array of available versions
     */
    async getAvailableVersions() {
        try {
            const response = await axios.get(`${this.serverUrl}/versions`);

            if (response.data && response.data.versions) {
                return response.data.versions;
            } else {
                console.error('Invalid response format from server');
                return [];
            }
        } catch (error) {
            console.error('Error fetching available versions:', error.message);

            // Fallback: try to get versions from health endpoint
            try {
                const healthResponse = await axios.get(`${this.serverUrl}/health`);
                if (healthResponse.data && healthResponse.data.versions) {
                    return healthResponse.data.versions;
                }
            } catch (fallbackError) {
                console.error('Fallback health check also failed:', fallbackError.message);
            }

            return [];
        }
    }

    /**
     * Downloads a version from the server
     * @param {string} version - Version to download (or 'LATEST')
     * @returns {Promise<string>} Path to the downloaded tar file
     */
    async downloadVersion(version = 'LATEST') {
        try {
            const response = await axios({
                method: 'GET',
                url: `${this.serverUrl}/updates`,
                params: { version },
                responseType: 'stream'
            });

            // Create downloads directory if it doesn't exist
            const downloadsDir = path.join(__dirname, 'downloads');
            if (!fs.existsSync(downloadsDir)) {
                fs.mkdirSync(downloadsDir, { recursive: true });
            }

            // Determine filename from Content-Disposition header or use version
            let filename = `${version}.tar.gz`;
            const contentDisposition = response.headers['content-disposition'];
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="(.+)"/);
                if (match && match[1]) {
                    filename = match[1];
                }
            }

            const filePath = path.join(downloadsDir, filename);
            const writer = fs.createWriteStream(filePath);

            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', () => resolve(filePath));
                writer.on('error', reject);
            });
        } catch (error) {
            console.error('Error downloading version:', error.message);
            throw error;
        }
    }

    /**
     * Extracts a tar file to the app directory
     * @param {string} tarPath - Path to the tar file
     * @returns {Promise<void>}
     */

    async extractTar(tarPath) {
         try {
             // Remove existing app directory
             if (fs.existsSync(this.appPath)) {
                 fs.rmSync(this.appPath, { recursive: true, force: true });
             }

             // Create app directory
             fs.mkdirSync(this.appPath, { recursive: true });

             // Extract tar file - FIXED: Changed cwd to extract directly into appPath
             await tar.x({
                 file: tarPath,
                 cwd: this.appPath,  // Changed from path.dirname(this.appPath)
                 strip: 1
             });

             console.log('Extraction completed successfully');
         } catch (error) {
             console.error('Error extracting tar file:', error.message);
             throw error;
         }
    }

    /**
     * Writes the version to version.txt
     * @param {string} version - Version to record
     * @returns {Promise<void>}
     */
    async recordVersion(version) {
        try {
            fs.writeFileSync(this.versionFile, version);
            console.log(`Recorded version: ${version}`);
        } catch (error) {
            console.error('Error recording version:', error.message);
            throw error;
        }
    }

    /**
     * Main update function
     * @param {string} version - Version to update to (default: 'LATEST')
     * @returns {Promise<boolean>} Success status
     */
    async update(version = 'LATEST') {
        try {
            console.log(`Starting update to version: ${version}`);

            // Download the version
            console.log('Downloading version...');
            const tarPath = await this.downloadVersion(version);

            // Extract the tar file
            console.log('Extracting...');
            await this.extractTar(tarPath);

            // Determine the actual version (from filename)
            let actualVersion = version;
            if (version === 'LATEST') {
                // Extract version from filename
                const filename = path.basename(tarPath);
                actualVersion = filename.replace('.tar.gz', '');
            }

            // Record the version
            await this.recordVersion(actualVersion);

            // Clean up downloaded file
            fs.unlinkSync(tarPath);

            console.log('Update completed successfully!');
            return true;
        } catch (error) {
            console.error('Update failed:', error.message);
            return false;
        }
    }

    /**
     * Checks if an update is available
     * @returns {Promise<boolean>} Whether an update is available
     */
    async checkForUpdate() {
        try {
            const currentVersion = this.getCurrentVersion();
            const availableVersions = await this.getAvailableVersions();

            // Simplified check - in a real implementation, you'd compare versions
            return availableVersions.length > 0 &&
                   availableVersions[0] !== currentVersion;
        } catch (error) {
            console.error('Error checking for updates:', error.message);
            return false;
        }
    }
}

// Command-line interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const version = args[0] || 'LATEST';
    const serverUrl = process.env.UPDATE_SERVER_URL || 'http://localhost:3000';

    const client = new UpdateClient(serverUrl);

    // Check if just checking for updates
    if (args[0] === '--check') {
        client.checkForUpdate().then(available => {
            console.log(available ? 'Update available' : 'No update available');
            process.exit(available ? 0 : 1);
        });
    } else {
        // Perform update
        client.update(version).then(success => {
            process.exit(success ? 0 : 1);
        });
    }
}

module.exports = UpdateClient;
