from flask import Flask
from flask_restful import reqparse, abort, Api, Resource, fields
from plate_recognizer import plateProcessor, plateRecongizer
from web3py import BUser
from web3 import Web3
from flask_cors import CORS, cross_origin


### flask setting

app = Flask(__name__)
api = Api(app)

# User's accounts
Users = {}

# Parking Users
parkingUsers = []



def abortIfNothing(userID):
    if userID not in parkingUsers:
        about(404, message="UserID {} doesn't exist".format(userID))

parser = reqparse.RequestParser()
parser.add_argument('users',required=True)


### ganache setting

ether = 1000000000000000000

ganache_url = "HTTP://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))
print(web3.isConnected())

class User(BUser):
    def setID(self, id):
        self.id = id

class ParkingUser(User):
    def __init__(self, User):
        self.userID = User.id
    
    def setLocation(self, location):
        self.userLocation = location

    def getInfo(self):
        tmp = {}
        tmp["userID"] = self.userID
        tmp["userLoaction"] = self.userLocation
        return tmp

user1 = User("0xFdB2677A8614f3D93b43e41e752b7D3E4060c724", "0e7c2dbf267835791323991fd0431fc753a8fe1f8210d52ba147179c73d1dbe1")
user2 = User("0x6f1986D51c8b126166c96A0f5bE2D1673e2E5760", "5407241a9295428ee05d4a8e8f8212689da36dadbdad40e0d6d06db5024a0207")
user3 = User("0x92883fa00eeb8E94D5c1b5118eA5594c173FF7cf", "a1eca58e0e587374e99f06ed4b554f34fd414d376c6620d52554274e7de7511e")
owner = User("0xE8e885972130F1810B356F5e56b56f17306B7346", "1041dfc41acfd41d6ca19a1c98b39114a34cc6728813c6d7c3de9a600e270af9")

user1.setID('user1')
user2.setID('user2')
user3.setID('user3')

Users[user1.id] = user1
Users[user2.id] = user2
Users[user3.id] = user3

parking1 = ParkingUser(user1)
parking1.setLocation('1A')
parkingUsers.append(parking1.getInfo())

parking2 = ParkingUser(user1)
parking2.setLocation('1B')
parkingUsers.append(parking2.getInfo())

class UserClass(Resource):
    def get(self, userID):
        abortIfNothing(userID)
        return parkingUsers[userID]

    def delete(self, userID):
        abortIfNothing(userID)
        
        # args = parser.parse_args()
        # time = args['time']

        # make transaction to owner
        # for test parking fee is 2 ether
        tx = Users[userID].makeTransaction(2)
        User.sendTransaction(tx)

        # del parkingUsers[userID]
        return '', 204

    # for test
    def put(self, userID):
        user = {'location' : 'somewhere'}
        parkingUsers[userID] = user
        return user, 201

class UserList(Resource):
    def get(self):
        return parkingUsers


api.add_resource(UserClass, '/users/<userID>')
api.add_resource(UserList, '/users')


def evtListener(imgsrc, location):
    img = plateProcessor(imgsrc)
    userID = plateRecongizer(img)

    user['location'] = location
    ParkingUsers[userID] = user


if __name__ == '__main__':
    CORS(app)
    app.run(debug=True)
