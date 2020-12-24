nginx_conf_443 ='''

worker_processes auto;

error_log /nginx_tmp/error.log;

events {

    worker_connections 1024;

}

pid /nginx_tmp/nginx.pid;

http {

  client_body_temp_path /nginx_tmp/client_body;
  fastcgi_temp_path /nginx_tmp/fastcgi;
  proxy_temp_path /nginx_tmp/proxy;
  scgi_temp_path /nginx_tmp/scgi;
  uwsgi_temp_path /nginx_tmp/uwsgi;

    server {
        # Port HTTPS
        listen      443 ssl;
        # block domain's name
        server_name {{domain}};  

        #ssl keys
        # Localisation de certifcat
        ssl_certificate /etc/letsencrypt/live/planetsmining.fr/fullchain.pem; 
        # Localisation de la clef
        ssl_certificate_key /etc/letsencrypt/live/planetsmining.fr/privkey.pem; 
        # Protocole SSL/TLS autorisé
        ssl_protocols TLSv1.2;
        # Activation du chiffrement coté serveur
        ssl_prefer_server_ciphers on; 
        # Type de chiffrement    
        ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';


       server_name {{app_host}};

        #log stdout peut etre => file
        access_log /dev/stdout;
        #log stdout peut etre => file
        error_log /dev/stdout info;

        root {{root}};

        include /etc/nginx/mime.types;

        charset utf-8;

        #Max upload size

        client_max_body_size 1M;   # adjust to taste

        location /static { 
        }




        location /socket.io {
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

            proxy_set_header X-Frame-Options SAMEORIGIN;
            proxy_pass http://{{app_host}}:{{app_port}};
        }

       # envoie la requete a express s ce n'est pas du static ou du media ou d$

       location / {
            proxy_pass http://{{app_host}}:{{app_port}};
            proxy_set_header   Host $host;
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Host $server_name;
        }
    }#end server 443

    server {
        listen 80;
        # Nom de domaine concerné par ce bloc de $
        server_name {{domain}}; 
        # Redirection automatique sur le HTTPS
        return 301 https://$host$request_uri; 
    }#end server 80

}#end http
'''