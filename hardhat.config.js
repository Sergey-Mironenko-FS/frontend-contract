require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  paths: {
    sources: "./contracts", // Укажите новый путь к контрактам
    artifacts: "./artifacts",
    cache: "./cache",
  },
  networks: {
    evm: {
        url: "http://127.0.0.1:9944", // Адрес вашей EVM-ноды
        accounts: [
            "0x560deca854f963e046ec839b527764c635bb2420c9af061a3d47e2e515c9700a" // Приватный ключ аккаунта для деплоя
        ]
    }
}
};
