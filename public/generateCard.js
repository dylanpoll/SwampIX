export function generateCard(cardCastCost, cardArt ,cardName, cardAttack, cardDef, cardHealth, cardDeathDam ) {
    const playingCard = document.createElement('div');
    playingCard.setAttribute('class', 'class="card"');
    playingCard.innerHTML = `
    <div class="avatar avatar-personnage"
        style="background-image:url('./resources/cardArt/${cardArt}');"></div>
    <div class="card-in card-personnage">
        <div class="card-level-cost cost-personnage"> ${cardCastCost} </div>
        <div class="title">
            <span class="name">${cardName}</span>
        </div>
        <div class="container">
            <table class="carac333">
                <tbody>
                    <tr>
                        <td class="iconcell for3"> <img class="icon" src="./resources/icons/axe-svgrepo-com.svg">
                        ${cardAttack} </td>
                        <td class="iconcell agi3"> <img class="icon"
                            src="./resources/icons/shield-svgrepo-com.svg"> ${cardDef} </td>
                        <td class="iconcell cha3"> <img class="icon"
                            src="./resources/icons/health-care-svgrepo-com.svg"> ${cardHealth} </td>
                        <td class="iconcell cha3"> <img class="icon"
                            src="./resources/icons/death-svgrepo-com.svg"> ${cardDeathDam} </td>
                    </tr>
                </tbody>
            </table>
            <div class="texte333"></div>
            <div class="ambiance"> test creature card </div>
        </div>
    </div>
        `;
    return playingCard
}