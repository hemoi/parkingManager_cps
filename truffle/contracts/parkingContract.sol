pragma solidity ^0.5.16;

contract parkingManager{
    
    // fee
    uint etherPerTime = 0.01 ether;

    // manager's address
    address payable owner;

    event SuccessPayment(uint fee);
    event QueryBalance(uint balance);

    function payMoney(uint8 time) external payable{
        uint fee = etherPerTime * time;
        require(msg.value >= fee, "not enough money");
        address(this).transfer(fee);

        // emit Event
        emit SuccessPayment(fee);

        msg.sender.transfer(msg.value - fee);
    }

    function withdraw() external payable onlyOwner returns (string memory){
        require(address(this).balance > 0, "withdraw Failed");

        owner.transfer(address(this).balance);
        return("withdraw Success");
    }

    function queryEther() external view returns (uint){
        return(address(this).balance);
    }

    modifier onlyOwner(){
        require(owner == msg.sender, "only for onwer");
        _;
    }

    // call when contract create
    constructor () public {
        owner = msg.sender;
    }
    
    function () external payable {

    }
}