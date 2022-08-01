const isMetaMaskInstalled = () => {
  const installed = typeof window.ethereum !== 'undefined'
  console.log(
    installed ? 'MetaMask is installed!' : 'MetaMask is NOT installed!'
  )
  return installed
}

const getNetworkName = id => {
  const networks = {
    1: 'Ethereum Mainnet',
    3: 'Ropsten Test Network',
    4: 'Rinkeby Test Network',
    5: 'Goerli Test Network',
    42: 'Kovan Test Network',
    137: 'Polygon Mainnet',
    80001: 'Mumbai',
    31337: 'Hardhat Local Node'
  }
  return networks[Number(id)] || 'Unknown Network'
}

const getNetworkCode = id => {
  const networks = {
    1: 'ethereum',
    3: 'ropsten',
    4: 'rinkeby',
    5: 'goerli',
    42: 'kovan',
    137: 'polygon',
    80001: 'mumbai',
    31337: 'hardhat'
  }
  return networks[Number(id)] || 'unknown'
}

const getProvider = () => {
  if (window.ethereum.providers) {
    return window.ethereum.providers.find(provider => provider.isMetaMask) // provider.isCoinbaseWallet
  }
  return window.ethereum
}

const connectMetaMask = async installed => {
  if (installed) {
    const provider = getProvider()
    const accounts = await provider.request({ method: 'eth_requestAccounts' })
    console.log('Account Address:', accounts[0])
    return {
      provider,
      account: accounts[0]
    }
  }
  return null
}

const getChainID = async () => {
  return provider.request({ method: 'eth_chainId' })
}

const switchNetwork = async () => {
  try {
    const NetworkId = '0x' + Number(80001).toString(16)
    let chainId = await getChainID()

    if (chainId !== NetworkId) {
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: NetworkId }]
        })
        chainId = await getChainID()
      } catch (error) {
        console.warn(error)
        if (error.code !== 4902) {
          return 0
        }

        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: NetworkId,
              chainName: 'Mumbai',
              rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
              blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
              nativeCurrency: {
                symbol: 'MATIC',
                decimals: 18
              }
            }
          ]
        })
        chainId = await getChainID()
      }
    }
    return chainId
  } catch (error) {
    console.error(error)
  }
  return 0
}

let provider = null
let account = null
const isInstalled = isMetaMaskInstalled()

const factoryContractAddress = '0xDd6949f458fc8b39e79ff96c08F1776E10578110'

document.getElementById('splitter-addresses').value = '["0xbabe6F915C8B33c2dB1b1E6148Bd26Ff370e27D2", "0x1C04D27346D31ade3B4B9250Fe3F19C622732C80"]'
document.getElementById('splitter-shares').value = '[2, 1]'
document.getElementById('state-erc20-address').value = '0xB2Fd2e8554A9107315995699C830C8ab311bd82c'
document.getElementById('transfer-erc20-address').value = '0xB2Fd2e8554A9107315995699C830C8ab311bd82c'
document.getElementById('splitter-split-tokens').value = '["0xB2Fd2e8554A9107315995699C830C8ab311bd82c", "0x6B51E8076F311ef76c35c1D7807Ffc1f450E7bfb"]'

document.getElementById('connect').addEventListener('click', async () => {
  const connection = await connectMetaMask(isInstalled)
  provider = connection.provider
  account = connection.account
})

document.getElementById('switch').addEventListener('click', async () => {
  const chainId = await switchNetwork()
  console.log('Connected to', getNetworkName(chainId))
})

document.getElementById('deploy').addEventListener('click', async () => {
  const splitterAddresses = document.getElementById('splitter-addresses').value
  const splitterShares = document.getElementById('splitter-shares').value

  const ethersProvider = new ethers.providers.Web3Provider(provider)
  const factoryContract = (new ethers.Contract(
    factoryContractAddress,
    AbiContractFactory,
    ethersProvider
  )).connect(ethersProvider.getSigner())

  factoryContract.on('CouponContractDeployed', address => {
    console.log('CouponContractDeployed', address)
  })

  factoryContract.on('CouponBoxContractDeployed', address => {
    console.log('CouponBoxContractDeployed', address)
  })

  factoryContract.on('PaymentSplitterContractDeployed', address => {
    console.log('PaymentSplitterContractDeployed', address)
    document.getElementById('splitter-split-contract').value = address
    document.getElementById('transfer-erc20-receiver').value = address
  })

  const tx = await factoryContract.deploy(JSON.parse(splitterAddresses), JSON.parse(splitterShares))
  console.log('TxHash', tx.hash)

  const receipt = await tx.wait()
  console.log('Tx confirmed with status', receipt.status)
})

document.getElementById('get-erc20-state').addEventListener('click', async () => {
  const tokenAddress = document.getElementById('state-erc20-address').value

  const ethersProvider = new ethers.providers.Web3Provider(provider)
  const tokenContract = (new ethers.Contract(
    tokenAddress,
    AbiERC20,
    ethersProvider
  ))

  const name = await tokenContract.name()
  const symbol = await tokenContract.symbol()
  const balance = await tokenContract.balanceOf(account)
  console.log({ name, symbol, balance: balance.toString() })
})

document.getElementById('erc20-mint').addEventListener('click', async () => {
  const tokenAddress = document.getElementById('state-erc20-address').value

  const ethersProvider = new ethers.providers.Web3Provider(provider)
  const tokenContract = (new ethers.Contract(
    tokenAddress,
    AbiERC20,
    ethersProvider
  )).connect(ethersProvider.getSigner())

  const tx = await tokenContract.mint(1000000)
  console.log('TxHash', tx.hash)

  const receipt = await tx.wait()
  console.log('Tx confirmed with status', receipt.status)
})

document.getElementById('transfer-erc20').addEventListener('click', async () => {
  const tokenAddress = document.getElementById('transfer-erc20-address').value
  const receieverAddress = document.getElementById('transfer-erc20-receiver').value

  const ethersProvider = new ethers.providers.Web3Provider(provider)
  const tokenContract = (new ethers.Contract(
    tokenAddress,
    AbiERC20,
    ethersProvider
  )).connect(ethersProvider.getSigner())

  const balance = await tokenContract.balanceOf(account)
  console.log('Balance', balance.toString())
  const tx = await tokenContract.transfer(receieverAddress, balance)
  console.log('TxHash', tx.hash)

  const receipt = await tx.wait()
  console.log('Tx confirmed with status', receipt.status)
})

document.getElementById('splitter-split').addEventListener('click', async () => {
  const splitterAddress = document.getElementById('splitter-split-contract').value
  const splitterTokens = document.getElementById('splitter-split-tokens').value

  const ethersProvider = new ethers.providers.Web3Provider(provider)
  const splitterContract = (new ethers.Contract(
    splitterAddress,
    AbiExtendedPaymentSplitter,
    ethersProvider
  )).connect(ethersProvider.getSigner())

  const tx = await splitterContract.releaseForPayees(JSON.parse(splitterTokens))
  console.log('TxHash', tx.hash)

  const receipt = await tx.wait()
  console.log('Tx confirmed with status', receipt.status)
})
