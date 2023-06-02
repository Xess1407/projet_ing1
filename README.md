# Maggle

## Dependence

```bash
$ sudo apt install npm
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
$ nvm install --lts
```
Warning you need a recent version of Node (At least 18.x.x)

```bash
$ sudo apt install sqlite3
```

## Usage

### Start with scripts (recommended)

In the current directory

```bash
$ chmod +x build.sh run.sh
$ ./build.sh
$ ./run.sh
```

### Start by services

In the current directory

#### Start API

```bash
$ cd api
$ npm i
$ ./run.sh
```

Warning you may need to change the permission 

```bash
$ chmod +x setup.sh
$ chmod +x run.sh
```

The API should be running in localhost:8080

#### Populate API with test values

```bash
$ ./insert.sh
```
Same then for the API scripts you'll need the permission

```bash
$ chmod +x insert.sh
```

#### Start front (for developpers)

```bash
$ cd front/
$ npm i
$ npm run dev
```
The front should run in localhost:3000

#### Start Java API

```bash
$ cd java
$ ./run.sh
```

Warining you may need to change the permission 

```bash
$ chmod +x run.sh
```

The API should be running in localhost:8001

## Identifiers

### Admin

- email: admin@admin
- password: admin

### Manager

- email: man@man
- password: man

## Authors

- ARRESSEGUET Yan
- CLAUSSE Evan
- LONGY Simon
- MORAND Brice
- PORTET Léo