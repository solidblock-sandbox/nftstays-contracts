require('@nomicfoundation/hardhat-toolbox')
require('dotenv').config()

task('accounts', 'Prints the list of accounts', async () => {
  const accounts = await ethers.getSigners()

  for (let i = 0; i < accounts.length; i++) {
    console.log(i, accounts[i].address)
  }
})

task('balance', "Prints an account's balance")
  .addParam('account', "The account's index")
  .setAction(async taskArgs => {
    const index = taskArgs.account
    const accounts = await ethers.getSigners()
    const account = accounts[index]
    const balance = await account.getBalance()

    console.log(Number(ethers.utils.formatEther(balance)), 'MATIC')
  })

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
}
