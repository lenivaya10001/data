

async function read_db(){
    console.log("message from javascript file , before calling python function") //this printed
    var pyresponse = await eel.python_method()()// not working - print eel.python_method is not a function
    console.log( parseInt(pyresponse) *2)
    
}

function nCleaner(txt){
    return txt.replace("\n"," ")
}

async function addonItem(){
    var name = document.getElementById("itemName").value
    var url = document.getElementById("itemUrl").value
    var viewed = document.getElementById("itemViewed").value
    //add checking later... at least clearing from \n inside incoming data
    name = nCleaner(name)
    url = nCleaner(url)
    viewed = nCleaner(viewed)
    var dbtxt = await eel.pythonAddonItem(name, url, viewed)() //text from txt file returned
    txtToObject(dbtxt)
    infoDivDataCreator()
    alert(dbtxt)
}

var db = {}

function txtToObject(txt){
    db = {} //clearing
    var stxt = txt.split("\n\n")
    for (var i=0;i<stxt.length;i++){
        var item = {}
        //alert("inside txtToObject stxt[i]= \n"+stxt[i])
        var sitem = stxt[i].split("\n")
        if (sitem.length == 3){
            item["name"] = sitem[0]
            item["url"] = sitem[1]
            item["saw"] = sitem[2]
            db[i]=item
        }//else{alert("sitem.length == "+sitem.length.toString()+"\n"+sitem.toString())}
    }
}

function objectToTxt(){
    var txt=""
    for (var key in db){txt+=db[key]["name"]+"\n"+db[key]["url"]+"\n"+db[key]["saw"]+"\n\n"}
    return txt
}

async function loadProcess(){
    var txt = await eel.pythonShow()() //read db first time
    txtToObject(txt) //now it can be used as database
    infoDivDataCreator()
}

function deleteItem(key){
    if(key in db) {delete db[key]}
    infoDivDataCreator()
    eel.pythonFixChanges(objectToTxt(db))()
}

function viewedItem(key,saw){
    if(key in db) {
        var sawnumber = (parseInt(saw)+1).toString()
        db[key]["saw"] = sawnumber
    }
    infoDivDataCreator()
    eel.pythonFixChanges(objectToTxt(db))()
}

function editItem(key){
    alert("editItem(key) in development")
}

function firstItem(key){
    alert("firstItem(key) in development")
}

function itemDivCreator(key,item){
    if("name" in item && "url" in item && "saw" in item){
        var div = document.createElement('div')
        var table = document.createElement('table')
        
        var deleteButton = document.createElement('button')
        deleteButton.innerHTML = "x"
        deleteButton.onclick = function() {deleteItem(key)}
        
        var a = document.createElement('a')
        a.href = item["url"]
        a.text = item["name"]
        a.target = "_blank"
        
        var viewedButton = document.createElement('button')
        viewedButton.innerHTML = item["saw"]
        viewedButton.onclick = function() {viewedItem(key, item["saw"])}
        
        var editButton = document.createElement('button')
        editButton.innerHTML = "edit"
        editButton.onclick = function() {editItem(key)}
        
        var firstButton = document.createElement('button')
        firstButton.innerHTML = "&uArr;"
        firstButton.onclick = function(){firstItem(key)}
        
        var tr = document.createElement('tr')
        var td = document.createElement('td')
        td.appendChild(deleteButton)
        tr.appendChild(td)
        var td = document.createElement('td')
        td.appendChild(a)
        tr.appendChild(td)
        var td = document.createElement('td')
        td.appendChild(viewedButton)
        tr.appendChild(td)
        var td = document.createElement('td')
        td.appendChild(editButton)
        tr.appendChild(td)
        var td = document.createElement('td')
        td.appendChild(firstButton)
        tr.appendChild(td)
        table.appendChild(tr)
        div.appendChild(table)
    }else{var div = null}
    return div
}

function infoDivDataCreator(){
    var infodiv = document.getElementById("infodiv")
    infodiv.innerHTML = ""
    for (var key in db){
        var itemDiv = itemDivCreator(key,db[key])
        if(itemDiv!=null) infodiv.appendChild(itemDiv)
    }
    
}

function clearAddonItem(){
    document.getElementById("itemName").value = ""
    document.getElementById("itemUrl").value = ""
    document.getElementById("itemViewed").value = ""
}
function showAddonItem(){
    clearAddonItem()
    document.getElementById("addItem").style.display = "inline"
}
function hideAddonItem(){document.getElementById("addItem").style.display = "none"}
eel.expose(jSShowMessage)
function jSShowMessage(message){document.getElementById("itemProcess").innerHTML = message}

loadProcess()