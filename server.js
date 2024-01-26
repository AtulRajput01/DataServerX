const express = require('express');
const fs = require('fs').promises;

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Welcome to the HTTP server');
});

app.get('/data', async (req, res) => {
    try {
        const { n, m } = req.query;

        if (!n) {
            return res.status(400).send('Missing query parameter: n');
        }

        const filePath = `/tmp/data/${n}.txt`;
        const fileContent = await fs.readFile(filePath, 'utf-8');

        if (m) {
            const lines = fileContent.split('\n');
            const lineNumber = parseInt(m, 10);

            if (lineNumber <= 0 || lineNumber > lines.length) {
                return res.status(400).send('Invalid line number');
            }

            return res.send(lines[lineNumber - 1]);
        }
        
        res.setHeader('Content-Type', 'text/plain');
        return res.send(fileContent);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

