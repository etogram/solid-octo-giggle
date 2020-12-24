echo "###########################"
echo "###   init server       ###"
echo "###########################"

W=`whoami` 
echo "you are running this file as $W"
if [ $W != "root" ]
then  
echo "You re not log as root"
echo "You must log as root to init server"
echo "this pgm is being ended..."
exit
else
echo "..."
fi

echo "Beginning server init"

echo "1. adapt env file to the server"
echo "node_projet/app/.env"
echo "check your env file"
echo "env file content"
echo ">>>>>>>>>>>>>>>>"
cat node_project/app/.env
echo "<<<<<<<<<<<<<<<<"
echo "if your env file is ok then continue..."
echo -n "Continue (Y/n)? "
read answer
if [ "$answer" != "${answer#[Y]}" ] ;then
    echo "..."
else
    echo "..."
    echo "exit"
    exit
fi
echo "2. create your https keys"
echo "check filenames for this server"
echo "you have to manually change the filenames in the syntax"

FILE=/etc/letsencrypt/live/planetsmining.fr/fullchain.pem
if [ -f "$FILE" ]; then
    echo "$FILE exists."
fi

FILE=/etc/letsencrypt/live/planetsmining.fr/fullchain.pem
if [ -f "$FILE" ]; then
    echo "$FILE exists."
fi

echo "do you want to run certbot container to create the keys?"
echo -n "Run certbot (Y/n)? "
read answer
if [ "$answer" != "${answer#[Y]}" ] ;then
    echo "running docker container..."
    sudo docker run -it --rm --name certbot \
            -v "/etc/letsencrypt/live:/etc/letsencrypt/live"\
            -v "/etc/letsencrypt:/etc/letsencrypt" \
            -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
            -p 80:80 \
            certbot/certbot certonly
else
    echo "avoid running container..."
fi

echo "3. create the nginx conf file"

sudo docker run -it --rm --name python \
            -v "$PWD:$PWD" \
            python:3 \
            python $PWD/config/init/create_nginx_conf.py

echo "4. install docker-compose if needed"
{ # try

    docker-compose --version &&
    #save your output
    echo "docker-compose is already installed"

} || { # catch
    # save log for exception 
    echo "docker-compose is not installed"    
    curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo "check docker-compose"
    docker-compose --version
}