Este repositorio pretende dar una estimación de la variaciones que han tenido las órdenes compras de las criptomonedas del exchange [Buda](https://www.buda.com/chile)

## Prerrequisitos

Es necesario tener instalado [Ruby](https://www.ruby-lang.org/en/documentation/installation/), [Rails](https://rubyonrails.org/) y [yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable).

## Setup

En primer lugar, es necesario obtener las API keys de Buda, para ello es necesario obtenerlas del siguiente [enlace](https://www.buda.com/manejar_api_keys). Se recomienda solo dar permisos para ver órdenes, ya que es lo único necesario para hacer funcionar la aplicación.

Luego creamos un archivo `.env` con el comando 

```
touch .env
```

 y colocamos las credenciales con el siguiente formato:

```
API_KEY=<API-KEY de buda>
SECRET=<SECRET de buda>
```

Luego es necesario instalar todos los paquetes con:

```
bundle install
```

```
yarn install
```

## Iniciar aplicación

Hay que correr el comando

```
rails s
```

e ingresar al servidor local (`"localhost:3000"` por defecto).