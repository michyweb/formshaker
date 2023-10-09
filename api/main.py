#!/usr/bin/python3

import json
import uvicorn
import os
import asyncio

from datetime import datetime
from bson.json_util import dumps
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, WebSocket, Depends, Response
from fastapi import Security
from fastapi.security.api_key import APIKeyHeader
from core.connector import *
from builder.constructor import download, get_file

app = FastAPI()
db = connector()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.environ['BACKEND_PASSWORD']
API_KEY_NAME = "Formshaker-ApiKey"

api_key_header_auth = APIKeyHeader(name=API_KEY_NAME, auto_error=True)

ws_clients = []

def get_ws_clients():
    return ws_clients

async def get_api_key(api_key_header: str = Security(api_key_header_auth)):
    if api_key_header != API_KEY:
        return "Invalid API Key"
    
async def _notifier(data, typeNotification, clients=Depends(get_ws_clients)):
    result = {
        "type": typeNotification,
        "data": data
    }
    await asyncio.wait([ws.send_text(dumps(result)) for ws in ws_clients])
    return {}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, clients=Depends(get_ws_clients)):
    await websocket.accept()
    ws_clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"{data}")
    finally:
        ws_clients.remove(websocket)

@app.get("/api/forms", dependencies=[Security(get_api_key)])
def Get_All_Forms():
    global db
    forms = db.get_all_forms()
    if forms != None:
        return json.loads(dumps(forms))


@app.post('/api/forms')
async def Forms(request: Request):
    global db
    data = await request.json()
    data['used'] = False
    data['inject'] = False
    data['originalInputs'] = data['inputs']
    inputs = data['inputs']

    lastArchive = db.last_archive_by_sessionID(data['sessionID'])
    if lastArchive != None:
        if data['executionID'] > lastArchive['executionID']:
            db.update_archive(lastArchive['_id'], data['executionID'])
    else:
        insertData = {
            "sessionID": data['sessionID'],
            "executionID": data['executionID']
        }
        db.create_archive(insertData)

    currentForm = db.get_last_form_by_sessionID(
        data['sessionID'], data['identifier'])
    if currentForm != None:
        data['_id'] = currentForm['_id']
        data['inputs'] = currentForm['inputs']
        data['creationDate'] = currentForm['creationDate']
        data['updatedDate'] = datetime.now()
        data['lastExecutionTime'] = currentForm['time']
        db.update_form(data, str(currentForm['_id']))
        await _notifier(data, "REPLACE_FORM")
    else:
        for index, originalInput in enumerate(inputs):
            inputs[index]['modified'] = False
        data['creationDate'] = datetime.now()
        data['inputs'] = inputs

        db.create_form(data)
        await _notifier(data, "APPEND_FORM")


    return json.loads(dumps(data))


@app.get("/api/forms/{sessionID}")
def Get_Forms_By_SessionID(sessionID: str):
    global db
    form = db.get_form_by_sessionID(sessionID)
    if form != None:
        data = form
        data['inject'] = False
        data['used'] = True
        db.check_form(data, data['_id'])
        return json.loads(dumps([form]))
    else:
        return json.loads(dumps([]))


@app.put('/api/forms/{formID}', dependencies=[Security(get_api_key)])
async def Update_Form(request: Request, formID: str):
    global db
    data = await request.json()
    form = db.get_form_by_formID(formID)
    result = form
    result['inputs'] = data['inputs']
    form = db.update_form(result, formID)
    # await _notifier(result, "REPLACE_FORM")
    return json.loads(dumps(data))


@app.post('/api/forms/{formID}/response')
async def Update_Form_Response(request: Request, formID: str):
    global db
    data = await request.json()
    db.update_form_response(data, formID)
    updatedForm = db.get_form_by_identifier(formID)
    print(updatedForm)
    await _notifier(updatedForm, "REPLACE_FORM")
    return json.loads(dumps(data))


