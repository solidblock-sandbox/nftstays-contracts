// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ModifiedPaymentSplitter.sol";

contract ExtendedPaymentSplitter is ModifiedPaymentSplitter {
    event PaymentNotDue(address to);
    event ERC20PaymentNotDue(IERC20 indexed token, address to);

    constructor(address[] memory payees, uint256[] memory shares_) payable 
        ModifiedPaymentSplitter(payees, shares_) { }

    function releaseForPayees() public {
        uint256 failed = 0;
        for (uint256 i = 0; i < _payees.length; i++) {
            if (!_release(payable(_payees[i]))) {
                failed++;
                emit PaymentNotDue(_payees[i]);
            }
        }
        require (failed < _payees.length, "ExtendedPaymentSplitter: none of accounts are due payment");
    }

    function releaseForPayees(IERC20 token) public {
        uint256 failed = 0;
        for (uint256 i = 0; i < _payees.length; i++) {
            if (!_release(token, _payees[i])) {
                failed++;
                emit ERC20PaymentNotDue(token, _payees[i]);
            }
        }
        require (failed < _payees.length, "ExtendedPaymentSplitter: none of accounts are due payment");
    }
}
