//weblink : https://github.com/OpenZeppelin/openzeppelin-test-helpers/blob/master/src/setup.js

//set-up inital config. for tests (ref. above link)
const TokenSale = artifacts.require("MyTokenSale")
const Token = artifacts.require("MyToken")
const KycContract = artifacts.require("KycContract")

const chai = require("./setupchai.js")
const BN = web3.utils.BN
const expect = chai.expect;


//start writing test from here
contract("TokenSale Test", async(accounts) => {

    const [deployerAccount, recipient, anotherAccount] = accounts;

    //as we're transferring all tokens from deployer a/c to MyTokenSale contract, so deployer a/c should not contain any tokens 
    it("should not have any tokens in my deployerAccount", async() => {
        let instance = await Token.deployed()
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0))
    })

    //MyTokenSale contract should contain all the tokens
    it("all the tokens should be in TokenSale contract by default", async() => {
        let instance = await Token.deployed()
        let balanceOfMyTokenSaleContract = await instance.balanceOf(TokenSale.address)
        let totalSupply = await instance.totalSupply()
        expect(balanceOfMyTokenSaleContract).to.be.a.bignumber.equal(totalSupply)
    })

    it("should be possible to buy tokens", async() => {
        let tokenInstance = await Token.deployed()
        let tokenSaleInstance = await TokenSale.deployed()
        let kycInstance = await KycContract.deployed()
            // let balanceBefore = await tokenInstance.balanceOf(deployerAccount)
        await kycInstance.KycCompleted(deployerAccount, { from: deployerAccount }) //trying to whitelist itself
        expect(tokenSaleInstance.sendTransaction({ from: deployerAccount, value: web3.utils.toWei("1", "wei") })).to.be.fulfilled
            // balanceBefore = balanceBefore.add(new BN(1))
            //return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceBefore)
    })

})