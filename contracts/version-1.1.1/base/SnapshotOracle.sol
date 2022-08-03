// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.7.0;

import "./HydraStakeManager.sol";
import "../GnosisSafe.sol";

/// @title SnapshotOracle - Calls Gnosis Safe Proxy to set or remove eligible owners
contract SnapshotOracle {

    address payable public bnHYDRA;
    address internal constant SENTINEL_OWNER = address(0x1);

    // 6 months trailing period calculated in blocks (15778800 seconds divided by 128 seconds - average blocktime)
    uint32 public constant TRAILING_PERIOD = 123272;

    // minimum amount of hydra owned to be eligible for admin role
    uint64 public constant ELIGIBLE_HYDRA_BALANCE_MIN = 10000 * 1e8;

    constructor (address payable _bnHYDRA) public {
        bnHYDRA = _bnHYDRA;
    }

    // Owner address cannot be zero address or sentinel owner.
    modifier onlyValidAddress(address addr) {
        require(addr != address(0) && addr != SENTINEL_OWNER, "SnapshotOracle: Invalid owner address provided");
        _;
    }

    function addAdminWithTreshhold(address admin, uint256 _threshold, address payable safeProxy)
        public
        onlyValidAddress(admin) 
    {
        // Check balance of new admin if eligible
        // require(_getBalanace(admin) >= ELIGIBLE_HYDRA_BALANCE_MIN, "SnapshotOracle: Below eligible hydra balance");

        // Check if new admin has atleast 6 months of staking activity
        // require(_getPastVotesTrailingPeriod(admin) > 0, "SnapshotOracle: Needs atleast 6 months of staking activity");

        // Add eligible admin to GnosisSafe
        GnosisSafe(safeProxy).addOwnerWithThreshold(admin, _threshold);
    }

    function removeAdmin(address prevAdmin, address admin, uint256 _threshold, address payable safeProxy) 
        public
    {
        // Check balance of admin to remove
        // require(_getBalanace(admin) < ELIGIBLE_HYDRA_BALANCE_MIN, "SnapshotOracle: Must be below eligible hydra balance to remove admin");

        // Check if new admin has atleast 6 months of NON staking activity
        // require(_getPastVotesTrailingPeriod(admin) == 0, "SnapshotOracle: Needs atleast 6 months of NON staking activity");

        // Remove non eligible admin from GnosisSafe
        GnosisSafe(safeProxy).removeOwner(prevAdmin, admin, _threshold);
    }
    
    function changeThreshold(uint256 _threshold, address payable safeProxy) 
        public
    {
        // Check balance of admin to remove
        // require(_getBalanace(admin) < ELIGIBLE_HYDRA_BALANCE_MIN, "SnapshotOracle: Must be below eligible hydra balance to remove admin");

        // Check if new admin has atleast 6 months of NON staking activity
        // require(_getPastVotesTrailingPeriod(admin) == 0, "SnapshotOracle: Needs atleast 6 months of NON staking activity");

        // Remove non eligible admin from GnosisSafe
        GnosisSafe(safeProxy).changeThreshold(_threshold);
    }

    function _getBalanace(address addr)
        private
        view
        returns (uint256)
    {
        return HydraStakeManager(bnHYDRA).balanceOf(addr);
    }

    function _getPastVotesTrailingPeriod(address addr)
        private
        view
        returns (uint256)
    {
        require(block.number >= TRAILING_PERIOD, "SnapshotOracle: Not enough blocks created");
        return HydraStakeManager(bnHYDRA).getPastVotes(addr, block.number - TRAILING_PERIOD);
    }
    
}