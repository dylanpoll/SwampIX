import os
from pathlib import Path
from dotenv import load_dotenv
import requests
import json

from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.id import ID

class AppwriteManager():
    def __init__(self):
      load_dotenv()
      self.ENDPOINT = str( os.getenv("ENDPOINT") )
      self.PROJECT  = str( os.getenv("PROJECTID") )
      self.KEY = str( os.getenv("KEY") )
      self.DATABASE_ID = str( os.getenv("DATABASEID") )
      self.MINION_COLLECTIONID = str( os.getenv("MINION_COLLECTION_ID") )
      self.MONARCH_COLLECTION_ID = str( os.getenv("MONARCH_COLLECTION_ID") )
      client = Client()
      (client
          .set_endpoint(self.ENDPOINT) # Your API Endpoint
          .set_project(self.PROJECT) # Your project ID
          .set_key(self.KEY) # Your secret API key
      )
      self.CLIENT = client
      self.HOST_URL = str( os.getenv("HOST_URL") )
      print("initialized appwrite client... \n")

# Minion cards--------
    def createMinionCardDocument(self, payload):# payload will have the card attributes etc
      databases = Databases(self.CLIENT)
      documentID = ID.unique()
      result = databases.create_document(self.DATABASE_ID, self.MINION_COLLECTIONID, documentID , data = payload )
      print("completed card action. \n")
      # print(str(result))
      return result

    def getMinionCardDocuments(self):
      databases = Databases(self.CLIENT)
      # queries = 100
      # result = databases.list_documents(self.DATABASE_ID, self.MINION_COLLECTIONID, [ Query.equal('limit', '100') ] )
      result = databases.list_documents(self.DATABASE_ID, self.MINION_COLLECTIONID)
      print("completed card action. \n")
      # print(str(result))
      return result

    def getSingleMinionCardDocument(self, payload): # payload will have the documentID
      databases = Databases(self.CLIENT)
      result = databases.get_document(self.DATABASE_ID,self.MINION_COLLECTIONID, str(payload))
      print("completed card action. \n")
      # print(str(result))
      return result

# Monarch cards--------
    def createMonarchCardDocument(self, payload):# payload will have the card attributes etc
      databases = Databases(self.CLIENT)
      documentID = ID.unique()
      result = databases.create_document(self.DATABASE_ID, self.MONARCH_COLLECTION_ID, documentID, data = payload )
      print("completed card action. \n")
      # print(str(result))
      return result

    def getMonarchCardDocuments(self):
      databases = Databases(self.CLIENT)
      result = databases.list_documents(self.DATABASE_ID, self.MONARCH_COLLECTION_ID)
      print("completed card action. \n")
      # print(str(result))
      return result

    def getSingleMonarchCardDocument(self, payload):# payload will have the documentID
      databases = Databases(self.CLIENT)
      result = databases.get_document(self.DATABASE_ID, self.MONARCH_COLLECTION_ID, str(payload) )
      print("completed card action. \n")
      # print(str(result))
      return result

