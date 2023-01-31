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

function createTable() {
    let row = getRandomInt(50);
    const tableRow = document.createElement('table');
    tableRow.setAttribute('id', `mainCardTableid${row}`);
    tableRow.setAttribute('class', 'cardTable');
    tableRow.innerHTML = `
    `;

    // <tr id="cardTableRow${row}" class="cardTable">
    // </tr>
    document.getElementById("uploader").appendChild(tableRow);
    return 'mainCardTableid' + row;
}

async function saveCardToCardCollection(cardCastCost, image_path, cardName, cardAttack, cardDef, cardHealth, cardDeathDam){
    let documentID = getRandomInt(50000);
    documentID +='card'
    var myHeaders = new Headers();
    myHeaders.append("X-Appwrite-Project", "63d3a5777ec8d871894e");
    myHeaders.append("X-Appwrite-Response-Format", "1.0.0");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "documentId": documentID,
    "data": {
        "cardName": cardName,
        "cardArt": image_path,
        "attack": cardAttack,
        "defence": cardDef,
        "deathDamage": cardDeathDam,
        "health": cardHealth,
        "castingCost": cardCastCost,
        "$permissions": [
        "read(\"any\")"
        ]
    },
    "permissions": [
        "read(\"any\")"
    ]
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    await fetch("https://appwrite.devdylan.us/v1/databases/63d3a613604eb2cde313/collections/63d3a61a70dec437bfaf/documents", requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        return result;
    })
    .catch(error => console.log('error', error));
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

        await fetch("https://swampix.devdylan.us/createCard/createArt", { method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' })
            .then(response => response.text())
            .then(result => {
                console.log(result)
                return result
            })
            .catch(error => console.log('error', error));
            let temp_image_path = 'https://swampix.devdylan.us/resources/cardArt/'+cardName.replaceAll(' ','_');
            let image_path = temp_image_path.replaceAll('"','')+'.png';
        
        generateCard(cardCastCost, image_path, cardName, cardAttack, cardDef, cardHealth, cardDeathDam);        
        saveCardToCardCollection(cardCastCost, image_path, cardName, cardAttack, cardDef, cardHealth, cardDeathDam);
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
    window.databases = new Appwrite.Databases(client);
    window.realtimeElement = document.getElementById("realtime");

    // client.subscribe("files", function (response) {
    //     const entry = document.createElement("li");
    //     const image = storage.getFilePreview(fileStorageBuckitID, response.payload.$id, 250);
    //     const url = storage.getFileView(fileStorageBuckitID, response.payload.$id, 250);
    //     entry.classList.add('list-group-item');
    //     entry.innerHTML = `
    //     <a href="${url}" target=_blank><b>Events</b>: ${response.events}<br><img src="${image}" /></a>
    //     `;
    //     realtimeElement.prepend(entry);
    // });

    // client.subscribe = (callback) => {
    //     return this.appwrite.subscribe(`collections.${COLLECTIONID}.documents`, callback);
    // }

    client.subscribe(['teams', 'memberships', 'accounts', 'databases', 'storage'], function (response) {
        console.log(response)
    });
}

async function getDatabaseDocuments() {
    var myHeaders = new Headers();
    myHeaders.append("X-Appwrite-Project", "63d3a5777ec8d871894e");
    myHeaders.append("X-Appwrite-Response-Format", "1.0.0");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    let cards = await fetch("https://appwrite.devdylan.us/v1/databases/63d3a613604eb2cde313/collections/63d3a61a70dec437bfaf/documents", requestOptions)
        .then(response => response.json())
        .then(result => {
            return result
        })
        .catch(error => console.log('error', error));
        console.log(cards);
    return cards
    // console.log(databases);
    // const promise = databases.getDocument('[DATABASE_ID]', '[COLLECTION_ID]', '[DOCUMENT_ID]');
    //     // const promise = databases.getDocument('63d64368d5fafedb7679', '63d3a61a70dec437bfaf','63d64368d5fafedb7679');
    //     console.log(promise);
    //     promise.then(function (response) {
    //         console.log(response); // Success
    //     }, function (error) {
    //         console.log(error); // Failure
    //     });
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
            
            <button type="button" class="btn btn-primary btn-lg mr-4 mb-4" onclick="location.href='https://swampix.devdylan.us/allCards.html'"> get Prior Generated Cards </button>
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

async function displayPriorGeneratedCards() {
    const { generateCard } = await import('./displayStoredCards.js');
    var myHeaders = new Headers();
    myHeaders.append("X-Appwrite-Project", "63d3a5777ec8d871894e");
    myHeaders.append("X-Appwrite-Response-Format", "1.0.0");

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch("https://appwrite.devdylan.us/v1/databases/63d3a613604eb2cde313/collections/63d3a61a70dec437bfaf/documents", requestOptions)
    .then(response => response.json())
    .then(result => {
        // console.log(result)
        for (let i = 1; i <= 5; i++) {
            let card = result.documents[i]
            console.log(card);
            let cardCastCost = card.castingCost;
            let image_path = card.cardArt;
            let cardName = card.cardName;
            let cardAttack = card.attack;
            let cardDef = card.defence;
            let cardHealth = card.health;
            let cardDeathDam = card.deathDamage;
        
            generateCard(cardCastCost, image_path, cardName, cardAttack, cardDef, cardHealth, cardDeathDam);
        }
        let cardTotal = result.total
        alert("Current cards stored in DB = " + cardTotal +" | Currently all cards can be viewed by using the https://appwrite.devdylan.us/v1/databases/63d3a613604eb2cde313/collections/63d3a61a70dec437bfaf/documents api endpoint with a get request, however rendering them is proving to be a bit tricky. open dev tools in browser to see the json bodies for the 5 rendered currently!");
        // return response
    })
    .catch(error => console.log('error', error));
    
    // Example json response, needs to be parsed and looped over to generate cards.

    // {
    //     "total": 2,
    //     "documents": [
    //         {
    //             "cardName": "Alexandrina Belvoir the twit",
    //             "cardArt": "https://swampix.devdylan.us/resources/cardart/Alexandrina_Belvoir_the_twit.png",
    //             "attack": 15,
    //             "defence": 14,
    //             "deathDamage": 14,
    //             "health": 5,
    //             "castingCost": 3,
    //             "$id": "63d64368d5fafedb7679",
    //             "$createdAt": "2023-01-29T09:59:04.876+00:00",
    //             "$updatedAt": "2023-01-29T09:59:43.390+00:00",
    //             "$permissions": [],
    //             "$collectionId": "63d3a61a70dec437bfaf",
    //             "$databaseId": "63d3a613604eb2cde313"
    //         },
    //         {
    //             "cardName": "aAPITest",
    //             "cardArt": "https://swampix.devdylan.us/resources/cardart/Alexandrina_Belvoir_the_twit.png",
    //             "attack": 15,
    //             "defence": 14,
    //             "deathDamage": 14,
    //             "health": 5,
    //             "castingCost": 3,
    //             "$id": "aAPITest",
    //             "$createdAt": "2023-01-29T11:01:21.675+00:00",
    //             "$updatedAt": "2023-01-29T11:01:21.675+00:00",
    //             "$permissions": [
    //                 "read(\"any\")"
    //             ],
    //             "$collectionId": "63d3a61a70dec437bfaf",
    //             "$databaseId": "63d3a613604eb2cde313"
    //         }
    //     ]
    // }
}
