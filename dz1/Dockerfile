FROM mongo:8.0.14

# устанавливаем SSH
RUN apt-get update && apt-get install -y \
    openssh-server \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# настраиваем SSH
RUN mkdir /var/run/sshd
RUN echo 'root:password123' | chpasswd
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config

# создаем юзера для SSH
RUN useradd -m -s /bin/bash mongoadmin
RUN echo 'mongoadmin:admin123' | chpasswd
RUN usermod -aG sudo mongoadmin

# открываем порты
EXPOSE 27017 22

# запускаем SSH и MongoDB
CMD service ssh start && mongod --bind_ip_all