// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Crowdsale.sol";
import "./KycContract.sol";

//weblink: https://docs.openzeppelin.com/contracts/2.x/crowdsales
/*
   Note : This contract owns the tokens , so once we sent ethers to the wallet
   it'll send us tokens as per the rate from it's own address
*/

contract MyTokenSale is Crowdsale {
    //adding a KYC Pre-validation here

    KycContract kyc;   //KycContract kyc is the contract-wide declaration of the kyc variable

    constructor(
        uint256 rate, // tells us for how many wei we can purchase a token
        address payable wallet, //this receives amount of ethers sent to crowdsale
        IERC20 token, //transfer tokens who's sending ethers to crowdsale contract
        KycContract _kyc
    ) Crowdsale(rate, wallet, token) {
        kyc = _kyc; //contarct instance once it is deployed
    }

    //overriding existing func. from Cowrdsale.sol
	
	/*
	
	
	-when you call the crowdsale contract then the _preValidatePurchase function is called. 
	-This function is initially empty, but when you override the crowdsale contract provided by openzeppelin, 
	then you can write your own _preValidatePurchase function which will be called then.
	
	
	*/

	
    function _preValidatePurchase(address beneficiary, uint256 weiAmount)
        internal
        view
        override
    {
        super._preValidatePurchase(beneficiary, weiAmount); //calling func. of base class
        require(
            kyc.KycCompleted(msg.sender),
            "Kyc not comleted, purchase not allowed"
        );
    }
}
