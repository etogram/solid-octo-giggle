import os

current_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(current_path)
os.chdir('..')#now you are in solid...
base_path = os.getcwd()

from templates.templite import Templite
from templates.nginx_conf_template_443 import nginx_conf_443
from templates.nginx_conf_template_80 import nginx_conf_80

import logging 
logger = logging.getLogger(__name__)
stream_handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
stream_handler.setFormatter(formatter)
logger.addHandler(stream_handler)
logger.setLevel(logging.DEBUG)

#mettre le env dev ou prod here
context_production_443 = {
        "app_host":"express",
        "app_port":"3000",
        "root":"/node_project/app",
        "domain":"planetsmining.fr",
    }

context_development_80 = {
        "app_host":"express",
        "app_port":"3000",
        "root":"/node_project/app",
        "domain":"127.0.0.1",
    }




def get_env(env_file):
    env_dict = {}
    with open(env_file,"r") as f:
        for line in f:
            try:
                if line[0]!="#":
                    env_dict[line.split("=")[0]] = (line.split("=")[1]).split("\n")[0] 
            except Exception as e:
                pass
    return env_dict

base_env_file = os.path.join(base_path,".env")
dev_or_prod = get_env(base_env_file)

if dev_or_prod['TAG']=='dev':
    logger.info("------ development mode ------")
    nginx_conf_template = nginx_conf_80 
    env_file = os.path.join(base_path,"config","env","nginx","env_dev")

if dev_or_prod['TAG']=='prod':
    logger.info("------ production mode ------")
    nginx_conf_template = nginx_conf_443 
    env_file = os.path.join(base_path,"config","env","nginx","env_prod")

nginx_conf_file = os.path.join(base_path,"nginx","nginx.conf")
t = Templite(nginx_conf_template,{})
logger.info(get_env(env_file))
nginx_conf = t.render(get_env(env_file))
with open(nginx_conf_file,"w") as f:
    f.write(nginx_conf)