@app.post('/api/forms/inject', dependencies=[Security(get_api_key)])
async def Update_Form_Inject(request: Request):
    global db
    data = await request.json()
    for x in data:
        db.update_form_inject(x['_id']['$oid'])
    return json.loads(dumps(""))


@app.get('/api/patterns', dependencies=[Security(get_api_key)])
def Get_Patterns():
    global db
    patterns = db.get_all_patterns()
    return json.loads(dumps(patterns))


@app.post('/api/patterns', dependencies=[Security(get_api_key)])
async def Create_Pattern(request: Request):
    global db
    data = await request.json()
    db.create_pattern(data)
    return json.loads(dumps(data))


@app.get('/api/patterns/client')
def Get_Patterns_Without_ID():
    global db
    patterns = db.get_all_patterns_without_id()
    blacklist = db.get_all_blacklist_without_id()
    seeds = db.get_all_seeds_without_id()
    injectasitgoes = db.get_status_inject()
    data = {
        "injectasitgoes": list(injectasitgoes)[0]['value'],
        "seeds": [x.get('value') for x in list(seeds)],
        "blacklist": [x.get('value') for x in list(blacklist)],
        "inputs": list(patterns)
    }
    return json.loads(dumps(data))


@app.post('/api/patterns/{patternId}', dependencies=[Security(get_api_key)])
async def Modify_Patterns(request: Request, patternId: str):
    global db
    data = await request.json()
    db.update_pattern(data, patternId)
    return json.loads(dumps(data))


@app.delete('/api/patterns/{patternId}', dependencies=[Security(get_api_key)])
def Delete_Pattern(patternId: str):
    global db
    db.delete_pattern(patternId)
    return json.loads(dumps(""))


@app.get('/api/seeds', dependencies=[Security(get_api_key)])
def Get_Seeds():
    global db
    patterns = db.get_all_seeds()
    return json.loads(dumps(patterns))


@app.post('/api/seeds', dependencies=[Security(get_api_key)])
async def Create_Seed(request: Request):
    global db
    data = await request.json()
    db.create_seed(data)
    return json.loads(dumps(data))


@app.delete('/api/seeds/{seedId}', dependencies=[Security(get_api_key)])
def Delete_Seed(seedId: str):
    global db
    db.delete_seed(seedId)
    return json.loads(dumps(""))


@app.get('/api/blacklist', dependencies=[Security(get_api_key)])
def Get_Blacklist():
    global db
    patterns = db.get_all_blacklist()
    return json.loads(dumps(patterns))


@app.post('/api/blacklist', dependencies=[Security(get_api_key)])
async def Create_Blacklist(request: Request):
    global db
    data = await request.json()
    db.create_blacklist(data)
    return json.loads(dumps(data))


@app.delete('/api/blacklist/{blacklistId}', dependencies=[Security(get_api_key)])
def Delete_Blacklist(blacklistId: str):
    global db
    db.delete_blacklist(blacklistId)
    return json.loads(dumps(""))


@app.get('/api/inject', dependencies=[Security(get_api_key)])
def Get_Inject():
    global db
    injectasitgoes = list(db.get_status_inject())
    status = injectasitgoes[0]['value'],
    return status

@app.get('/api/agent.js')
def Agent_Downloading(mode: str = "", minify: bool = False, obfuscated: bool = False, limit: int = 30, url: str = "http://localhost:4040"):
    if mode == "":
        agent = get_file()
        return Response(content=agent, media_type="application/javascript")
    else:
        agent = download(mode, minify, obfuscated, url, limit)
        return Response(content=agent, media_type="application/javascript")

@app.post('/api/inject', dependencies=[Security(get_api_key)])
async def Modify_Inject(request: Request):
    global db
    injectasitgoes = db.get_status_inject()
    result = list(injectasitgoes)
    if len(result) > 0 and result[0]['value'] == True:
        db.modify_inject(result[0]['_id'], False)
    else:
        db.modify_inject(result[0]['_id'], True)
    return json.loads(dumps([]))

def run():   
    uvicorn.run("main:app", host="0.0.0.0", port=4040, reload=True)

if __name__ == '__main__':
    run()