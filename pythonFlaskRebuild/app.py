import os
import json
from pathlib import Path
from dotenv import load_dotenv

from flask import Flask, jsonify, request

from AppwriteManager import AppwriteManager
from CardRNGGenerationManager import CardRNGGenerationManager

load_dotenv()
appwriterUtil = AppwriteManager()
cardGenerationUtil = CardRNGGenerationManager()
app = Flask(__name__)

PORT = int( os.getenv("PORT") )
HOST = str( os.getenv("HOST") )
DYLAN_OPENAI_API_KEY = str( os.getenv("DYLAN_OPENAI_API_KEY") )
ORGANIZATION_ID_OPENAI = str( os.getenv("ORGANIZATION_ID_OPENAI") )

@app.route('/test/<uuid>', methods=['POST'])  # EXAMPLE CODE https://stackoverflow.com/questions/43218413/get-data-json-in-flask
def testEcho(uuid):
    content = request.get_json(silent=False) # silent means if it fails or not silently.
    response = str( uuid ) + " \n \n" + str( content )
    print(content) # Do your processing
    return response


@app.route("/getAllMinionCards" , methods = ['GET'])
def getAllMinionCards():
    response = appwriterUtil.getMinionCardDocuments()
    return response

@app.route("/createMonarch" , methods = ['GET'])
def createMonarch():
    payload = cardGenerationUtil.createMonarch()
    response = appwriterUtil.createMonarchCardDocument(payload)
    return response

# @app.route("/getMonarch")
# def hello_world():
#     return "<p>Hello, World!</p>"

@app.route("/createMinion" , methods = ['get'])
def createMinion():
    # payload = request.get_json(silent=False) # silent means if it fails or not silently.
    # if not payload: 
    #     return { "Error" : " failed to pass a payload."}
    payload = cardGenerationUtil.createMinion()
    response = appwriterUtil.createMinionCardDocument(payload)
    return response

@app.route("/cleanCollection/<collectionID>" , methods = ['get'])
def cleanCollection(collectionID):
    collectionID = str(collectionID)
    response = appwriterUtil.cleanResetCollectionDocuments(collectionID)
    return response

# @app.route("/getMinion")
# def hello_world():
#     return "<p>Hello, World!</p>"


if __name__ == '__main__':
    app.run(host=HOST, port=PORT, debug=True)

    # openai.organization = "org-o6qA7OG1FMPpp0oAFX37RUns"
    # openai.api_key = os.getenv("OPENAI_API_KEY")

# @app.route('/api/add_message/<uuid>', methods=['GET', 'POST'])  # https://stackoverflow.com/questions/20001229/how-to-get-posted-json-in-flask
# def add_message(uuid):
#     content = request.get_json(silent=True)
#     # print(content) # Do your processing
#     return uuid

    
    # payload = request.get_json(silent=False) # silent means if it fails or not silently.
    # if not payload: 
    #     return { "Error" : " failed to pass a payload."}
    # cardArt = requests.request("POST", "https://appenai.com/v1/images/generations", headers={ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DYLAN_OPENAI_API_KEY } , data = json.dumps({ "prompt": str( payload['cardName'] ), "n": 1, "size": "256x256" }) ).json()
    # payload['cardArt'] = cardArt['data'][0]['url'] # grabbing the url from the generation

    # response = appwriterUtil.createMonarchCardDocument(payload)
    # return responsei.o