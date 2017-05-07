# BitReturn
Bitreturn is an application which scans the blockchain for donations to approved charities and organisations and pays out rebates directly to the donor. This process is automated.

# DOCUMENTATION

## function findCharities(){
  this function searches the approvedCharitiesTable from the database and gets back all the charities bitcoin addresses.
}

## function getDonations(charity){
  this function scans the blockr.io address transaction api and gets back the latest 200 transactions from the specified address. This function is passed the charity address from the findCharities() function and scans each address one by one.
}

## function getDonor(dataObj){
  this function is passed an object containing all the transaction data above (txId, charityAddress,value) and uses the blockchain.info api to pull out the donor's address as the blockr.io api doesn't provide this.
}

## function payTo(dataObj,donor){
  this function takes the same object from getDonor and also recieves the donors bitcoin address. The function then calls payout(dataObj.value,donor) passing in the value of the transaction and the donor's address.
}

## function payout(value,address){
  this function pays out 33% of the transactions value to the donor using Bitcore. The private keys to authorise the payment are stored in the .env file and used by the BitCore API (Bitcore does not have the private keys however)
}

## function addPaymentToDB(value,address,charity,tx){
  this function gathers the neccasary payment details (from the parameters) and adds it to the database to prevent double claims and to keep track of rebates given.
}

## app.post("/search/:searchTerm",(req,res) => {
  this post request responds to the client and allows users to search the approvedCharitiesTable database table for approved charities.
})

## function findPayees(){
  This function scans the database for all donors that have not yet been paid out. After it finds non paid donors
  it calls the pay(tx) function to pay them out.
}

## function paid(tx){
  this gathers all payees and pays them out using the payout function and passes in the value and address to be paid. this data comes from the database.
}

## function payout(value,address) {
  this function makes an api call to the localhost blockchain.info server and makes the payments out to the donors. it then calls the payFee function to pay BitReturn a 1% service fee.
}

then run this program to collect donor information:

#### npm run server

and to pay out to donors run:

#### npm run pay

### To run the search server:

#### npm run search

