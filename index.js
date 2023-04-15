const express = require("express");
const app = express();

app.use(express.json());
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

const persons = [
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
app.get("/", (req, res) => {
  res.status(200).json(persons);
});
app.get("/info", (req, res) => {
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
