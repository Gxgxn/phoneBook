const express = require("express");
const app = express();
require("dotenv").config();
const morgan = require("morgan");
const Person = require("./models/person");
morgan.token("data", (req, _) => JSON.stringify(req.body));
app.use(express.static("dist"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

app.use(express.json());
const PORT = process.env.PORT || 3002;

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
  Person.find({}).then((persons) => {
    res.status(200).json(persons);
  });
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

app.get("/api/persons/:id", (req, res, next) => {
  const personId = req.params.id;
  Person.findById(personId)
    .then((person) => {
      res.status(202).json(person);
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;
  const person = {
    name,
    number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  Person.find({ name: name }).then((response) => {
    if (response === name) {
      return res.status(400).json({ error: "name must be unique" });
    }
    if (!name || !number) {
      return res.status(400).json({ error: "content missing" });
    }

    const person = new Person({
      name,
      number,
    });
    person.save().then((savedPerson) => res.status(203).json(savedPerson));
  });
});
function unknownRoute(req, res) {
  return res.status(404).send({ error: "unknown endpoint" });
}
app.use(unknownRoute);

function errorHandler(err, req, res, next) {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next(err);
}
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
