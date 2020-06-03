import json, sys, time, pprint
from web3 import Web3

# one_ether : 1000000000000000000
ether = 10000000000000000 # 0.01 ether

ganache_url = "HTTP://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))
# web3.eth.defaultAccount=web3.eth.accounts[0]

"""
accounts = {
    "user1" : "0xFdB2677A8614f3D93b43e41e752b7D3E4060c724",
    "user2" : "0x6f1986D51c8b126166c96A0f5bE2D1673e2E5760",
    "owner" : "0xE8e885972130F1810B356F5e56b56f17306B7346",
}
Key = {
    accounts["user1"] : "0e7c2dbf267835791323991fd0431fc753a8fe1f8210d52ba147179c73d1dbe1",
    accounts["user2"] : "5407241a9295428ee05d4a8e8f8212689da36dadbdad40e0d6d06db5024a0207",
    accounts["owner"] : "1041dfc41acfd41d6ca19a1c98b39114a34cc6728813c6d7c3de9a600e270af9",
}
"""


class Wallet():
    def __init__(self, account, key):
        self.account = account
        self.key = key

    def showBalance(self):
        balance = web3.eth.getBalance(self.account)
        print(web3.fromWei(balance, "ether"))
    
    def makeTransaction(self, time, enterTime):
        singed_txn = web3.eth.account.signTransaction(dict(
            nonce =web3.eth.getTransactionCount(web3.eth.coinbase),
            gasPrice =web3.eth.gasPrice,
            gas = 100000,
            value = ether * time,
            to = owner.account,
            data = enterTime.encode()
        ),
        self.key,
        )
        return singed_txn.rawTransaction

    @classmethod
    def sendTransaction(cls, tx):
        return web3.eth.sendRawTransaction(tx)

owner = Wallet("0xE8e885972130F1810B356F5e56b56f17306B7346", "1041dfc41acfd41d6ca19a1c98b39114a34cc6728813c6d7c3de9a600e270af9")


if __name__ == "__main__":
    user1 = Wallet("0xFdB2677A8614f3D93b43e41e752b7D3E4060c724", "0e7c2dbf267835791323991fd0431fc753a8fe1f8210d52ba147179c73d1dbe1")
    user2 = Wallet("0x6f1986D51c8b126166c96A0f5bE2D1673e2E5760", "5407241a9295428ee05d4a8e8f8212689da36dadbdad40e0d6d06db5024a0207")
    user3 = Wallet("0x92883fa00eeb8E94D5c1b5118eA5594c173FF7cf", "a1eca58e0e587374e99f06ed4b554f34fd414d376c6620d52554274e7de7511e")
    owner = Wallet("0xE8e885972130F1810B356F5e56b56f17306B7346", "1041dfc41acfd41d6ca19a1c98b39114a34cc6728813c6d7c3de9a600e270af9")

    print(web3.eth.getBlock('latest'))

    tx1 = user1.makeTransaction(1)
    tx = Wallet.sendTransaction(tx1)

    print(tx)