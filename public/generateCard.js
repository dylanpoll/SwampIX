// cardCastCost='2', cardArt='potardTheMenace.jpg', cardName='Potard the menace - flying Devil', cardAttack='3', cardDef='2', cardHealth='2', cardDeathDam='4'

function generateCard(cardCastCost, cardArt, cardName, cardAttack, cardDef, cardHealth, cardDeathDam) {
    // const playingCard = document.createElement('div');
    const playingCard = document.createElement('button');
    playingCard.setAttribute('type', 'button');
    playingCard.setAttribute('onclick', 'getUserName()');
    playingCard.setAttribute('style', `background: transparent; border: none !important; font-size:0;`);
    playingCard.innerHTML = `
        <div class="cardContainer">
            <div class="cardAvatar" style="background-image:url('./resources/cardArt/${cardArt}');"/>
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
`;
    // console.log(playingCard);
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