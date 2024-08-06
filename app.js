const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    fs.readdir('./files', (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading files directory');
            return;
        }
        res.render('index', { files });
    });
});

app.post('/create', (req, res) => {
    const { title, details } = req.body;
    const newTask = `${title}\n${details}`;
    const fileName = `./files/${title.replace(/\s+/g, '_')}.txt`;

    fs.writeFile(fileName, newTask, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error creating task');
            return;
        }
        res.redirect('/');
    });
});

app.get('/task/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, 'files', fileName);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading file');
            return;
        }
        const [title, ...details] = data.split('\n');
        res.render('task', { title, details: details.join('\n'), fileName });
    });
});

app.post('/delete', (req, res) => {
    const { filename } = req.body;
    const filePath = path.join(__dirname, 'files', filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting file');
            return;
        }
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
