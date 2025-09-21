
const UpdateClient = require('./Updates-Client');

async function main() {
    const args = process.argv.slice(2);
    const serverUrl = process.env.UPDATE_SERVER_URL || 'http://localhost:3000';
    const client = new UpdateClient(serverUrl);

    if (args.includes('--check')) {
        const available = await client.checkForUpdate();
        console.log(available ? 'Update available' : 'No update available');
        process.exit(available ? 0 : 1);
    } else if (args.includes('--list')) {
        const versions = await client.getAvailableVersions();
        console.log('Available versions:', versions);
    } else if (args[0]) {
        await client.update(args[0]);
    } else {
        await client.update('LATEST');
    }
}

main().catch(console.error);
