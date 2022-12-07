#/bin/bash

source .env

cd ${wwwDir}/${projectname}

git reset --hard
git clean -df
git pull origin master

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

echo "Done."


