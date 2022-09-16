// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.7.0;

import "./HydraStakeManager.sol";
import "./OwnerManager.sol";

/// @title SnapshotOracle - Calls Gnosis Safe Proxy to set or remove eligible owners
contract SnapshotOracle {
    using SafeMath for uint256;
    address payable public bnHYDRA;
    address payable public gnosisSafeProxy;
    address internal constant SENTINEL_OWNER = address(0x1);

    // 12 months trailing period calculated in blocks ( 31560000 seconds divided by 128 seconds(average blocktime) )
    uint32 public constant TRAILING_PERIOD = 246562;

    // 1 week (7 days) period calculated in blocks ( 604800 seconds divided by 128 seconds(average blocktime) )
    uint32 public constant WEEK_IN_BLOCKS = 4725;

    // (TRAILING_PERIOD / WEEK_IN_BLOCKS) to check full 12 months period - week by week on every exact 7 days timeframe
    uint8 public constant REVISION_COUNT = 52;

    // minimum amount of hydra owned to be eligible for admin role
    uint64 public constant ELIGIBLE_HYDRA_BALANCE_MIN = 10000 * 1e8;
    
    // presicion to calculate persentage of admins since division with float numbers is not permited
    uint256 public precision = 10 ** 4;

    uint8 public thresholdPercentage;

    event ThresholdPercentageChanged(uint8 previous, uint8 current);

    constructor (address payable _gnosisSafeProxy, address payable _bnHYDRA, uint8 _thresholdPercentage) 
        public 
        isValidAddress(_gnosisSafeProxy)
        isValidAddress(_bnHYDRA)
        isValidPercentage(_thresholdPercentage)
    {
        gnosisSafeProxy = _gnosisSafeProxy;
        bnHYDRA = _bnHYDRA;
        thresholdPercentage = _thresholdPercentage;
    }

    // Owner address cannot be zero address or sentinel owner.
    modifier isValidAddress(address addr) {
        require(addr != address(0) && addr != SENTINEL_OWNER, "SnapshotOracle: Invalid hydra address provided");
        _;
    }

    // Owner address cannot be zero address or sentinel owner.
    modifier isValidPercentage(uint8 _thresholdPercentage) {
        require(_thresholdPercentage > 0 && _thresholdPercentage <= 100, "Threshold percentage must be between 1 ~ 100");
        _;
    }

    function addAdminWithTreshhold(address admin)
        public
        isValidAddress(admin) 
    {
        // // Check balance of new admin if eligible
        // require(address(admin).balance >= ELIGIBLE_HYDRA_BALANCE_MIN, "SnapshotOracle: Below eligible hydra balance");

        // // Check if new admin has atleast 6 months of staking activity
        // require(isEligible(admin), "SnapshotOracle: Needs atleast 12 months of staking activity");

        address[] memory owners = OwnerManager(gnosisSafeProxy).getOwners();
        
        // Add eligible admin to GnosisSafe
        OwnerManager(gnosisSafeProxy).addOwnerWithThreshold(admin, getAdminsByPercentage(owners.length + 1));
    }

    function removeAdmin(address prevAdmin, address admin) 
        public
        isValidAddress(admin)
    {
        // // Check balance of admin to remove
        // require(address(admin).balance < ELIGIBLE_HYDRA_BALANCE_MIN, "SnapshotOracle: Must be below eligible hydra balance to remove admin");

        // // Check if new admin has atleast 6 months of NON staking activity
        // require(!isEligible(admin), "SnapshotOracle: Needs atleast 12 months of NON staking activity");

        address[] memory owners = OwnerManager(gnosisSafeProxy).getOwners();

        // Remove non eligible admin from GnosisSafe
        OwnerManager(gnosisSafeProxy).removeOwner(prevAdmin, admin, getAdminsByPercentage(owners.length - 1));
    }

    function isEligible(address addr)
        public
        view
        returns (bool)
    {
        require(block.number >= TRAILING_PERIOD, "SnapshotOracle: Not enough blocks created");
        uint256 currentBlockToTrack = block.number;
        uint256 cumulativeForPeriod = 0;
        for (uint256 i = 0; i < REVISION_COUNT; i++) {
            cumulativeForPeriod += HydraStakeManager(bnHYDRA).getPastVotes(addr, currentBlockToTrack);
            currentBlockToTrack -= WEEK_IN_BLOCKS;
        }
        if (cumulativeForPeriod > ELIGIBLE_HYDRA_BALANCE_MIN) {
            // average cumulative values must be >= to min eligible hydra staked (10_000 HYDRA)
            return cumulativeForPeriod.div(REVISION_COUNT) >= ELIGIBLE_HYDRA_BALANCE_MIN;
        } 
        return false;
    } 

    
    function getAdminsByPercentage(uint256 adminCount)
        public 
        view 
        returns (uint result) 
    {
        uint256 z = adminCount.mul(100).mul(thresholdPercentage);
        if (z > precision.mul(10)) {
            return z.div(precision);
        }
        result = 1;
        uint256 z_min = z.div(precision).mul(precision);
        if (z_min == 0) {
            return result;
        }
        uint256 z_max = z_min.add(precision);
        if (z.sub(precision.div(2)) <= z_min) {
            result = z_min.div(precision);
        }
        if (z.add(precision.div(2)) >= z_max) {
            result = z_max.div(precision);
        }
        return result;
    }
    
    function setThresholdPercentage(uint8 _thresholdPercentage)
        public 
        isValidPercentage(_thresholdPercentage)
    {
        require(OwnerManager(gnosisSafeProxy).isOwner(msg.sender), "SnapshotOracle: Sender is not an owner");
        require(thresholdPercentage != _thresholdPercentage, "SnapshotOracle: Identical threshold percentage value");
        uint8 previous = thresholdPercentage;
        thresholdPercentage = _thresholdPercentage;
        emit ThresholdPercentageChanged(previous, thresholdPercentage);
    }
}
