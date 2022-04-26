import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from "react"; 
//importing all ABI's
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";

import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
    //make state empty and use it as a class variable
    state = { loaded: false, tokenSaleAddress:null, userTokens:0 }; //initially our app is not loaded

    componentDidMount = async() => {
        try {
            // Get network provider and web3 instance.
            this.web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            this.accounts = await this.web3.eth.getAccounts();

            // Get the contract instance.
            this.networkId = await this.web3.eth.net.getId();

            this.tokenInstance = new this.web3.eth.Contract(
                MyToken.abi,
                MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
            );

            this.tokensaleInstance = new this.web3.eth.Contract(
                MyTokenSale.abi,
                MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
            );

            this.kycInstance = new this.web3.eth.Contract(
                KycContract.abi,
                KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
            );

            //empty this as well
            this.setState({ loaded: true, tokenSaleAddress: MyTokenSale.networks[this.networkId].address}, this.updateUserTokens ); // app is fully loaded
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };
    //handle user address for kyc whitelisting
    handleInputChange = (event)=>{
        const target = event.target;
        const value = target.type ==="checkbox" ? target.checked :target.value;
        const name = target.name;

        this.setState({
            [name]:value  //here [name] = kycAddress and value = user a/c address
        })
    }
    //handle kyc whitelisting functionality
    handleKycWhitelisting = async() =>{
        //                                     user a/c address            contract deployer/owner address
        await this.kycInstance.methods.setKycCompleted(this.state.kycAddress).send({from: this.accounts[0]})
        alert("Kyc for "+this.state.kycAddress+"Is Completed!!")
    }
      copyclipboard() {
        /* Get the text field */
        var copyText = document.getElementById("owneraddress");
      
        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /* For mobile devices */
      
        /* Copy the text inside the text field */
        document.execCommand("copy");
      
        /* Alert the copied text
        alert("Copied the text: " + copyText.value); */
      }
      //update token here
      updateUserTokens = async() =>{
          let userTokens = await this.tokenInstance.methods.balanceOf(this.accounts[0]).call()
          this.setState({userTokens : userTokens})
      }
      //listen to token transfer
      listenTokenTransfer = async() =>{
          this.tokenInstance.events.Trasfer({to: this.accounts[0]}).on("data",this.updateUserTokens)
      }
      //handle buyToken here
      handleBuyTokens = async() =>{
          await this.tokensaleInstance.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: this.web3.utils.toWei("1","wei")})
      }

      

      render() {
        if (!this.state.loaded) {
            return <div> Loading Web3, accounts, and contract...! </div>;
        }
        return ( 
        <div className = "App" >
            <h1 > My Coffee Token Sale </h1> 
            <p> Grab your Tokens today! </p> 
            <h2> Kyc Whitelisting </h2>

            Address to allow: 
            <div class="input-group mb-3">
              <input type="text" class="form-control" name = "kycAddress"
            placeholder = "Enter Address here"
            value = { this.state.kycAddress }
            onChange = { this.handleInputChange }
            />
             <button type = "button" class="btn btn-primary"
            onClick = { this.handleKycWhitelisting }> Add to Whitelist </button>    
              </div>
           
            

            
            <h2> Buy Tokens </h2>

            
             <p>If you want to buy Tokens, Wei transfered to this address: { this.state.tokenSaleAddress } </p>

            <p> You currently have: <span class="tokenNum">{ this.state.userTokens } </span>Tokens</p>

            
            <button type = "button" class="btn btn-primary"
            onClick = { this.handleBuyTokens } > Buy Tokens </button>

            </div>
        );
    }
}

export default App;