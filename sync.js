const fs = require('fs');
const path = require('path');

// Configuration
const REPO_NAME = 'chp-data-proxy'; // Replace with your actual repo name
const USERNAME = 'your-github-username'; // Replace with your GitHub username
const BASE_URL = `https://${USERNAME}.github.io/${REPO_NAME}`;

const FILES = [
    { name: 'cms-data-index.json', url: 'https://capitalhealth.com/cms-data-index.json' },
    { name: 'provider.json', url: 'https://capitalhealth.com/json/provider.json' },
    { name: 'drugs.json', url: 'https://capitalhealth.com/json/drugs.json' },
    { name: 'plans.json', url: 'https://capitalhealth.com/json/plans.json' }
];

async function sync() {
    const outputDir = path.join(__dirname, 'docs');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    for (const file of FILES) {
        console.log(`Fetching ${file.name}...`);
        const response = await fetch(file.url);
        let content = await response.text();

        // Special logic for the index file
        if (file.name === 'cms-data-index.json') {
            console.log('Updating URLs in index file...');
            // Replaces 'https://capitalhealth.com/json/' with your GitHub Pages URL
            content = content.replace(/https:\/\/capitalhealth\.com\/json\//g, `${BASE_URL}/`);
        }

        fs.writeFileSync(path.join(outputDir, file.name), content);
    }
    console.log('Sync complete.');
}

sync().catch(err => {
    console.error(err);
    process.exit(1);
});