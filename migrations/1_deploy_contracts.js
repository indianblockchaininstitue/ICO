//artifacts are json files which are created by truffle when it compiles contracts
let MyToken = artifacts.require('MyToken')
let MyTokenSale = artifacts.require("MyTokenSale")
let MyKycContract = artifacts.require("KycContract")
require('dotenv').config({ path: "../.env" }) //for importing .env file //console.log(process.env)


//deployer is the handle to deploy these contracts on bc
module.exports = async function(deployer) {

    let addr = await web3.eth.getAccounts()

    await deployer.deploy(MyKycContract)
    await deployer.deploy(MyToken)
    await deployer.deploy(MyTokenSale, 1, addr[0], MyToken.address, MyKycContract.address)


    let instance = await MyToken.deployed()
    
    await instance.transfer(MyTokenSale.address, process.env.INITIAL_TOKENS) //transferring all the tokens to MyTokenSale contract

}