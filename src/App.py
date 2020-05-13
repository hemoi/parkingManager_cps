from flask import Flask
from flask_restful import reqparse, abort, Api, Resource, fields
from plate_recognizer import plateProcessor, plateRecongizer

app = Flask(__name__)
api = Api(app)

Users = {}

def abortIfNothing(userID):
    if userID not in Users:
        about(404, message="UserID {} doesn't exist".format(userID))

parser = reqparse.RequestParser()
parser.add_argument('Users', required=True)


class UserClass(Resource):
    def get(self, userID):
        abortIfNothing(userID)
        return Users[userID]

    def delete(self, userID):
        abortIfNothing(userID)
        del Users[userID]
        return '', 204

class UserList(Resource):
    def get(self):
        return Users


api.add_resource(UserClass, '/users/<userID>')
api.add_resource(UserList, '/users')

def generator(imgsrc, location):
    user = {}
    img = plateProcessor(imgsrc)
    userID = plateRecongizer(img)

    user['location'] = location

    Users[userID] = user




if __name__ == '__main__':
    app.run(debug=True)
