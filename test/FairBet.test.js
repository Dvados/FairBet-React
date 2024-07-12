const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe('FairBet', function() {
  async function deploy(){
    // Getting test accounts
    const [user1, user2, user3, user4] = await ethers.getSigners();
    const users = [user1, user2, user3, user4];

    // Finding the contract
    const Factory = await ethers.getContractFactory('FairBet', user4);
    // Deploying the contract
    const fairBet = await Factory.deploy();

    // Waiting for the deploy
    await fairBet.waitForDeployment();

    return { users, fairBet };
  }


  // async function placeRandomBets(users, fairBet, numberOfBets) {
  //   for (let i = 0; i < numberOfBets; i++) {
  //     const randomUserIndex = Math.floor(Math.random() * users.length);
  //     const randomUser = users[randomUserIndex];

  //     const randomBetAmount = (Math.random() * (5 - 0.1) + 0.1);
  //     const betAmountInEther = ethers.parseEther(randomBetAmount.toString());

  //     const randomSelection = Math.floor(Math.random() * 3 + 1);

  //     const placeBetTx = await fairBet.connect(randomUser).placeBet(1, randomSelection, { value: betAmountInEther });
  //     await placeBetTx.wait();
  //   }
  // }


  it('Deploys a Contract', async function() {
    // Executing the deploy function and getting the variables
    const { fairBet } = await loadFixture(deploy);

    expect(fairBet.target).to.be.properAddress;

    const balance = await ethers.provider.getBalance(fairBet.target);
    expect(balance).to.eq(0);
  });


  it('Create Match', async function() {
    const { fairBet } = await loadFixture(deploy);

    const createMatchTx = await fairBet.createMatch('Real Madrid', 'Barcelona');
    await createMatchTx.wait();

    const match = await fairBet.matches(1);

    expect(match.teamA).to.eq(ethers.hexlify(ethers.toUtf8Bytes('Real Madrid')));
    expect(match.teamB).to.eq(ethers.hexlify(ethers.toUtf8Bytes('Barcelona')));
    expect(match.matchStatus).to.eq(1); // Status.Bets
  });


  it('Pause Bets', async function() {
    const { fairBet } = await loadFixture(deploy);
  
    const createMatchTx = await fairBet.createMatch('Real Madrid', 'Barcelona');
    await createMatchTx.wait();
  
    await fairBet.pauseBets(1);
  
    const match = await fairBet.matches(1);
  
    expect(match.matchStatus).to.eq(0); // Status.BetsPaused

    let error = 'fail';

    try {
      const placeBetTx = await fairBet.placeBet(1, 1, { value: ethers.parseEther('1') });
      await placeBetTx.wait();
    } 
    catch(err) {
      error = 'success';
    }

    expect(error).to.eq('success');
  });

  it('Resume Bets', async function() {
    const { fairBet } = await loadFixture(deploy);
  
    const createMatchTx = await fairBet.createMatch('Real Madrid', 'Barcelona');
    await createMatchTx.wait();
  
    await fairBet.pauseBets(1);
    await fairBet.resumeBets(1);
  
    const match = await fairBet.matches(1);
  
    expect(match.matchStatus).to.eq(1); // Status.Bets

    let error = 'success';

    try {
      const placeBetTx = await fairBet.placeBet(1, 1, { value: ethers.parseEther('1') });
      await placeBetTx.wait();
    } 
    catch(err) {
      error = 'fail';
    }

    expect(error).to.eq('success');
  });

  it('Finish Match', async function() {
    const { fairBet } = await loadFixture(deploy);
  
    const createMatchTx = await fairBet.createMatch('Real Madrid', 'Barcelona');
    await createMatchTx.wait();
  
    await fairBet.finishMatch(1, 1); // Result.TeamA
  
    const match = await fairBet.matches(1);
  
    expect(match.matchStatus).to.eq(2); // Status.Finished
    expect(match.matchResult).to.eq(1); // Result.TeamA

    let error = 'fail';

    try {
      const placeBetTx = await fairBet.placeBet(1, 1, { value: ethers.parseEther('1') });
      await placeBetTx.wait();
    } 
    catch(err) {
      error = 'success';
    }

    expect(error).to.eq('success');
  });

  it('Place Bet', async function() {
    const { users, fairBet } = await loadFixture(deploy);

    const createMatchTx = await fairBet.createMatch('Real Madrid', 'Barcelona');
    await createMatchTx.wait();

    const numberOfBets = 1000;  // Number of random bets

    for (let i = 0; i < numberOfBets; i++) {
      // Select a random user
      const randomUserIndex = Math.floor(Math.random() * users.length);
      const randomUser = users[randomUserIndex];

      // Generate a random bet amount between 0.1 and 5 ether
      const randomBetAmount = (Math.random() * (5 - 0.1) + 0.1);
      const betAmountInWei = ethers.parseEther(randomBetAmount.toString());

      const randomSelection = Math.floor(Math.random() * 3 + 1);

      const placeBetTx = await fairBet.connect(randomUser).placeBet(1, randomSelection, { value: betAmountInWei });
      await placeBetTx.wait();

      await expect(placeBetTx).to.changeEtherBalance(randomUser, -betAmountInWei);
      await expect(placeBetTx).to.changeEtherBalance(fairBet.target, betAmountInWei);

      const bet = await fairBet.allBets(1, i);

      expect(bet.better).to.eq(randomUser.address);
      expect(bet.amount).to.eq(betAmountInWei);
      expect(bet.resultSelection).to.eq(randomSelection);
    }
  });

  it('Bet Amounts and Odds', async function() {
    const { users, fairBet } = await loadFixture(deploy);

    const createMatchTx = await fairBet.createMatch('Real Madrid', 'Barcelona');
    await createMatchTx.wait();

    let expectedBetAmounts1X2 = [0, 0, 0];
    let totalBetAmount1X2 = 0;
    let expectedOdds1X2 = [1, 1, 1];

    const numberOfBets = 1000;

    for (let i = 0; i < numberOfBets; i++) {
      const randomUserIndex = Math.floor(Math.random() * users.length);
      const randomUser = users[randomUserIndex];

      const randomBetAmount = (Math.random() * (5 - 0.1) + 0.1);
      const betAmountInWei = ethers.parseEther(randomBetAmount.toString());

      const randomSelection = Math.floor(Math.random() * 3 + 1);

      const placeBetTx = await fairBet.connect(randomUser).placeBet(1, randomSelection, { value: betAmountInWei });
      await placeBetTx.wait();

      expectedBetAmounts1X2[randomSelection - 1] += randomBetAmount;

      totalBetAmount1X2 += randomBetAmount;

      const betAmounts1X2 = await fairBet.betAmounts1X2(1);

      for(let j = 0; j < expectedBetAmounts1X2.length; j++) {
        expect(Number(ethers.formatEther(betAmounts1X2[j].toString()))).to.be.closeTo(expectedBetAmounts1X2[j], 0.00000000001);
      }

      for(let j = 0; j < expectedOdds1X2.length; j++) {
        if(expectedBetAmounts1X2[j] != 0 && expectedBetAmounts1X2[j] != totalBetAmount1X2){
          expectedOdds1X2[j] = totalBetAmount1X2 / (expectedBetAmounts1X2[j] / 100 * 105);
        }
      }

      const odds1X2 = await fairBet.odds1X2(1);

      for(let j = 0; j < odds1X2.length; j++) {
        expect(Number(ethers.formatEther(odds1X2[j].toString()))).to.be.closeTo(expectedOdds1X2[j], 0.0000000000001);
      }
    }
  })

  it('Distribute Winnings', async function() {
    const { users, fairBet } = await loadFixture(deploy);

    for (let i = 1; i < 4; i++) {
    
      const createMatchTx = await fairBet.createMatch('Real Madrid', 'Barcelona');
      await createMatchTx.wait();

      const usersSum = new Array(3).fill(0);

      const numberOfBets = 3;

      for (let j = 0; j < numberOfBets; j++) {
        const randomBetAmount = (Math.random() * (5 - 0.1) + 0.1);
        const betAmountInWei = ethers.parseEther(randomBetAmount.toString());

        const placeBetTx = await fairBet.connect(users[j]).placeBet(i, j + 1, { value: betAmountInWei });
        await placeBetTx.wait();

        usersSum[j] += randomBetAmount;
      }

      await fairBet.finishMatch(i, i);

      const odds1X2 = await fairBet.odds1X2(i);

      let userExpBalance = usersSum[i - 1] * Number(ethers.formatEther(odds1X2[i - 1].toString()));

      const userBalance = await fairBet.balances(users[i - 1].address);

      expect(Number(ethers.formatEther(userBalance.toString()))).to.be.closeTo(userExpBalance, 0.00000000001);
    }
  });

  it('Recieve and Withdraw', async function() {
    const { users, fairBet } = await loadFixture(deploy);

    const amountToSend = ethers.parseEther('1.0');

    const sendEtherTx = await users[0].sendTransaction({ to: fairBet.target, value: amountToSend });
    await sendEtherTx.wait();

    await expect(sendEtherTx).to.changeEtherBalance(users[0], -amountToSend);
    await expect(sendEtherTx).to.changeEtherBalance(fairBet.target, amountToSend);

    let userBalance = await fairBet.balances(users[0].address);

    expect(userBalance).to.eq(amountToSend);

    const withdrawTx = await fairBet.connect(users[0]).withdraw();
    await withdrawTx.wait();

    await expect(withdrawTx).to.changeEtherBalance(users[0], amountToSend);
    await expect(withdrawTx).to.changeEtherBalance(fairBet.target, -amountToSend);

    userBalance = await fairBet.balances(users[0].address);

    expect(userBalance).to.eq(0);
  });
});