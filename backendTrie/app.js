const express = require('express')
const app = express()

var cors = require('cors')

app.use(cors())

let PhoneDirectory = require('./tries');

let phoneDirectory = new PhoneDirectory();

// phoneDirectory.display();

const PORT = process.env.PORT || 5000;

let graph = {
  nodesList : [ {id: 0, label: "root", title: "Root Node", color: "#a685e2",level: 0, prefix: "", nodeIDMAx: 0,} ],
  edgesList : []
}

phoneDirectory.insertNewContact("airtel", 121, graph.nodesList, graph.edgesList);
phoneDirectory.insertNewContact("vodafone", 123, graph.nodesList, graph.edgesList);
phoneDirectory.insertNewContact("idea", 111, graph.nodesList, graph.edgesList);
phoneDirectory.insertNewContact("police", 100, graph.nodesList, graph.edgesList);
phoneDirectory.insertNewContact("home", 0360253071, graph.nodesList, graph.edgesList);
phoneDirectory.insertNewContact("pharmacy", 036056000, graph.nodesList, graph.edgesList);
phoneDirectory.insertNewContact("policemobile", 9788098814, graph.nodesList, graph.edgesList);

app.get('/', (req, res) => {
    
    let trie = {
      nodes: graph.nodesList,
      edges: graph.edgesList
    }

    let contactList = phoneDirectory.contactSuggestion("");
    contactList.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

    let finalData = {
      trie: trie,
      list: contactList
    }


    res.json(finalData)
})

app.post('/', (req, res) => {

    res.json(data)
})

app.get('/add-user/name/:name/contact/:contact', (req, res) => {

  let name = req.params.name;
  let phoneNumber = req.params.contact;

  phoneDirectory.insertNewContact(name, phoneNumber, graph.nodesList, graph.edgesList);

  let trie = {
    nodes: graph.nodesList,
    edges: graph.edgesList
  }
  
  res.json(trie)
})

app.get('/get-contact/:name', (req, res) => {

  let name = req.params.name;
  let contactInfo = phoneDirectory.getPhoneNumber(name);
  
  res.json(contactInfo)
})

app.get('/get-list-contact/:keyword', (req, res) => {

  let name = req.params.keyword;

  let contactList = phoneDirectory.contactSuggestion(name);
  
  res.json(contactList)
})

app.get('/get-all-contacts/', (req, res) => {

  let contactList = phoneDirectory.contactSuggestion("");

  contactList.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

  res.json(contactList);
})

app.get('/delete-contact/:delete', (req, res) => {
  
  let name = req.params.delete;
  let bool = phoneDirectory.deleteContact(name,  graph.nodesList, graph.edgesList);

  res.json(bool)
})

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("../trie-project/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../trie-project", "build", "index.html"));
  });
}


app.listen(PORT, () => {
  console.log(`App listening at PORT: ${port}`)
})

