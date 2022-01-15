// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./Owned.sol";
import "./IDonate.sol";

contract Donate is Owned, IDonate {

  uint public numOfFunders;
  bool public isStopped = false;
 
  mapping(address => bool) private funders;
  mapping(uint => address) private lutFunders;

  modifier limitWithdraw(uint withdrawAmount) {
    require(
      withdrawAmount <= 100000000000000000,
      "Cannot withdraw more than 0.1 ether"
    );
    _;
  }

  modifier onlyWhenNotStopped {
    require(!isStopped);
    _;
  
  }
  modifier onlyWhenStopped {
    require(isStopped);
    _;
  
  }


  receive() external payable {}

  function addFunds() override external payable onlyWhenNotStopped {
    address funder = msg.sender;
    if (!funders[funder]) {
      uint index = numOfFunders++;
      funders[funder] = true;
      lutFunders[index] = funder;
    }
  }

  function stopContract() external onlyOwner {
    isStopped = true;
    // only owner should have access to
  }

  function resumeContract() external onlyOwner {
    isStopped = false;
    // only owner should have access to
  }

  /*function withdraw(uint withdrawAmount) override external onlyOwner onlyWhenNotStopped limitWithdraw(withdrawAmount) {
    payable(msg.sender).transfer(withdrawAmount);
  }*/

  function withdraw(uint withdrawAmount) override external onlyOwner onlyWhenNotStopped limitWithdraw(withdrawAmount) {
    (bool success, ) = owner.call{value: withdrawAmount}("");
    require(success, "Transfer failed."); 
  }

  function emergencyWithdraw() external onlyOwner onlyWhenStopped {
    (bool success, ) = owner.call{value: address(this).balance}("");
    require(success, "Transfer failed."); 
  }

  
  function getAllFunders() external view returns (address[] memory) {
    address[] memory _funders = new address[](numOfFunders);

    for (uint i = 0; i < numOfFunders; i++) {
      _funders[i] = lutFunders[i];
    }

    return _funders;
  }

  function getFunderAtIndex(uint8 index) external view returns(address) {
    return lutFunders[index];
  }

}
