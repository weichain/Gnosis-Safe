// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.7.0;


import "../openzeppelin/ERC20/ERC20.sol";
import "../openzeppelin/ERC20/extensions/draft-ERC20Permit.sol";
import "../openzeppelin/ERC20/extensions/ERC20Votes.sol";


contract HydraStakeManager is ERC20, ERC20Permit, ERC20Votes {
    constructor() public ERC20("bnHYDRA", "bnH", 8) ERC20Permit("bnHYDRA") {}

    event  Deposit(address indexed dst, uint wad);
    event  Withdrawal(address indexed src, uint wad);

    // The following functions are overrides required by Solidity.
    
    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
    {
        super._burn(account, amount);
    }

    function() external payable {
        deposit();
    }

    function deposit() public payable {
        _mint(msg.sender, msg.value);
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint wad) public payable {
        require(balanceOf(msg.sender) >= wad, "bnHYDRA: Not enough balance");
        _burn(msg.sender, wad);
        msg.sender.transfer(wad);
        emit Withdrawal(msg.sender, wad);
    }
}