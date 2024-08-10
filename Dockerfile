# 使用官方的 Nginx 镜像作为基础镜像
FROM nginx:alpine

# 将构建后的静态文件复制到 Nginx 的默认静态文件目录
COPY dist /usr/share/nginx/html

# 复制自定义的 Nginx 配置文件（如果有）
# COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
