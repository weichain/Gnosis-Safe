pragma solidity >=0.5.0 <0.7.0;

import "../base/SnapshotOracle.sol";

/// @title SnapshotAuthorized - authorizes current contract to perform actions if called from SnapshotOracle contract
contract SnapshotAuthorized {

    SnapshotOracle public oracle;

    modifier snapshotAuthorized() {
        require(msg.sender == address(oracle), "SnapshotAuthorized: Must be called from SnapshotOracle contract");
        _;
    }

    function setOracle(address _oracle, mapping(address => address) storage owners) internal {
        require(_oracle != address(0), "SnapshotAuthorized: Oracle cannot be zero address");
        require(owners[msg.sender] != address(0), "SnapshotAuthorized: Caller is not owner");
        oracle = SnapshotOracle(_oracle);
    }
}