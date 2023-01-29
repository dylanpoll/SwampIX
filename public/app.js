$(document).ready(async function () {
    // console.log("document ready");
    await getClientConstVars();
    // console.log("got constants");
    // printClientVars(); // used for testing.
    // console.log("starting main");
    main();
    await isLogged();
});

document.getElementById('uploader').onchange = function () {
    document.getElementById('uploader-label').innerHTML = this.files[0].name;
};

function printClientVars() {
    console.log("fileStorage buckit ID: " + fileStorageBuckitID + " | WebsiteDomainRoot: " + WebsiteDomainRoot + " | AppwriteProjectID: " + AppwriteProjectID + " | getServiceEndpoint: " + ServiceEndpoint)
}

async function getClientConstVars() {
    let { getFileStorageBuckitID, getwebsiteDomainRoot, getAppwriteProjectID, getServiceEndpoint, getDATABASEID, getCOLLECTIONID } = await import('./clientSideConsts.js');
    window.fileStorageBuckitID = getFileStorageBuckitID;
    window.WebsiteDomainRoot = getwebsiteDomainRoot;
    window.AppwriteProjectID = getAppwriteProjectID;
    window.ServiceEndpoint = getServiceEndpoint;
    window.DATABASEID = getDATABASEID;
    window.COLLECTIONID = getCOLLECTIONID;
}
function getUserName() {
    let promise = account.get();
    promise.then(
        function (response) {
            alert(response.name);
        },
        function (error) {
            alert("No User is Logged!");
        }
    );
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
function createTable(){
    let row = getRandomInt(50);
    const tableRow = document.createElement('table');
    tableRow.setAttribute('id',`mainCardTableid${row}`);
    tableRow.setAttribute('class', 'cardTable');
    tableRow.innerHTML = `
    `;
    
    // <tr id="cardTableRow${row}" class="cardTable">
    // </tr>
    document.getElementById("uploader").appendChild(tableRow);
    return 'mainCardTableid'+row;
}
async function importAndGenerateCard() {
    const { generateCard } = await import('./generateCard.js');
    const { createCardStats, getCardName } = await import('./getCardName.js');

    // var table = createTable();
    for (let i = 0; i <= 4; i++) {
        
      
    let cardName = await getCardName(); // generates the card name
    let stats = createCardStats(); // generates the stats and returns them in a json object

    let cardCastCost = stats.castingCost;
    let cardAttack = stats.attack;
    let cardDef = stats.defense;
    let cardHealth = stats.health;
    let cardDeathDam = stats.deathDamage;
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "name": cardName
    });

    let cardArt = await fetch("https://swampix.devdylan.us/createCard/createArt", {  method: 'POST',  headers: myHeaders, body: raw, redirect: 'follow' })
        .then(response => response.text())
        .then(result => {
            console.log(result)
            return result
        })
        .catch(error => console.log('error', error));

    generateCard(cardCastCost, cardArt, cardName, cardAttack, cardDef, cardHealth, cardDeathDam);
    } 
    return
}

function main() {
    window.client = new Appwrite.Client();// Before we start doing anything, we need to init our Appwrite Web SDK
    client // your appwrite server info NOT THE WEBSITE RUNNING IT :(
        .setEndpoint(ServiceEndpoint)
        .setProject(AppwriteProjectID);
    // Preparing all services we are going to use
    window.account = new Appwrite.Account(client);
    window.storage = new Appwrite.Storage(client);
    window.teams = new Appwrite.Teams(client);
    window.locale = new Appwrite.Locale(client);
    window.realtimeElement = document.getElementById("realtime");

    client.subscribe("files", function (response) {
        const entry = document.createElement("li");
        const image = storage.getFilePreview(fileStorageBuckitID, response.payload.$id, 250);
        const url = storage.getFileView(fileStorageBuckitID, response.payload.$id, 250);
        entry.classList.add('list-group-item');
        entry.innerHTML = `
        <a href="${url}" target=_blank><b>Events</b>: ${response.events}<br><img src="${image}" /></a>
        `;
        realtimeElement.prepend(entry);
    });

    // client.subscribe = (callback) => {
    //     return this.appwrite.subscribe(`collections.${COLLECTIONID}.documents`, callback);
    // }

    client.subscribe(['teams', 'memberships', 'accounts',], function (response) {
        console.log(response)
    });

}

function loginWithGithub(event) {
    let promise = account.createOAuth2Session(
        "github",
        WebsiteDomainRoot, // have this handled in islogged function
        WebsiteDomainRoot, // have this handled in islogged function
        []
    );
    promise.then(
        function (response) {
            console.log(response); // Success
        },
        function (error) {
            console.log(error); // Failure
        }
    );
}

function isLogged() {
    let promise = account.get();
    promise.then(
        function (response) {
            document.getElementById("buttonRow").innerHTML += `
            <button type="button" class="btn btn-primary btn-lg mr-4 mb-4" onclick="importAndGenerateCard()">  Generate Card Deck </button>

            <button type="button" class="btn btn-primary btn-lg mr-4 mb-4" onclick="getUserName()"> Get User Name </button>
    
            <button type="button" class="btn btn-primary btn-lg mr-4 mb-4" onclick="deleteCurrentSession()"> Logout </button>
    
            <button type="button" class="btn btn-primary btn-lg mr-4 mb-4" onclick="createTD()"> make row </button>
        `;
        },
        function (error) {
            // alert("No User is Logged! Please log in using Github!");
            $('#buttonDash').prepend(`<br>
            <h2>The Options Related to Card Creation Will only be Availble after Logging in.</h2>
            `);
            // document.getElementById("buttonDash").innerHTML += `
            // <h2>The Options Related to Card Creation Will only be Availble after Logging in.</h2>
            // `;
            document.getElementById("buttonRow").innerHTML += `
            <button type="button" class="btn btn-primary btn-lg mr-4 mb-4" onclick="loginWithGithub()"> Login With Github </button>`;
            // document.getElementById("buttonRow").appendChild(githubPrompt);
            // document.body.buttonRow.appendChild(githubPrompt)
        }
    );
}

function deleteCurrentSession() {
    let promise = account.deleteSession('current');
    promise.then(
        function (response) {
            console.log("Current session deleted."); // Success
        },
        function (error) {
            console.log(error); // Failure
        }
    );
}

function createJWT() {
    account.createJWT().then(
        function (response) {
            console.log("JWT: ", response);
            alert("JWT created.");
        },
        function (error) {
            alert("failed to create session");
        }
    );
}

