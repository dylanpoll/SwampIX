// cardCastCost='2', cardArt='potardTheMenace.jpg', cardName='Potard the menace - flying Devil', cardAttack='3', cardDef='2', cardHealth='2', cardDeathDam='4'

async function checkImageLink(image_path) {
    var e = new Date().getTime() + (3 * 1000);
    while (new Date().getTime() <= e) {}
    
    let respond = await fetch(image_path, {
        "method": "GET",
    })     
    .then(response => response.text())
    .then(result => {
      console.log(result);
      return result
    })
    .catch(error => console.log('error', error));
    return respond // returns the cards name
}

async function generateCard(cardCastCost, cardArt, cardName, cardAttack, cardDef, cardHealth, cardDeathDam) {
    // const playingCard = document.createElement('div');
    const playingCard = document.createElement('td');
    playingCard.setAttribute('type', 'button');
    playingCard.setAttribute('onclick', 'getUserName()');
    playingCard.setAttribute('style', `background: transparent; border: none !important; font-size:0;`);
    // console.log(`cardArt link is : ${cardArt}`);
    // const stringCardArt = String.raw`${cardArt}`;


    let temp_image_path = 'https://swampix.devdylan.us/resources/cardArt/'+cardName.replaceAll(' ','_');
    let image_path = temp_image_path.replaceAll('"','')+'.png';
    
    let respond = await checkImageLink(image_path);

    // console.log(`cardArt link is : ${image_path}`);

    // <div class="cardAvatar" style="background-image:url('${cardArt}');"/>
    // <img src="${cardArt}" class="cardAvatar"/>
    playingCard.innerHTML = `
    <div class="bufferContainer">
        <div class="cardContainer">
        <div class="cardAvatar" style="background-image:url('`+image_path+`');"/>
            <div class="cardBase"/>
            <div class="container">
                <table class="cardTextStuff">
                    <tbody>
                        <tr>
                            <td class="cardLevelCost"> ${cardCastCost} </td>
                            <td class="cardName">${cardName}</td>
                            <td class="cardAttckAbsoluteTextPosition"> ${cardAttack} </td>
                            <td class="cardDeffenceAbsoluteTextPosition"> ${cardDef} </td>
                            <td class="cardHealthAbsoluteTextPosition"> ${cardHealth} </td>
                            <td class="cardDeathDamAbsoluteTextPosition"> ${cardDeathDam} </td>
                        </tr>
                    </tbody>
                </table>
                <div class="cardTextStuff"></div>
                <div class="cardDescription"> Descriptions not implemented yet </div>
            </div>
        </div>
        </div>
`;
    console.log(playingCard);
    // document.body.appendChild(playingCard);
    document.getElementById("cardTable").appendChild(playingCard);
    // alert(playingCard)
    return playingCard;
}

export { generateCard };



    // playingCard.setAttribute('class', 'class="card"');
//     playingCard.setAttribute('type', 'button');
//     playingCard.setAttribute('onclick', 'getUserName()');
//     playingCard.setAttribute('style', `background: transparent; border: none !important; font-size:0;`);
//     playingCard.innerHTML = `
//     <div class="card">
// <link rel="stylesheet" type="text/css" href="./resources/css/card.css">
//     <div class="avatar avatar-personnage"
//         style="background-image:url('./resources/cardArt/${cardArt}');"></div>
//     <div class="card-in card-personnage">
//         <div class="card-level-cost cost-personnage"> ${cardCastCost} </div>
//         <div class="title">
//             <span class="name">${cardName}</span>
//         </div>
//         <div class="container">
//             <table class="carac333">
//                 <tbody>
//                     <tr>
//                         <td class="iconcell for3"> <img class="icon" src="./resources/icons/axe-svgrepo-com.svg">
//                         ${cardAttack} </td>
//                         <td class="iconcell agi3"> <img class="icon"
//                             src="./resources/icons/shield-svgrepo-com.svg"> ${cardDef} </td>
//                         <td class="iconcell cha3"> <img class="icon"
//                             src="./resources/icons/health-care-svgrepo-com.svg"> ${cardHealth} </td>
//                         <td class="iconcell cha3"> <img class="icon"
//                             src="./resources/icons/death-svgrepo-com.svg"> ${cardDeathDam} </td>
//                     </tr>
//                 </tbody>
//             </table>
//             <div class="texte333"></div>
//             <div class="ambiance"> test creature card </div>
//         </div>
//     </div>
//     </div>
// `;