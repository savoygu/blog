# Node.js项目线上服务器部署与发布

## 远程登录服务器

### ssh 远程登录服务器

```bash
# ssh 登录
ssh root@47.xx.xx.xx

# 查看硬盘
fdisk -l

# 查看硬盘使用情况
df -h
```

### 配置 root 及应用账号权限

```bash
# 增加用户
adduser tanya # tanya 为用户名，然后输入密码，创建完成

# 用户授权
gpasswd -a tanya sudo # 添加用户到  sudo 组中

sudo visudo # 接着，为用户授权

tanya ALL=(ALL:ALL) ALL
```

### 配置本地无密码 ssh 登录

```bash
# 生成 ssh key
ssh-keygen -t rsa -b 4096 -C "savoygu@gmail.com"

# 开启 ssh 代理
eval "$(ssh-agent -s)"

# 把生成的私钥文件加到代理中
ssh-add ~/.ssh/tanya_id_rsa

# 把生成的公钥文件放到服务器上 authorized_keys 文件中，并授权
chmod 600 authorized_keys

# 重启服务器 ssh 服务
sudo service ssh restart
```