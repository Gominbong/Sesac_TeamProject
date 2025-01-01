-- Active: 1732688617247@@127.0.0.1@3306@sesac
show tables;
desc message;
SELECT * from message;

insert into message (title, content, receivedUserId, createdAt) VALUES('제목', '내용', 1, '2024-12-20T05:25:19');
ALTER TABLE message ADD COLUMN userId INT;
ALTER TABLE message ADD CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES user(userId);




insert into user (email, password, answer, temp, createdAt) values
('ert@naver.com','1234', 'asd',37, now());

