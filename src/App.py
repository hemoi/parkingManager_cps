from flask import Flask
from flask_restful import reqparse, abort, Api, Resource

app = Flask(__name__)
api = Api(app)

users = {}

def abortIfNothing(userID):
    if userID not in users:
        about(404, message="UserID {} doesn't exist".format(userID))

parser = reqparse.RequestParser()
parser.add_argument('users')

class Users(Resource):
    def get(self, userId):
        abortIfNothing(userID)
        return users[userId]

    def delete(self, userID):
        abortIfNothing(userID)
        del users[userID]
        return '', 204

    def put(self, userID):
        args = 