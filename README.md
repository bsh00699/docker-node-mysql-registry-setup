# docker-node-mysql-registry-setup
Container Technology Building Services

## node-server-app
1. 编写Dockerfile文件
2. 镜像构建
3. 运行镜像
4. 发布镜像
#### 编写Dockerfile
```
FROM node:14

WORKDIR /app

COPY ./ ./

RUN npm install

CMD ["npm", "run", "dev"]
```
Dockerfile基础指令
* [Dockerfile介绍以及指令详解](https://www.runoob.com/docker/docker-dockerfile.html)
```
FROM # 基础镜像 比如centos
MAINTAINER # 镜像是谁写的 姓名+邮箱
RUN # 镜像构建时需要运行的命令
ADD # 添加，比如添加一个tomcat压缩包
WORKDIR # 镜像的工作目录
VOLUME # 挂载的目录
EXPOSE # 指定暴露端口，跟-p一个道理
RUN # 最终要运行的
CMD # 指定这个容器启动的时候要运行的命令，只有最后一个会生效，而且可被替代
ENTRYPOINT # 指定这个容器启动的时候要运行的命令，可以追加命令
ONBUILD # 当构建一个被继承Dockerfile 这个时候运行ONBUILD指定，触发指令
COPY # 将文件拷贝到镜像中
ENV # 构建的时候设置环境变量
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
自定义网络(用命令打通各个容器间的网络通信)
```
docker network create --driver bridge --subnet 192.168.0.0/16 --gateway 192.168.0.1 [网络名称]
  --driver bridge
  --subnet 192.168.0.0/16 可以支持255*255个网络 192.168.0.2 ~ 192.168.255.254
  --gateway 192.168.0.1
```
接下使用自己创建的网络来启动容器，发现[容器名1]和[容器2]是可以互相ping通的
```
docker run -d -P --name [容器名1] --net [自定义网络] [镜像名]
docker run -d -P --name [容器名2] --net [自定义网络] [镜像名]
```
## 私有仓库registry
* [参考文档](https://docs.docker.com/registry/)
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
#### 镜像的推送与拉取
* 将准备的镜像上传到registry服务,比如 mysql.tar.gz
```
docker load < mysql.tar.gz
```
* 镜像打标签
```
docker tag [存在镜像] [registry服务运行的ip/域名]:[端口]/[镜像名]:[版本]
比如mysql
docker tag mysql xxx.xxx.xxx.xxx:5000/mysql:5.7
```
* 推送镜像
```
docker push [域名:端口]/[镜像名:版本]
比如mysql
docker push xxx.xxx.xxx.xxx:5000/mysql:5.7
```
* 拉取镜像
```
docker pull [域名:端口]/[镜像名:版本]
比如mysql
docker pull xxx.xxx.xxx.xxx:5000/mysql:5.7
```

