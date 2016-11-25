El proyecto se encuentra dentro de la carpeta django.


## Instalacion
####1. Crear un entorno virtual de python
    virtualenv env
####2. Activar el entorno virtual
    source /env/bin/activate
####3. Instalar las dependencias del proyecto especificadas en el archivo requirements.txt
    pip install -r requirements.txt
####4. Configurar los datos de la base de datos PostgreSQL 
En el archivo nexa/settings.py se configuran **nombre de la base, usuario, contraseña, ip y puerto**:

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'nexa_todolist',
            'USER': 'nexa',
            'PASSWORD': 'password',
            'HOST': '127.0.0.1',
            'PORT': '5432',
        }
    }

Si no se tiene creada la base de datos ni el usuario para acceder, se puede crear con los siguientes comandos (en una terminal en el equipo en donde esté levantado PostgreSQL) usando el usuario postgre:

    sudo -u postgres createdb nexa_todolist
    sudo -u postgres psql
    CREATE ROLE nexa WITH LOGIN PASSWORD 'password';
    GRANT ALL PRIVILEGES ON DATABASE nexa_todolist TO nexa;
    ALTER USER nexa CREATEDB;

####5. Configurar el acceso a la API de Google
Para usar la API de Google para la autentificacion es necesario registrar una app en: http://console.developers.google.com (documentación sobre como obtenerla: https://developers.google.com/+/web/api/rest/oauth#about)

Previamente se debe activar la Google+ API, la cual se puede encontrar en API Manager -> Enable API -> Social APIs.  
Y luego ya se puede solicitar el Client ID junto con el Client Secret, siendo necesario indicar el nombre de la app y el callback url configurado en la aplicacion.  
En el caso de esta aplicación el callback url es: http://localhost/todo/complete/google-oauth2/ y funciona para pruebas locales, pero en caso ser hosteada en otro dominio es necesario cambiarlo por el que corresponda.  
El **client id** y **client secret** obtenidos se agregan en el archivo nexa/settings.py:

    SOCIAL_AUTH_GOOGLE_OAUTH2_KEY='...'
    SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET='...'

####6. Iniciar la aplicación
Con todo lo anterior configurado ya se puede iniciar la aplicación.  
Antes de levantar la aplicación puede ser necesarion ejecutar el comando: `./manage.py migrate` para configurar correctamente la base de datos.


Para hacer el deploy, se usó Gunicorn + NGINX:  

En el archivo de configuración de NGINX normalmente ubicado en `/etc/nginx/nginx.conf` se debe agregar lo siguiente para hacer un proxy con gunicorn:

    server {

        ...

        location /static/ {
            alias <DIRECTORIO A CARPETA static>;
        }

        location / {
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $http_host;
            proxy_set_header X-NginX-Proxy true;

            proxy_pass http://127.0.0.1:8000;
            proxy_redirect off;
        }
    }

Luego se reinicia el servidor nginx y se puede levantar la aplicación ejecutando el comando `gunicorn nexa.wsgi` en el mismo directorio del proyecto donde se encuentra el archivo `manage.py`.


La aplicación ya es accesible en la url http://localhost/todo
`