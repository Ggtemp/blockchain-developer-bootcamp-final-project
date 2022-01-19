
import { useCallback, useEffect, useState } from "react";
import "./App.css";

import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from "./utils/load-contract";


function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    isProviderLoaded: false,
    web3: null,
    contract: null
  })

  const [balance, setBalance] = useState(null)
  const [account, setAccount] = useState(null)
  const [shouldReload, reload] = useState(false)

  const canConnectToContract = account && web3Api.contract
  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload])

  const setAccountListener = provider => {
    provider.on("accountsChanged", _ => window.location.reload())
    provider.on("chainChanged", _ => window.location.reload())
  }

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider()

      if (provider) {
        const contract = await loadContract("Donate", provider)
        setAccountListener(provider)
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
          isProviderLoaded: true
        })
      } else {
        setWeb3Api(api => ({...api, isProviderLoaded: true}))
        console.error("Please, install Metamask.")
      }
    }

    loadProvider()
  }, [])

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api
      const balance = await web3.eth.getBalance(contract.address)
      setBalance(web3.utils.fromWei(balance, "ether"))
    }
    web3Api.contract && loadBalance()
  }, [web3Api, shouldReload])

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts()
      setAccount(accounts[0])
    }
    web3Api.web3 && getAccount()
  }, [web3Api.web3])

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether")
    })

    reloadEffect()
  }, [web3Api, account, reloadEffect])

  const withdraw = async () => {
    const { contract, web3 } = web3Api
    const withdrawAmount = web3.utils.toWei("0.1", "ether")
    await contract.withdraw(withdrawAmount, {
      from: account
    })
    reloadEffect()
  }

  return (
    <>
       <section className="hero is-halfheight is-bold">
           <div className="hero-head">
             <header className="navbar ">
               <div className="container">
                 <div className="navbar-brand">
                 { web3Api.isProviderLoaded ?
                    <div className="is-flex is-align-items-center">
                      <span>
                        <strong className="mr-2 has-text-white" >Account: </strong>
                      </span>
                        { account ?
                          <div className ="has-background-danger-light has-text-danger-dark p-3 is-size-5 is-rounded">{account}</div> :
                          !web3Api.provider ?
                          <>
                            <div className="notification is-warning is-size-6 is-rounded">
                              Wallet is not detected!{` `}
                              <a
                                rel="noreferrer"
                                target="_blank"
                                href="https://metamask.io/download/">
                                Install Metamask
                              </a>
                            </div>
                          </> :
                          <button
                            className="button mr-2 has-background-danger has-text-white is-link "
                            onClick={() =>
                              web3Api.provider.request({method: "eth_requestAccounts"}
                            )}
                          >
                            Connect Wallet
                          </button>
                        }
                    </div> :
                    
                    <span className="has-text-white  ">Looking for Web3...</span>
                  }
                   <span className="navbar-burger" data-target="navbarMenuHeroC">
                   <span></span>
                   <span></span>
                   <span></span>
                   </span>
                 </div>
                 <div id="navbarMenuHeroC" className="navbar-menu">
                   <div className="navbar-end">
                   <div className="buttons">
                           <button
                               className="button is-primary has-background-link">Admin
                            </button>
                            <button
                              disabled={!canConnectToContract}
                              onClick={withdraw}
                              className="button is-danger is-light">Withdraw
                            </button>
                          </div>
                   </div>
                 </div>
               </div>
             </header>
           </div>
          
         
          <div className="hero-body"></div>   
            
        </section>   
        <div className="donate-wrapper">  
            
             <div className="donate">
               { web3Api.isProviderLoaded ?
                 <div className="is-flex is-align-items-center">
                   <span>
                     <strong className="mr-2 has-text-white" >Account: </strong>
                   </span>
                     { account ?
                       <div className="has-background-danger-light has-text-danger-dark p-4 is-size-5">{account}</div> :
                       !web3Api.provider ?
                       <>
                         <div className="notification is-warning is-size-6 is-rounded">
                           Wallet is not detected!{` `}
                           <a
                             rel="noreferrer"
                             target="_blank"
                             href="https://metamask.io/download/">
                             Install Metamask
                           </a>
                         </div>
                       </> :
                       <button
                         className="button mr-2 has-background-danger has-text-white is-link"
                         onClick={() =>
                           web3Api.provider.request({method: "eth_requestAccounts"}
                         )}
                       >
                         Connect Wallet
                       </button>
                     }
                 </div> :
                 <span>Looking for Web3...</span>
               }
                
               { !canConnectToContract &&
                 <span className="is-block has-text-white">
                   Connect to ropsten
                 </span>
               }
              
               <button
                 disabled={!canConnectToContract}
                 onClick={addFunds}
                 className="button is-link mt-6 has-background-danger is-large is-fullwidth">
                   Donate 1 eth
                 </button>
                 <div className="balance-view is-size-2 my-4 is-flex is-align-items-center has-text-white">
                  Donations : &nbsp; <strong className="has-text-white">{balance}</strong>&nbsp;eth
                </div>
              
               
             </div>
 
             
           </div>
    </>
  );
}

export default App;


