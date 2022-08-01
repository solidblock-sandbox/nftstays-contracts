// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./openzeppelin-v4.7.0/utils/Context.sol";
import "./Coupon.sol";
import "./CouponBox.sol";
import "./ExtendedPaymentSplitter.sol";

contract PaymentSplitterFactory {
    function deploy(address[] memory payees, uint256[] memory shares) public returns(ExtendedPaymentSplitter) {
        ExtendedPaymentSplitter splitterInstance = new ExtendedPaymentSplitter(payees, shares);
        return splitterInstance;
    }
}

contract CouponFactory {
    function deploy(address owner) public returns(Coupon){
        address proxyRegistryAddress = 0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101;

        Coupon couponInstance = new Coupon(proxyRegistryAddress);
        couponInstance.transferOwnership(owner);

        return couponInstance;
    }
}

contract CouponBoxFactory {
    function deploy(address owner, Coupon couponAddress) public returns(CouponBox){
        address proxyRegistryAddress = 0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101;

        CouponBox couponBoxInstance = new CouponBox(proxyRegistryAddress, couponAddress);
        couponBoxInstance.transferOwnership(owner);

        return couponBoxInstance;
    }
}

contract ContractFactory is Context {
    event CouponContractDeployed(Coupon);
    event CouponBoxContractDeployed(CouponBox);
    event PaymentSplitterContractDeployed(ExtendedPaymentSplitter);

    PaymentSplitterFactory public splitterFactory;
    CouponFactory public couponFactory;
    CouponBoxFactory public couponBoxFactory;

    constructor (CouponFactory couponFactoryAddress, CouponBoxFactory couponBoxFactoryAddress, PaymentSplitterFactory splitterFactoryAddress) {
        couponFactory = couponFactoryAddress;
        couponBoxFactory = couponBoxFactoryAddress;
        splitterFactory = splitterFactoryAddress;
    }

    function deploy(address[] memory payees, uint256[] memory shares) public {
        Coupon couponInstance = couponFactory.deploy(_msgSender());
        emit CouponContractDeployed(couponInstance);

        CouponBox couponBoxInstance = couponBoxFactory.deploy(_msgSender(), couponInstance);
        emit CouponBoxContractDeployed(couponBoxInstance);

        ExtendedPaymentSplitter splitterInstance = splitterFactory.deploy(payees, shares);
        emit PaymentSplitterContractDeployed(splitterInstance);
    }
}
