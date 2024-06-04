const { loadFixture, ethers, expect } = require("./setup");

describe('FairBet', function(){
  async function deploy(){
    const [user1, user2] = await ethers.getSigners(); // Отримуємо тестові акаунти

    const Factory = await ethers.getContractFactory('FairBet'); // Знаходимо контракт
    const fairBet = await Factory.deploy(); // Розгортуємо/Деплоїмо його

    await fairBet.waitForDeployment(); // Очікуємо деплою

    return { user1, user2, fairBet };
  }

  it('deploys a contract', async function(){
    const { fairBet } = await loadFixture(deploy); // Виконуємо функцію deploy та отримуємо змінні

    expect(fairBet.target).to.be.properAddress;
  });

  it('has 0 ethers by default', async function(){
    const { fairBet } = await loadFixture(deploy);

    const balance = await ethers.provider.getBalance(fairBet.target);

    expect(balance).to.eq(0);
  });

  it('Create match', async function(){
    const { user1, user2, fairBet } = await loadFixture(deploy);

    const createMatchTx = await fairBet.createMatch('Real Madrid', 'Barcelona');
    await createMatchTx.wait();

    const match = await fairBet.matches(1);

    expect(match.teamA).to.eq('Real Madrid');
    expect(match.teamB).to.eq('Barcelona');
  });

  it('Place Bet', async function(){
    const { user1, user2, fairBet } = await loadFixture(deploy);

    const createMatchTx = await fairBet.createMatch('Real Madrid', 'Barcelona');
    await createMatchTx.wait();

    const sum = ethers.parseEther('1');

    const placeBetTx = await fairBet.connect(user2).placeBet(1, 1, { value: sum });
    await placeBetTx.wait();

    await expect(placeBetTx).to.changeEtherBalance(user2, -sum);
    await expect(placeBetTx).to.changeEtherBalance(fairBet.target, sum);

    const bet = await fairBet.allBets(1);

    expect(bet.matchId).to.eq(1);
    expect(bet.resultSelection).to.eq(1);
  });
});