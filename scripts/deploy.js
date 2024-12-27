const hre = require("hardhat");

async function main() {
  // Получаем аккаунты, с которых будем деплоить
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Загружаем контракт (указываем путь к файлу контракта)
  const BalanceTracker = await hre.ethers.getContractFactory("BalanceTracker");

  console.log("Deploying BalanceTracker contract...");

  // Деплоим контракт
  const balanceTracker = await BalanceTracker.deploy();

  // Ждем, пока контракт будет развернут
  await balanceTracker.deployed();

  console.log("BalanceTracker deployed to:", balanceTracker.address);
}

// Запускаем скрипт деплоя
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });