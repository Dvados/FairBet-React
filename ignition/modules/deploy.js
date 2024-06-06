async function main() {
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }
  
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with", await deployer.getAddress())

  const Factory = await ethers.getContractFactory("FairBet", deployer);
  const fairBet = await Factory.deploy();

  // Очікуємо деплою
  await fairBet.waitForDeployment();

  console.log("Contract deployed to:", fairBet.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });