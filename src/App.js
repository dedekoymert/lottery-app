import { useEffect, useState } from 'react';
import { ethers } from "ethers";
import tlAbi from './TLabi.json';
import lotteryAbi from './lotteryAbi.json'




function App() {

  // const [account, setAccount] = useState(); // state variable to set account.
  
  ///< Selected user address
  window.userAddress = null;
  //const [tl, setTl] = useState();
  //const [lotteryContract, setLotteryContract] = useState();
  const lotteryAddress = '0x34Ff7116840379e60C005E88752B137ab1a76328';
  const tlAddress = '0x43257e0cBd6De3A840243B738b56C103629C7670';



  // window.userAddress = null;
  // window.deployedAddress = null;
  // window.contract = null;



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
        setUserAddress(selectedAccount);
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

  async function getInfoFromContract() {
    // Update the document title using the browser API
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const tlContract = new ethers.Contract(tlAddress, tlAbi, provider);

    const tokenName = await tlContract.name();
    const tokenSymbol = await tlContract.symbol();
    const tokenSupply = await tlContract.totalSupply();

    console.log("tokenName ",tokenName);
    console.log("symbol ", tokenSymbol);
    console.log("supply ", tokenSupply.toString());

 
  }

  async function getAccountBalance() {
   if (window.web3) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        
        const tlContract = new ethers.Contract(tlAddress, tlAbi, provider);

    
        const balance = await tlContract.balanceOf(userAddress);

        console.log("Balance of the user: ", balance.toString() );
      
        showAccount(); 
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("No ETH brower extension detected.");
    }
  }

   async function approveTrial() {

      if (window.web3) {
      try {

      
        const provider = new ethers.providers.Web3Provider(window.ethereum);
      
        //await provider.send("eth_requestAccounts",[]);
        const signer =   provider.getSigner();

        const tlContract = new ethers.Contract(tlAddress, tlAbi, signer);
       

      await tlContract.approve(lotteryAddress, "1000000000000000000000");

        
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Change the error");
    }


    //await tl.approve(lotteryAddress, transferApproveAmount, { from: window.userAddress });
  }


  async function approveHandler(event) {
    event.preventDefault();
    if (window.web3) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      //await provider.send("eth_requestAccounts",[]);
        const signer =   provider.getSigner();

        const tlContract = new ethers.Contract(tlAddress, tlAbi, signer);
  
  
        await tlContract.approve(lotteryAddress, transferApproveAmount); 

      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Change the error");
    }
  }
  async function depositTrial() {

    if (window.web3) {
      try {

      
        const provider = new ethers.providers.Web3Provider(window.ethereum);
      
        //await provider.send("eth_requestAccounts",[]);
        const signer = await provider.getSigner();

        const lotteryContract = new ethers.Contract(lotteryAddress, lotteryAbi, signer);
       

        await lotteryContract.depositTL("10"); 


      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Change the error");
    }

  //  await lotteryContract.depositTl(depositAmount);
  }

  async function depositHandler(event) {
    event.preventDefault();

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //await provider.send("eth_requestAccounts",[]);
    const signer =  provider.getSigner();

    const lotteryContract = new ethers.Contract(lotteryAddress, lotteryAbi, signer);

    await lotteryContract.depositTL(depositAmount); 
   
  //  await lotteryContract.depositTl(depositAmount);
  }

  async function withdrawHandler(event) {
    event.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
       
    // await provider.send("eth_requestAccounts",[]);
    const signer =  provider.getSigner();

    const lotteryContract = new ethers.Contract(lotteryAddress, lotteryAbi, signer);
    await lotteryContract.withdrawTL(withdrawAmount);
  }

  async function randomNumberHandler()  {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
       
    //await provider.send("eth_requestAccounts",[]);
    const signer =  provider.getSigner();

    const lotteryContract = new ethers.Contract(lotteryAddress, lotteryAbi, signer);
    const number =  await lotteryContract.random();

    console.log("random number: ", number.toString());

    setRandomNumber(number.toString());
  }
  
  async function hashNumberHandler(event) {
    event.preventDefault()
    const provider = new ethers.providers.Web3Provider(window.ethereum);
       
    // await provider.send("eth_requestAccounts",[]);
    const signer =  provider.getSigner();

    const lotteryContract = new ethers.Contract(lotteryAddress, lotteryAbi, signer);
    if(randomNumber !== undefined) {
      const hash = await lotteryContract.hash_your_random_number(randomNumber);
      setHashedNumber(hash.toString());
    }
  }

  async function buyTicketHandler() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
       
    await provider.send("eth_requestAccounts",[]);
    const signer =  provider.getSigner();

    const lotteryContract = new ethers.Contract(lotteryAddress, lotteryAbi, signer);
    if(hashedNumber !== undefined) {
      await lotteryContract.buyTicket(hashedNumber);
    }
  }

  async function collectTicketRefundHandler() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
       
    await provider.send("eth_requestAccounts",[]);
    const signer =  provider.getSigner();

    const lotteryContract = new ethers.Contract(lotteryAddress, lotteryAbi, signer);
    await lotteryContract.collectTicketRefund(ticketRefund);   
  }

  async function revealRandomNumberHandler() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
       
    await provider.send("eth_requestAccounts",[]);
    const signer =  provider.getSigner();

    const lotteryContract = new ethers.Contract(lotteryAddress, lotteryAbi, signer);
    await lotteryContract.revealRndNumber(revealedRandomNumber);   
  }

  async function getLastOwnedHandler(event) {
    event.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
       
    const signer =  provider.getSigner();

    const lotteryContract = new ethers.Contract(lotteryAddress, lotteryAbi, signer);
    const ticket = await lotteryContract.getLastOwnedTicketNo(lotteryNoLastOwned);
    setTicketLastOwned(ticket.toString());
  }

  async function getIthOwnedHandler(event) {
    event.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
       
    const signer =  provider.getSigner();

    const lotteryContract = new ethers.Contract(lotteryAddress, lotteryAbi, signer);
    const ticket = await lotteryContract.getIthOwnedTicketNo(ownedIndex, ticketIthOwned);
    setTicketIthOwned(ticket.toString());
  }

  async function checkIfTicketWonHandler(event) {
    event.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
       
    const signer =  provider.getSigner();

    const lotteryContract = new ethers.Contract(lotteryAddress, lotteryAbi, signer);
    const winAmount = await lotteryContract.checkIfTicketWon(ticketIfWon);  
    setTicketWinAmount(winAmount);
  }

  async function collectTicketPrizeHandler(event) {
    event.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
       
    const signer =  provider.getSigner();

    const lotteryContract = new ethers.Contract(lotteryAddress, lotteryAbi, signer);
    await lotteryContract.collectTicketPrize(ticketCollectPrize);  
  }

  async function getIthWinningTicketHandler(event) {
    event.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
       
    const signer =  provider.getSigner();

    const lotteryContract = new ethers.Contract(lotteryAddress, lotteryAbi, signer);
    const result = await lotteryContract.getIthWinningTicket(winnerIndex, lotteryNoIthWinning);
    setTicketIthOwnedWinning(result[0].toString());
    setAmountIthWinning(result[1]);
  }

  async function getLotteryNoHandler(event) {
    event.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
       
    const signer =  provider.getSigner();

    const lotteryContract = new ethers.Contract(lotteryAddress, lotteryAbi, signer);
    const lotteryNumber = await lotteryContract.getLotteryNo(unixTime);  
    setLotteryNo(lotteryNumber.toString());
  }

  async function getTotalLotteryMoneyCollectedHandler(event) {
    event.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
       
    const signer =  provider.getSigner();

    const lotteryContract = new ethers.Contract(lotteryAddress, lotteryAbi, signer);
    const amount = await lotteryContract.getTotalLotteryMoneyCollected(lotteryNoMoneyCollected);
    setMoneyCollected(amount.toString());
  }

  async function getLotteryWinnersHandler(event) {
    event.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
       
    const signer =  provider.getSigner();

    const lotteryContract = new ethers.Contract(lotteryAddress, lotteryAbi, signer);
    await lotteryContract.get_winners(lotteryNoWinners);
  }

  const [userAddress, setUserAddress] = useState('');
  const [transferApproveAmount, setTransferApproveAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [randomNumber, setRandomNumber] = useState('');
  const [hashedNumber, setHashedNumber] = useState('');
  const [ticketRefund, setTicketRefund] = useState('');
  const [revealedRandomNumber, setRevealedRandomNumber] = useState('');
  const [lotteryNoLastOwned, setLotteryNoLastOwned] = useState('');
  const [ticketLastOwned, setTicketLastOwned] = useState('');
  const [lotteryNoIthOwned, setLotteryNoIthOwned] = useState('');
  const [ticketIthOwned, setTicketIthOwned] = useState('');
  const [ownedIndex, setOwnedIndex] = useState('');
  const [ticketIfWon, setTicketIfWon] = useState('')
  const [ticketWinAmount, setTicketWinAmount] = useState('');
  const [ticketCollectPrize, setTicketCollectPrize] = useState('')
  const [lotteryNoIthWinning, setLotteryNoIthWinning] = useState('');
  const [ticketIthWinning, setTicketIthOwnedWinning] = useState('');
  const [amountIthWinning, setAmountIthWinning] = useState('');
  const [winnerIndex, setWinnerIndex] = useState('');
  const [unixTime, setUnixTime] = useState('');
  const [lotteryNo, setLotteryNo] = useState('');
  const [lotteryNoMoneyCollected, setLotteryNoMoneyCollected] = useState('');
  const [moneyCollected, setMoneyCollected] = useState('');
  const [lotteryNoWinners, setLotteryNoWinners] = useState('');

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

            <button onClick={getInfoFromContract}
                className="rounded bg-blue-500 hover:bg-blue-700 py-2 px-4 text-white">
                Get Info
            </button>

            <button onClick={approveTrial}
                className="rounded bg-blue-500 hover:bg-blue-700 py-2 px-4 text-white">
                Approve Trial
            </button>

            <button onClick={depositTrial}
                className="rounded bg-blue-500 hover:bg-blue-700 py-2 px-4 text-white">
                DEposit Trial
            </button>

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
                    required={true}
                    onChange={(e) => setTransferApproveAmount(e.target.value)}
                    />
                </label>
                <input type="submit" value="Approve" />
              </form>
            </div>
          
            <div>
              <form onSubmit={depositHandler}>
                <label>
                  Amount:
                  <input 
                    type="number" 
                    value={depositAmount}
                    required={true}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    />
                </label>
                <input type="submit" value="Deposit TL" />
              </form>
            </div>
            <div>
              <form onSubmit={withdrawHandler}>
                <label>
                  Amount:
                  <input 
                    type="number" 
                    value={withdrawAmount}
                    required={true}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                </label>
                <input type="submit" value="Withdraw TL" />
              </form>
            </div>
            <hr/>
            <div>
              <button onClick={randomNumberHandler}>
                  Generate a random number
              </button>
              <label>
                " {randomNumber} "
              </label>
            </div>
            <div>
              <button onClick={hashNumberHandler}>
                  Hash your random number
              </button>
              <label>
                " {hashedNumber} "
              </label>
            </div>
            <div>
              <form onSubmit={buyTicketHandler}>
                <label>
                  Your hashed random number: " " {hashedNumber}
                </label>
                <input type="submit" value="Buy ticket" />
              </form>
            </div>
            <hr/>
            <div>
              <form onSubmit={collectTicketRefundHandler}>
              <label>
                Ticket No:
                <input 
                  type="text" 
                  value={ticketRefund}
                  required={true}
                  onChange={(e) => setTicketRefund(e.target.value)}
                  />
              </label>
              <input type="submit" value="Collect ticket refund" />
              </form>
            </div>
            <div>
              <form onSubmit={revealRandomNumberHandler}>
              <label>
                Random number:
                <input 
                  type="number" 
                  value={revealedRandomNumber}
                  required={true}
                  onChange={(e) => setRevealedRandomNumber(e.target.value)}
                />
              </label>
              <input type="submit" value="Reveal random number" />
              </form>
            </div>
            <div>
              <form onSubmit={getLastOwnedHandler}>
              <label>
                Lottery No:
                <input 
                  type="number" 
                  value={lotteryNoLastOwned}
                  required={true}
                  onChange={(e) => setLotteryNoLastOwned(e.target.value)}
                />
              </label>
              <input type="submit" value="Get last owned ticket" />
              <label>
                Ticket No: {ticketLastOwned}
              </label>
              </form>
            </div>
            <div>
              <form onSubmit={getIthOwnedHandler}>
              <label>
                Lottery No:
                <input 
                  type="number" 
                  value={lotteryNoIthOwned}
                  required={true}
                  onChange={(e) => setLotteryNoIthOwned(e.target.value)}
                />
              </label>
              <label>
                Index:
                <input 
                  type="number" 
                  value={ownedIndex}
                  required={true}
                  onChange={(e) => setOwnedIndex(e.target.value)}
                />
              </label>
              <input type="submit" value="Get ith owned ticket" />
              <label>
                Ticket No: {ticketIthOwned}
              </label>
              </form>
            </div>
            <div>
              <form onSubmit={checkIfTicketWonHandler}>
                <label>
                  Ticket No:
                  <input 
                    type="number" 
                    value={ticketIfWon}
                    required={true}
                    onChange={(e) => setTicketIfWon(e.target.value)}
                    />
                </label>
                <input type="submit" value="Check if ticket won" />
                <label>
                  Amount won: {ticketWinAmount}
                </label>
              </form>
            </div>
            <div>
              <form onSubmit={collectTicketPrizeHandler}>
                <label>
                  Ticket No:
                  <input 
                    type="text" 
                    value={ticketCollectPrize}
                    required={true}
                    onChange={(e) => setTicketCollectPrize(e.target.value)}
                  />
                </label>
                <input type="submit" value="Collect ticket prize" />
              </form>
            </div>
            <div>
              <form onSubmit={getIthWinningTicketHandler}>
              <label>
                Lottery No:
                <input 
                  type="number" 
                  value={lotteryNoIthWinning}
                  required={true}
                  onChange={(e) => setLotteryNoIthWinning(e.target.value)}
                />
              </label>
              <label>
                Winner index:
                <input 
                  type="number" 
                  value={winnerIndex}
                  required={true}
                  onChange={(e) => setWinnerIndex(e.target.value)}
                />
              </label>
              <input type="submit" value="Get ith winning ticket" />
              <label>
                Ticket No: {ticketIthWinning}
              </label>
              <label>
                Amount: {amountIthWinning}
              </label>
              </form>
            </div>
            <div>
              <form onSubmit={getLotteryNoHandler}>
                <label>
                  Unix Time:
                  <input 
                    type="number" 
                    value={unixTime}
                    required={true}
                    onChange={(e) => setUnixTime(e.target.value)}
                    />
                </label>
                <input type="submit" value="Get lottery no" />
                <label>
                  Lottery No: {lotteryNo}
                </label>
              </form>
            </div>
            <div>
              <form onSubmit={getTotalLotteryMoneyCollectedHandler}>
              <label>
                Lottery No:
                <input 
                  type="number" 
                  value={lotteryNoMoneyCollected}
                  required={true}
                  onChange={(e) => setLotteryNoMoneyCollected(e.target.value)}
                />
              </label>
              <input type="submit" value="Get total money collected" />
              <label>
                Amount: {moneyCollected}
              </label>
              </form>
            </div>
            <hr/>
            <div>
              <form onSubmit={getLotteryWinnersHandler}>
              <label>
                Lottery No:
                <input 
                  type="number" 
                  value={lotteryNoWinners}
                  required={true}
                  onChange={(e) => setLotteryNoWinners(e.target.value)}
                />
              </label>
              <input type="submit" value="Get lottery winners" />
              </form>
            </div>
            <p id="deployedAddress" className="text-gray-600"></p>
            <p id="activeContractAddress-producer" className="text-gray-600"></p>  
        </div>
    </div>      
   );
}

export default App;