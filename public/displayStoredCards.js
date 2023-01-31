async function generateCard(cardCastCost, image_path, cardName, cardAttack, cardDef, cardHealth, cardDeathDam, ) {
    const playingCard = document.createElement('td');
    playingCard.setAttribute('type', 'button');
    // playingCard.setAttribute('onclick', 'getUserName()');
    playingCard.setAttribute('style', `background: transparent; border: none !important; font-size:0;`);

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
    document.getElementById("cardTable").appendChild(playingCard);
    return playingCard;
}

export { generateCard };
