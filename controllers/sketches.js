const { ethers } = require("ethers");
const fs = require('fs');
const path = require("path");
const artifact = require("../artifacts/DropGenerativeArt.json");
require('dotenv').config();

const provider_rinkeby = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_RINKEBY);

const contract = new ethers.Contract("0x50D0095B43b3Ce4EcAb52c37F0cb6bC3A42F4E90", artifact.abi, provider_rinkeby);

const getScript = async (tokenId) => {
    const scriptStr = await contract.script();
    const hash = await contract.tokenToHash(parseInt(tokenId));
    const x = `const tokenData = {
        hash: "0x${hash}",
        tokenId: ${tokenId}
    }
    `;
    
    fs.writeFile(path.resolve(__dirname, "../public/token/js/pieces/mySketch.js"), x + scriptStr.toString(), 'utf8', () => console.log("done"));
}

module.exports = { getScript };