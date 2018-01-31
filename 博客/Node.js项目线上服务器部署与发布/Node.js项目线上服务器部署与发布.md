# Node.js项目线上服务器部署与发布

> 感谢 [scott](https://coding.imooc.com/class/95.html)

我添加的内容：

- MySQL数据库导入与导出
- 脚本部署前端项目

***

## 目录

<!-- TOC -->

- [Node.js项目线上服务器部署与发布](#nodejs%E9%A1%B9%E7%9B%AE%E7%BA%BF%E4%B8%8A%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%83%A8%E7%BD%B2%E4%B8%8E%E5%8F%91%E5%B8%83)
  - [目录](#%E7%9B%AE%E5%BD%95)
  - [远程登录服务器](#%E8%BF%9C%E7%A8%8B%E7%99%BB%E5%BD%95%E6%9C%8D%E5%8A%A1%E5%99%A8)
    - [ssh 远程登录服务器](#ssh-%E8%BF%9C%E7%A8%8B%E7%99%BB%E5%BD%95%E6%9C%8D%E5%8A%A1%E5%99%A8)
    - [配置 root 及应用账号权限](#%E9%85%8D%E7%BD%AE-root-%E5%8F%8A%E5%BA%94%E7%94%A8%E8%B4%A6%E5%8F%B7%E6%9D%83%E9%99%90)
    - [配置本地无密码 ssh 登录](#%E9%85%8D%E7%BD%AE%E6%9C%AC%E5%9C%B0%E6%97%A0%E5%AF%86%E7%A0%81-ssh-%E7%99%BB%E5%BD%95)
      - [先决条件](#%E5%85%88%E5%86%B3%E6%9D%A1%E4%BB%B6)
      - [让我们开始吧](#%E8%AE%A9%E6%88%91%E4%BB%AC%E5%BC%80%E5%A7%8B%E5%90%A7)
  - [增强服务器安全等级](#%E5%A2%9E%E5%BC%BA%E6%9C%8D%E5%8A%A1%E5%99%A8%E5%AE%89%E5%85%A8%E7%AD%89%E7%BA%A7)
    - [修改服务器默认登录端口](#%E4%BF%AE%E6%94%B9%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%BB%98%E8%AE%A4%E7%99%BB%E5%BD%95%E7%AB%AF%E5%8F%A3)
    - [配置 iptables 和 Fail2Ban 增强安全防护](#%E9%85%8D%E7%BD%AE-iptables-%E5%92%8C-fail2ban-%E5%A2%9E%E5%BC%BA%E5%AE%89%E5%85%A8%E9%98%B2%E6%8A%A4)
      - [配置 iptables：](#%E9%85%8D%E7%BD%AE-iptables%EF%BC%9A)
      - [配置 Fail2Ban：](#%E9%85%8D%E7%BD%AE-fail2ban%EF%BC%9A)
  - [搭建 Nodejs 生产环境](#%E6%90%AD%E5%BB%BA-nodejs-%E7%94%9F%E4%BA%A7%E7%8E%AF%E5%A2%83)
    - [搭建服务器的 Nodejs 环境](#%E6%90%AD%E5%BB%BA%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%9A%84-nodejs-%E7%8E%AF%E5%A2%83)
    - [借助 pm2 让 Node.js 服务常驻](#%E5%80%9F%E5%8A%A9-pm2-%E8%AE%A9-nodejs-%E6%9C%8D%E5%8A%A1%E5%B8%B8%E9%A9%BB)
  - [配置 Nginx 实现反向代理](#%E9%85%8D%E7%BD%AE-nginx-%E5%AE%9E%E7%8E%B0%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86)
    - [配置 Nginx 反向代理 Nodejs 端口](#%E9%85%8D%E7%BD%AE-nginx-%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86-nodejs-%E7%AB%AF%E5%8F%A3)
  - [服务器配置安装 MongoDB](#%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%85%8D%E7%BD%AE%E5%AE%89%E8%A3%85-mongodb)
    - [在 Ubuntu 14.04 上安装 MongoDB](#%E5%9C%A8-ubuntu-1404-%E4%B8%8A%E5%AE%89%E8%A3%85-mongodb)
    - [修改 MongoDB 默认端口](#%E4%BF%AE%E6%94%B9-mongodb-%E9%BB%98%E8%AE%A4%E7%AB%AF%E5%8F%A3)
    - [往线上 MongoDB 导入单表数据或数据库](#%E5%BE%80%E7%BA%BF%E4%B8%8A-mongodb-%E5%AF%BC%E5%85%A5%E5%8D%95%E8%A1%A8%E6%95%B0%E6%8D%AE%E6%88%96%E6%95%B0%E6%8D%AE%E5%BA%93)
    - [往线上 MySQL 导入单表数据或数据库【新增】](#%E5%BE%80%E7%BA%BF%E4%B8%8A-mysql-%E5%AF%BC%E5%85%A5%E5%8D%95%E8%A1%A8%E6%95%B0%E6%8D%AE%E6%88%96%E6%95%B0%E6%8D%AE%E5%BA%93%E3%80%90%E6%96%B0%E5%A2%9E%E3%80%91)
    - [为上线项目配置 MongoDB 数据库读写权限](#%E4%B8%BA%E4%B8%8A%E7%BA%BF%E9%A1%B9%E7%9B%AE%E9%85%8D%E7%BD%AE-mongodb-%E6%95%B0%E6%8D%AE%E5%BA%93%E8%AF%BB%E5%86%99%E6%9D%83%E9%99%90)
    - [从一台服务器迁移数据到另一个线上 MongoDB 中](#%E4%BB%8E%E4%B8%80%E5%8F%B0%E6%9C%8D%E5%8A%A1%E5%99%A8%E8%BF%81%E7%A7%BB%E6%95%B0%E6%8D%AE%E5%88%B0%E5%8F%A6%E4%B8%80%E4%B8%AA%E7%BA%BF%E4%B8%8A-mongodb-%E4%B8%AD)
    - [为数据库实现定时备份方案](#%E4%B8%BA%E6%95%B0%E6%8D%AE%E5%BA%93%E5%AE%9E%E7%8E%B0%E5%AE%9A%E6%97%B6%E5%A4%87%E4%BB%BD%E6%96%B9%E6%A1%88)
    - [上传到数据库备份到七牛云](#%E4%B8%8A%E4%BC%A0%E5%88%B0%E6%95%B0%E6%8D%AE%E5%BA%93%E5%A4%87%E4%BB%BD%E5%88%B0%E4%B8%83%E7%89%9B%E4%BA%91)
  - [向服务器正式部署和发布上线 Nodejs 项目](#%E5%90%91%E6%9C%8D%E5%8A%A1%E5%99%A8%E6%AD%A3%E5%BC%8F%E9%83%A8%E7%BD%B2%E5%92%8C%E5%8F%91%E5%B8%83%E4%B8%8A%E7%BA%BF-nodejs-%E9%A1%B9%E7%9B%AE)
    - [上传项目代码到线上私有 Git 仓库](#%E4%B8%8A%E4%BC%A0%E9%A1%B9%E7%9B%AE%E4%BB%A3%E7%A0%81%E5%88%B0%E7%BA%BF%E4%B8%8A%E7%A7%81%E6%9C%89-git-%E4%BB%93%E5%BA%93)
    - [配置 PM2 一键部署线上项目结构](#%E9%85%8D%E7%BD%AE-pm2-%E4%B8%80%E9%94%AE%E9%83%A8%E7%BD%B2%E7%BA%BF%E4%B8%8A%E9%A1%B9%E7%9B%AE%E7%BB%93%E6%9E%84)
    - [通过脚本部署前端项目（新增）](#%E9%80%9A%E8%BF%87%E8%84%9A%E6%9C%AC%E9%83%A8%E7%BD%B2%E5%89%8D%E7%AB%AF%E9%A1%B9%E7%9B%AE%EF%BC%88%E6%96%B0%E5%A2%9E%EF%BC%89)
  - [使用和配置更安全的 HTTPS 协议](#%E4%BD%BF%E7%94%A8%E5%92%8C%E9%85%8D%E7%BD%AE%E6%9B%B4%E5%AE%89%E5%85%A8%E7%9A%84-https-%E5%8D%8F%E8%AE%AE)
    - [申请证书](#%E7%94%B3%E8%AF%B7%E8%AF%81%E4%B9%A6)
    - [Nginx 配置](#nginx-%E9%85%8D%E7%BD%AE)

<!-- /TOC -->

## 远程登录服务器

### ssh 远程登录服务器

```bash
# ssh 登录
ssh root@47.xx.xx.xx

# 接着，输入密码（购买服务器时的密码）
******

# 然后，可以做你想做的事情，简单点：
# 查看硬盘
fdisk -l

# 查看硬盘使用情况
df -h
```

### 配置 root 及应用账号权限

用户定制：

```bash
# 增加用户
adduser tanya # tanya 为用户名，然后输入密码，创建完成

# 用户授权
gpasswd -a tanya sudo # 添加用户到 sudo 组中

sudo visudo # 接着，为用户授权

tanya ALL=(ALL:ALL) ALL

# 重新开启一个终端，就可以以 tanya 的身份登录啦
ssh tanya@47.xx.xx.xx # 然后输入密码，即可登录成功
```

每次登录都要输入密码好烦啊，当然琐碎的事情，总是存在处理它的办法。接下来，无密码登录登场。

### 配置本地无密码 ssh 登录

以下操作的用户是 `tanya`：

#### 先决条件

你需要知道：

`~` 表示用户目录:

- 本地代表：`C:\Users\savoy`
- 服务器代表：`/home/tanya`

你需要了解：

vim 的基本操作：编辑文件、粘贴内容、保存并退出

关于 vim 的知识可以阅读：[博客园](http://www.cnblogs.com)星尘： [http://www.cnblogs.com/88999660/articles/1581524.html](http://www.cnblogs.com/88999660/articles/1581524.html)
#### 让我们开始吧

需要开启两个终端：一个服务器终端，一个本地终端

本地终端

```bash
# cd ~/.ssh # 进入到 .ssh目录

# 生成 ssh key
ssh-keygen -t rsa -b 4096 -C "savoygu@gmail.com" # 会在本地 ~/.ssh 目录中生成两个文件 id_rsa id_rsa.pub，当然你也可以进行重命名

# 开启 ssh 代理
eval "$(ssh-agent -s)"

# 把生成的私钥文件加到代理中
ssh-add ~/.ssh/tanya_id_rsa # tanya_id_rsa 是重命名过的文件
```

服务器终端

```bash
# 把生成的公钥文件`tanya_id_rsa.pub`的内容放到服务器上 authorized_keys 文件中，并授权

cd ~/.ssh # 进入到 .ssh目录

sudo vi authorized_keys # 编辑 authorized_keys，添加 `tanya_id_rsa.pub` 内容，保存退出

chmod 600 authorized_keys # 授权 authorized_keys 文件

# 重启服务器 ssh 服务
sudo service ssh restart

# 重新开启一个终端
ssh tanya@47.xx.xx.xx # 无需输入密码，即可登录成功
```

**[⬆ back to top](#目录)**

## 增强服务器安全等级

### 修改服务器默认登录端口

```bash
# 编辑文件
sudo vi /etc/ssh/sshd_config

# 修改 Port 项，端口范围 0 ~ 65536
Port xx

# 在末尾添加
AllowUsers tanya

# 重启服务
sudo service ssh restart

# 重新开启一个终端：ssh -p 端口 tanya@47.xx.xx.xx
ssh -p xx tanya@47.xx.xx.xx
```

有可能登录不上去，需要去控制台修改安全组规则，把你的端口加进去。

### 配置 iptables 和 Fail2Ban 增强安全防护

#### 配置 iptables：

```bash
# 升级更新一下系统
sudo apt-get update && sudo apt-get upgrade

# 清空 iptables
sudo iptables -F

# 新建 iptables 规则配置文件
sudo vi /etc/iptables.up.rules
```

iptables.up.rules 配置，

```bash
*filter

# allow all connections
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# allow out traffic
-A OUTPUT -j ACCEPT

# allow http https
-A INPUT -p tcp --dport 443 -j ACCEPT
-A INPUT -p tcp --dport 80 -j ACCEPT

# allow ssh port login
-A INPUT -p tcp -m state --state NEW --dport 39999 -j ACCEPT

# ping
-A INPUT -p icmp -m icmp --icmp-type 8 -j ACCEPT

# Mongodb 连接
-A INPUT -s 127.0.0.1 -p tcp --destination-port 27017 -m state --state NEW,ESTABLISHED -j ACCEPT
-A OUTPUT -d 127.0.0.1 -p tcp --source-port 27017 -m state --state ESTABLISHED -j ACCEPT

# 服务器 Node.js 端口开放，可以添加很多，只需修改一下 --destination-port 和 --source-port 就行了
-A INPUT -s 127.0.0.1 -p tcp --destination-port 3000 -m state --state NEW,ESTABLISHED -j ACCEPT
-A OUTPUT -d 127.0.0.1 -p tcp --source-port 3000 -m state --state ESTABLISHED -j ACCEPT
-A INPUT -s 127.0.0.1 -p tcp --destination-port 3001 -m state --state NEW,ESTABLISHED -j ACCEPT
-A OUTPUT -d 127.0.0.1 -p tcp --source-port 3001 -m state --state ESTABLISHED -j ACCEPT
-A INPUT -s 127.0.0.1 -p tcp --destination-port 3002 -m state --state NEW,ESTABLISHED -j ACCEPT
-A OUTPUT -d 127.0.0.1 -p tcp --source-port 3002 -m state --state ESTABLISHED -j ACCEPT
# ...

# Mysql 连接
-A INPUT -s 127.0.0.1 -p tcp --destination-port 3306 -m state --state NEW,ESTABLISHED -j ACCEPT
-A OUTPUT -d 127.0.0.1 -p tcp --source-port 3306 -m state --state ESTABLISHED -j ACCEPT


# log denied calls
-A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied:" --log-level 7

# drop incoming sensitive connections
-A INPUT -p tcp --dport 80 -i eth0 -m state --state NEW -m recent --set
-A INPUT -p tcp --dport 80 -i eth0 -m state --state NEW -m recent --update --seconds 60 --hitcount 150 -j DROP

# reject all other inbound
-A INPUT -j REJECT
-A FORWARD -j REJECT

COMMIT
```

接着，

```bash
# 查看防火墙状态
sudo ufw status

# 激活防火墙
sudo ufw enable
```

开机启动防火墙脚本，

```bash
#!/bin/sh
iptables-restore /etc/iptables.up.rules
```

执行脚本，

```bash
sudo chmod +x /etc/network/if-up.d/iptables
```

#### 配置 Fail2Ban：

```bash
# 安装  fail2ban
sudo apt-get install fail2ban

# 查看 fail2ban 状态
sudo service fail2ban status

# 停止 fail2ban
sudo service fail2ban stop

# 开启 fail2ban
sudo service fail2ban start
```

**[⬆ back to top](#目录)**

## 搭建 Nodejs 生产环境

### 搭建服务器的 Nodejs 环境

```bash
# 更新服务器
sudo apt-get update

# 安装工具
sudo apt-get install vim openssl build-essential libssl-dev wget curl git

# 安装 nvm (node 版本管理工具) https://github.com/creationix/nvm
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.7/install.sh | bash

# 安装 Node.js (最新稳定版) https://nodejs.org/en/
nvm install v8.9.3

# 指定 Node.js 版本
nvm use v8.9.3

# 安装 npm
npm --registry=https://registry.npm.taobao.org install -g npm

# 如果有多个 Node.js 版本，通过这种方式指定默认版本
nvm alias default v8.9.3

# 增加系统文件监控数目
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

# 安装一些常用模块
npm install pm2 webpack gulp grunt-cli -g

```

### 借助 pm2 让 Node.js 服务常驻

```bash
# 启动服务
pm2 start app.js

# 查看所有服务
pm2 list

# 查看应用
pm2 show app

# 查看日志
pm2 logs
```

**[⬆ back to top](#目录)**

## 配置 Nginx 实现反向代理

### 配置 Nginx 反向代理 Nodejs 端口

安装 nginx

```bash
sudo apt-get install nginx
```

nginx 配置规则：可以通过 `http://47.xx.xx.xx` 访问服务器 `http://127.0.0.1:8081` 端口的服务

```bash
upstream gusaifei {
    server 127.0.0.1:8081;
}

server {
    listen 80;
    server_name 47.xx.xx.xx;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Nginx-Proxy true;

        proxy_pass http://gusaifei;
        proxy_redirect off;
    }
}

```

重启之前，可以先检测一下配置规则

```bash
sudo nginx -t
```

重启 nginx 服务

```bash
sudo nginx -s reload
```

**[⬆ back to top](#目录)**

## 服务器配置安装 MongoDB

### 在 Ubuntu 14.04 上安装 MongoDB

```bash
# 安装，https://docs.mongodb.com/v3.4/tutorial/install-mongodb-on-ubuntu/

# 开启服务
sudo service mongod start

# 停止服务
sudo service mognod stop

# 重启服务
sudo service mongod restart
```

### 修改 MongoDB 默认端口

```bash
# 编辑配置文件
sudo vi /etc/mongod.conf

# 修改 Port 项，端口范围 0 ~ 65536
net:
  port: xx

# 重启服务
sudo service mongod restart
```

### 往线上 MongoDB 导入单表数据或数据库

如果已经修改过端口，需要把 27017 换成修改的端口。

```bash
# 导出数据库：mongodump -h ip:端口 -d 数据库名 -o 输出文件夹名
mongodump -h 127.0.0.1:27017 -d movie -o movie-backup

# 压缩文件： tar zcvf 打包成的文件名 要打包的文件
tar zcvf movie.tar.gz movie-backup

# 上传文件到服务器： scp -P 端口号 本地压缩包 上传的服务器路径
scp -P xx ~/Desktop/mooc/movie.tar.gz root@47.xx.xx.xx:/home/tanya/dbbackup

# 解压文件：tar xvf 要解压的文件
tar xvf movie.tar.gz

# 导入数据库：mongorestore --host ip:端口 -d 数据库名 要导入的文件存放的位置
mongorestore --host 127.0.0.1:27017 -d movie ./dbbackup/movie-backup/movie

# 导出单表数据：mongoexport -d 数据库名 -c 表名 -q 查询条件 -o 输出文件名
mongoexport -d dream-wall -c dreams -q '{}' -o dreams.json

# 导入单表数据：mongoimport --host ip:端口 -d 数据库名 -c 表名 要导入的文件
mongoimport --host 127.0.0.1:27017 -d dream-wall -c dreams ./dreams.json

# 删除数据库
mongo --host 127.0.0.1:27017 dream-wall --eval "db.dropDatabase()"

```

### 往线上 MySQL 导入单表数据或数据库【新增】

```bash
# 导入数据库
source ./dream-wall.sql
mysql -u root -p dream-wall < dream-wall-backup.sql

# 导出数据库
mysqldump -u root -p dream-wall > dream-wall-backup.sql

```

### 为上线项目配置 MongoDB 数据库读写权限

创建用户及授权

```bash
# 切换到 admin 数据库
use admin

# 创建用户
db.createUser({user: 'tanya', pwd: 'tanya', roles: [{role: 'userAdminAnyDatabase', db: 'admin'}]})

# 授权
db.auth('tanya', 'tanya')

# 切换到其他数据库
use dream-wall

# 创建用户
db.createUser({user: 'tanya_dream-wall_runner', pwd: 'tanya', roles: [{role: 'readWrite', db: 'dream-wall'}]})
db.createUser({user: 'tanya_dream-wall_wheel', pwd: 'tanya', roles: [{role: 'read', db: 'dream-wall'}]})

# 修改配置，开启授权
sudo vi /etc/mongod.conf

security:
  authorization: 'enabled'

# 重启 mongo 服务，使配置生效
sudo service mongod restart

```

需要注意的是：每次要进行数据库操作都需要先进行授权 `db.auth('tanya', 'tanya')`

```bash
# 登录到指定数据库，无需授权
mongo 127.0.0.1:xx/dream-wall -u tanya_dream-wall_runner -p tanya

# 验证一下
show tables
db.dreams.find()
```

### 从一台服务器迁移数据到另一个线上 MongoDB 中

就是数据库数据的导入和导出操作

```bash
# 导出数据库：mongodump -h ip:端口 -d 数据库名 -u 用户名 -p 密码 -o 要输出的文件名
mongodump -h 127.0.0.1:19999 -d dream-wall -u tanya_dream-wall_wheel -p tanya -o dream-wall-old

# 导出单表：-h ip:端口 -d 数据库名 -u 用户名 -p 密码 -c 要导出的表 要输出的文件名
mongoexport -h 127.0.0.1:19999 -d dream-wall -u tanya_dream-wall_wheel -p tanya -c dreams -q '{}' -o dream-wall-dreams-old.json

# 下载到本地
scp -P 39999 root@47.xx.xx.xx:/home/tanya/db/dream-wall-old.tar.gz ./

# 导入数据库：mongorestore -h ip:端口 -d 数据库名 -u 用户名 -p 密码 要导入的文件名
mongorestore -h 127.0.0.1:19999 -d dream-wall -u tanya_dream-wall_wheel -p tanya dream-wall-old

# 导入单表：mongoimport -h ip:端口 -d 数据库名 -u 用户名 -p 密码 -c 要导入到的表 要导入的文件名
mongoimport -h 127.0.0.1:19999 -d dream-wall -u tanya_dream-wall_wheel -p tanya -c dreams dream-wall-dreams-old.json

# 下载文件到本地
scp -P xx root@47.xx.xx.xx:/home/xx/dbbackup ./
```

### 为数据库实现定时备份方案

备份脚本

```bash
#!/bin/sh

# 存放目录
backUpFolder=/home/tanya/backup/dream-wall
# 为目录名增加备份时间
date_now=`date +%Y_%m_%d_%H%M`
# 目录名
backFileName=dream-wall_$date_now

# 进入到目录，并创建目录
cd $backUpFolder
mkdir -p $backFileName

# 导出到目录中
mongodump -h 127.0.0.1:xx -d dream-wall -u tanya_dream-wall_wheel -p tanya -o $backFileName

# 压缩
tar zcvf $backFileName.tar.gz $backFileName

# 上传到七牛云
NODE_ENV=$backUpFolder@$backFileName node /home/tanya/tasks/upload.js

# 删除目录
rm -rf $backFileName
```

定时任务

```bash
# 配置定时任务
crontab -e

00 4 * * * sh /home/tanya/tasks/dream-wall.backup.sh
```

**注意啦**：如果遇到上传七牛云失败的问题：把 node 路径补全就行了

```bash
NODE_ENV=$backUpFolder@$backFileName /home/tanya/.nvm/versions/node/v8.9.3/bin/node /home/tanya/tasks/upload.js
```

### 上传到数据库备份到七牛云

你需要先在七牛云上创建存储的空间及找到你的公钥和私钥。并在备份脚本中传入 QINIU_BUCKET、QINIU_ACCESS_KEY、QINIU_SECRET_KEY，修改一下上面的备份脚本

```bash
NODE_ENV=$backUpFolder@$backFileName QINIU_BUCKET=空间名称 QINIU_ACCESS_KEY=你的公钥 QINIU_SECRET_KEY=你的私钥 node /home/tanya/tasks/upload.js
```

```javascript
const qiniu = require("qiniu");
const parts = process.env.NODE_ENV.split('@'); // 文件夹@文件名
const file = parts[1] + '.tar.gz';
const filePath = parts[0] + '/' + file;

var bucket = process.env.QINIU_BUCKET; // 空间
var accessKey = process.env.QINIU_ACCESS_KEY; // 公钥
var secretKey = process.env.QINIU_SECRET_KEY; // 私钥
console.log(accessKey, secretKey)
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var options = {
  scope: bucket,
  saveKey: file
}
var putPolicy = new qiniu.rs.PutPolicy(options);

var uploadToken = putPolicy.uploadToken(mac);
var config = new qiniu.conf.Config();
var localFile = filePath;

//config.zone = qiniu.zone.Zone_z0;
var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();

//file
formUploader.putFile(uploadToken, null, localFile, putExtra, function(respErr,
  respBody, respInfo) {
  if (respErr) {
    throw respErr;
  }

  if (respInfo.statusCode == 200) {
    console.log(respBody);
  } else {
    console.log(respInfo.statusCode);
    console.log(respBody);
  }
});
```

**[⬆ back to top](#目录)**

## 向服务器正式部署和发布上线 Nodejs 项目

### 上传项目代码到线上私有 Git 仓库

你需要了解一下 git 基本操作：

```bash
# 关联远程仓库
git remote add origin 远程仓库地址

# 添加所有文件
git add .

# 提交
git commit -m 'init'

# 推送到远程仓库
git push origin -u master
```

### 配置 PM2 一键部署线上项目结构

> pm2 文档：http://pm2.keymetrics.io/docs/usage/deployment/

pm2 配置文件 ecosystem.json

```json
{
  "apps": [
    {
      "name": "dream-wall-koa", // 应用名称
      "script": "server.js", // 启动脚本
      "env": { // 环境变量
        "COMMON_VARIABLE": "true"
      },
      "env_production": { // 生产环境变量
        "NODE_ENV": "production"
      }
    }
  ],
  "deploy": {
    "production": {
      "user": "tanya", // 用户名
      "host": ["47.xx.xx.xx"], // 主机
      "port": "39999", // 端口
      "ref": "origin/master", // 分支
      "repo": "git@gitee.com:drem-wall/dream-wall-koa.git", // 仓库地址
      "path": "/www/dream-wall-koa/production", // 上传到服务器的目录 /www/dream-wall-koa
      "ssh_options": "StrictHostKeyChecking=no",
      "post-deploy": "npm install --registry=https://registry.npm.taobao.org && pm2 startOrRestart ecosystem.json --env production", // 上传完成后执行的操作：安装依赖、启动 pm2
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}

```

创建文件夹并授权

```bash
# 进入到 www 目录
cd /www

# 创建文件夹
sudo mkdir dream-wall-koa

# 授权文件夹
sudo chmod 777 dream-wall-koa
```

部署项目到服务器

```bash
# 安装
pm2 deploy ecosystem.json production setup

# 发布
pm2 deploy ecosystem.json production
```

发布时报错：`pm2：command not found`

原因是：pm2 是非交互的操作方式

解决方式：打开 `~/.bashrc`， 注释掉最上面的几行

```bash
# If not running interactively, don't do anything
#case $- in
#    *i*) ;;
#      *) return;;
#esac
```

### 通过脚本部署前端项目（新增）

```bash
#!bin/sh

# 生产构建
npm run build

# 压缩文件，其中 dist为要上传的文件所在目录
tar -zcvf dist.tar.gz dist/

# 上传到服务器（需要输入密码，如果已经进行过私钥配置，则不用），其中/www/dream-wall-vue 为上传文件所在目录
scp -P xx -r dist.tar.gz tanya@47.xx.xx.xx:/www/dream-wall-vue

# 登录到服务器（需要输入密码，如果已经进行过私钥配置，则不用）
# 服务器环境开启
ssh -p xx tanya@47.xx.xx.xx << EOF

# 进入目标目录
cd /www/dream-wall-vue
# 清空 static 文件
sudo rm -rf static
# 解压
sudo tar -zxvf dist.tar.gz --strip-components 1
# 移除线上压缩文件
sudo rm -rf dist.tar.gz

exit
EOF

# 移除本地压缩文件
rm -rf dist.tar.gz

# 服务器环境结束
echo 上传完成！
```

上传时sudo 操作失败：

`sudo: no tty present and no askpass program specified`

解决方式：`sudo visudo` ，然后在末尾添加 `tanya ALL=(ALL) NOPASSWD: ALL`

`sudo: unkonown host xx`

解决方式：查看主机名 `cat /etc/hostname` 获取 xx，然后 `sudo vi /etc/hosts`

```bash
127.0.0.1       localhost.localdomain localhost
127.0.0.1       xx
```

**[⬆ back to top](#目录)**

## 使用和配置更安全的 HTTPS 协议

选购申请SSL证书：腾讯云、阿里云、七牛云、又拍云

### 申请证书

> 腾讯云证书申请地址：[https://console.cloud.tencent.com/ssl](https://console.cloud.tencent.com/ssl)

填写一些信息：绑定的域名、邮箱、...

### Nginx 配置

> 腾讯云证书安装文档：[https://cloud.tencent.com/document/product/400/4143](https://cloud.tencent.com/document/product/400/4143)

下载证书，上传到服务器的某一目录，比如：`/www/ssl`，并解压出来 1_www.xx.com_bundle.crt 和 2_www.xx.com.key

```bash
upstream dream-wall-express {
        server 127.0.0.1:xx; #xx 为服务器本地端口（例如：Node.js服务器监听端口）
}
server {
        listen 80;
        server_name xx.xx.com; #访问域名
        #rewrite ^(.*) https://$host$1 permanent;
        return 301 https://xx.xx.com$request_uri;
}

server {
        listen 443;
        server_name xx.xx.com; #填写绑定证书的域名
        ssl on;
        ssl_certificate /www/ssl/1_www.domain.com_bundle.crt; #上传到服务器的证书目录
        ssl_certificate_key /www/ssl/2_www.domain.com.key; #上传到服务器的证书目录
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2; #按照这个协议配置
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;#按照这个套件配置
        ssl_prefer_server_ciphers on;

        if ($ssl_protocol = "") {
                rewrite ^(.*) https://$host$1 permanent;
        }

        location / {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
                proxy_set_header Host $http_host;
                proxy_set_header X-Nginx-Proxy true;

                proxy_pass http://dream-wall-express;
                proxy_redirect off;
        }
}

```

**[⬆ back to top](#目录)**
