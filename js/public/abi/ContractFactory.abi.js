const AbiContractFactory = [
  {
    inputs: [
      {
        internalType: 'contract CouponFactory',
        name: 'couponFactoryAddress',
        type: 'address'
      },
      {
        internalType: 'contract CouponBoxFactory',
        name: 'couponBoxFactoryAddress',
        type: 'address'
      },
      {
        internalType: 'contract PaymentSplitterFactory',
        name: 'splitterFactoryAddress',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'contract CouponBox',
        name: '',
        type: 'address'
      }
    ],
    name: 'CouponBoxContractDeployed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'contract Coupon',
        name: '',
        type: 'address'
      }
    ],
    name: 'CouponContractDeployed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'contract ExtendedPaymentSplitter',
        name: '',
        type: 'address'
      }
    ],
    name: 'PaymentSplitterContractDeployed',
    type: 'event'
  },
  {
    inputs: [],
    name: 'couponBoxFactory',
    outputs: [
      {
        internalType: 'contract CouponBoxFactory',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'couponFactory',
    outputs: [
      {
        internalType: 'contract CouponFactory',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'payees',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: 'shares',
        type: 'uint256[]'
      }
    ],
    name: 'deploy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'splitterFactory',
    outputs: [
      {
        internalType: 'contract PaymentSplitterFactory',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]
