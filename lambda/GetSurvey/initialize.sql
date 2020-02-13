CREATE TABLE question (
   qId INT NOT NULL AUTO_INCREMENT,
   questions VARCHAR(500) NOT NULL,
   PRIMARY KEY (qId)
);

CREATE TABLE answer (
   qId   INT   NOT NULL,
   aId   INT   NOT NULL,
   answers  VARCHAR(500) NOT NULL,
   parent VARCHAR(500),
   foster_parent INT,
   respite INT,
   host_home INT,
   mentor INT,
   tutor INT,
   career_mentor INT,
   volunteer INT,
   donate_support INT,

   PRIMARY KEY(qId, aId),
   FOREIGN KEY(qId) REFERENCES question(qId)
);

