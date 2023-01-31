// cardCastCost='2', cardArt='potardTheMenace.jpg', cardName='Potard the menace - flying Devil', cardAttack='3', cardDef='2', cardHealth='2', cardDeathDam='4'
async function checkImageLink(image_path) {
    var e = new Date().getTime() + (3 * 1000);
    while (new Date().getTime() <= e) {}
    
    let respond = await fetch(image_path, {
        "method": "GET",
    })     
    .then(response => response.text())
    .then(result => {
    //   console.log(result);
      return result
    })
    .catch(error => console.log('error', error));
    return respond // returns the cards name
}

async function generateCard(cardCastCost, image_path, cardName, cardAttack, cardDef, cardHealth, cardDeathDam, ) {
    // const playingCard = document.createElement('div');
    const playingCard = document.createElement('td');
    playingCard.setAttribute('type', 'button');
    // playingCard.setAttribute('onclick', 'getUserName()');
    playingCard.setAttribute('style', `background: transparent; border: none !important; font-size:0;`);
    // console.log(`cardArt link is : ${cardArt}`);
    // const stringCardArt = String.raw`${cardArt}`;
    
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
    // console.log(playingCard);
    // document.body.appendChild(playingCard);
    document.getElementById("cardTable").appendChild(playingCard);
    // alert(playingCard)
    return playingCard;
}

export { generateCard };
