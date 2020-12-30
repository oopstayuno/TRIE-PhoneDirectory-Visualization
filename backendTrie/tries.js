class TrieNode {

    constructor(){
        this.children = new Map();
        this.char = '';
        this.isRoot = false;
        this.isLastNode = false;
        this.phoneNumber = '\0';
        this.nodeID ='';
    }
}

class PhoneDirectory{
    
    constructor(){
        this.root = new TrieNode();
        this.root.isRoot = true;
    }

    // insert new contact
    insertNewContact(name, phoneNumber, nodesArray, edgesArray){

        var temp = this.root;

        let prevNodeId = 0;
        let curNodeId = 0;

        let stringPrefix = "";

        let levelID = 1;
        for(let i=0; i<name.length; i++){
            let charName = name[i];

            // check if the node has a children with the character
            if(!temp.children.has(charName)){
                
                temp.children.set(charName, new TrieNode());

                prevNodeId = nodesArray.find((x) => {return x.prefix===stringPrefix}).id;
                curNodeId = (parseInt(nodesArray[0].nodeIDMAx)+parseInt(1))
                
                // push the node edgese into the edges array
                edgesArray.push({from: prevNodeId, to: curNodeId, length: "2"})

                // will store the prefixes at each node -> to find ndoes while deleting
                stringPrefix = stringPrefix + charName;

                // push node information into the node array
                nodesArray.push({id: (parseInt(nodesArray[0].nodeIDMAx)+parseInt(1)), label: charName,level: levelID,  title: stringPrefix, prefix: stringPrefix });
                nodesArray[0].nodeIDMAx = parseInt(nodesArray[0].nodeIDMAx) + 1;
                // will place the node ID
                temp.nodeID = parseInt(nodesArray[0].nodeIDMAx);
            }else{
                
                stringPrefix = stringPrefix + charName;
            }
            
            levelID = levelID+1;
            temp.char = charName;
            
            
            temp = temp.children.get(charName);
        }
        temp.isLastNode = true;
        
        temp.phoneNumber = phoneNumber;
        
        // will add a red color feature for the last node
        nodesArray[nodesArray.findIndex(x=>x.id===parseInt(nodesArray[0].nodeIDMAx) )].color = "red";
        nodesArray[nodesArray.findIndex(x=>x.prefix===name)].color = "red";  

    }

    // get the phone number for the given contact
    getPhoneNumber(name){
        let temp = this.root;

        let count = 0; // to count if reached the end of the name provided in the parameter

        for(let i=0; i<name.length; i++){
            if(!temp.children.has(name[i])){
                break;
            }
            temp = temp.children.get(name[i]);
            count++;
        }

        if(count === name.length && temp.isLastNode){

            let contact = {
                name: name,
                phoneNumber: temp.phoneNumber
            }
            // return the contact found            
            return contact;
        }else{
 
            // contact not found
            return null
        }

    }

    // display list of contacts based on prefix
    contactSuggestion(prefix){
        // 1. check if the prefix is present in the tries
        let isPresent = true;
        let temp = this.root;

        for(let i=0; i<prefix.length; i++){
            let charPref = prefix[i];

            // check if the character is present in the path
            if(!temp.children.has(charPref)){
                isPresent = false;
                break;
            }

            temp = temp.children.get(charPref);
        }

        if(isPresent){
            
            // get all the cobtacts with the same prefixes
            let contactList = []
            this.displayContactList(temp,  prefix, contactList)
            return contactList;
        }else{
            // not available
            return null
        }

    }

    // display the contact list
    displayContactList(node, name, contactList){

        if(node.isLastNode === true){
            
            contactList.push({
                name: name,
                phoneNumber: node.phoneNumber
            });
        }

        for (let i = 'a'; i <= 'z'; i = String.fromCharCode(i.charCodeAt(0)+1))
        {
            let index = i;

            if (node.children.has(index) )
            {
                this.displayContactList(node.children.get(index), (name + index), contactList);
            }
        }


    }    


    // check if a node has any children
    isEmpty(node)
    {

        for (let i = 'a'; i <= 'z'; i = String.fromCharCode(i.charCodeAt(0)+1))
        {
            let index = i;

            if (node.children.has(index) )
            {
                return true;
            }
        }

        return false;
    }

    // Recursive function to delete a key from given Trie
    remove(root, key, depth)
    {
        // If tree is empty
        if (!root)
            return null;

        // If last character of key is being processed
        if (depth == key.length)
        {
            if (root.isLastNode){
                root.isLastNode = false;
            }
            if (this.isEmpty(root))
            {
                root = null;
            }

            return root;
        }

        let index = key[depth];
        root.children[index] = this.remove(root.children.get(index), key, depth + 1);

        if(this.isEmpty(root) && root.isLastNode == false)
        {
            root = null;
        }

        return root;
    }

    deleteContact(name, nodeList, edgeList)
    {
        let temp = this.root;
        if (temp == null)
        {
            return false;
        }

        let phoneNumber = this.getPhoneNumber(name)

        if(phoneNumber === null){
            return false;
        }

        let list = this.contactSuggestion(name);

        if(list=== null){
            return false;
        }

        let index = -1;

        
        for(let i =1; i<=name.length; i++){
            // get the list of all
            let contactList = this.contactSuggestion(name.substring(0,i));

            if(contactList == null){
                return false
            }
            // console.log(contactList.length);

            if(contactList.length == 1){
                index = i-1;
                break;
            }

        }

        
        
        if(index == -1){

            let id = nodeList.findIndex(x=>x.prefix===name);
            delete nodeList[id].color 
            

            for(let i=0; i<name.length; i++){
                temp = temp.children.get(name[i]);
            }
            temp.isLastNode = false;
            
        }else{
            this.remove(temp, name, 0);

            // indexes that is being removed: 

            let indexes = []

            for(let i = index+1; i<=name.length; i++){

                let substring = name.substring(0, i);
                let id = nodeList.findIndex(x=>x.prefix===substring);
    
                indexes.push(nodeList[id].id);
                nodeList.splice(id, 1);
             
            }

            for(let i=0; i<indexes.length; i++){
                // console.log(indexes[i]);

                let idFrom = edgeList.findIndex(x => x.from === indexes[i]);
                if(idFrom!=-1){
                    edgeList.splice(idFrom, 1);
                }
                let idTo = edgeList.findIndex(x => x.to === indexes[i]);
                if(idTo != -1){
                   edgeList.splice(idTo, 1);
                }
            }
        }

        return true;
    }
}

module.exports = PhoneDirectory;
