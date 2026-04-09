const fs = require('fs');
const path = require('path');

const targets = [
    'frontend/src/components/AppLayout.jsx', // The UI + Globe rendering
    'tie/src/sources/gdelt.js',             // The Gemini Prediction logic
    'tie/src/threatManager.js'               // How threats are saved
];

const root = path.join(__dirname, '..');
console.log("--- FINAL LOGIC DUMP ---");

targets.forEach(t => {
    const fullPath = path.join(root, t);
    if (fs.existsSync(fullPath)) {
        console.log(`\nFILE: ${t}\n\`\`\`javascript\n${fs.readFileSync(fullPath, 'utf8')}\n\`\`\``);
    } else {
        // Search components if AppLayout isn't there
        const compDir = path.join(root, 'frontend/src/components');
        if (fs.existsSync(compDir)) {
            console.log(`\nFILE: ${t} NOT FOUND. Look in frontend/src/components/ for the globe file.`);
        }
    }
});