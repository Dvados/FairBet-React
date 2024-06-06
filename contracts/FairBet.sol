// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FairBet {
    // Owner
    address public owner;

    // -------------------------------
    // Matches
    uint public matchCount;

    mapping(uint => Match) public matches;

    struct Match {
        string teamA;
        string teamB;
        uint betAmountTeamA;
        uint betAmountTeamB;
        uint betAmountDraw;
        uint oddsTeamA;
        uint oddsTeamB;
        uint oddsDraw;
        Status matchStatus;
        Result matchResult;
    }

    enum Status { Bets, BetsPaused, Finished }

    enum Result { NotFinished, TeamA, TeamB, Draw }

    // -------------------------------
    // Users
    mapping(address => uint) public users;

    // -------------------------------
    // Bets
    uint public betCount;

    mapping(uint => Bet) public allBets;

    struct Bet {
        uint timestamp;
        uint matchId;
        address better;
        uint amount;
        Selection resultSelection;
    }

    enum Selection { Nothing, TeamA, TeamB, Draw }

    // -------------------------------

    event MatchCreated(uint indexed matchId, string teamA, string teamB);
    event BetPlaced(uint indexed betId, uint matchId, address better, uint amount, Selection selection);
    event MatchFinished(uint indexed matchId, Result matchResult);
    event Withdrawal(uint indexed withdrawalId, address user, uint amount);

    uint withdrawalCount;

    // -------------------------------

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // -------------------------------

    function createMatch(string memory _teamA, string memory _teamB) public onlyOwner {
        matchCount++;

        matches[matchCount] = Match(_teamA, _teamB, 0, 0, 0, 1e18, 1e18, 1e18, Status.Bets, Result.NotFinished);

        emit MatchCreated(matchCount, _teamA, _teamB);
    }

    // -------------------------------

    function placeBet(uint _matchId, Selection _selection) public payable {
        require(matches[_matchId].matchStatus == Status.Bets, "Bets are no longer accepted");

        require(msg.value > 0, "Bet amount must be greater than zero");

        require(_selection == Selection.TeamA || _selection == Selection.TeamB || _selection == Selection.Draw, "Invalid selection");

        if (_selection == Selection.TeamA) {                    // teamA
            matches[_matchId].betAmountTeamA += msg.value;
        } else if (_selection == Selection.TeamB) {             // teamB
            matches[_matchId].betAmountTeamB += msg.value;
        } else {                                                // Draw
            matches[_matchId].betAmountDraw += msg.value;
        }

        getOdds(_matchId);

        betCount++;

        allBets[betCount] = Bet(block.timestamp, _matchId, msg.sender, msg.value, _selection);

        emit BetPlaced(betCount, _matchId, msg.sender, msg.value, _selection);
    }

    // -------------------------------

    function pauseBets(uint _matchId) public onlyOwner {
        matches[_matchId].matchStatus = Status.BetsPaused;
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
        uint totalAmount = m.betAmountTeamA + m.betAmountTeamB + m.betAmountDraw;

        if(m.betAmountTeamA != 0){
            m.oddsTeamA = totalAmount * 1e18 / m.betAmountTeamA;
        }

        if(m.betAmountTeamB != 0){
            m.oddsTeamB = totalAmount * 1e18 / m.betAmountTeamB;
        }

        if(m.betAmountDraw != 0){
            m.oddsDraw = totalAmount * 1e18 / m.betAmountDraw;
        }
    }

    // -------------------------------

    function distributeWinnings(uint _matchId) private {
        Match storage m = matches[_matchId];
        
        uint winningAmount;
        uint odds;

        if (m.matchResult == Result.TeamA) {
            winningAmount = m.betAmountTeamA;
            odds = m.oddsTeamA;
        } else if (m.matchResult == Result.TeamB) {
            winningAmount = m.betAmountTeamB;
            odds = m.oddsTeamB;
        } else if (m.matchResult == Result.Draw) {
            winningAmount = m.betAmountDraw;
            odds = m.oddsDraw;
        }

        for (uint i = 1; i <= betCount; i++) {
            Bet storage b = allBets[i];

            if (b.matchId == _matchId && uint(b.resultSelection) == uint(m.matchResult)) {
                uint reward = b.amount * odds / 1e18;
                users[b.better] += reward;
            }
        }
    }

    // -------------------------------

    function withdraw() public {
        
        uint amount = users[msg.sender];

        require(amount > 0, "No balance to withdraw");

        payable(msg.sender).transfer(amount);

        users[msg.sender] = 0;

        emit Withdrawal(++withdrawalCount, msg.sender, amount);
    }

}