# end cards--------

    def updateCardArtURLAttributes(self, collectionID):# payload will have the documentID
      url = "https://appwrite.devdylan.us/v1/databases/" + self.DATABASE_ID + "/collections/" + collectionID + "/documents?queries[0]=limit(100)"
      print(url)
      jsonResponse = requests.request("GET", url, headers={'X-Appwrite-Project': str(self.PROJECT)} , data = {}).json()
      print("\n jsonResponse : \n" + str(jsonResponse) + "\n \n \n")
      cardArtURLList = []
      totalDocuments = int(jsonResponse['total'])
      for index in range(0,totalDocuments):
        documentID = str(jsonResponse['documents'][index]['$id'])
        cardName = str(jsonResponse['documents'][index]['cardName'])
        databases = Databases(self.CLIENT)
        cardArtFileSaveName = str(jsonResponse['documents'][index]['cardName']).replace(" ", "-") +'.png'
        cardArtURL = self.HOST_URL + "/cardArt/" + cardArtFileSaveName
        # print("updating " + str(jsonResponse['documents'][index]['cardName']) + "'s cardArt URL to : " + cardArtURL + " \n ")
        cardArtURLList.append({ "documentID" : str(documentID), "cardName" : str(cardName), "cardURL" : str(cardArtURL) })
        result = databases.update_document( self.DATABASE_ID, collectionID, documentID, data ={ "cardArt" : str(cardArtURL) } )
      return cardArtURLList

    def getAllCardArtURLAttributes(self, collectionID):# payload will have the documentID
      url = "https://appwrite.devdylan.us/v1/databases/" + self.DATABASE_ID + "/collections/" + collectionID + "/documents?queries[0]=limit(100)"
      print(url)
      jsonResponse = requests.request("GET", url, headers={'X-Appwrite-Project': str(self.PROJECT)} , data = {}).json()
      cardArtURLList = []
      # print(str(jsonResponse) + "\n \n \n")
      totalDocuments = int(jsonResponse['total'])
      for index in range(0,totalDocuments):
        # print(index)
        documentID = str(jsonResponse['documents'][index]['$id'])
        cardName = str(jsonResponse['documents'][index]['cardName'])
        cardURL = str(jsonResponse['documents'][index]['cardArt'])
        description = str(jsonResponse['documents'][index]['description'])
        # print( documentID + " cardName : " + cardName + " | cardURL : " + cardURL)
        cardArtURLList.append({ "documentID" : str(documentID), "cardName" : str(cardName), "description" : str(description),  "cardURL" : str(cardURL) })
      return cardArtURLList
      
    def cleanResetCollectionDocuments(self, collectionID):# payload will have the documentID
      url = "https://appwrite.devdylan.us/v1/databases/" + self.DATABASE_ID + "/collections/" + collectionID + "/documents?queries[0]=limit(100)"
      print(url)
      jsonResponse = requests.request("GET", url, headers={'X-Appwrite-Project': str(self.PROJECT)} , data = {}).json()
      deletedDocuments = []
      print(str(jsonResponse))
      totalDocuments = int(jsonResponse['total'])
      for document in range(0,totalDocuments):
        documentID = str(jsonResponse['documents'][document]['$id'])
        databases = Databases(self.CLIENT)
        print(str(document) + " Deleting documentID : " + documentID)
        result = databases.delete_document(self.DATABASE_ID, collectionID, documentID )
        deletedDocuments.append({ "documentID" : str(documentID) })
      return deletedDocuments
    
    def deleteSingleCardByCollectionAndDocID(self, collectionID, documentID):# payload will have the documentID
      databases = Databases(self.CLIENT)
      result = databases.delete_document(self.DATABASE_ID, collectionID, documentID )
      return { "deleted documentID" : str(documentID) }
      
    def getAllCardData(self, collectionID):# payload will have the documentID
      url = "https://appwrite.devdylan.us/v1/databases/" + self.DATABASE_ID + "/collections/" + collectionID + "/documents?queries[0]=limit(100)"
      print(url)
      jsonResponse = requests.request("GET", url, headers={'X-Appwrite-Project': str(self.PROJECT)} , data = {}).json()
      cardArtURLList = []
      # print(str(jsonResponse) + "\n \n \n")
      totalDocuments = int(jsonResponse['total'])
      for index in range(0,totalDocuments):
        # print(index)
        documentID = str(jsonResponse['documents'][index]['$id'])
        cardName = str(jsonResponse['documents'][index]['cardName'])

        alignment = str(jsonResponse['documents'][index]['alignment'])
        race = str(jsonResponse['documents'][index]['race'])
        status = str(jsonResponse['documents'][index]['status'])
        keyWords = str(jsonResponse['documents'][index]['keyWords'])

        castingCost = int(jsonResponse['documents'][index]['castingCost'])
        deathDamage = int(jsonResponse['documents'][index]['deathDamage'])
        sacrificeValue = int(jsonResponse['documents'][index]['sacrificeValue'])
        attack = int(jsonResponse['documents'][index]['attack'])
        defence = int(jsonResponse['documents'][index]['defence'])
        health = int(jsonResponse['documents'][index]['health'])

        reachCapabilities = str(jsonResponse['documents'][index]['reachCapabilities'])
        activeAbilities = str(jsonResponse['documents'][index]['activeAbilities'])
        passiveAbilities = str(jsonResponse['documents'][index]['passiveAbilities'])

        description = str(jsonResponse['documents'][index]['description'])
        cardArt = str(jsonResponse['documents'][index]['cardArt'])

        cardArtURLList.append({ 
          "documentID" : str(documentID), 
          "cardName" : str(cardName), 
          "alignment" : str( alignment ) , 
          "race" : str( race ), 
          "status" : str( status ), 
          "keyWords" : str( keyWords ), 
          "castingCost" : int( castingCost ), 
          "deathDamage" : int( deathDamage ), 
          "sacrificeValue" : int( sacrificeValue ), 
          "attack" : int( attack ), 
          "defence" : int( defence ), 
          "health" : int( health ), 
          "reachCapabilities" : str( reachCapabilities ), 
          "activeAbilities" : str( activeAbilities ), 
          "passiveAbilities" : str( passiveAbilities ),
          "description" : str(description), 
          "cardArt" : str(cardArt)
          })
      return cardArtURLList

    def getAllMonarchCardData(self, collectionID):# payload will have the documentID
      url = "https://appwrite.devdylan.us/v1/databases/" + self.DATABASE_ID + "/collections/" + collectionID + "/documents?queries[0]=limit(100)"
      print(url)
      jsonResponse = requests.request("GET", url, headers={'X-Appwrite-Project': str(self.PROJECT)} , data = {}).json()
      cardArtURLList = []
      # print(str(jsonResponse) + "\n \n \n")
      totalDocuments = int(jsonResponse['total'])
      for index in range(0,totalDocuments):
        # print(index)
        documentID = str(jsonResponse['documents'][index]['$id'])
        cardName = str(jsonResponse['documents'][index]['cardName'])

        alignment = str(jsonResponse['documents'][index]['alignment'])
        race = str(jsonResponse['documents'][index]['race'])
        status = str(jsonResponse['documents'][index]['status'])
        keyWords = str(jsonResponse['documents'][index]['keyWords'])

        health = int(jsonResponse['documents'][index]['health'])

        activeAbilities = str(jsonResponse['documents'][index]['activeAbilities'])
        passiveAbilities = str(jsonResponse['documents'][index]['passiveAbilities'])

        description = str(jsonResponse['documents'][index]['description'])
        cardArt = str(jsonResponse['documents'][index]['cardArt'])

        cardArtURLList.append({ 
          "documentID" : str(documentID), 
          "cardName" : str(cardName), 
          "alignment" : str( alignment ) , 
          "race" : str( race ), 
          "status" : str( status ), 
          "keyWords" : str( keyWords ),  
          "health" : int( health ), 
          "activeAbilities" : str( activeAbilities ), 
          "passiveAbilities" : str( passiveAbilities ),
          "description" : str(description), 
          "cardArt" : str(cardArt)
          })
      return cardArtURLList