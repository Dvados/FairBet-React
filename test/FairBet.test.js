const { loadFixture, ethers, expect } = require("./setup");

describe('FairBet', function() {
  async function deploy(){
    // Отримуємо тестові акаунти
    const [user1, user2, user3, user4] = await ethers.getSigners();

    const users = [user1, user2, user3, user4];

    // Знаходимо контракт
    const Factory = await ethers.getContractFactory('FairBet');
    // Розгортуємо/Деплоїмо його
    const fairBet = await Factory.deploy();

    // Очікуємо деплою
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

  it('deploys a contract', async function() {
    // Виконуємо функцію deploy та отримуємо змінні
    const { fairBet } = await loadFixture(deploy);

    expect(fairBet.target).to.be.properAddress;
  });

  it('has 0 ethers by default', async function() {
    const { fairBet } = await loadFixture(deploy);

    const balance = await ethers.provider.getBalance(fairBet.target);

    expect(balance).to.eq(0);
  });

  it('Create match', async function() {
    const { fairBet } = await loadFixture(deploy);

    const createMatchTx = await fairBet.createMatch('Real Madrid', 'Barcelona');
    await createMatchTx.wait();

    const match = await fairBet.matches(1);

    expect(match.teamA).to.eq('Real Madrid');
    expect(match.teamB).to.eq('Barcelona');
    expect(match.matchStatus).to.eq(0); // Status.Bets
  });

  it('Pause Bets', async function(){
    const { fairBet } = await loadFixture(deploy);
  
    const createMatchTx = await fairBet.createMatch('Real Madrid', 'Barcelona');
    await createMatchTx.wait();
  
    await fairBet.pauseBets(1);
  
    const match = await fairBet.matches(1);
  
    expect(match.matchStatus).to.eq(1); // Status.BetsPaused

    let error = 'fail';

    try{
      const placeBetTx = await fairBet.placeBet(1, 1, { value: ethers.parseEther('1') });
      await placeBetTx.wait();
    } 
    catch(err){
      error = 'success';
    }

    expect(error).to.eq('success');
  });

  it('Finish Match', async function(){
    const { fairBet } = await loadFixture(deploy);
  
    const createMatchTx = await fairBet.createMatch('Real Madrid', 'Barcelona');
    await createMatchTx.wait();
  
    await fairBet.finishMatch(1, 1); // Result.TeamA
  
    const match = await fairBet.matches(1);
  
    expect(match.matchStatus).to.eq(2); // Status.Finished
    expect(match.matchResult).to.eq(1); // Result.TeamA

    let error = 'fail';

    try{
      const placeBetTx = await fairBet.placeBet(1, 1, { value: ethers.parseEther('1') });
      await placeBetTx.wait();
    } 
    catch(err){
      error = 'success';
    }

    expect(error).to.eq('success');
  });

  it('Place Bet', async function() {
    const { users, fairBet } = await loadFixture(deploy);

    const createMatchTx = await fairBet.createMatch('Real Madrid', 'Barcelona');
    await createMatchTx.wait();

    const numberOfBets = 100;  // Number of random bets

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

      const bet = await fairBet.allBets(i + 1);

      expect(bet.matchId).to.eq(1);
      expect(bet.better).to.eq(randomUser.address);
      expect(bet.amount).to.eq(betAmountInWei);
      expect(bet.resultSelection).to.eq(randomSelection);
    }
  });

  it('Bet amounts and odds', async function() {
    const { users, fairBet } = await loadFixture(deploy);

    const createMatchTx = await fairBet.createMatch('Real Madrid', 'Barcelona');
    await createMatchTx.wait();

    let expectedBetAmountTeamA = 0;
    let expectedBetAmountTeamB = 0;
    let expectedBetAmountDraw = 0;

    let totalBetAmount = 0;

    let expectedOddsTeamA = 1;
    let expectedOddsTeamB = 1;
    let expectedOddsDraw = 1;

    const numberOfBets = 100;

    for (let i = 0; i < numberOfBets; i++) {
      const randomUserIndex = Math.floor(Math.random() * users.length);
      const randomUser = users[randomUserIndex];

      const randomBetAmount = (Math.random() * (5 - 0.1) + 0.1);
      const betAmountInWei = ethers.parseEther(randomBetAmount.toString());

      const randomSelection = Math.floor(Math.random() * 3 + 1);

      const placeBetTx = await fairBet.connect(randomUser).placeBet(1, randomSelection, { value: betAmountInWei });
      await placeBetTx.wait();

      if(randomSelection == 1) {
        expectedBetAmountTeamA += randomBetAmount;
      } else if(randomSelection == 2) {
        expectedBetAmountTeamB += randomBetAmount;
      } else if (randomSelection == 3) {
        expectedBetAmountDraw += randomBetAmount;
      }

      totalBetAmount += randomBetAmount;

      const match = await fairBet.matches(1);

      expect(Number(ethers.formatEther(match.betAmountTeamA.toString()))).to.be.closeTo(expectedBetAmountTeamA, 0.0000000000001);
      expect(Number(ethers.formatEther(match.betAmountTeamB.toString()))).to.be.closeTo(expectedBetAmountTeamB, 0.0000000000001);
      expect(Number(ethers.formatEther(match.betAmountDraw.toString()))).to.be.closeTo(expectedBetAmountDraw, 0.0000000000001);

      if(expectedBetAmountTeamA != 0) {
        expectedOddsTeamA = totalBetAmount / expectedBetAmountTeamA;
      }

      if(expectedBetAmountTeamB != 0) {
        expectedOddsTeamB = totalBetAmount / expectedBetAmountTeamB;
      }

      if(expectedBetAmountDraw != 0) {
        expectedOddsDraw = totalBetAmount / expectedBetAmountDraw;
      }

      expect(Number(ethers.formatEther(match.oddsTeamA.toString()))).to.be.closeTo(expectedOddsTeamA, 0.0000000000001);
      expect(Number(ethers.formatEther(match.oddsTeamB.toString()))).to.be.closeTo(expectedOddsTeamB, 0.0000000000001);
      expect(Number(ethers.formatEther(match.oddsDraw.toString()))).to.be.closeTo(expectedOddsDraw, 0.0000000000001);
    }
  })

  it('Distribute Winnings', async function(){
    const { users, fairBet } = await loadFixture(deploy);

    for (let j = 0; j < 3; j++) {
    
      const createMatchTx = await fairBet.createMatch('Real Madrid', 'Barcelona');
      await createMatchTx.wait();

      const usersSum = new Array(users.length).fill(0);

      const numberOfBets = 3;

      for (let i = 0; i < numberOfBets; i++) {
        const randomBetAmount = (Math.random() * (5 - 0.1) + 0.1);
        const betAmountInWei = ethers.parseEther(randomBetAmount.toString());

        const placeBetTx = await fairBet.connect(users[i]).placeBet(j + 1, i + 1, { value: betAmountInWei });
        await placeBetTx.wait();

        usersSum[i] += randomBetAmount;
      }

      await fairBet.finishMatch(j + 1, j + 1);

      const match = await fairBet.matches(j + 1);

      const userBalance = await fairBet.users(users[j].address);

      let userExpBalance;

      if(j + 1 == 1) {
        userExpBalance = usersSum[j] * Number(ethers.formatEther(match.oddsTeamA.toString()));
      } else if(j + 1 == 2) {
        userExpBalance = usersSum[j] * Number(ethers.formatEther(match.oddsTeamB.toString()));
      } else if(j + 1 == 3) {
        userExpBalance = usersSum[j] * Number(ethers.formatEther(match.oddsDraw.toString()));
      }

      expect(Number(ethers.formatEther(userBalance.toString()))).to.be.closeTo(userExpBalance, 0.0000000000001);
    }
  });

  it('Withdraw', async function(){
    const { users, fairBet } = await loadFixture(deploy);
  
    const createMatchTx = await fairBet.createMatch('Real Madrid', 'Barcelona');
    await createMatchTx.wait();

    const bet = ethers.parseEther('1');
  
    await fairBet.connect(users[0]).placeBet(1, 1, { value: bet });
    await fairBet.finishMatch(1, 1); // Result.TeamA

    const withdrawTx = await fairBet.withdraw();
    await withdrawTx.wait();

    await expect(withdrawTx).to.changeEtherBalance(users[0], bet);
    await expect(withdrawTx).to.changeEtherBalance(fairBet.target, -bet);
  });
});