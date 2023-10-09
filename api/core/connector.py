#!/usr/bin/python3

import pymongo
from bson.objectid import ObjectId

class connector:
    def __init__(self):
        address="mongodb://mongo:27017"
        client = self._connect(address)
        if client:
            self.mydb = client.formshaker

    def get_form_by_sessionID(self, sessionID):
        try:
            mycol = self.mydb["forms"]
            return mycol.find_one({"sessionID": sessionID, "inject": True})
        except Exception:
            print("forms collection unavailable - get_form_by_sessionID")
            pass
        return None

    def get_last_form_by_sessionID(self, sessionID, identifier):
        try:
            mycol = self.mydb["forms"]
            return mycol.find_one({"sessionID": sessionID, "identifier": identifier})
        except Exception:
            print("forms collection unavailable - get_last_form_by_sessionID")
            pass
        return None

    def get_form_by_formID(self, formID):
        try:
            forms = self.mydb["forms"]
            return forms.find_one({"_id": ObjectId(formID) })
        except Exception:
            print("forms collection unavailable - get_form_by_formID")
            pass
        return None

    def get_form_by_identifier(self, formID):  
        try:
            forms = self.mydb["forms"]
            return forms.find_one({"identifier": formID })
        except Exception:
            print("forms collection unavailable - get_form_by_identifier")
            pass
        return None

    def create_form(self, data):
        try:
            mycol = self.mydb["forms"]
            return mycol.insert_one(data)
        except Exception:
            print("forms collection unavailable - create_form")
            pass
        return None

    def update_form(self, data, formID):
        try:
            mycol = self.mydb["forms"]
            return mycol.update_one({ "_id": ObjectId(formID) }, {"$set":data})
        except Exception as e:
            print("forms collection unavailable - update_form")
            pass
        return None

    def check_form(self, data, formID):
        try:
            mycol = self.mydb["forms"]
            return mycol.update_one({ "_id": ObjectId(formID) },{"$set":{
                "inject": data['inject'],
                "used": data['used']
                }})
        except Exception as e:
            print("forms collection unavailable - check_form")
            pass
        return None

    def update_form_inject(self, formID):
        try:
            mycol = self.mydb["forms"]
            return mycol.update_one({ "_id": ObjectId(formID) },{"$set":{
                "inject": True
                }})
        except Exception:
            print("forms collection unavailable - update_form_inject")
            pass
        return None

    def update_form_response(self, data, formID):
        try:
            mycol = self.mydb["forms"]
            return mycol.update({ "identifier": formID },{"$set":{
                "HttpStatusCode": data['HttpStatusCode'],
                "Attempt": data['Attempt'],
                "executionID": data['executionID']
                }}, upsert=True)
        except Exception:
            print("forms collection unavailable - update_form_response")
            pass
        return None

    def get_all_forms(self):
        try:
            mycol = self.mydb["forms"]
            query = [
                {
                    "$lookup": {
                        "from": 'archive',
                        "localField": 'sessionID',
                        "foreignField": 'sessionID',
                        "as": 'colour'
                    }
                },
                { "$unwind": "$colour" },
                {
                    "$addFields": {
                        "colour": {
                            "$cond": {
                                "if": { "$eq": [ "$colour.executionID", "$executionID" ] },
                                "then": "white",
                                "else": "gray"
                            }
                        }
                    }
                }
            ]
            return mycol.aggregate(query)
        except Exception:
            print("forms collection unavailable - get_all_forms")
            pass
        return None    

    def get_all_patterns(self):
        try:
            mycol = self.mydb["patterns"]
            return mycol.find({})
        except Exception:
            print("patterns collection unavailable - get_all_patterns")
            pass
        return None

    def get_all_patterns_without_id(self):
        try:
            mycol = self.mydb["patterns"]
            return mycol.find({}, {'_id': False})
        except Exception:
            print("patterns collection unavailable - get_all_patterns_without_id")
            pass
        return None

    def get_all_blacklist_without_id(self):
        try:
            mycol = self.mydb["blacklist"]
            return mycol.find({}, {'_id': False})
        except Exception:
            print("blacklist collection unavailable - get_all_blacklist_without_id")
            pass
        return None

    def get_all_seeds_without_id(self):
        try:
            mycol = self.mydb["seeds"]
            return mycol.find({}, {'_id': False})
        except Exception:
            print("seeds collection unavailable - get_all_seeds_without_id")
            pass
        return None    

    def create_pattern(self, data):
        try:
            mycol = self.mydb["patterns"]
            return mycol.insert_one(data)
        except Exception:
            print("patterns collection unavailable - create_pattern")
            pass
        return None
    
    def update_pattern(self, data, patternID):
        try:
            mycol = self.mydb["patterns"]
            return mycol.update_one({ "_id": ObjectId(patternID) },{"$set":{
                "name": data['name'],
                "value": data['value']
                }})
        except Exception:
            print("patterns collection unavailable - update_pattern")
            pass
        return None

    def delete_pattern(self, patternID):
        try:
            mycol = self.mydb["patterns"]
            return mycol.delete_one({"_id": ObjectId(patternID)})
        except Exception:
            print("patterns collection unavailable - delete_pattern")
            pass
        return None

    def last_archive_by_sessionID(self, sessionID):
        try:
            mycol = self.mydb["archive"]
            return mycol.find_one({"sessionID": sessionID})
        except Exception:
            print("archive collection unavailable - last_archive_by_sessionID")
            pass
        return None

    def create_archive(self, data):
        try:
            mycol = self.mydb["archive"]
            print(data)
            return mycol.insert_one(data)
        except Exception  as e: 
            print(e)
            print("archive collection unavailable - create_archive")
            pass
        return None
    
    def update_archive(self, archiveID, executionID):
        try:
            mycol = self.mydb["archive"]
            return mycol.update_one({ "_id": archiveID },{"$set":{
                "executionID": executionID
                }})
        except Exception:
            print("archive collection unavailable - update_archive")
            pass
        return None

    def get_all_seeds(self):
        try:
            mycol = self.mydb["seeds"]
            return mycol.find({})
        except Exception:
            print("seeds collection unavailable - get_all_seeds")
            pass
        return None    

    def create_seed(self, data):
        try:
            mycol = self.mydb["seeds"]
            return mycol.insert_one(data)
        except Exception:
            print("seeds collection unavailable - create_seed")
            pass
        return None

    def delete_seed(self, seedID):
        try:
            mycol = self.mydb["seeds"]
            return mycol.delete_one({"_id": ObjectId(seedID)})
        except Exception:
            print("seeds collection unavailable - delete_seed")
            pass
        return None

    def get_all_blacklist(self):
        try:
            mycol = self.mydb["blacklist"]
            return mycol.find({})
        except Exception:
            print("blacklist collection unavailable - get_all_blacklist")
            pass
        return None    

    def create_blacklist(self, data):
        try:
            mycol = self.mydb["blacklist"]
            return mycol.insert_one(data)
        except Exception:
            print("blacklist collection unavailable - create_blacklist")
            pass
        return None

    def delete_blacklist(self, blacklistId):
        try:
            mycol = self.mydb["blacklist"]
            return mycol.delete_one({"_id": ObjectId(blacklistId)})
        except Exception:
            print("blacklist collection unavailable - delete_blacklist")
            pass
        return None

    def get_status_inject(self):
        try:
            mycol = self.mydb["injectasitgoes"]
            return mycol.find({})
        except Exception:
            print("injectasitgoes collection unavailable - get_status_inject")
            pass
        return None

    def modify_inject(self, injectID, newStatus):
        try:
            mycol = self.mydb["injectasitgoes"]
            return mycol.update_one({ "_id": ObjectId(injectID) },{"$set":{
                "value": newStatus
                }})
        except Exception:
            print("injectasitgoes collection unavailable - modify_inject")
            pass
        return None

    def _connect(self, address):
            client = pymongo.MongoClient(address)
            try:
                client.server_info()
            except pymongo.errors.ServerSelectionTimeoutError as e:
                client = None
            return client