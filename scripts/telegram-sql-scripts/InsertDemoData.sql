USE telegram_test;

INSERT INTO `User` (`Id`, `Login`, `Name`, `Password`, `AccessToken`, `RefreshToken`, `TokenExpire`, `RefreshExpire`) VALUES
(1, 'Artyom', 'Артём', '123', NULL, NULL, NULL, NULL),
(2, 'Sasha', 'Саша', '123', NULL, NULL, NULL, NULL),
(3, 'Anton', 'Антон', '123', NULL, NULL, NULL, NULL);

INSERT INTO `Message` (`Id`, `Text`, `CREATED`, `EDITED`, `AuthorId`, `SenderId`) VALUES
(1, 'Привет! Как дела?', '2023-09-09 17:12:23', NULL, 1, 2),
(2, 'Нормально! У тебя как?', '2023-09-09 17:12:23', NULL, 2, 1),
(3, 'Что делаешь?', '2023-09-09 17:13:06', NULL, 1, 2),
(4, 'Ничего!', '2023-09-09 17:13:06', NULL, 2, 1),
(5, 'Всё хорошо?', '2023-09-09 17:13:32', NULL, 1, 2),
(6, 'Да, всё отлично!', '2023-09-09 17:13:32', NULL, 2, 1),
(7, 'Будут ли сегодня задачи?', '2023-09-09 17:14:39', NULL, 1, 3),
(8, 'Нет, не будут.', '2023-09-09 17:14:39', NULL, 3, 1);