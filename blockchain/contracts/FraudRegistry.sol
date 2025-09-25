// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title FraudRegistry
 * @dev Smart contract for tamper-proof fraud detection logging
 * @author SafeGuard AI Team
 */
contract FraudRegistry {
    // Events
    event FraudReported(
        uint256 indexed reportId,
        address indexed reporter,
        string fraudType,
        string description,
        uint256 timestamp
    );
    
    event FraudVerified(
        uint256 indexed reportId,
        address indexed verifier,
        bool verified,
        uint256 timestamp
    );
    
    event PredictionLogged(
        uint256 indexed predictionId,
        address indexed user,
        string predictionType,
        bool isFraud,
        uint256 riskScore,
        uint256 timestamp
    );

    // Structs
    struct FraudReport {
        uint256 id;
        string fraudType;
        string description;
        string evidence;
        address reporter;
        uint256 timestamp;
        bool verified;
        address verifier;
        uint256 verificationTimestamp;
        uint256 reputationScore;
    }
    
    struct Prediction {
        uint256 id;
        string predictionType;
        bool isFraud;
        uint256 riskScore;
        uint256 confidence;
        string explanation;
        address user;
        uint256 timestamp;
        bytes32 hash;
    }
    
    struct UserReputation {
        address user;
        uint256 totalReports;
        uint256 verifiedReports;
        uint256 falseReports;
        uint256 reputationScore;
        bool isActive;
    }

    // State variables
    mapping(uint256 => FraudReport) public fraudReports;
    mapping(uint256 => Prediction) public predictions;
    mapping(address => UserReputation) public userReputations;
    
    uint256 public reportCount;
    uint256 public predictionCount;
    address public owner;
    uint256 public verificationThreshold = 3; // Minimum verifications needed
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier validReport(uint256 _reportId) {
        require(_reportId > 0 && _reportId <= reportCount, "Invalid report ID");
        _;
    }
    
    modifier validPrediction(uint256 _predictionId) {
        require(_predictionId > 0 && _predictionId <= predictionCount, "Invalid prediction ID");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Report a fraud incident
     * @param _fraudType Type of fraud (sms, url, transaction, website)
     * @param _description Description of the fraud
     * @param _evidence Evidence data (JSON string)
     */
    function reportFraud(
        string memory _fraudType,
        string memory _description,
        string memory _evidence
    ) public returns (uint256) {
        reportCount++;
        
        FraudReport memory newReport = FraudReport({
            id: reportCount,
            fraudType: _fraudType,
            description: _description,
            evidence: _evidence,
            reporter: msg.sender,
            timestamp: block.timestamp,
            verified: false,
            verifier: address(0),
            verificationTimestamp: 0,
            reputationScore: 0
        });
        
        fraudReports[reportCount] = newReport;
        
        // Update user reputation
        _updateUserReputation(msg.sender, true, false);
        
        emit FraudReported(
            reportCount,
            msg.sender,
            _fraudType,
            _description,
            block.timestamp
        );
        
        return reportCount;
    }

    /**
     * @dev Verify a fraud report
     * @param _reportId ID of the report to verify
     * @param _verified Whether the report is verified as fraud
     */
    function verifyFraud(uint256 _reportId, bool _verified) 
        public 
        validReport(_reportId) 
    {
        FraudReport storage report = fraudReports[_reportId];
        require(!report.verified, "Report already verified");
        
        report.verified = _verified;
        report.verifier = msg.sender;
        report.verificationTimestamp = block.timestamp;
        
        // Update reputation scores
        if (_verified) {
            _updateUserReputation(report.reporter, true, true);
            _updateUserReputation(msg.sender, false, true);
        } else {
            _updateUserReputation(report.reporter, true, false);
        }
        
        emit FraudVerified(
            _reportId,
            msg.sender,
            _verified,
            block.timestamp
        );
    }

    /**
     * @dev Log a fraud prediction
     * @param _predictionType Type of prediction (sms, url, transaction, website)
     * @param _isFraud Whether the prediction indicates fraud
     * @param _riskScore Risk score (0-100)
     * @param _confidence Confidence level (0-100)
     * @param _explanation Explanation of the prediction
     */
    function logPrediction(
        string memory _predictionType,
        bool _isFraud,
        uint256 _riskScore,
        uint256 _confidence,
        string memory _explanation
    ) public returns (uint256) {
        predictionCount++;
        
        // Generate hash for data integrity
        bytes32 hash = keccak256(abi.encodePacked(
            _predictionType,
            _isFraud,
            _riskScore,
            _confidence,
            _explanation,
            msg.sender,
            block.timestamp
        ));
        
        Prediction memory newPrediction = Prediction({
            id: predictionCount,
            predictionType: _predictionType,
            isFraud: _isFraud,
            riskScore: _riskScore,
            confidence: _confidence,
            explanation: _explanation,
            user: msg.sender,
            timestamp: block.timestamp,
            hash: hash
        });
        
        predictions[predictionCount] = newPrediction;
        
        emit PredictionLogged(
            predictionCount,
            msg.sender,
            _predictionType,
            _isFraud,
            _riskScore,
            block.timestamp
        );
        
        return predictionCount;
    }

    /**
     * @dev Get fraud report details
     * @param _reportId ID of the report
     * @return FraudReport struct
     */
    function getFraudReport(uint256 _reportId) 
        public 
        view 
        validReport(_reportId) 
        returns (FraudReport memory) 
    {
        return fraudReports[_reportId];
    }

    /**
     * @dev Get prediction details
     * @param _predictionId ID of the prediction
     * @return Prediction struct
     */
    function getPrediction(uint256 _predictionId) 
        public 
        view 
        validPrediction(_predictionId) 
        returns (Prediction memory) 
    {
        return predictions[_predictionId];
    }

    /**
     * @dev Get user reputation
     * @param _user User address
     * @return UserReputation struct
     */
    function getUserReputation(address _user) 
        public 
        view 
        returns (UserReputation memory) 
    {
        return userReputations[_user];
    }

    /**
     * @dev Verify prediction integrity
     * @param _predictionId ID of the prediction
     * @return bool Whether the prediction is valid
     */
    function verifyPrediction(uint256 _predictionId) 
        public 
        view 
        validPrediction(_predictionId) 
        returns (bool) 
    {
        Prediction memory prediction = predictions[_predictionId];
        
        bytes32 expectedHash = keccak256(abi.encodePacked(
            prediction.predictionType,
            prediction.isFraud,
            prediction.riskScore,
            prediction.confidence,
            prediction.explanation,
            prediction.user,
            prediction.timestamp
        ));
        
        return prediction.hash == expectedHash;
    }

    /**
     * @dev Get total reports count
     * @return uint256 Total number of reports
     */
    function getTotalReports() public view returns (uint256) {
        return reportCount;
    }

    /**
     * @dev Get total predictions count
     * @return uint256 Total number of predictions
     */
    function getTotalPredictions() public view returns (uint256) {
        return predictionCount;
    }

    /**
     * @dev Get verified reports count
     * @return uint256 Number of verified reports
     */
    function getVerifiedReportsCount() public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 1; i <= reportCount; i++) {
            if (fraudReports[i].verified) {
                count++;
            }
        }
        return count;
    }

    /**
     * @dev Update user reputation
     * @param _user User address
     * @param _isReporter Whether the user is the reporter
     * @param _isVerified Whether the report was verified
     */
    function _updateUserReputation(
        address _user, 
        bool _isReporter, 
        bool _isVerified
    ) internal {
        UserReputation storage reputation = userReputations[_user];
        
        if (reputation.user == address(0)) {
            reputation.user = _user;
            reputation.isActive = true;
        }
        
        if (_isReporter) {
            reputation.totalReports++;
            if (_isVerified) {
                reputation.verifiedReports++;
                reputation.reputationScore += 10;
            } else {
                reputation.falseReports++;
                reputation.reputationScore = reputation.reputationScore > 5 ? 
                    reputation.reputationScore - 5 : 0;
            }
        } else {
            // Verifier gets reputation boost
            reputation.reputationScore += 5;
        }
    }

    /**
     * @dev Set verification threshold (only owner)
     * @param _threshold New verification threshold
     */
    function setVerificationThreshold(uint256 _threshold) public onlyOwner {
        verificationThreshold = _threshold;
    }

    /**
     * @dev Get system statistics
     * @return uint256[4] Array of [totalReports, verifiedReports, totalPredictions, totalUsers]
     */
    function getSystemStats() public view returns (uint256[4] memory) {
        uint256 verifiedCount = getVerifiedReportsCount();
        uint256 totalUsers = 0;
        
        // Count unique users (simplified)
        for (uint256 i = 1; i <= reportCount; i++) {
            if (fraudReports[i].reporter != address(0)) {
                totalUsers++;
            }
        }
        
        return [reportCount, verifiedCount, predictionCount, totalUsers];
    }
}
