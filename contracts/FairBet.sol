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
        //uint[] bidHistory;
    }

    // -------------------------------
    // Bets
    uint public betCount;

    mapping(uint => Bet) public bets;

    struct Bet {
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

        require(users[msg.sender].userId > 0, "User already exists");

        userCount++;

        users[msg.sender] = User(userCount, _name, 0);

        emit UserCreated(msg.sender, userCount, _name);
    }

    // -------------------------------

    function placeBet(uint _matchId, Selection _selection) public payable {
        require(users[msg.sender].userId != 0, "Create an account");

        require(matches[_matchId].matchStatus == Status.Bets, "Bets are no longer accepted.");

        require(msg.value > 0, "Bet amount must be greater than zero");

        if (_selection == Selection.TeamA) {                    // teamA
            matches[_matchId].betAmountTeamA += msg.value;
        } else if (_selection == Selection.TeamB) {             // teamB
            matches[_matchId].betAmountTeamB += msg.value;
        } else {                                                // Draw
            matches[_matchId].betAmountDraw += msg.value;
        }

        betCount++;

        bets[betCount] = Bet(_matchId, msg.sender, msg.value, _selection);

        emit BetPlaced(betCount, _matchId, msg.sender, msg.value, _selection);
    }

    // -------------------------------

    function PauseBets(uint _matchId) public onlyOwner {
        matches[_matchId].matchStatus = Status.BetsPaused;
    }
    
}