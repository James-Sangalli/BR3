#DOCUMENTATION

##function findCharities(){
  this function searches the approvedCharitiesTable from the database and gets back all the charities bitcoin addresses.
}

##function scanBlockchain(addresses){
  this function scans the blockr.io address transaction api and gets back the latest 200 transactions from the specified address. This function is passed the charity address from the findCharities() function and scans each address one by one.
}

##function getDonor(dataObj){
  this function is passed an object containing all the transaction data above (txId, charityAddress,value) and uses the blockchain.info api to pull out the donor's address as the blockr.io api doesn't provide this.
}

##function payTo(dataObj,donor){
  this function takes the same object from getDonor and also recieves the donors bitcoin address. The function then calls payout(dataObj.value,donor) passing in the value of the transaction and the donor's address.
}

##function payout(value,address){
  this function pays out 33% of the transactions value to the donor using the blockchain.info payment api
}

##function addPaymentToDB(value,address,charity,tx){
  this function gathers the neccasary payment details (from the parameters) and adds it to the database to prevent double claims and to keep track of rebates given.
}

##app.post("/search/:searchTerm",(req,res) => {
  this post request responds to the client and allows users to search the approvedCharitiesTable database table for approved charities.
})

##blockchain server

To make the blockchain server run so that payments to donors can be executed, first install blockchain wallet service by running the following(node.js is needed).

###$ npm install -g blockchain-wallet-service

then run the server at:
###$ blockchain-wallet-service start --port 3000

(for more info regarding blockchain wallet service see this link: https://github.com/blockchain/service-my-wallet-v3)

then run this program with this:

###$ npm run server
