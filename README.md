## Para hacer funcionar nest con mongodb hay que seguir los pasos de :
https://docs.nestjs.com/techniques/mongodb

# Backend en Nest

```
#podman volume create myvol mongo
#podman run -dt --name mean-db -p 27017:27017 -v "mongo:/data/db:Z" docker.io/library/mongo:latest
```

Copiar el ```.env.template``` y renombrarlo a ```.env```

# uso del fichero .env

```
Para poder usar este fichero .env hay que instalar un paquete con 
npm i @nestjs/config
e importar ConfigModule.forRoot() en el app.module.ts
```

# para poder usar JWT https://docs.nestjs.com/security/authentication#jwt-token

```
hay que instalar npm install --save @nestjs/jwt

```