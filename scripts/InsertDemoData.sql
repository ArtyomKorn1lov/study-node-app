USE node_test;

INSERT INTO `Message` (`Id`, `Text`, `Date`, `UserId`) VALUES
(1, 'Привет!', '2023-09-04 21:51:32', 1),
(2, 'Как дела?', '2023-09-04 21:51:32', 2),
(3, 'Нормально? У тебя как?', '2023-09-04 21:51:52', 1),
(4, 'Всё хорошо!', '2023-09-04 21:51:52', 2);

INSERT INTO `Users` (`Id`, `Name`) VALUES
(1, 'Артём'),
(2, 'Саша');