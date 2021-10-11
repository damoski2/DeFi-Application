const { assert } = require('chai');

const DaiToken = artifacts.require("DaiToken")
const DappToken = artifacts.require("DappToken")
const TokenFarm = artifacts.require("TokenFarm")

require('chai')
    .use(require('chai-as-promised'))
    .should();


    const tokens = (n)=> web3.utils.toWei(n,'Ether')


    contract('TokenFarm', ([owner,investor])=>{
       let daiToken, dappToken, tokenFarm;

       before(async()=>{
           //Load Contracts
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        //Transfer all DappToken to token Farm
        await dappToken.transfer(tokenFarm.address,tokens('1000000'))

        //Transfer all DaiTokens tokens to Investor
        await daiToken.transfer(investor, tokens('100'), { from: owner})
        
       }) 



        //Write test here...
        describe('Mock Dai Deployement', async()=>{
            it('Has a name', async()=>{
                let name = await daiToken.name()
                assert.equal(name,'Mock DAI Token')
            })

            //Investor has (100) dai Tokens
            it('investor has token', async()=>{
                let investorBalance = await daiToken.balanceOf(investor);
                assert.equal(investorBalance.toString(),tokens('100'))
            })
        })

        describe('Dapp Token Deployement', async()=>{
            it('Has a name', async()=>{
                let name = await dappToken.name()
                assert.equal(name,'DApp Token')

            })
        })


        describe('Token Farm Deployement', async()=>{
            it('Has a name', async()=>{
                let name = await tokenFarm.name()
                assert.equal(name,'Dapp Token Farm')

            })

            it('contract has tokens', async()=>{
                let balance = await dappToken.balanceOf(tokenFarm.address)
                assert.equal(balance.toString(),tokens('1000000'))
            })
        })

        describe('Farming tokens', async()=>{
            it('rewards investors for staking mDai Tokens', async()=>{
                let result;

                //Check investor balance before staking
                result = await daiToken.balanceOf(investor)
                assert.equal(result.toString(), tokens('100'), 'Investor mock dai wallet correct before staking')

                //Stake mock Dai Tokens
                await daiToken.approve(tokenFarm.address,tokens('100'), {from: investor})
                await tokenFarm.stakeTokens(tokens('100'), { from: investor })

                //Check Staking result
                result = await daiToken.balanceOf(investor)
                assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking')

                result = await daiToken.balanceOf(tokenFarm.address)
                assert.equal(result.toString(), tokens('100'),'Tokens Farm mock DAI balance correct after staking')

                result = await tokenFarm.stakingBalance(investor)
                assert.equal(result.toString(), tokens('100'),'Token farm Mock DAI balance correct after staking')

                result = await tokenFarm.isStaking(investor)
                assert.equal(result.toString(),'true','investor staking status correct after staking')

                //issue tokens
                await tokenFarm.issueTokens({ from: owner })

                //Check balances after issueance
                result = await dappToken.balanceOf(investor);
                assert.equal(result.toString(),tokens('100'),'investor Dapp Token wallet balance correct after issuance');

                //Ensure that only owner can issue tokens
                await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

                //Unstake Tokens
                await tokenFarm.unStakeTokens({ from: investor})

                //Check result after unstaking
                result = await daiToken.balanceOf(investor);
                assert.equal(result.toString(), tokens('100'), 'investor mock DAI wallet balance after staking');

                result =  await tokenFarm.stakingBalance(investor);
                assert.equal(result.toString(),tokens('0'),'investor staking balance correct after staking');

            })
        })

    })