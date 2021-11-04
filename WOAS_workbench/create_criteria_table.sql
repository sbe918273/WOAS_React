CREATE TABLE VisualMOAS.criteria (
id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, 
topic VARCHAR(100) NOT NULL, 
topic_weight REAL(6, 4), 
statement VARCHAR(200) NOT NULL, 
statement_weight REAL(6, 4),
statement_label VARCHAR(50), 
never_score REAL(6, 4), 
single_score REAL(6, 4),
multiple_score REAL(6, 4));