#/bin/bash

source .env

echo "Remove local site"

rm -rf ${wwwDir}/${projectname}

git clone --depth 1 -b master git@gitlab.redweb.dk:aesirx/aesir-webservice.git ${wwwDir}/${projectname}

echo "Download database..."

sshpass -p $password ssh $username@$host -p $port -o StrictHostKeyChecking=no "mysqldump -h $dbhost -u $dbusername -p$dbpassword --default-character-set=utf8 --no-tablespaces $dbname | gzip -9" > db.sql.gz

gzip -d db.sql.gz

echo "Restoring database..."

docker exec -i mysql mysql -uroot -proot -e "DROP DATABASE sso"
docker exec -i mysql mysql -uroot -proot -e "CREATE DATABASE sso"
docker exec -i mysql mysql -uroot -proot -e "CREATE USER 'sso'@'%' IDENTIFIED BY 'sso'"
docker exec -i mysql mysql -uroot -proot -e "GRANT ALL PRIVILEGES ON sso.* TO 'sso'@'%'"
docker exec -i mysql mysql -usso -psso --default-character-set=utf8 sso < db.sql

rm db.sql

echo "Create config file"
cp ${wwwDir}/${projectname}/configuration.onl.php ${wwwDir}/${projectname}/configuration.php


# insert/update hosts entry
ip_address="127.0.0.1"
host_name="${projectname}.local"

# find existing instances in the host file and save the line numbers
matches_in_hosts="$(grep -n $host_name /etc/hosts | cut -f1 -d:)"
host_entry="${ip_address} ${host_name}"

if [ ! -z "$matches_in_hosts" ]
then
    echo "Updating existing hosts entry."
    # iterate over the line numbers on which matches were found
    while read -r line_number; do
        # replace the text of each line with the desired host entry
        sudo sed -i '' "${line_number}s/.*/${host_entry} /" /etc/hosts
    done <<< "$matches_in_hosts"
else
    echo "Adding new hosts entry."
    echo "$host_entry" | sudo tee -a /etc/hosts > /dev/null
fi

echo "Done."





