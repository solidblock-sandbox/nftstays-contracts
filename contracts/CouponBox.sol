// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./opensea/ERC1155Tradable.sol";
import "./Coupon.sol";

//   if (network === 'rinkeby') {
//     proxyRegistryAddress = "0x1E525EEAF261cA41b809884CBDE9DD9E1619573A";
//   } else {
//     proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
//   }

contract CouponBox is ERC1155Tradable {

    event AllowedForOperator(address);

    Coupon public coupon;
    constructor(address _proxyRegistryAddress)
        ERC1155Tradable(
            "CouponBox",
            "CPNBOX",
            "https://creatures-api.opensea.io/api/accessory/{id}",
            _proxyRegistryAddress
        ) {
            coupon = new Coupon(_proxyRegistryAddress);
            coupon.transferOwnership(msgSender());
        }

    function contractURI() public pure returns (string memory) {
        return "https://creatures-api.opensea.io/contract/opensea-erc1155";
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory /*data*/
    ) public virtual override {
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "ERC1155: caller is not owner nor approved"
        );
        _burn(from, id, amount);
        for (uint256 i = 0; i < amount; i++) {
            coupon.mintTo(to);
        }
        emit AllowedForOperator(_msgSender());
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory /*data*/
    ) public virtual override {
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "ERC1155: transfer caller is not owner nor approved"
        );

        _burnBatch(from, ids, amounts);
        for (uint256 i = 0; i < amounts.length; i++) {
            uint256 amount = amounts[i];
            for (uint256 j = 0; j < amount; j++) {
                coupon.mintTo(to);
            }
        }
        emit AllowedForOperator(_msgSender());
    }
}
