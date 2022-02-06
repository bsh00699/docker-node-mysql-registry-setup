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
docker pull mysql/mysql-server:5.7
docker run --name mysql -p 3310:3306 -e MYSQL_ROOT_PASSWORD=123456 -d mysql/mysql-server:5.6

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
## 容器间通信
当然你可以用命令打通各个容器间的网络通信，这里我们依赖编写compose-yaml文件
当然这是最简单的
```
version: '1.0'
services:
  build: .
  posts:
    - '5000:5000'
  db:
    image: 'mysql/mysql-server:5.7'
    expose:
      - '3310'
    ports:
      - '3310:3306'
    environment:
       MYSQL_ROOT_PASSWORD: '123456'
       MYSQL_DATABASE: 'db'
       MYSQL_USER: 'docker'
       MYSQL_PASSWORD: '123456'
```
