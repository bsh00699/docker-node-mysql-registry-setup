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
docker run -d -p 3310:3306 mysql -e MYSQL_ROOT_PASSWORD=123456 --name mysql01 mysql

```
