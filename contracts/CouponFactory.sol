// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./openzeppelin-v4.7.0/utils/Context.sol";
import "./Coupon.sol";
import "./CouponBox.sol";
import "./ExtendedPaymentSplitter.sol";

contract CouponFactory is Context {
    event CouponContractDeployed(Coupon);
    event CouponBoxContractDeployed(CouponBox);
    event PaymentSplitterContractDeployed(ExtendedPaymentSplitter);

    function deploy(address[] memory payees, uint256[] memory shares) public {
        address proxyRegistryAddress = 0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101;

        Coupon couponInstance = new Coupon(proxyRegistryAddress);
        couponInstance.transferOwnership(_msgSender());
        emit CouponContractDeployed(couponInstance);

        CouponBox couponBoxInstance = new CouponBox(proxyRegistryAddress);
        couponBoxInstance.transferOwnership(_msgSender());
        emit CouponBoxContractDeployed(couponBoxInstance);

        ExtendedPaymentSplitter splitterInstance = new ExtendedPaymentSplitter(payees, shares);
        emit PaymentSplitterContractDeployed(splitterInstance);
    }
}