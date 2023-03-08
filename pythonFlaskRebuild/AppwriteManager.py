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

    def cleanResetCollectionDocuments(self, collectionID):# payload will have the documentID
      url = "https://appwrite.devdylan.us/v1/databases/" + self.DATABASE_ID + "/collections/" + collectionID + "/documents?queries[0]=limit(100)"
      print(url)
      jsonResponse = requests.request("GET", url, headers={'X-Appwrite-Project': str(self.PROJECT)} , data = {}).json()
      print(str(jsonResponse))
      totalDocuments = int(jsonResponse['total'])
      for document in range(0,totalDocuments-1):
        documentID = str(jsonResponse['documents'][document]['$id'])
        databases = Databases(self.CLIENT)
        print(str(document) + " Deleting documentID : " + documentID)
        result = databases.delete_document(self.DATABASE_ID, collectionID, documentID )
      return result