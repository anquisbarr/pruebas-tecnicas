import csvToJson from "convert-csv-to-json";
import cors from "cors";
import express from "express";
import multer from "multer";

const port = process.env.PORT || 3000;

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors());

let userData: Array<Record<string, string>> = [];

app.post("/api/files", upload.single("file"), async (req, res) => {
  const file = req.file;

  if (!file) {
    res.send(500).json({ message: "File is required" });
  } else {
    if (file.mimetype === ".csv") {
      return res.status(500).json({ message: "File must be CSV" });
    }

    let json: Array<Record<string, string>> = [];
    try {
      const rawCsv = Buffer.from(file.buffer).toString("utf-8");
      json = csvToJson.fieldDelimiter(",").csvStringToJson(rawCsv);
    } catch (e) {
      res.status(500).json({ message: "Error parsing the file" });
    }
    userData = json;
    res.status(200).json({
      data: userData,
      message: "Envio de archivos correctamente",
    });
  }
});

app.get("/api/users", async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(500).json({ message: `Query param ${q} is required` });
  }
  if (Array.isArray(q)) {
    return res.status(500).json({ message: "Query param must be a string" });
  }

  const search = q.toString().toLowerCase();
  const filteredData = userData.filter((row) => {
    return Object.values(row).some((value) => {
      return value.toLowerCase().includes(search);
    });
  });

  console.log({ search, filteredData });

  res.status(200).json({ data: filteredData });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
