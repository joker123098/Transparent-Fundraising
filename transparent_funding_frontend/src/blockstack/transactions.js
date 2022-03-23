
import { StacksMocknet } from '@stacks/network';
import { openContractCall } from '@stacks/connect';
import {
//   uintCV,
  stringAsciiCV,
  standardPrincipalCV,
  uintCV,
  intCV,
//   trueCV,
    cvToHex,
    cvToString,
    hexToCV,
    makeContractFungiblePostCondition,
    makeStandardFungiblePostCondition,
    FungibleConditionCode,
    createAssetInfo,
    makeContractCall,
    PostConditionMode

} from '@stacks/transactions';
import { getUserData } from './auth';
const BigNum = require("bn.js");


const APP_NAME = "Transparent Function"
const CONTRACT_ADDRESS = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
const CONTRACT_NAME = "transparent_contract"

const STACKS_API_URL = "http://localhost:3999"


export async function getCampaignInfo(address, callback) {
    const functionArgs = [
        
    ]
    const options = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'register-campaign',
        functionArgs: functionArgs,
        network: StacksMocknet,
        appDetails: {
          name: APP_NAME,
        },
        onFinish: callback,
        
    }
    await openContractCall(options);
}


export async function createCampaign(name, url, callback) {
    const functionArgs = [
        stringAsciiCV(name),
        stringAsciiCV(url)
    ]
    const options = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'register-campaign',
        functionArgs: functionArgs,
        network: StacksMocknet,
        appDetails: {
          name: APP_NAME,
        },
        onFinish: callback,
    }
    await openContractCall(options);
}

export async function donate(recipient,amount , callback) {
    const functionArgs = [
        standardPrincipalCV(recipient),
        uintCV(40)
    ];
    const userData = await getUserData();
    const senderAddress = userData.profile.stxAddress.testnet;
    const options = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'process-donation-mia',
        functionArgs: functionArgs,
        network: StacksMocknet,
        appDetails: {
          name: APP_NAME,
        },
        postConditionsMode: PostConditionMode.Allow,
        postConditions: [makeStandardFungiblePostCondition(senderAddress, FungibleConditionCode.Equal, new BigNum(40), createAssetInfo(CONTRACT_ADDRESS, "miamicoin-token", "miamicoin"))],
        onFinish: callback,
    }
    await openContractCall(options);
}


export async function addDonor(name, donor_address, callback) {
    const functionArgs = [
        stringAsciiCV(name),
        standardPrincipalCV(donor_address)
    ]
    const options = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'register-donor',
        functionArgs: functionArgs,
        network: StacksMocknet,
        appDetails: {
          name: APP_NAME,
        },
        onFinish: callback,
    }
    await openContractCall(options);
}

export async function getAllDonors(wallet) {
    const data = {
        sender: wallet,
        arguments: [cvToHex(standardPrincipalCV(wallet))]
    }
    const apiCall = STACKS_API_URL + "/v2/contracts/call-read/" + CONTRACT_ADDRESS + '/' + CONTRACT_NAME + '/get-all-donors';
    console.log("API CALL: " + apiCall)
    const result = await fetch(apiCall, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
    .then( (result) => {console.log(result);return cvToString(hexToCV(result.result));})
    console.log("Result of getCampaign: " + result);
    return result;
}


export async function getAllCampaigns(wallet) {
    const data = {
        sender: wallet,
        arguments: []
    }
    const apiCall = STACKS_API_URL + "/v2/contracts/call-read/" + CONTRACT_ADDRESS + '/' + CONTRACT_NAME + '/get-all-campaigns';
    console.log("API CALL: " + apiCall)
    const result = await fetch(apiCall, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
    .then( (result) => {console.log(result);return cvToString(hexToCV(result.result));})
    console.log("Result of getCampaign: " + result);
    return result;
}



export async function getCampaign(wallet) {
    const data = {
        sender: wallet,
        arguments: [cvToHex(standardPrincipalCV(wallet))]
    }
    const apiCall = STACKS_API_URL + "/v2/contracts/call-read/" + CONTRACT_ADDRESS + '/' + CONTRACT_NAME + '/get-campaign-info';
    console.log("API CALL: " + apiCall)
    const result = await fetch(apiCall, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
    .then( (result) => {console.log(result);return cvToString(hexToCV(result.result));})
    console.log("Result of getCampaign: " + result);
    return result;
}
export async function getCurrentCampaign(wallet) {
    const data = {
        sender: wallet,
        arguments: []
    }
    const apiCall = STACKS_API_URL + "/v2/contracts/call-read/" + CONTRACT_ADDRESS + '/' + CONTRACT_NAME + '/get-current-campaign';
    console.log("API CALL: " + apiCall)
    const result = await fetch(apiCall, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
    .then( (result) => {console.log(result);return cvToString(hexToCV(result.result));})
    console.log("Result of getCampaign: " + result);
} 


// Testing:
export async function createMiamiCoin(callback) {
    const functionArgs = []
    const options = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'make-miami-coin',
        functionArgs: functionArgs,
        network: StacksMocknet,
        appDetails: {
          name: APP_NAME,
        },
        onFinish: callback,
    }
    await openContractCall(options);
}

export async function mintMiamiCoin( callback) {
    const functionArgs = []
    const options = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'mint-miami-coin',
        functionArgs: functionArgs,
        network: StacksMocknet,
        appDetails: {
          name: APP_NAME,
        },
        onFinish: callback,
    }
    await openContractCall(options);
}
