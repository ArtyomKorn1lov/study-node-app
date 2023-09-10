USE telegram_test;

CREATE TABLE User (
		Id INT PRIMARY KEY AUTO_INCREMENT,
        Login VARCHAR(50) NOT NULL,
		Name VARCHAR(50) NULL,
        Password VARCHAR(256) NOT NULL,
        RefreshToken VARCHAR(256) NULL,
        TokenExpire DATETIME NULL
);

CREATE TABLE Message (
	Id INT PRIMARY KEY AUTO_INCREMENT,
	Text VARCHAR(256) NOT NULL,
	CREATED DATETIME NOT NULL,	
    EDITED DATETIME NULL,
	AuthorId INT NOT NULL, 
	FOREIGN	KEY (AuthorId) REFERENCES User (Id),
    SenderId INT NOT NULL, 
    FOREIGN	KEY (SenderId) REFERENCES User (Id)
);