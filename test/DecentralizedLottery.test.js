const DecentralizedLottery = artifacts.require("DecentralizedLottery");
const { expectRevert, BN, balance } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract('DecentralizedLottery', (accounts) => {
  const owner = accounts[0];
  const player1 = accounts[1];
  const player2 = accounts[2];
  const ticketPrice = web3.utils.toWei('0.1', 'ether');

  let lottery;
  beforeEach(async () => {
    lottery = await DecentralizedLottery.new(ticketPrice, { from: owner });
  });

  describe('Ticket Purchase', () => {
    it('allows purchase with exact payment and tracks participants', async () => {
      await lottery.buyTicket({ from: player1, value: ticketPrice });
      let count = await lottery.getParticipantsCount();
      expect(count).to.be.bignumber.equal(new BN(1));

      await lottery.buyTicket({ from: player2, value: ticketPrice });
      count = await lottery.getParticipantsCount();
      expect(count).to.be.bignumber.equal(new BN(2));
    });

    it('rejects underpayment', async () => {
      await expectRevert(
        lottery.buyTicket({ from: player1, value: web3.utils.toWei('0.09', 'ether') }),
        "Incorrect payment amount"
      );
    });

    it('rejects overpayment', async () => {
      await expectRevert(
        lottery.buyTicket({ from: player1, value: web3.utils.toWei('0.11', 'ether') }),
        "Incorrect payment amount"
      );
    });
  });

  describe('Winner Selection', () => {
    it('reverts if non-owner calls selectWinner', async () => {
      await lottery.buyTicket({ from: player1, value: ticketPrice });
      await expectRevert(
        lottery.selectWinner({ from: player1 }),
        "Ownable: caller is not the owner"
      );
    });

    it('reverts when no participants', async () => {
      await expectRevert(
        lottery.selectWinner({ from: owner }),
        "No participants in the lottery"
      );
    });

    it('selects the only participant as winner and distributes prize', async () => {
      await lottery.buyTicket({ from: player1, value: ticketPrice });
      const tracker = await balance.tracker(player1);

      const tx = await lottery.selectWinner({ from: owner });
      const winner = await lottery.lastWinner();
      expect(winner).to.equal(player1);

      // Check prize distribution
      const prize = new BN(ticketPrice);
      const delta = await tracker.delta();
      expect(delta).to.be.bignumber.closeTo(prize, new BN(web3.utils.toWei('0.001', 'ether')));

      const poolAfter = await lottery.getPrizePool();
      expect(poolAfter).to.be.bignumber.equal(new BN(0));
    });

    it('selects one of multiple participants', async () => {
      await lottery.buyTicket({ from: player1, value: ticketPrice });
      await lottery.buyTicket({ from: player2, value: ticketPrice });
      await lottery.selectWinner({ from: owner });
      const winner = await lottery.lastWinner();
      expect([player1, player2]).to.include(winner);
    });
  });

  describe('Statistical testing - unbiased randomness', () => {
    it('distributes wins roughly equally over iterations', async function() {
      this.timeout(200000);
      const runCount = 20;
      const wins = { [player1]: 0, [player2]: 0 };

      for (let i = 0; i < runCount; i++) {
        // Re-open if closed
        const open = await lottery.lotteryOpen();
        if (!open) {
          await lottery.openNewLottery({ from: owner });
        }
        await lottery.buyTicket({ from: player1, value: ticketPrice });
        await lottery.buyTicket({ from: player2, value: ticketPrice });
        await lottery.selectWinner({ from: owner });
        const winner = await lottery.lastWinner();
        wins[winner] += 1;
      }

      const diff = Math.abs(wins[player1] - wins[player2]);
      expect(new BN(diff)).to.be.bignumber.lte(new BN(runCount * 0.3)); // <=30% variance
    });
  });
});
