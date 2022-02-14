# docker-node-mysql-registry-setup
Container Technology Building Services

## node-server-app
1. 编写Dockerfile文件
2. 镜像构建
3. 运行镜像
4. 发布镜像
#### 编写Dockerfile
* [Dockerfile介绍以及指令详解](https://www.runoob.com/docker/docker-dockerfile.html)
```
FROM node:14

WORKDIR /app

COPY ./ ./

RUN npm install

CMD ["npm", "run", "dev"]
```
#### 镜像构建
```
docker build . -t [镜像名]
```
#### 运行镜像
```
docker run -p [机器端口]:[容器端口] -d --name [运行容器名] [镜像名]
```
#### 发布镜像
如果你的构建的镜像不易公开,那需要将镜像发布到自己的镜像仓库
* 如果环境是公有网络，推荐你在阿里云上申请一个镜像仓库
* 如果环境是私有网络，推荐使用registry镜像自已拉起一个镜像仓库服务（后面会介绍如何搭建一个私有镜像仓库服务）
## mysql
如果是Linux系统这里推荐镜像版本5.7，你懂的。
这里由于我这边是macM1环境，拉取镜像的时候需要后面跟上 --platform linux/x86_64
```
docker pull --platform linux/x86_64 mysql
docker run  --platform linux/amd64 -d -p 3310:3306 mysql -e MYSQL_ROOT_PASSWORD=123456 --name mysql-test mysql

或者这样
docker pull mysql/mysql-server
docker run --name mysql -p 3310:3306 -e MYSQL_ROOT_PASSWORD=123456 -d mysql/mysql-server

-d 后台运行
-p 端口映射
-e 环境配置 安装启动mysql需要配置密码
--name 容器名字
```
进入mysql
```
docker exec -it mysql bash
mysql -u root -p
create database db;
show databases db;
```
使用workbench连接会报错 Failed to Connect to MySQL at localhost:3306 with user root
解决如下
```
show databases;
use mysql;
show tables;
select Host, User  from user;
修改user表中的Host:
update user set Host='%' where User='root';
flush privileges;
```
## 容器间通信
当然你可以用命令打通各个容器间的网络通信，这里我们依赖编写compose-yaml文件
当然这是最简单的
```
version: '1.0'
services:
  build: .
  posts:
    - '5001:5000'
  db:
    image: 'mysql/mysql-server:latest'
    expose:
      - '3310'
    ports:
      - '3310:3306'
    environment:
       MYSQL_ROOT_PASSWORD: '123456'
       MYSQL_DATABASE: 'db'
       MYSQL_USER: 'root'
       MYSQL_PASSWORD: '123456'
```
## 私有仓库registry
* linux系统上
#### 启动服务
```
docker run -d -p 5000:5000 --restart=always -v /mnt/registry:var/lib/registry --name registry registry:2
-v 挂载，机器上的/mnt/registry挂载到容器里面var/lib/registry
```
#### 配置域名
```
vim /etc/hosts,编辑内容在最后添加【registry服务运行的ip】+ 域名
比如 xxx.xxx.xxx.xxx  xxx.xxx.com
```
#### 配置daemon.json
* vim /etc/docker/daemon.json, 将registry的地址【域名】+ 【端口】写入insecure-registries配置
```
{
  "insecure-registries": [
    "上面registry服务配置的域名:5000"
  ],
  "live-restore": true
}
```
#### 重启docker服务
```
systemctl daemon-reload
systemctl restart docker
```
#### 注：镜像的推送与拉取

