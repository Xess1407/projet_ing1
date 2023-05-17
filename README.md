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

In front directory

```bash
$ npm i
```

In API directory

```bash
$ npm i
```

## Usage


### Start by services

In the current directory

#### Start API

```bash
$ ./api/run.sh
```

Warining you may need to change the permission 

```bash
$ chmod +x api/setup.sh
$ chmod +x api/run.sh
```

The API should be running in localhost:8080

#### Populate API

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
$ npm run dev
```
The front should run in localhost:3000

## Authors

- ARRESSEGUET Yan
- CLAUSSE Evan
- LONGY Simon
- MORAND Brice
- PORTET Léo