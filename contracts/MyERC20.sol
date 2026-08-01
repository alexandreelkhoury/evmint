// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MyERC20
 * @dev ERC20 token with multi-chain fee support
 *
 * NOTE: This file is for REFERENCE ONLY.
 * The actual bytecode used for deployment is in:
 *   src/contracts/MyERC20Artifacts.ts
 *
 * The source code for verification is in:
 *   src/features/verification/sourceCodeFormatter.ts
 *
 * If you modify this contract, you must:
 * 1. Compile it with Solidity 0.8.30, optimization=200, viaIR=true, evmVersion=prague
 * 2. Update MyERC20Artifacts.ts with the new ABI and bytecode
 * 3. Update sourceCodeFormatter.ts with the flattened source
 */
contract MyERC20 is ERC20 {
    uint256 public immutable FEE; // Chain-specific fee (immutable, set at deployment)
    address payable public constant feeRecipient =
        payable(0x160788647f13271dF554aA3640025CA1560ecdE8);

    uint8 private immutable _decimalsValue;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_,
        uint8 decimals_,
        uint256 fee_ // Chain-specific fee parameter
    ) payable ERC20(name_, symbol_) {
        FEE = fee_; // Set fee from constructor parameter
        require(msg.value >= FEE, "Insufficient fee");
        require(decimals_ <= 18, "Too many decimals");

        _decimalsValue = decimals_;

        // Send fees to recipient
        (bool sent, ) = feeRecipient.call{value: FEE}("");
        require(sent, "Fee transfer failed");

        // Mint tokens to creator
        _mint(msg.sender, initialSupply_ * (10 ** uint256(decimals_)));

        // Refund excess if user sent too much
        if (msg.value > FEE) {
            (bool refunded, ) = msg.sender.call{value: msg.value - FEE}("");
            require(refunded, "Refund failed");
        }
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimalsValue;
    }
}