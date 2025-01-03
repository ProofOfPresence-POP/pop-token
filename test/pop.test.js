const { expect } = require("chai");
const { parseEther, formatEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

let uniswapV2Router;
let popToken;

async function deploy() {
  const [owner, admin, wallet1, wallet2, wallet3, wallet4, wallet5, wallet6, wallet7, wallet8, _] = await ethers.getSigners();
  if (!uniswapV2Router) {
    const UniswapV2RouterFactory = await ethers.getContractFactory("UniswapV2Router02");
    uniswapV2Router = UniswapV2RouterFactory.attach("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");
  }
  if (!popToken) {
    const whiteList = [
      "0xe8cdd07c83f83450f45e28c7e7817dea86ec572e",
      "0xe867e1603b3ec22e21547258d3ddb93e5f071af7",
      "0xd246011e92e093ac1283d635dfb53f70cd9c2e82",
      "0x366247a7dc30559f0e7617aa5a2b8df744d59953",
      "0x60a73e7b44e1b3571acd677123be7bb454358686",
      "0x3980aba4c4486b4872abcc141b64c232149d4f4b",
      "0x35b9576a194c828f96f83d01f846bb7444875782",
      "0x47094e73662d17c70a671e5724f464793569863a",
      "0xf6747ea0f46f2b58e89eb1c5a3c10144c761c3f9",
      "0xc47aec1816e93c2b8469911fb2727940d9ed2b52",
      "0x82f2eff386061848f2b02be77d3263734345ee6e",
      "0xfb05d1003ca98ff757bce1ae39b08f8e590ea32a",
      "0x6cec992d5d8a60d4f0f9f270c93a9cdef1181575",
      "0x0586b4933f94bd0ecd0c74b0d4c0d42ba8a43d19",
      "0xa774f66e6fb1c7affcbb82692bc980df0f155d46",
      "0xe26c382ef323408cba0bf19b9f2f7fb21c570393",
      "0xa4cc4ba9223ab03bdea6c99e4f74fe4821e255e7",
      "0xc5aaa3a5e01f776654cb27f1c71d0ec9d5ee016e",
      "0x63073018132000f874ded687a3bc993720023114",
      "0xc91c9abf93b9134d3910a5b024816fc01cd4350a",
      "0xbbbd2c3158ae3f6f3204785f9e072ba4df977a83",
      "0x584eaf120546f9b44b5d6d515078cecd6110aed3",
      "0x1776fab2f96ebb594b727d375451c7d07aa3e184",
      "0xc5edad9d5b9ee49bd71bba5a7bb24b130653a689",
      "0x240567762d39c81f5f391bb0795669f595afbe93",
      "0x6c14cc07c4a440b152d793d9ec0a4b1397f72067"
    ];
    const PopToken = await ethers.getContractFactory("POPToken");
    popToken = await PopToken.deploy(owner.address, admin.address, whiteList);
    await popToken.deployed();
    // popToken = PopToken.attach("0xC4D42AcE4697450901ad7a390b1273C017b6f405");
  }

  const popOwner = popToken.connect(owner);
  const popAdmin = popToken.connect(admin);
  const popWallet1 = popToken.connect(wallet1);
  const popWallet2 = popToken.connect(wallet2);
  const popWallet3 = popToken.connect(wallet3);
  const popWallet4 = popToken.connect(wallet4);
  const popWallet5 = popToken.connect(wallet5);
  const popWallet6 = popToken.connect(wallet6);
  const popWallet7 = popToken.connect(wallet7);
  const popWallet8 = popToken.connect(wallet8);

  const ownerRouter = uniswapV2Router.connect(owner);
  const adminRouter = uniswapV2Router.connect(admin);
  const wallet1Router = uniswapV2Router.connect(wallet1);
  const wallet2Router = uniswapV2Router.connect(wallet2);
  const wallet3Router = uniswapV2Router.connect(wallet3);
  const wallet4Router = uniswapV2Router.connect(wallet4);
  const wallet5Router = uniswapV2Router.connect(wallet5);
  const wallet6Router = uniswapV2Router.connect(wallet6);
  const wallet7Router = uniswapV2Router.connect(wallet7);
  const wallet8Router = uniswapV2Router.connect(wallet8);

  return {
    owner,
    admin,
    wallet1,
    wallet2,
    wallet3,
    wallet4,
    wallet5,
    wallet6,
    wallet7,
    wallet8,
    popToken,
    popOwner,
    popAdmin,
    popWallet1,
    popWallet2,
    popWallet3,
    popWallet4,
    popWallet5,
    popWallet6,
    popWallet7,
    popWallet8,
    ownerRouter,
    adminRouter,
    wallet1Router,
    wallet2Router,
    wallet3Router,
    wallet4Router,
    wallet5Router,
    wallet6Router,
    wallet7Router,
    wallet8Router,
  }
}


describe("POP Token", async function () {
  context("Trading Functions", async function () {
    it("Should add liquidity using UniswapV2Router", async function () {
      const {
        owner,
        popToken,
        popOwner,
        ownerRouter,
      } = await deploy();
      const amountETH = ethers.utils.parseEther("1");
      const amountPOP = ethers.utils.parseEther("1000000");
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      await popOwner.approve(ownerRouter.address, amountPOP);
      await ownerRouter.addLiquidityETH(
        popToken.address,
        amountPOP,
        amountPOP,
        amountETH,
        owner.address,
        deadline,
        { value: amountETH }
      );
      expect(await popToken.balanceOf(owner.address)).to.equal(0) &&
        expect(await popToken.balanceOf(await popToken.uniswapV2Pair())).to.equal(amountPOP);
    });
    // Add a test to check if a user can buy POP tokens before enableTrading is called by the owner
    it("Should not allow a user to buy POP tokens before enableTrading is called by the owner", async function () {
      const {
        owner,
        wallet1,
        popToken,
        popOwner,
        popWallet1,
        ownerRouter,
        wallet1Router,
      } = await deploy();

      // Add liquidity
      const amountETH = ethers.utils.parseEther("0.1");
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      // Buy POP tokens
      await expect(wallet1Router.swapExactETHForTokensSupportingFeeOnTransferTokens(
        0,
        [await ownerRouter.WETH(), popToken.address],
        wallet1.address,
        deadline,
        { value: amountETH }
      )).to.be.revertedWith("UniswapV2: TRANSFER_FAILED");
    });
    // Buy POP Tokens from the owner before enableTrading is called
    it("Should allow the owner to buy POP tokens before enableTrading is called", async function () {
      const {
        owner,
        wallet1,
        popToken,
        popOwner,
        popWallet1,
        ownerRouter,
        wallet1Router,
      } = await deploy();

      // Add liquidity
      const amountETH = ethers.utils.parseEther("0.018");
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      // Buy POP tokens
      await ownerRouter.swapExactETHForTokensSupportingFeeOnTransferTokens(
        0,
        [await ownerRouter.WETH(), popToken.address],
        owner.address,
        deadline,
        { value: amountETH }
      );
      expect(await popToken.balanceOf(owner.address) > 0);
    });
    // Buy POP Tokens from the owner after enableTrading is called
    it("Should allow a user to buy POP tokens after enableTrading is called", async function () {
      const {
        owner,
        wallet1,
        popToken,
        popOwner,
        popWallet1,
        wallet3,
        ownerRouter,
        wallet1Router,
        wallet3Router,
      } = await deploy();

      // Add liquidity
      const amountETH = ethers.utils.parseEther("0.021");
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      // Enable trading
      await popOwner.enableTrading();

      // Buy POP tokens
      const expectedAmountPOP = await wallet1Router.getAmountsOut(amountETH, [await ownerRouter.WETH(), popToken.address]);
      await wallet1Router.swapExactETHForTokensSupportingFeeOnTransferTokens(
        0,
        [await wallet1Router.WETH(), popToken.address],
        wallet1.address,
        deadline,
        { value: amountETH }
      );
      const userBalance = ethers.utils.formatEther(await popToken.balanceOf(wallet1.address));
      expect(userBalance > 0);

      // // Check the contract ETH balance
      // const contractPOPBalance = ethers.utils.formatEther(await popToken.balanceOf(popToken.address));
      // const contractETHBalance = ethers.utils.formatEther(await ethers.provider.getBalance(popToken.address));
      // console.log(contractBalance);
    });
    // Should not allow a user to buy more than max wallet
    it("Should not allow a user to buy more than max wallet", async function () {
      const {
        owner,
        wallet1,
        popToken,
        popOwner,
        popWallet1,
        ownerRouter,
        wallet1Router,
      } = await deploy();

      // Add liquidity
      const amountETH = ethers.utils.parseEther("0.01");
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      // Buy POP tokens
      await expect(wallet1Router.swapExactETHForTokensSupportingFeeOnTransferTokens(
        0,
        [await wallet1Router.WETH(), popToken.address],
        wallet1.address,
        deadline,
        { value: amountETH }
      )).to.be.revertedWith("UniswapV2: TRANSFER_FAILED");
    });
    // Should not allow a user to buy more than max transaction
    it("Should not allow a user to buy more than max transaction", async function () {
      const {
        owner,
        wallet1,
        popToken,
        popOwner,
        popWallet1,
        ownerRouter,
        wallet1Router,
      } = await deploy();

      // Add liquidity
      const amountETH = ethers.utils.parseEther("0.01");
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      // Buy POP tokens
      await expect(wallet1Router.swapExactETHForTokensSupportingFeeOnTransferTokens(
        ethers.utils.parseEther("0.01"),
        [await wallet1Router.WETH(), popToken.address],
        wallet1.address,
        deadline,
        { value: amountETH }
      )).to.be.revertedWith("UniswapV2: TRANSFER_FAILED");
    });
    // Should charge 4% buy fee and 1% burn fee to the buyer and check if the buy fee is being added to the contract balance
    it("Should charge 4% buy fee and 1% burn fee to the buyer", async function () {
      const {
        owner,
        popToken,
        popOwner,
        wallet2,
        wallet2Router,
      } = await deploy();

      // Add liquidity
      const amountETH = ethers.utils.parseEther("0.001");
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      // contract balance before
      const contractBalanceBefore = ethers.utils.formatEther(await popToken.balanceOf(popToken.address));

      // Buy POP tokens
      await wallet2Router.swapExactETHForTokensSupportingFeeOnTransferTokens(
        0,
        [await wallet2Router.WETH(), popToken.address],
        wallet2.address,
        deadline,
        { value: amountETH }
      );
      const userBalance = ethers.utils.formatEther(await popToken.balanceOf(wallet2.address));
      expect(userBalance > 0);

      // Check the contract balance
      const contractBalance = ethers.utils.formatEther(await popToken.balanceOf(popToken.address));
      expect(contractBalance > contractBalanceBefore);
    });
    // A user should be able to sell POP tokens with a 4% sell fee and 1% burn fee
    it("Should charge 4% sell fee and 1% burn fee to the seller", async function () {
      const {
        popToken,
        wallet2,
        popWallet2,
        wallet2Router,
      } = await deploy();

      // Add liquidity
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      const userBalance = await popToken.balanceOf(wallet2.address);

      // contract balance before
      const contractBalanceBefore = ethers.utils.formatEther(await popToken.balanceOf(popToken.address));

      // Sell POP tokens
      await popWallet2.approve(wallet2Router.address, userBalance);
      await wallet2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
        userBalance,
        0,
        [popToken.address, await wallet2Router.WETH()],
        wallet2.address,
        deadline
      );
      const userBalanceAfter = ethers.utils.formatEther(await popToken.balanceOf(wallet2.address));
      expect(userBalanceAfter == 0);

      //   // Check the contract balance
      //   const contractBalance = ethers.utils.formatEther(await popToken.balanceOf(popToken.address));
      //   expect(contractBalance > contractBalanceBefore);
    });
    // Should allow multiple users to buy in a row
    it("Should allow multiple users to buy in a row", async function () {
      const {
        owner,
        popToken,
        popWallet5,
        wallet3,
        wallet4,
        wallet5,
        wallet6,
        wallet7,
        wallet8,
        ownerRouter,
        wallet3Router,
        wallet4Router,
        wallet5Router,
        wallet6Router,
        wallet7Router,
        wallet8Router,
      } = await deploy();

      let amountETH;
      let deadline;

      // Buy POP tokens for wallet3
      // Get the amount of ETH to be paid against 20,000 POP tokens
      deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      await wallet3Router.swapExactETHForTokensSupportingFeeOnTransferTokens(
        0,
        [await wallet3Router.WETH(), popToken.address],
        wallet3.address,
        deadline,
        { value: parseEther("0.01") }
      );
      const userBalance3 = ethers.utils.formatEther(await popToken.balanceOf(wallet3.address));
      expect(userBalance3 > 0);

      // Buy POP tokens for wallet4
      // Get the amount of ETH to be paid against 20,000 POP tokens
      deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      await wallet4Router.swapExactETHForTokensSupportingFeeOnTransferTokens(
        0,
        [await wallet4Router.WETH(), popToken.address],
        wallet4.address,
        deadline,
        { value: parseEther("0.01") }
      );
      const userBalance4 = ethers.utils.formatEther(await popToken.balanceOf(wallet4.address));
      expect(userBalance4 > 0);

      // Buy POP tokens for wallet5
      // Get the amount of ETH to be paid against 20,000 POP tokens
      deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      await wallet5Router.swapExactETHForTokensSupportingFeeOnTransferTokens(
        0,
        [await wallet5Router.WETH(), popToken.address],
        wallet5.address,
        deadline,
        { value: parseEther("0.01") }
      );
      const userBalance5 = formatEther(await popToken.balanceOf(wallet5.address));
      expect(userBalance5 > 0);

      // Buy POP tokens for wallet6
      deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      await wallet6Router.swapExactETHForTokensSupportingFeeOnTransferTokens(
        0,
        [await wallet6Router.WETH(), popToken.address],
        wallet6.address,
        deadline,
        { value: parseEther("0.01") }
      );
      const userBalance6 = ethers.utils.formatEther(await popToken.balanceOf(wallet6.address));
      expect(userBalance6 > 0);

      // Buy POP tokens for wallet7
      deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      await wallet7Router.swapExactETHForTokensSupportingFeeOnTransferTokens(
        0,
        [await wallet7Router.WETH(), popToken.address],
        wallet7.address,
        deadline,
        { value: parseEther("0.01") }
      );
      const userBalance7 = ethers.utils.formatEther(await popToken.balanceOf(wallet7.address));
      expect(userBalance7 > 0);

      // Buy POP tokens for wallet8 
      deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      await wallet8Router.swapExactETHForTokensSupportingFeeOnTransferTokens(
        0,
        [await wallet8Router.WETH(), popToken.address],
        wallet8.address,
        deadline,
        { value: parseEther("0.01") }
      );
      const userBalance8 = ethers.utils.formatEther(await popToken.balanceOf(wallet8.address));
      expect(userBalance8 > 0);
    });
    // Should allow multiple users to sell in a row
    it("Should allow multiple users to sell in a row", async function () {
      const {
        popToken,
        wallet3,
        wallet4,
        wallet5,
        wallet6,
        wallet7,
        wallet8,
        popWallet3,
        popWallet4,
        popWallet5,
        popWallet6,
        popWallet7,
        popWallet8,
        wallet3Router,
        wallet4Router,
        wallet5Router,
        wallet6Router,
        wallet7Router,
        wallet8Router,
      } = await deploy();

      let deadline;

      // Sell POP tokens for wallet3
      deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      await popWallet3.approve(wallet3Router.address, await popToken.balanceOf(wallet3.address));
      const userBalance3 = await popToken.balanceOf(wallet3.address);
      await wallet3Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
        userBalance3,
        0,
        [popToken.address, await wallet3Router.WETH()],
        wallet3.address,
        deadline
      );
      const userBalance3After = ethers.utils.formatEther(await popToken.balanceOf(wallet3.address));
      expect(userBalance3After == 0);

      // Sell POP tokens for wallet4
      deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      await popWallet4.approve(wallet4Router.address, await popToken.balanceOf(wallet4.address));
      const userBalance4 = await popToken.balanceOf(wallet4.address);
      await wallet4Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
        userBalance4,
        0,
        [popToken.address, await wallet4Router.WETH()],
        wallet4.address,
        deadline
      );
      const userBalance4After = ethers.utils.formatEther(await popToken.balanceOf(wallet4.address));
      expect(userBalance4After == 0);

      // Sell POP tokens for wallet5
      deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      await popWallet5.approve(wallet5Router.address, await popToken.balanceOf(wallet5.address));
      const userBalance5 = await popToken.balanceOf(wallet5.address);
      await wallet5Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
        userBalance5,
        0,
        [popToken.address, await wallet5Router.WETH()],
        wallet5.address,
        deadline
      );
      const userBalance5After = ethers.utils.formatEther(await popToken.balanceOf(wallet5.address));
      expect(userBalance5After == 0);

      // Sell POP tokens for wallet6
      deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      await popWallet6.approve(wallet6Router.address, await popToken.balanceOf(wallet6.address));
      const userBalance6 = await popToken.balanceOf(wallet6.address);
      await wallet6Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
        userBalance6,
        0,
        [popToken.address, await wallet6Router.WETH()],
        wallet6.address,
        deadline
      );
      const userBalance6After = ethers.utils.formatEther(await popToken.balanceOf(wallet6.address));
      expect(userBalance6After == 0);

      // Sell POP tokens for wallet7
      deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      await popWallet7.approve(wallet7Router.address, await popToken.balanceOf(wallet7.address));
      const userBalance7 = await popToken.balanceOf(wallet7.address);
      await wallet7Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
        userBalance7,
        0,
        [popToken.address, await wallet7Router.WETH()],
        wallet7.address,
        deadline
      );
      const userBalance7After = ethers.utils.formatEther(await popToken.balanceOf(wallet7.address));
      expect(userBalance7After == 0);

      // Sell POP tokens for wallet8
      deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      await popWallet8.approve(wallet8Router.address, await popToken.balanceOf(wallet8.address));
      const userBalance8 = await popToken.balanceOf(wallet8.address);
      await wallet8Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
        userBalance8,
        0,
        [popToken.address, await wallet8Router.WETH()],
        wallet8.address,
        deadline
      );
      const userBalance8After = ethers.utils.formatEther(await popToken.balanceOf(wallet8.address));
      expect(userBalance8After == 0);
    });
  });

  context("Reward Functions", async function () {
    // Should distribute rewards to the top 100 holders
    it("Should distribute rewards to the top 100 holders", async function () {
      const {
        owner,
        popToken,
        popAdmin
      } = await deploy();
      // Check the contract ETH balance
      const contractBalance = await ethers.provider.getBalance(popToken.address);
      expect(contractBalance > 0);

      // Generate 100 random addresses
      let addresses = [];
      let amounts = [];
      for (let i = 0; i < 100; i++) {
        addresses.push(ethers.Wallet.createRandom().address);
        // divide the contract balance by 100
        amounts.push(contractBalance.div(100));
      }

      // Distribute rewards in bathches of 50
      // split the array into batches of 50 and make new array
      const batch1 = addresses.slice(0, 25);
      await popAdmin.distributeRewards(batch1, amounts.slice(0, 25));
      // await popAdmin.distributeRewards(batch2, amounts.slice(50, 100));
      expect(await popToken.rewardRound() > 0);
    });
  });
  context("Owner Function Calls", async function () {
    // Should allow the owner to enable trading
    it("Should allow the owner to enable trading", async function () {
      const {
        owner,
        popToken,
        popOwner,
      } = await deploy();

      await popOwner.enableTrading();
      expect(await popToken.tradingEnabled());
    });
    // Should allow the owner to set the setAdminWallet
    it("Should allow the owner to set the setAdminWallet", async function () {
      const {
        owner,
        admin,
        popToken,
        popOwner,
      } = await deploy();

      await popOwner.setAdminWallet(admin.address);
      expect(await popToken.adminWallet() == admin.address);
    });
  });

});
