// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20 is ERC20 {
    uint256 public constant FEE = 0.02 ether;
    address payable public constant feeRecipient =
        payable(0x160788647f13271dF554aA3640025CA1560ecdE8);

    uint8 private immutable _decimalsValue;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_,
        uint8 decimals_
    ) payable ERC20(name_, symbol_) {
        require(msg.value >= FEE, "Insufficient fee");
        require(decimals_ <= 18, "Too many decimals"); // limite pour rester standard

        _decimalsValue = decimals_;

        // envoyer les frais direct à ton wallet
        (bool sent, ) = feeRecipient.call{value: FEE}("");
        require(sent, "Fee transfer failed");

        // mint tokens au créateur
        _mint(msg.sender, initialSupply_ * (10 ** uint256(decimals_)));

        // refund du surplus si l'utilisateur a envoyé trop
        if (msg.value > FEE) {
            (bool refunded, ) = msg.sender.call{value: msg.value - FEE}("");
            require(refunded, "Refund failed");
        }
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimalsValue;
    }
}