nginx_conf_80 ='''

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
        # Port HTTP
        listen     80;
        # block domain's name
        server_name 127.0.0.1;  

        server_name express;

        #log stdout peut etre => file
        access_log /dev/stdout;
        #log stdout peut etre => file
        error_log /dev/stdout info;

        root /node_project/app;

        include /etc/nginx/mime.types;

        charset utf-8;

        #Max upload size

        client_max_body_size 1M;   # adjust to taste

       # in fine le bundle js c est ici
#        location /static { 
#            alias /project-hesabu/static;
#            # On active la compression
#            gzip  on;
#            gzip_http_version 1.0;
#            gzip_vary on;
#            gzip_comp_level 6;
#            gzip_proxied any;
#            gzip_types text/plain text/css application/
#json application/x-javascript text/xml application/xml 
#application/xml+rss text/javascript;
#            gzip_buffers 16 8k;
#
#            # Sauf pour les vieux nav
#            gzip_disable ~@~\MSIE [1-6].(?!.*SV1)~@~];
#
#            # On dit au navigateur de le mettre en cache 
#pour 10 jours. Faites gaffe,

        location /socket.io {
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

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