### Процесс выполнения ДЗ:
Мой пк на Linux Ubuntu 24.04.3 LTS.
Докер уже стоял - используется для работы.

#### Описал Dockerfile, docker-compose.yml: контейнер с mongo, прокинул volumes (ssh ключи, чтобы не вводить каждый раз пароль), подключил network. Использовал последний образ с dockerhub: mongo:8.0.14.
![dockerfile](screenshots/dockerfile.png)
![docker-compose](screenshots/docker-compose.png)

#### Для удобства работы создал justfile (аналог makefile), описал команды работы с ключами, контейнером.
![justfile](screenshots/justfile.png)

#### Подключился к контейнеру, через mongosh поработал с бд, коллекциями используя команды с занятия.

#### Написал скрипт генерации рандомного кол-ва документов в новой коллекции.
![script](screenshots/script.png)

#### Запустил в mongosh.
![results.png](screenshots/results.png)

#### Установил, изучил gui mongodb compass.
![compass](screenshots/compass.png)

#### Также для удобства описал команды в readme.md.
![readme_with_comands.png](screenshots/readme_with_comands.png)![compass](screenshots/compass.png)