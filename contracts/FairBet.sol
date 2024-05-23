// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Betting {
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
        uint betAmountDraw;
        uint betAmountTeamB;
        Status matchStatus;
        Result matchResult;
    }

    enum Status { Bets, BetsPaused, Finished }

    enum Result { NotFinished, TeamA, TeamB, Draw }

    // -------------------------------
    // Users
    uint public userCount;

    mapping(address => User) public users;

    struct User {
        uint userId;
        string userName;
        uint balance;
        uint[] betHistory;
    }

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

    enum Selection { TeamA, TeamB, Draw }

    // -------------------------------

    event MatchCreated(uint indexed matchId, string teamA, string teamB);
    event UserCreated(address indexed userAddress, uint userId, string name);
    event BetPlaced(uint indexed betId, uint matchId, address better, uint amount, Selection selection);
    event MatchFinished(uint indexed matchId, Result matchResult);

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

        matches[matchCount] = Match(_teamA, _teamB, 0, 0, 0, Status.Bets, Result.NotFinished);

        emit MatchCreated(matchCount, _teamA, _teamB);
    }

    // -------------------------------

    function createUserProfile(string memory _name) public {
        require(bytes(_name).length > 0, "Name cannot be empty");

        require(users[msg.sender].userId == 0, "User already exists");

        userCount++;

        users[msg.sender] = User(userCount, _name, 0, new uint[](0));

        emit UserCreated(msg.sender, userCount, _name);
    }

    // -------------------------------

    function placeBet(uint _matchId, Selection _selection) public payable {
        require(users[msg.sender].userId != 0, "Create an account");

        require(matches[_matchId].matchStatus == Status.Bets, "Bets are no longer accepted.");

        require(msg.value > 0, "Bet amount must be greater than zero");

        require(_selection == Selection.TeamA || _selection == Selection.TeamB || _selection == Selection.Draw, "Invalid selection");

        if (_selection == Selection.TeamA) {                    // teamA
            matches[_matchId].betAmountTeamA += msg.value;
        } else if (_selection == Selection.TeamB) {             // teamB
            matches[_matchId].betAmountTeamB += msg.value;
        } else {                                                // Draw
            matches[_matchId].betAmountDraw += msg.value;
        }

        betCount++;

        allBets[betCount] = Bet(block.timestamp, _matchId, msg.sender, msg.value, _selection);

        users[msg.sender].betHistory.push(betCount);

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

        emit MatchFinished(_matchId, _result);
    }

}