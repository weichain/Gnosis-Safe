pragma solidity >=0.5.0 <0.7.0;

/// @title SnapshotAuthorized - authorizes current contract to perform actions if called from SnapshotOracle contract
contract SnapshotAuthorized {
    modifier snapshotAuthorized(address oracle) {
        require(msg.sender == oracle, "SnapshotAuthorized: Must be called from SnapshotOracle contract");
        _;
    }
}