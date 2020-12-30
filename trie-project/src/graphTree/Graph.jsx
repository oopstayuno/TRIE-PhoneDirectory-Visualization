import React, {useEffect, useState} from "react";
import Graph from "react-graph-vis";
import axios from "axios"


function GraphTree() {

  const [nodes, getNodes] = useState();
  const [phoneNumberResult, setPhoneNumberResult] = useState("");
  const [contactListResult, setContactListResult] = useState();
  const [deleteSuccess, setDeleteSuccess] = useState();
  const [allContactList, setAllContactList] = useState();

  const [newEntry, setNewEntry] = useState({
    "name": "",
    "phoneNumber": ""
  });

  const [ getPhoneName, setGetPhoneName ] = useState("");
  const [ deleteName, setDeleteName ] = useState("");

  const [ prefix, setPrefix ] = useState("");

  const url = "http://localhost:5000/api/";

  const getAllNode = () => {
    axios.get(url).then( (response) =>  {

      const allNodes = response.data;
      // console.log(allNodes.list);
      getNodes(allNodes.trie);
      setAllContactList(allNodes.list);
    })
    .catch(error => console.log(`Error: ${error}`))

  }

  useEffect(() => {
    getAllNode();

}, []);

const options = {
  layout: {
    hierarchical: true,
  },
  // configurePhysics: true, 
  physics: {
    hierarchicalRepulsion: {
      nodeDistance: 10, 
      springLength: 0, 
      springConstant: 0, 
      damping: 0.05
    }},
    // hierarchicalLayout: {
    //   direction: "UD", nodeSpacing: 100,levelSeparation: 102,
    // },
  nodes: {
    size : 25,
    font : {
      size : 30,
      color : 'black',
    },
    borderWidth : 1,
    color: {
      background: '#adce74',
      border: 'white',
      highlight: {
        background: 'pink',
        border: 'red',
        
      }
    },
  },
  edges: {
    color: "#000000",
    width: 2
    
  },
  height: "600px"
};


const handleNewEntryChange = (event) => {
  const { name, value} = event.target;

    setNewEntry( prevValue => {
      return {
        ...prevValue,
        [name]: value.toLowerCase()
      }
    })

}

const insertNewContact = ()=>{
  // console.log(newEntry);

  if(newEntry.name === "" || newEntry.phoneNumber === ""){
    alert("Name or Phone Number cannot be empty");
  }else{
    let newUrl = `${url}add-user/name/${newEntry.name}/contact/${newEntry.phoneNumber}`;

//     console.log("This is the new url: ", newUrl);
    axios.get(newUrl);
    window.location.reload();
  }

  


}

const handlePrefixChange = (event) => {

  const { value} = event.target;
  setPrefix(value);
  setContactListResult();
}



const getPhoneNumber = async ()  => {
  // console.log(getPhoneName);

  if(getPhoneName===""){
    alert("Enter Name to get Phone Number");
  }else{
    // get phone number
    let newUrl = `${url}get-contact/${getPhoneName}`;

//     console.log("This is the new url: ", newUrl);
    let contactNumber = await axios.get(newUrl);

//     console.log(contactNumber);
    if(contactNumber.data === null){
      let contactInfo = contactNumber.data;
//       console.log(contactInfo);
      setPhoneNumberResult(contactInfo);
    }else{
      let contactInfo = contactNumber.data.phoneNumber;
//       console.log(contactInfo);
  
      setPhoneNumberResult(contactInfo);
    }

    
  }

  

}

const getContactList = async () => {
  // console.log(prefix)

  // get contactList

  if(prefix === ""){
    alert("Prefix field cannot be empty");
  }else{
    let newUrl = `${url}get-list-contact/${prefix}`;

    // console.log("This is the new url: ", newUrl);
    let contactList = await axios.get(newUrl);
  
    let contactArray = contactList.data;
    // console.log(contactArray);
  
    
    if(contactArray === null || contactArray.length === 0) {
      setContactListResult(null);
    }else{
      setContactListResult(contactArray)
    }
  }
  

}

const deleteContact = async () => {
//   console.log(deleteName);

  // get contactList
  let newUrl = `${url}delete-contact/${deleteName}`;

  let deleteResult = await axios.get(newUrl);

  if(deleteResult.data === true ){
    window.location.reload();
  }
  else{
    setDeleteSuccess("Contacts not available");
  }


}

  return (
    <React.Fragment>
    {console.log("Starting.....")}
    <div >
      
      <div style={{backgroundColor: "black"}}>
        <h3 style={{margin: 0, color: "white", paddingTop: "2em"}}> TRIES VISUALIZATION</h3>
        <p style={{margin: 0, color: "white", paddingBottom: "1em"}}>(Phone Book)</p>
      <div>
        <div style={{margin: "1em", backgroundColor: "white", display:"block", width:" 60%", float: "left", borderStyle: "outset"}}>

        {nodes === undefined
          ?  <React.Fragment>What now </React.Fragment>:
          <Graph
          graph={nodes}
          options={options}
          // events={events}
        />
        }
        </div> 

          <div style={{margin: "1em", backgroundColor: "#bbbbbb", width:" 25%", float:"left", height: "800px"}}>
          <div>
            <h5 style={{marginBottom: "0.5em"}}>Available Contacts:</h5>
            { allContactList === undefined ? <React.Fragment></React.Fragment> : allContactList=== null ? <p>No Contacts</p> : allContactList.map((comp, index) => (
              <p key={index} style={{margin:"0"}}>
                {comp.name}
              </p>
            ))}
          </div>
          <div style={{alignContent: "flex-start"}}>
            <h3>Perform any operation </h3>

            <label><strong>Add New Contact</strong></label><br/>
            <input placeholder="Name" name="name" onChange={handleNewEntryChange} value={newEntry.name}></input> 
            <input placeholder="Phone Number" type="number" name="phoneNumber" onChange={handleNewEntryChange} value={newEntry.phoneNumber}></input> 
            <br/>
            <button onClick={insertNewContact}>Add</button>
            <br/>
            <br/>
            <label><strong>Get Phone Number</strong></label><br/>
            <input placeholder="Enter Name" onChange={ (e) => { setGetPhoneName(e.target.value) }} value={getPhoneName}></input>
            <button onClick={getPhoneNumber}>Get Phone Number</button><br/>
            { phoneNumberResult === null ? 
                  <label style={{color: "red"}}><strong>ERROR: </strong>no contact available</label> : 
                  phoneNumberResult === "" ? <span></span> : <label>Phone Number: {phoneNumberResult}</label>}

            <br/>
            <br/>

            <label><strong>Get Contacts Suggestion</strong></label> <br/>
            <input name="prefix" placeholder="PREFIX" value={prefix} onChange={handlePrefixChange}></input>
            <button onClick={getContactList}>Get Contact List Starting with </button><br/>
            
            { contactListResult === undefined ? <React.Fragment></React.Fragment> : (contactListResult=== null ? <label style={{color: "red"}}><strong>Error: </strong>No Contacts with the given prefix</label> : contactListResult.map((comp, index) => (
              <p key={index} style={{margin:"0"}}>
                {comp.name} : {comp.phoneNumber}
              </p>
            )))}
              <br/>
              <br/>
            <label><strong>Delete Contact</strong></label><br/>
            <input placeholder="Contact Name" onChange={ (e) => { setDeleteName(e.target.value); setDeleteSuccess(); }} value={deleteName}></input>
            <button onClick={deleteContact}>Delete Contact</button>
            <br/>
            {deleteSuccess === undefined? <React.Fragment/> : <label style={{color: "red"}}><strong>Error: </strong>{deleteSuccess}</label>}
          </div>
          </div>
      </div>

      </div>
      

      
      </div>

    </React.Fragment>
    
  );
}
 
export default GraphTree;
