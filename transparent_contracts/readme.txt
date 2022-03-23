Commands to initialize miami coins
(contract-call? .miamicoin-auth initialize-contracts .miamicoin-core-v1)
(contract-call? .miamicoin-core-v1 register-user none)
::advance_chain_tip 200

Command to mint
(contract-call? .miamicoin-token mint u100 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5)

command to send
::set_tx_sender ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.miamicoin-token send-many 
    (default-to (list) (as-max-len? 
        (list {to: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG, amount: u50, memo: none}) 
        u200)))
::get_assets_maps

Commands for transparent_contract
::set_tx_sender ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
(contract-call? .transparent_contract register-campaign "Campaign 1" "url.com")
(contract-call? .transparent_contract register-donor "Donor 1"  'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5)
::set_tx_sender ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5

(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.transparent_contract process-donation-mia 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM u20)
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.transparent_contract get-donor-info 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.transparent_contract get-campaign-info 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)


Noteable functions:
send-token in miamicoin-token
mint in miamicoin-tokens
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.transparent_contract get-all-campaigns)
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.transparent_contract get-all-donors)



Wallets:
deployer: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
wallet_1: ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5
wallet_2: ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG
wallet_3: ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC








Main Demo: 

E
Donor Wallet: ST2G0KVR849MZHJ6YB4DCN8K5TRDVXF92A664PHXT
