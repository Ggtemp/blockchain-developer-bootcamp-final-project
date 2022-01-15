

const Donate = artifacts.require("Donate");
const { catchRevert } = require("./utils/expections")

contract("Donate", function(accounts){

    const [contractOwner, Alice] = accounts;


      
    it("should assert true", async function (){
        await Donate.deployed();
        return assert.isTrue(true);
    });


    it("has an initial value of 0", async() => {
        //get contract
        const dInstance = await Donate.deployed();

        //verify is has an initial value of 0
        const storedData = await dInstance.numOfFunders.call()
        assert.equal(storedData, 0,  `Initial state should be zero`);
    })

    it("is owned by owner", async() => {
        //get contract
        const dInstance = await Donate.deployed();

        //verify is has an initial value of 0
        const owner = await dInstance.owner.call()
        assert.equal(owner, contractOwner, `Is not the owner`);
    })

    it("should fail when withdrawing with NOT owner address", async () => {
        const dInstance = await Donate.deployed();
        const value = "10000000000000000"
        await catchRevert(dInstance.withdraw(value, {from: Alice}))
      })

      before(async () => {
          const dInstance = await Donate.deployed();
          currentOwner = await dInstance.owner.call()
      })

      it("should fail when contract is not stopped", async () => {
          const dInstance = await Donate.deployed();
          await catchRevert(dInstance.emergencyWithdraw({from: contractOwner}))
      })

      
        
    
      
    
      

});

