// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FairBet {
    // Owner
    address public owner;

    uint8 public constant totalProbWMargin = 105;

    // -------------------------------
    // Matches
    uint public matchCount;

    mapping(uint => Match) public matches;

    struct Match {
        bytes teamA;
        bytes teamB;
        uint[3] betAmounts1X2;   // [0] - TeamA, [1] - Draw, [2] - TeamB
        uint[3] odds1X2;         // [0] - TeamA, [1] - Draw, [2] - TeamB
        Status matchStatus;
        Result matchResult;
    }

    enum Status { BetsPaused, Bets, Finished }

    enum Result { NotFinished, TeamA, Draw, TeamB }

    // -------------------------------
    // Users
    mapping(address => uint) public balances;

    // -------------------------------
    // Bets
    uint public betCount;

    mapping(uint => Bet[]) public allBets;

    struct Bet {
        uint timestamp;
        address better;
        uint amount;
        Selection resultSelection;
    }

    enum Selection { Nothing, TeamA, Draw, TeamB }

    // -------------------------------
    uint public withdrawalCount;

    event MatchCreated(uint indexed matchId, bytes teamA, bytes teamB);
    event BetsPaused(uint _matchId);
    event BetsResumed(uint _matchId);
    event BetPlaced(uint indexed betId, uint matchId, address better, uint amount, Selection selection);
    event MatchFinished(uint indexed matchId, Result matchResult);
    event Withdrawal(uint indexed withdrawalId, address user, uint amount);

    // -------------------------------

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // -------------------------------

    function createMatch(string calldata _teamA, string calldata _teamB) public onlyOwner {
        matchCount++;

        matches[matchCount] = Match({
            teamA: bytes(_teamA),
            teamB: bytes(_teamB),
            betAmounts1X2: [uint(0), uint(0), uint(0)],
            odds1X2: [uint(1e18), uint(1e18), uint(1e18)],
            matchStatus: Status.Bets,
            matchResult: Result.NotFinished
        });

        emit MatchCreated(matchCount, bytes(_teamA), bytes(_teamB));
    }

    // -------------------------------

    function betAmounts1X2(uint _matchId) public view returns(uint[3] memory _betAmounts1X2) {
        Match storage m = matches[_matchId];

        _betAmounts1X2 = m.betAmounts1X2;
    }

    // -------------------------------

    function odds1X2(uint _matchId) public view returns(uint[3] memory _odds1X2) {
        Match storage m = matches[_matchId];

        _odds1X2 = m.odds1X2;
    }

    // -------------------------------

    function pauseBets(uint _matchId) public onlyOwner {
        require(matches[_matchId].matchStatus != Status.Finished, "Match already finished");

        require(matches[_matchId].matchStatus != Status.BetsPaused, "Betting on this match is already closed");

        matches[_matchId].matchStatus = Status.BetsPaused;

        emit BetsPaused(_matchId);
    }

    // -------------------------------

    function resumeBets(uint _matchId) public onlyOwner {
        require(matches[_matchId].matchStatus != Status.Finished, "Match already finished");

        require(matches[_matchId].matchStatus != Status.Bets, "Bets are not paused for this match");

        matches[_matchId].matchStatus = Status.Bets;

        emit BetsResumed(_matchId);
    }

    // -------------------------------

    function placeBet(uint _matchId, Selection _selection) public payable {
        require(matches[_matchId].matchStatus == Status.Bets, "Bets are no longer accepted");

        require(msg.value > 0, "Bet amount must be greater than zero");

        require(_selection != Selection.Nothing, "Invalid selection");

        if (_selection == Selection.TeamA) {                    // teamA
            matches[_matchId].betAmounts1X2[0] += msg.value;
        } else if (_selection == Selection.Draw) {              // Draw
            matches[_matchId].betAmounts1X2[1] += msg.value;
        } else {                                                // teamB
            matches[_matchId].betAmounts1X2[2] += msg.value;
        }

        getOdds(_matchId);

        betCount++;

        allBets[_matchId].push(Bet({
            timestamp: block.timestamp,
            better: msg.sender,
            amount: msg.value,
            resultSelection: _selection
        }));

        emit BetPlaced(betCount, _matchId, msg.sender, msg.value, _selection);
    }

    // -------------------------------

    function finishMatch(uint _matchId, Result _result) public onlyOwner {
        require(matches[_matchId].matchStatus != Status.Finished, "Match already finished");

        require(_result != Result.NotFinished, "Invalid result");

        matches[_matchId].matchStatus = Status.Finished;
        matches[_matchId].matchResult = _result;

        distributeWinnings(_matchId);

        emit MatchFinished(_matchId, _result);
    }

    // -------------------------------

    function getOdds(uint _matchId) private {
        Match storage m = matches[_matchId];
        uint totalAmount1X2 = m.betAmounts1X2[0] + m.betAmounts1X2[1] + m.betAmounts1X2[2];

        for (uint i = 0; i < m.betAmounts1X2.length; i++) {
            if(m.betAmounts1X2[i] != 0 && m.betAmounts1X2[i] != totalAmount1X2){
                m.odds1X2[i] = totalAmount1X2 * 1e18 / (m.betAmounts1X2[i] / 100 * totalProbWMargin);
            }
        }
    }

    // -------------------------------

    function distributeWinnings(uint _matchId) private {
        Match storage m = matches[_matchId];

        uint remainAmount1X2 = m.betAmounts1X2[0] + m.betAmounts1X2[1] + m.betAmounts1X2[2];
        uint odds;

        if (m.matchResult == Result.TeamA) {
            odds = m.odds1X2[0];
        } else if (m.matchResult == Result.Draw) {
            odds = m.odds1X2[1];
        } else if (m.matchResult == Result.TeamB) {
            odds = m.odds1X2[2];
        }

        Bet[] storage bets = allBets[_matchId];

        for (uint i = 0; i < bets.length; i++) {
            Bet storage b = bets[i];

            if (uint(b.resultSelection) == uint(m.matchResult)) {
                uint reward = b.amount * odds / 1e18;
                balances[b.better] += reward;

                remainAmount1X2 -= reward;
            }
        }

        balances[owner] += remainAmount1X2;
    }

    // -------------------------------

    function withdraw() external {
        uint amount = balances[msg.sender];

        require(amount > 0, "No balance to withdraw");

        balances[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit Withdrawal(++withdrawalCount, msg.sender, amount);
    }

    // -------------------------------

    receive() external payable {
        balances[msg.sender] += msg.value;
    }

}