// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./openzeppelin-v4.7.0/token/ERC20/ERC20.sol";

contract TestERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20 (name, symbol) {
        mint(1_000_000);
    }

    function mint(uint256 amount) public {
        _mint(_msgSender(), amount);
    }
}