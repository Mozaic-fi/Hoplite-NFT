// SPDX-License-Identifier: MIT
// File: test/HopliteNFT.test.js

const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('HopliteNFT Contract', function () {
  let HopliteNFT;
  let hopliteNFT;
  let owner;
  let addr1;
  let addr2;
  let default_receiver;

  beforeEach(async function () {
    [owner, addr1, addr2, default_receiver] = await ethers.getSigners(); 

    const HopliteNFTFactory = await ethers.getContractFactory('HopliteNFT');
    const baseURL = "https://example.net/";
    const currentTimestamp = (await ethers.provider.getBlock()).timestamp;
    hopliteNFT = await HopliteNFTFactory.deploy(baseURL, currentTimestamp + 3600, 200000, addr1.address);
    await hopliteNFT.deployed();
  });

  it('Should set the base URI', async function () {
    const newBaseURI = "https://new_example.net/";;
    await expect(hopliteNFT.setBaseURI(newBaseURI)).to.emit(hopliteNFT, "SetBaseURI").withArgs(newBaseURI);
  });

  it('Should set the default royalty', async function () {
    const newRoyalty = 500; // Set your desired royalty value here
    await expect(hopliteNFT.setDefaultRoyalty(default_receiver.address, newRoyalty)).to.emit(hopliteNFT, "NewDefaultRoyalty").withArgs(default_receiver.address, newRoyalty);
  });

  it('Should update whitelist', async function () {
    const newWhiteList = [addr1.address, addr2.address];
    await hopliteNFT.updateWhiteList(newWhiteList);
    expect(await hopliteNFT.whiteList(addr1.address)).to.equal(true);
    expect(await hopliteNFT.whiteList(addr2.address)).to.equal(true);
  });

  it('Should mint tokens for the owner during deployment', async function () {
    const ownerBalance = await hopliteNFT.balanceOf(owner.address);
    expect(ownerBalance).to.equal(377); // Update with the number of tokens you mint during deployment
  });

  it('Should revert if transfer to non-whitelisted address before go live date', async function () {
    await hopliteNFT.approve(addr1.address, 0);
    await expect(hopliteNFT.connect(addr1).transferFrom(owner.address, addr2.address, 0)).to.be.revertedWithCustomError(hopliteNFT, "NotWhiteList");
  });

  it('Should allow transfer to non-whitelisted address after go live date', async function () {
    // Increase the block timestamp by 1 hour (4800 seconds)
    await ethers.provider.send("evm_increaseTime", [4800]);

    // Mine a new block to finalize the timestamp change
    await ethers.provider.send("evm_mine", []);

    await hopliteNFT.connect(owner).transferFrom(owner.address, addr2.address, 0);

    const newOwnerBalance = await hopliteNFT.balanceOf(addr2.address);
    expect(newOwnerBalance).to.equal(1);
  });
});
