const mongoose = require("mongoose");
const password = process.argv[2];
const url = `mongodb+srv://gxgxn:${password}@cluster1.baqh6ry.mongodb.net/phoneBook`;
if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);
if (process.argv.length === 3) {
  Person.find({}).then((persons) => {
    persons.forEach((person) => console.log(person));
    mongoose.connection.close();
    process.exit(1);
  });
}
const person = new Person({
  id: Math.floor(Math.random() * 200),
  name: process.argv[3],
  number: process.argv[4],
  important: true,
});

person.save().then((result) => {
  console.log(`added ${result.name} number ${result.number} to phoneBook`);
  mongoose.connection.close();
});
