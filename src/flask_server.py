from flask import Flask
from flask_restful import reqparse, abort, Api, Resource, fields
from plate_recognizer import plateProcessor, plateRecongizer
from wallet import Wallet
from web3 import Web3
from flask_cors import CORS, cross_origin
from datetime import datetime
from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer
import threading
from multiprocessing import Process, Queue
import os
import time

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
    checkTime = datetime.now() - enterTime
    print(str(checkTime.seconds) + " seconds")
    print("IN  : " + enterTime.isoformat())
    print("OUT : " + datetime.now().isoformat())
    return checkTime.seconds


parser = reqparse.RequestParser()
parser.add_argument('users',required=True)

# match User to Wallet
class User():
    def __init__(self, id, wallet):
        self.wallet = wallet
        self.id = id

# Users who park their cars
class ParkingUser():
    def __init__(self, User, location, enterTime):
        self.user = User
        self.userLocation = location
        self.enterTime = enterTime
    
    def getInfo(self):
        tmp = {}
        tmp["userID"] = self.user.id
        tmp["userLocation"] = self.userLocation
        tmp["enterTime"] = self.enterTime.isoformat()

        return tmp

walletList = []
### set Dummy DATA for testing
wallet1 = Wallet("0xFdB2677A8614f3D93b43e41e752b7D3E4060c724", "0e7c2dbf267835791323991fd0431fc753a8fe1f8210d52ba147179c73d1dbe1")
wallet2 = Wallet("0x6f1986D51c8b126166c96A0f5bE2D1673e2E5760", "5407241a9295428ee05d4a8e8f8212689da36dadbdad40e0d6d06db5024a0207")
wallet3 = Wallet("0x92883fa00eeb8E94D5c1b5118eA5594c173FF7cf", "a1eca58e0e587374e99f06ed4b554f34fd414d376c6620d52554274e7de7511e")
ownerWallet = Wallet("0xE8e885972130F1810B356F5e56b56f17306B7346", "1041dfc41acfd41d6ca19a1c98b39114a34cc6728813c6d7c3de9a600e270af9")

walletList.append(wallet1)
walletList.append(wallet2)
walletList.append(wallet3)


### FLASK
class UserClass(Resource):
    
    ## GET
    def get(self, userID):
        abortIfNothing(userID)
        return parkingUsers[userID]
    
    ## DELETE
    ## caculating and paying money with their wallet
    @cross_origin()
    def delete(self, userID):
        abortIfNothing(userID)
        
        ## make transaction to owner
        ## parking fee is 0.01 ether * seconds (for testing)
        enterTime = parkingUsers[userID].enterTime
        tToSeconds = timeCalculator(enterTime)
        tx = Users[userID].wallet.makeTransaction(tToSeconds, enterTime.isoformat())
        Users[userID].wallet.sendTransaction(tx)

        parkingAvailable.append(parkingUsers[userID].userLocation)
        del parkingUsers[userID]

        return '', 204


### return all parkingUsers List
class UserList(Resource):
    def get(self):
        allData = []
        print(len(parkingUsers))
        for iParkingUser in parkingUsers.values():
            data = iParkingUser.getInfo()
            allData.append(data)
        print(allData)
        return allData

api.add_resource(UserClass, '/users/<userID>')
api.add_resource(UserList, '/users')

parkingAvailable = ['1A', '1B', '1C']

## event Listener
class MyHandler(FileSystemEventHandler):

    def __init__(self):
        self.event_q = Queue()
        self.dummyThread = None

    def on_created(self, event):
        imgPath = event.src_path
        print("event! on_created : "+ event.src_path)

        img = plateProcessor(imgPath)

        # extract plate Number
        # this number is a userID
        plateNum = plateRecongizer(img)
        plateNum = plateNum.replace(" ", "")
        plateNum = plateNum.replace(".", "")
        plateNum = plateNum.replace("&", "")
        plateNum = str(plateNum)
        # IF new car
        if plateNum not in Users:
            linkWallet = walletList.pop()
            newUser = User(plateNum, linkWallet)
            Users[plateNum] = newUser

        # matching this number to user Info
        userInfo = Users[plateNum]

        # find available location
        location = parkingAvailable.pop()

        # add to ParkingUsers DICT
        tmpParkingUser = ParkingUser(userInfo, location, datetime.now())
        parkingUsers[plateNum] = tmpParkingUser

        print(plateNum + " enter")

    def start(self):
        self.dummyThread = threading.Thread(target=self._process)
        self.dummyThread.daemon = True
        self.dummyThread.start()

    def _process(self):
        while True:
            time.sleep(1)

handler = MyHandler()
handler.start()

eventlist_flag = 0
evenlist = []

def run_watcher():
    watchDir = os.getcwd()
    watchDir = os.path.join(watchDir, 'parking')
    
    global eventlist_flag, evenlist

    observer = Observer()
    observer.schedule(handler, watchDir)
    observer.start()

    try:
        while True:
            if eventlist_flag == 0:
                eventlist_flag = 1
                while not handler.event_q.empty():
                    event, ts = handler.event_q.get()
                    evenlist.append(event)
                eventlist_flag = 0
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join


if __name__ == '__main__':
    watcher_thread = threading.Thread(target=run_watcher)
    watcher_thread.start()
    CORS(app)
    app.run(debug=True)
    watcher_thread.join()
