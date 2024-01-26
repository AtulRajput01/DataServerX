const express = require("express");
const app = express();

const multer = require("multer");
const readline = require("readline");
const fs = require("fs");

const PORT = 8080;

// Set up Multer to store uploaded files in /tmp/data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function getLine(filePath, m) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let curr = 0;
  for await (const line of rl) {
    curr++;
    if (curr == m) {
      return line || "Line 'm' not found ❗❗";
    }
  }
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("File not uploaded 🚫");
    }
    // Save the uploaded file to /tmp/data
    const name = Math.floor(Math.random() * 100) + 1;
    const filePath = `./tmp/data/${name}.txt`;

    fs.writeFile(filePath, req.file.buffer.toString(), (err) => {
      if (err) throw err;
      console.log(`${name} is uploaded successfully 🎉🎉`);
    });
    res.send(`${name} is uploaded successfully 🎉🎉`);
  } catch (err) {
    console.error(err.message);
    res.status(400).send(err.message);
  }
});

app.get("/data", async (req, res) => {
  try {
    const n = req.query.n;
    const m = req.query.m;

    if (!n) {
      throw new Error("File is missing ❌❌");
    }

    const filePath = `./tmp/data/${n}.txt`;

    if (m) {
      // Read that line from file
      const line = await getLine(filePath, m);
      res.send(line);
    } else {
      throw new Error("Line 'm' is missing ❓❓");
    }
  } catch (err) {
    console.error(err.message);
    res.status(400).send(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is up on PORT:${PORT} 🛜`);
});

