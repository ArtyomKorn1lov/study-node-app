USE node_test;

CREATE TABLE Users (
		Id INT PRIMARY KEY AUTO_INCREMENT,
		Name VARCHAR(50) NOT NULL
);

CREATE TABLE Message (
	Id INT PRIMARY KEY AUTO_INCREMENT,
	Text VARCHAR(50) NOT NULL,
	Date DATETIME NOT NULL,	
	UserId INT NOT NULL, 
	FOREIGN	KEY (UserId) REFERENCES Users (Id) 
);