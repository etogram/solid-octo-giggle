nginx_conf_80 ='''worker_processes auto;

error_log /tmp/error.log;

events {

    worker_connections 1024;

}

pid /tmp/nginx.pid;

http {

    client_body_temp_path /tmp/client_temp;
    proxy_temp_path       /tmp/proxy_temp_path;
    fastcgi_temp_path     /tmp/fastcgi_temp;
    uwsgi_temp_path       /tmp/uwsgi_temp;
    scgi_temp_path        /tmp/scgi_temp;

    server {
        # Port HTTP
        listen     80;
        # block domain's name
        server_name {{domain}};  

        
        #log stdout peut etre => file
        access_log /dev/stdout;
        #log stdout peut etre => file
        error_log /dev/stdout info;

        root /node_project/app;

        include /etc/nginx/mime.types;

        charset utf-8;

        #Max upload size

        client_max_body_size 1M;   # adjust to taste
        
        location /favicons/ {
            alias /node_project/app/frontend/dist/favicons/;
            sendfile           on;
            sendfile_max_chunk 1m;
            tcp_nopush on;
            tcp_nodelay on;
            keepalive_timeout 65;
        }

        location /css {
            alias /node_project/app/frontend/dist/css;
            gzip  on;# On active la compression
            gzip_http_version 1.0;
            gzip_vary on;
            gzip_comp_level 6;
            gzip_proxied any;
            gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;
            gzip_buffers 16 8k;
            gzip_disable ~@~\MSIE [1-6].(?!.*SV1)~@~];# Sauf pour les vieux nav
            expires 7d;#Mettre en cache pour 7 jours
        }
        location /js {
            alias /node_project/app/frontend/dist/js;
            gzip  on;# On active la compression
            gzip_http_version 1.0;
            gzip_vary on;
            gzip_comp_level 6;
            gzip_proxied any;
            gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;
            gzip_buffers 16 8k;
            gzip_disable ~@~\MSIE [1-6].(?!.*SV1)~@~];# Sauf pour les vieux nav
            expires 7d;#Mettre en cache pour 7 jours
        }


        location /socket.io {
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header 'Access-Control-Allow-Origin' '{{domain}}';

            proxy_set_header X-Frame-Options SAMEORIGIN;
            proxy_pass http://express:3000;
        }

       # envoie la requete a express s ce n'est pas du static ou du media ou d$

       location / {
            proxy_pass http://express:3000;
            proxy_set_header   Host $host;
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Host $server_name;
        }
    }

}#end http
'''