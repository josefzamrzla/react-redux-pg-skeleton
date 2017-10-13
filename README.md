# React + Redux + Postgresql app boilerplate

App is split into two separate parts:

- frontend - React + Redux app with dev server
- backend - standalone API server (uses JWT for auth)

### Install and run backend
```bash
cd backend
npm i
# or: yarn
```

#### Backend env variables:
- PORT (default: 3001)
- DB_USER (default: postgres)
- DB_PASSWORD (default: _empty_)
- DB_HOST (default: localhost)
- DB_PORT (default: 5432)
- DB_DATABASE (default: database_name)

#### Npm scripts:
- start (default): runs a "dev" script
- dev: runs a "lint" script and starts the server in dev mode (using nodemon, port 3001)
- lint: runs eslint    
- prod: runs a "lint" script and starts the server in production mode (port 3001)


### Install and run frontend
```bash
cd frontend
npm i
# or: yarn
```

#### Backend env variables:
- PORT (default: 3000)
- API_HOST (default: localhost)
- API_PORT (default: 3001)

#### Npm scripts:
- start (default): runs a "dev" script
- dev: runs a "lint" script and starts the dev server in dev mode (port 3000)
- lint: runs eslint
- build: runs a "lint" script and builds the React app into "dist" folder
- prod: runs a "build" script and starts the dev server in production mode (port 3000)

#### Redux DevTools
It is highly recommended to install a browser extension, see: https://github.com/zalmoxisus/redux-devtools-extension
