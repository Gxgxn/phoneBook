const express = require("express");
const app = express();
const morgan = require("morgan");
morgan.token("data", (req, _) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

app.use(express.json());
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
app.get("/api/persons", (req, res) => {
  res.status(200).json(persons);
});
app.get("/api/persons/info", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  const date = new Date();
  res
    .status(200)
    .end(
      `<p>Phone Book has Info for ${persons.length} people</p><p>${date}</p>`
    );
});

app.get("/api/persons/:id", (req, res) => {
  const personId = Number(req.params.id);
  const person = persons.find((person) => person.id === personId);
  if (!person) {
    return res.status(404).end();
  }
  console.log(person);
  res.status(202).json(person);
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  const isDuplicate = persons.find((person) => person.name === name);
  if (isDuplicate) {
    return res.status(400).json({ error: "name must be unique" });
  }
  if (!name || !number) {
    return res.status(400).json({ error: "content missing" });
  }

  const person = {
    name,
    number,
    id: Math.floor(Math.random() * 200),
  };
  persons = persons.concat(person);
  res.json(person);
});
