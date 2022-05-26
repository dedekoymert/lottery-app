import { useEffect, useState } from 'react';
import { ethers } from "ethers";
import tlAbi from './TLabi.json';
import lotteryAbi from './lotteryAbi.json'


function App() {
  // const [account, setAccount] = useState(); // state variable to set account.
  
  ///< Selected user address
  window.userAddress = null;
  const [tl, setTl] = useState();
  const [lotteryContract, setLotteryContract] = useState();
  const lotteryAddress = '0x34Ff7116840379e60C005E88752B137ab1a76328';
  const tlAddress = '0x43257e0cBd6De3A840243B738b56C103629C7670';

  const [transferApproveAmount, setTransferApproveAmount] = useState(0);

  // window.userAddress = null;
  // window.deployedAddress = null;
  // window.contract = null;

  useEffect(() => {
    // Update the document title using the browser API
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const x = await provider.send("eth_requestAccounts", []);
    const tlContract = new ethers.Contract(tlAddress, tlAbi, provider);
    const lotteryContractAbi = new ethers.Contract(lotteryAddress, lotteryAbi, provider);

    setLotteryContract(lotteryContractAbi);
    setTl(tlContract);
  },[]);

  function showAddress() {
    if (!window.userAddress) {
      document.getElementById("userAddress").innerText = "";
      document.getElementById("hideButton").classList.add("hidden");
      return false;
    }

    document.getElementById(
      "userAddress"
    ).innerText = `Active User Address: ${window.userAddress}`;
    //document.getElementById("hideButton").classList.remove("hidden");
  }

  ///< Login with Web3 via Metamasks window.ethereum library
  async function loginWithEth() {
    if (window.web3) {
      try {
        // We use this since ethereum.enable() is deprecated. This method is not
        // available in Web3JS - so we call it directly from metamasks' library
        const selectedAccount = await window.ethereum
          .request({
            method: "eth_requestAccounts",
          })
          .then((accounts) => accounts[0])
          .catch(() => {
            throw Error("No account selected!");
          });
        window.userAddress = selectedAccount;
        window.localStorage.setItem("userAddress", selectedAccount);
        showAddress();
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("No ETH brower extension detected.");
    }
  }

  function showAccount() {
    if (!window.deployedAddress) {
      document.getElementById("deployedAddress").innerText = "";
      document.getElementById("hideButton").classList.add("hidden");
      return false;
    }

    document.getElementById(
      "deployedAddress"
    ).innerText = `Active User Address: ${window.deployedAddress}`;
    //document.getElementById("hideButton").classList.remove("hidden");
  }

  async function getAccountBalance() {
   if (window.web3) {
      try {

        const balance = await tl.balanceOf(window.userAddress);
        // const coolNumber = await window.contract.methods.name().call();
      
        console.log(ethers.providers.Web3Provider.fromWei(balance.toNumber(), "ether" ) );
      
        showAccount(); 
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("No ETH brower extension detected.");
    }
  }

  async function approveHandler() {
    await tl.approve(lotteryAddress, transferApproveAmount, { from: window.userAddress });

  }

  return (
    <div className="flex w-full h-fit justify-center content-center items-center space-x-4">
        <div className="flex flex-col space-y-18">
            <h1 className="text-center">Lottery</h1>
            <div className="flex flex-col space-y-2">
                <button onClick={loginWithEth}
                    className="rounded bg-white border border-gray-400 hover:bg-gray-100 py-2 px-4 text-gray-600 hover:text-gray-700">
                    Login Save ETH Address
                </button>
                <p id="userAddress" className="text-gray-600"></p>
                <p id="activeContractAddress-producer" className="text-gray-600"></p>
            </div>
            <button onClick={getAccountBalance}
                className="rounded bg-blue-500 hover:bg-blue-700 py-2 px-4 text-white">
                Get Balance
            </button>
            <div>
              <form onSubmit={approveHandler}>
                <label>
                  Amount:
                  <input 
                    type="text" 
                    value={transferApproveAmount}
                    onChange={(e) => setTransferApproveAmount(e.target.value)}
                    />
                </label>
                <input type="submit" value="Approve" />
              </form>
            </div>
            <p id="deployedAddress" className="text-gray-600"></p>
            <p id="activeContractAddress-producer" className="text-gray-600"></p>  
        </div>
    </div>      
   );
}

export default App;