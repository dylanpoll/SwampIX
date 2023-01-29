async function getCardName() {
    let name = await fetch("https://swampix.devdylan.us/createCard/name", {
        "method": "GET",
    })     
    .then(response => response.text())
    .then(result => {
      console.log(result);
      return result
    })
    .catch(error => console.log('error', error));

    return name // returns the cards name
}


function createCardStats() {
    /*
        Card Attributes:
        attack -> damage dealt when attacking or defending
        defense -> used to ward off attack damage
        health -> overflow damage dealt lowers this value until death
        death damage -> when this creature dies, deals this much damage to the owning  player or player commanders health.
        distributionPoints -> randomly generated number to be randomly distributed between attack, defense, or health attributes
    */

    let castingCost = Math.floor(Math.random() * 5);    // between 0 and 4 inclusive
    let attack = Math.floor(Math.random() * 11);        // between 0 and 10 inclusive
    let defense = Math.floor(Math.random() * 11);       // between 0 and 10 inclusive
    let health = Math.floor(Math.random() * 6) + 5;     // between 5 and 10 inclusive
    let deathDamage = castingCost + 2;                  // equal to castingCost + 2
    let distribPoints = (6 * (castingCost + 1));        // equal to (6 * (castingCost + 1)), which is between 6 and 24 inclusive

    //Print out all attributes
    console.log("castingCost " + castingCost);
    console.log("attack " + attack);
    console.log("defense " + defense);
    console.log("health " + health);
    console.log("deathDamage " + deathDamage);
    console.log("distribPoints " + distribPoints);
    
    //Randomly add distrib points to either attack, defense, or health    
    let isComplete = 0;
    do{

        //generate random number between 1 and 3 to decide how many distrib points are going to get allocated
        let selectedDistribPoints = Math.floor(Math.random() * 3) + 1; //returns between 1 and 3
        console.log("The selected number of distrib points is: " + selectedDistribPoints);

        //check if decrement is going to create negative number, if so, do not decrement number and isComplete = 1
        if((distribPoints - selectedDistribPoints) < 0){
            console.log("Final distrib points: " + distribPoints);
            console.log("isComplete is true ");
            selectedDistribPoints = distribPoints;
            isComplete = 1; //we have completed our run
        }
        else{ //else decrement extracted points
            distribPoints = parseInt(distribPoints) - parseInt(selectedDistribPoints);
            console.log("Decremented distrib points: " + distribPoints);
        }


        //generate another random number between 1 and 3 to determine which attribute is going to be incremented
        let selectedAttribute = Math.floor(Math.random() * 3) + 1; //returns between 1 and 3

        console.log("The selected attribute is: " + selectedAttribute);

        //increment selected value
        if(selectedAttribute == 1){
            attack = parseInt(attack) + parseInt(selectedDistribPoints);
            console.log("attack is now: " + attack);
        }
        else if(selectedAttribute == 2){
            defense = parseInt(defense) + parseInt(selectedDistribPoints);
            console.log("defense is now: " + defense);
        }
        else{
            health = parseInt(health) + parseInt(selectedDistribPoints);
            console.log("health is now: " + health);
        }

    }while(isComplete != 1);

    console.log("Final Stats: ")
    console.log("castingCost " + castingCost);
    console.log("attack " + attack);
    console.log("defense " + defense);
    console.log("health " + health);
    console.log("deathDamage " + deathDamage);
    

    return {"castingCost": castingCost, "attack": attack, "defense": defense, "health": health, "deathDamage": deathDamage};
}

export { getCardName, createCardStats };