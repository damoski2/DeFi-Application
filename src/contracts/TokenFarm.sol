pragma solidity^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";


contract TokenFarm{
    //All code goes here...
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;
    address public owner;

    address[] public stakers;
    mapping(address =>uint) public stakingBalance;
    mapping(address =>bool) public hasStaked;
    mapping(address =>bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // 1. Stakes Tokens(Deposit)
    function stakeTokens(uint _amount) public{

        // Require amount greater than 0
        require(_amount > 0, "amount cannot be 0");

        //Code goes here...

        //Transfer Mock Dai tokens to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        //Update Stacking Balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        //Add User to stakers array "only" if they havent staked already
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    //. Issuing Tokens

    function issueTokens() public{
        //Only owner can call this function
        require(msg.sender == owner, "caller must be a owner");

        //Issue tokens to all stakers
        for(uint i=0; i<stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0){
                dappToken.transfer(recipient, balance);
            }
        }
    }

    //. UnStacking Tokens(Withdraw)
    function unStakeTokens() public{
        //Fetch Staking balance
        uint balance = stakingBalance[msg.sender];
        //Require amount greater than 0
        require(balance > 0, "staking balance cannot be 0");

        //transfer Mock Dai Tokens to this contract for staking
        daiToken.transfer(msg.sender, balance);

        //Reser staking balance
        stakingBalance[msg.sender] = 0;

        //update staking status
        isStaking[msg.sender] = false;
    }
}