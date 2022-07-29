// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./opensea/ERC721Tradable.sol";

contract Coupon is ERC721Tradable {
    constructor(address _proxyRegistryAddress)
        ERC721Tradable("Coupon", "CPN", _proxyRegistryAddress)
    {}

    function baseTokenURI() override public pure returns (string memory) {
        return "https://creatures-api.opensea.io/api/creature/";
    }

    function contractURI() public pure returns (string memory) {
        return "https://creatures-api.opensea.io/api/creature/";
    }
}
