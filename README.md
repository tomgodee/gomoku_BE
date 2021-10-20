# A server for a fun stock market simulation game

## Tech Stack:
* ExpressJS
* PostgreSQL

## Deployment:

### Prod env:
* Server and database are deployed to aws ec-2 and RDS

### To check if the prod server is alive:
```
curl --location --request GET 'http://13.229.65.159:2000/ping'
```

## Migration
* To create a migration file. This will create `xxx-migration-skeleton.js` in your migration folder.
``` 
npx sequelize-cli migration:generate --name migration-skeleton
```

* To create a database
```
npx sequelize db:create
```

* To create a migration + model
```
npx sequelize model:generate --name <model_name> --attributes name:string
```

* To create a seed
```
npx sequelize seed:generate --name <seed_name>
```

* To run migration
```
npx sequelize db:migrate
```

* To run a seed
```
npx sequelize db:seed --seed <seed_name.js>
```

* To seed this project first time
```
docker exec -it gomoku_api_1 sh
npx sequelize db:create
npm run migrate
npm run seed
```

* To run this project
```
sudo service postgresql stop
docker-compose up
```
