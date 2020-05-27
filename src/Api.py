from flask import Flask
from flask_restful import reqparse, abort, Api, Resource, fields
from plate_recognizer import plateProcessor, plateRecongizer
from web3py import Wallet
from web3 import Web3
from flask_cors import CORS, cross_origin
from datetime import datetime
import evtListener
from watchdog.events import FileSystemEventHandler
import threading
from multiprocessing import Process, Queue

### flask setting
app = Flask(__name__)
api = Api(app)

### User's info
Users = {}

### Parking Users' info
parkingUsers = {}


# for error handling
def abortIfNothing(userID):
    if userID not in parkingUsers:
        abort(404, message="UserID {} doesn't exist".format(userID))

# calculate FEE
def timeCalculator(enterTime):
    deltaTime = enterTime - datetime.now()
    seconds = deltaTime.seconds
    seconds += deltaTime.minute * 60
    seconds += deltaTime.hour * 60 * 60

    return seconds


parser = reqparse.RequestParser()
parser.add_argument('users',required=True)

# match User to Wallet
class User(Wallet):
    def setID(self, id):
        self.id = id

# Users who park their cars
class ParkingUser():
    def __init__(self, User, location):
        self.user = User
        self.userLocation = location
        self.enterTime = datetime.now()
    
    def getInfo(self):
        tmp = {}
        tmp["userID"] = self.user.id
        tmp["userLocation"] = self.userLocation
        tmp["enterTime"] = self.enterTime.isoformat()

        return tmp


### set Dummy DATA for testing
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

parking1 = ParkingUser(user1,'1A')
parkingUsers[parking1.user.id] = parking1.getInfo()

parking2 = ParkingUser(user2,'1B')
parkingUsers[parking2.user.id] = parking2.getInfo()

### FLASK
class UserClass(Resource):
    ## GET
    def get(self, userID):
        abortIfNothing(userID)
        return parkingUsers[userID]
    
    ## DELETE
    ## caculating, and paying money with their wallet
    @cross_origin()
    def delete(self, userID):
        abortIfNothing(userID)
        
        ## make transaction to owner
        ## parking fee is 0.01 ether * seconds (for testing)
        enterTime = parkingUsers[userID]['enterTime']
        tToSeconds = timeCalculator(enterTime)
        tx = Users[userID].makeTransaction(tToSeconds)
        User.sendTransaction(tx)

        # del parkingUsers[userID]
        return '', 204


### return all parkingUsers List
class UserList(Resource):
    def get(self):
        return parkingUsers

api.add_resource(UserClass, '/users/<userID>')
api.add_resource(UserList, '/users')


## event Listener
## 아직 미완 
class myHandler(FileSystemEventHandler):

    def on_created(self, event):
        img = event.src_path
        img = plateProcessor(img)

        # extract plate Number
        # this number is a userID
        plateNum = plateRecongizer(img)

        # matching this number to user Info
        userInfo = User[plateNum]

        # add to ParkingUsers DIC
        tmpParkingUser = ParkingUser(userInfo, '1A')
        parkingUsers[tmpParkingUser.user.id] = tmpParkingUser.getInfo()


def evtListnerInit():
    t = evtListener.Target()
    t.run(myHandler)


if __name__ == '__main__':
    # thread = threading.Thread(target=evtListnerInit())
    # thread.daemon = True
    # thread.start()

    # proc = Process(target=evtListnerInit())
    # proc.start()
    # proc.join()

    CORS(app)
    app.run(debug=True)
