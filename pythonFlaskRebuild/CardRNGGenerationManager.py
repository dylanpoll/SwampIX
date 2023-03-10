import requests
import json
import random
import os
import json
from nameLists import NAME_PREFIXES,NAME_SUFFIXES,NAME_DECORATORS,WOMAN_NAMES,MENS_NAMES,UK_SURNAMES, RACES, ART_BACKGROUNDS

from dotenv import load_dotenv

class CardRNGGenerationManager():
    def __init__(self):
      self.DYLAN_OPENAI_API_KEY = str( os.getenv("DYLAN_OPENAI_API_KEY") )
      self.ORGANIZATION_ID_OPENAI = str( os.getenv("ORGANIZATION_ID_OPENAI") )
      self.HOST_URL = str( os.getenv("HOST_URL") )
      self.status = [
            "Flying", "Stealth", "Basic"
          ]
      self.reachCapabilities = [
            "Ranger", "Melee"
          ]
      self.activeAbilities = [
            "placeholder"
          ]
      self.passiveAbilities = [
            "placeholder"
          ]
      self.keyWords = [
            "placeholder"
          ]
      self.alignment = [
            "Holy", "Evil", "Lawful Neutral", "Neutral", "Lawful", "Chaotic", "Lawful Holy", "Chaotic Evil", "Chaotic Neutral", "Lawful Chaotic"
          ]
      self.gender = [
        "Woman","Man","Gender-Fluid"
      ]
      self.races = RACES
      self.name_prefixes = NAME_PREFIXES,
      self.name_suffixes = NAME_SUFFIXES
      self.name_decorators = NAME_DECORATORS
      self.woman_names = WOMAN_NAMES
      self.mens_names = MENS_NAMES
      self.uk_surnames = UK_SURNAMES

    def generateCardName(self):# payload will have the card attributes etc
      localNameOptionsList = []
      selectedRace = str(random.choice(self.races))
      gender = str(random.choice(self.gender)) # used to pick names that make sense.
      if gender == "Woman":
        localNameOptionsList = WOMAN_NAMES
      elif gender == "Man":
        localNameOptionsList = MENS_NAMES
      elif gender == "Gender-Fluid":
        localNameOptionsList = WOMAN_NAMES + MENS_NAMES

      totalNameItems = int( random.randint( 1, 4 ))
      resultingName = ''

      for nameChoise in range(0,totalNameItems):
        if nameChoise != totalNameItems:
          tempNamePortion = str(random.choice(localNameOptionsList))
          resultingName = resultingName + tempNamePortion + " "

        else: 
          tempLastNamePortion = str(random.choice(UK_SURNAMES))
          resultingName = resultingName + tempNamePortion  + " "
      fullName = resultingName + str( random.choice(NAME_DECORATORS) )
      print(fullName)
      return {"cardName": fullName, "race": selectedRace, "gender" : gender}

    def generateCardArt(self, prompt):
      cardArt = requests.request("POST", "https://api.openai.com/v1/images/generations", headers={ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + self.DYLAN_OPENAI_API_KEY } , data = json.dumps({ "prompt": str(prompt), "n": 1, "size": "256x256" }) ).json()
      cardArtURL = str(cardArt['data'][0]['url'])
      # print(cardArtURL)
      return cardArtURL  # grabbing the url from the generation

    def generateDescription(self, content):    
      description = requests.request("POST", "https://api.openai.com/v1/chat/completions", headers={ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + self.DYLAN_OPENAI_API_KEY } , data = json.dumps({ "model": "gpt-3.5-turbo", "messages": [{"role": "user", "content": str(content) }]}) ).json()
      returnedDescription = str(description['choices'][0]['message']['content'])
      # print(returnedDescription)
      return returnedDescription # grabbing the url from the generation

    def createMinion(self):# payload will have the card attributes etc
      nameGenderAndRace = self.generateCardName()
      # prompt =  str(nameAndRace['cardName']) + " the " + str(nameAndRace['race'])
      # cardArt = self.generateCardArt(prompt)
      attributeList = [ "attack",  "defence", "health", ]
      cardAttributes = {
                "cardName": str(nameGenderAndRace['cardName']),
                # "cardArt": str(cardArt),
                "cardArt": "",
                "attack": 0,
                "defence": 0,
                "deathDamage": 0,
                "health": 0,
                "castingCost": 0,
                "alignment": str(random.choice(self.alignment)),
                "sacrificeValue":  0,
                "race":  [str(nameGenderAndRace['race'])],
                "status":  [str(random.choice(self.status))],
                "reachCapabilities":  [str(random.choice(self.reachCapabilities))],
                "activeAbilities": [str(random.choice(self.activeAbilities))],
                "passiveAbilities":  [str(random.choice(self.passiveAbilities))],
                "keyWords":  [str(random.choice(self.keyWords))],
                "description": "" 
      }
      descriptionContent = "Give me a short description for a fictional "  + str(cardAttributes["race"])[2:len(str(cardAttributes["race"]))-2] + " who identifies as a " + str(nameGenderAndRace['gender']) + " with " + str(cardAttributes["alignment"]) + " tendencies who's name is " + str(cardAttributes["cardName"])
      # print(descriptionContent)
      cardAttributes["description"] = self.generateDescription(descriptionContent)
      # cardAttributes["cardArt"]  = self.generateCardArt( prompt = str(cardAttributes["description"]))

      prompt = "Generate fantasy art from the following prompt but inside a " + str(random.choice(ART_BACKGROUNDS)) + " . the prompt is : " + str(cardAttributes["description"])
      print(prompt)
      img_data = requests.get(self.generateCardArt( prompt = prompt)).content #locally saving the image... will update code to use locally stored image links as openAI deletes theirs.
      cardArtFileSaveNAme = str(nameGenderAndRace['cardName']).replace(" ", "-") +'.png'
      savedFilePath = os.path.join("./cardArt/" + cardArtFileSaveNAme)
      cardAttributes["cardArt"]  = self.HOST_URL + "/cardArt/" + cardArtFileSaveNAme
      # print("saving card image at : " + str(cardAttributes["cardArt"]))
      with open(savedFilePath, 'wb') as handler:
        handler.write(img_data)

      totalStatDistributionPool = None
      castingCostPossibleValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      rarityWeights = [0.05, 0.2, 0.3, 0.2, 0.15, 0.15, 0.15, 0.1, 0.1, 0.05] #order aligns with casting values list and assigns probability for those casting values.
      castingCost = random.choices(population = castingCostPossibleValues, weights = rarityWeights) # for info on probability weights for options : https://docs.python.org/3.6/library/random.html#random.choices
      # print(str(type(castingCost)) + str(castingCost))
      castingCost = int(str(castingCost)[1:-1])
      health = 1 # assigning 1 here and removing the required stat from the pool below.
      if castingCost == 0:
        totalStatDistributionPool = 2
        cardAttributes["deathDamage"] = 2
        cardAttributes["sacrificeValue"] = 0
      else:
        totalStatDistributionPool = ( 2 + (castingCost * 2 ) )
        cardAttributes["deathDamage"] = ( castingCost + 2 )
        if ( castingCost / 2 ) <= 1:
          sacrificeValue = 1
        else :
          sacrificeValue = ( castingCost / 2 )
        cardAttributes["sacrificeValue"] = int(sacrificeValue)
        cardAttributes["castingCost"] = int(castingCost)

      for stat in range(totalStatDistributionPool):
        incriminatedAttribute = str(random.choice(attributeList))
        cardAttributes[incriminatedAttribute] = int(cardAttributes[incriminatedAttribute]) + 1
        totalStatDistributionPool = totalStatDistributionPool -1
      # print(str(cardAttributes))
      return cardAttributes

    def createMonarch(self):# payload will have the card attributes etc
      nameGenderAndRace = self.generateCardName()      
      prompt =  str(nameGenderAndRace['cardName']) + " the " + str(nameGenderAndRace['race'])
      cardArt = self.generateCardArt(prompt)
      cardAttributes = {
                "cardName": str(nameGenderAndRace['cardName']),
                "cardArt": str(cardArt),
                "health": 40,
                "alignment": str(random.choice(self.alignment)),
                "race":  [str(nameGenderAndRace['race'])],
                "status":  [str(random.choice(self.status))],
                "activeAbilities": [str(random.choice(self.activeAbilities))],
                "passiveAbilities":  [str(random.choice(self.passiveAbilities))],
                "keyWords":  [str(random.choice(self.keyWords))],
                "description": "" 
      }
      descriptionContent = "Give me a short description for a fictional "  + str(cardAttributes["race"])[2:len(str(cardAttributes["race"]))-2] + " who identifies as a " + str(nameGenderAndRace['gender']) + " with " + str(cardAttributes["alignment"]) + " tendencies who's name is " + str(cardAttributes["cardName"])
      print(descriptionContent)
      cardAttributes["description"] = self.generateDescription(descriptionContent)
      return cardAttributes

    
    
      # for name in range(len(self.nameEndpoints))
      #   result = databases.create_document(self.DATABASE_ID, self.MONARCH_COLLECTION_ID, documentID, data = payload )
      #   print("completed card action. \n")
      #   print(str(result))            
      # nameAPIUsed = random.choice(self.nameEndpoints)
      # for name in self.nameEndpoints:
      #   cardName = requests.request("POST", styr(name), headers={ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DYLAN_OPENAI_API_KEY } , data = json.dumps({ "prompt": str( payload['cardName'] ), "n": 1, "size": "256x256" }) ).json()
      #   payload['cardArt'] = cardArt['data'][0]['url'] # grabbing the url from the generation