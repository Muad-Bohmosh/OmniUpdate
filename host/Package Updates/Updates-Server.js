/**
 * Software Update Server
 *
 * A lightweight Express server that serves versioned application packages as tar.gz archives.
 * Clients can request specific versions or the latest version via HTTP API.
 *
 * Directory Structure:
 * /Project-directory/
 * ├── Package Updates/    ← This file should be placed here
 * │   └── Updates-Server.js
 * │   └── TARer.js
 * └── app/
 *     ├── 1.0.0/         ← Version directories containing application files
 *     ├── 1.1.0/
 *     ├── 2.0.0/
 *     └── 2.1.0/
 *     └── ...
 *
 * Usage:
 * - Run: PORT=3000 node Updates-Server.js
 * - Request: GET /updates?version=LATEST or GET /updates?version=1.2.0
 * - Returns: Streaming tar.gz archive of the requested version
 * - Request: GET /versions
 * - Returns: List of available versions
 *
 * Typical use cases:
 * - Desktop/mobile application updates
 * - Game client patches
 * - IoT device firmware distribution
 * - Internal tool deployment
 */

const express = require('express');
const { createTarStream } = require('./TARer');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
// Set base directory to the parent directory's 'app' folder
const BASE_DIR = path.join(__dirname, '..', 'app');

const app = express();

// Enable CORS for cross-origin requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

/**
 * GET endpoint to get available versions
 */
app.get('/versions', (req, res) => {
    try {
        const V_Found = get_versions();

        if (!V_Found.Status) {
            return res.status(500).json({
                error: V_Found.error
            });
        }

        res.json({
            versions: V_Found.versions,
            latest: V_Found.versions.length > 0 ? V_Found.versions[0] : null
        });
    } catch (error) {
        console.error('Error in /versions endpoint:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

/**
 * GET endpoint to stream tar archive of specific version
 * Query parameter: version - specific version or 'LATEST'
 */
app.get('/updates', async (req, res) => {
    let version = req.query.version;

    if (!version) {
        version = 'LATEST';
    }

    try {
        const V_Found = get_versions();

        if (!V_Found.Status) {
            return res.status(403).json({
                error: V_Found.error
            });
        }

        const versions = V_Found.versions;

        if (versions.length === 0) {
            return res.status(404).json({
                error: 'No available releases for this app'
            });
        }

        // Find the requested version
        if (version.toUpperCase() === 'LATEST') {
            version = versions[0];
        } else {
            const cleanVersion = version.replace(/\s/g, '');
            const foundVersion = versions.find(v =>
                v.toUpperCase() === cleanVersion.toUpperCase()
            );

            if (!foundVersion) {
                return res.status(404).json({
                    error: `Version ${version} not found, try a different version or 'version=LATEST' to get the latest version`
                });
            }
            version = foundVersion;
        }

        // Security: Prevent directory traversal attacks
        const folderPath = path.join(BASE_DIR, version);
        const resolvedPath = path.resolve(folderPath);

        if (!resolvedPath.startsWith(BASE_DIR)) {
            return res.status(403).json({
                error: 'Invalid version path'
            });
        }

        // Check if the folder actually exists
        if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isDirectory()) {
            return res.status(404).json({
                error: `Version ${version} not found`
            });
        }

        console.log(`Creating archive for: ${resolvedPath}`);

        const tarStream = createTarStream(resolvedPath);

        // Handle stream errors
        tarStream.on('error', (error) => {
            console.error('Stream error:', error.message);
            if (!res.headersSent) {
                res.status(500).json({
                    error: `Failed to create archive: ${error.message}`
                });
            }
        });

        // Set appropriate headers for file download
        const filename = `${version}.tar.gz`;
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/gzip');

        // Pipe the tar stream to the response
        tarStream.pipe(res);

        // Handle connection close
        req.on('close', () => {
            if (tarStream.destroy) {
                tarStream.destroy();
            }
        });

    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        versions: get_versions().versions || []
    });
});

/**
 * 404 handler
 */
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found. Available endpoints: GET /versions, GET /updates?version=VERSION, GET /health'
    });
});

/**
 * Gets all available versions (folders) in the base directory
 * @returns {Object} Object with Status and versions or error
 */
function get_versions() {
    try {
        const versions = getFolders(BASE_DIR);
        const sorted = sortVersionsDescending(versions);
        return sorted;
    } catch (e) {
        return {
            Status: false,
            error: e.message
        };
    }
}

/**
 * Sorts version strings in descending order
 * @param {Array} versions - Array of version strings
 * @returns {Object} Object with Status and sorted versions
 */
function sortVersionsDescending(versions) {
    if (!Array.isArray(versions)) {
        return {
            Status: false,
            error: 'Invalid versions array'
        };
    }

    try {
        const filteredAndSorted = versions
            .filter(version => {
                return typeof version === 'string' && /^\d+(\.\d+)*$/.test(version);
            })
            .sort((a, b) => {
                const partsA = a.split('.').map(Number);
                const partsB = b.split('.').map(Number);

                const maxLength = Math.max(partsA.length, partsB.length);

                for (let i = 0; i < maxLength; i++) {
                    const numA = partsA[i] || 0;
                    const numB = partsB[i] || 0;

                    if (numA !== numB) {
                        return numB - numA; // Bigger numbers first
                    }
                }

                return 0;
            });

        return {
            Status: true,
            versions: filteredAndSorted
        };
    } catch (error) {
        return {
            Status: false,
            error: error.message
        };
    }
}

/**
 * Gets all folders in a directory
 * @param {string} dirPath - Path to directory
 * @returns {Array} Array of folder names
 */
function getFolders(dirPath) {
    try {
        const items = fs.readdirSync(dirPath, { withFileTypes: true });
        return items
            .filter(item => item.isDirectory())
            .map(folder => folder.name);
    } catch (error) {
        console.error('Error reading directory:', error.message);
        return [];
    }
}

// Start server
app.listen(PORT, () => {
    console.log(`App versions Update stream Server is running on port ${PORT}`);
    console.log(`Serving versions from: ${BASE_DIR}`);
    console.log(`Available endpoints:`);
    console.log(`  GET http://localhost:${PORT}/versions - List available versions`);
    console.log(`  GET http://localhost:${PORT}/updates?version=VERSION - Download a version`);
    console.log(`  GET http://localhost:${PORT}/health - Health check`);
});
