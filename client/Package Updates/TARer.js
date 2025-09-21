const tar = require('tar');
const fs = require('fs');
const path = require('path');

/**
 * Creates a tar stream from a folder
 * @param {string} folderPath - Path to the folder to archive
 * @returns {stream.Readable} - Tar archive stream
 */
function createTarStream(folderPath) {
    try {
        // Check if source folder exists
        if (!fs.existsSync(folderPath)) {
            throw new Error(`Source folder does not exist: ${folderPath}`);
        }

        // Check if it's actually a directory
        if (!fs.statSync(folderPath).isDirectory()) {
            throw new Error(`Path is not a directory: ${folderPath}`);
        }

        // Create tar stream
        return tar.create(
            {
                gzip: true,
                cwd: path.dirname(folderPath),
            },
            [path.basename(folderPath)]
        );
    } catch (error) {
        // Create an error stream
        const { Readable } = require('stream');
        const errorStream = new Readable({
            read() {
                this.push(null);
            }
        });
        errorStream.error = error;
        return errorStream;
    }
}

/**
 * Creates a tar archive from a folder and returns it as a buffer
 * @param {string} folderPath - Path to the folder to archive
 * @returns {Promise<Buffer>} - Promise that resolves with the tar buffer
 */
function createTarArchive(folderPath) {
    return new Promise((resolve, reject) => {
        try {
            // Check if source folder exists
            if (!fs.existsSync(folderPath)) {
                throw new Error(`Source folder does not exist: ${folderPath}`);
            }

            // Create a transform stream to capture the tar data
            const chunks = [];
            const tarStream = tar.create(
                {
                    gzip: true,
                    cwd: path.dirname(folderPath),
                },
                [path.basename(folderPath)]
            );

            // Capture the stream data
            tarStream
                .on('data', (chunk) => chunks.push(chunk))
                .on('end', () => resolve(Buffer.concat(chunks)))
                .on('error', reject);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Saves a tar buffer to the specified path
 * @param {Buffer} tarBuffer - The tar archive buffer to save
 * @param {string} savingPath - Path where to save the tar file
 * @returns {Promise<string>} - Promise that resolves with the saved file path
 */
function saveTarArchive(tarBuffer, savingPath) {
    return new Promise((resolve, reject) => {
        try {
            // Ensure the saving directory exists
            const saveDir = path.dirname(savingPath);
            if (!fs.existsSync(saveDir)) {
                fs.mkdirSync(saveDir, { recursive: true });
            }

            // Write the buffer to file
            fs.writeFile(savingPath, tarBuffer, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(savingPath);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Combined function that creates and saves a tar archive
 * @param {Object} params - Parameters object
 * @param {string} params.folder_path - Path to the folder to archive
 * @param {string} params.saving_path - Path where to save the tar file
 * @returns {Promise<string>} - Promise that resolves with the saved file path
 */
async function createAndSaveTarArchive({ folder_path, saving_path }) {
    try {
        const tarBuffer = await createTarArchive(folder_path);
        const savedPath = await saveTarArchive(tarBuffer, saving_path);
        console.log(`Successfully created archive at: ${savedPath}`);
        return savedPath;
    } catch (error) {
        console.error('Error creating tar archive:', error);
        throw error;
    }
}

// Export all functions
module.exports = {
    createTarStream,
    createTarArchive,
    saveTarArchive,
    createAndSaveTarArchive
};
