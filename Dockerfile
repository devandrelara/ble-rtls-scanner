FROM node:9.7.1-stretch
# install base dependencies 
RUN apt-get update && apt-get install -y bluetooth \
	bluez \
	libbluetooth-dev  \
	libudev-dev \
	&& rm -rf /var/lib/apt/lists/*


RUN npm install noble \
	node-beacon-scanner\
	serialport

# copy script files
COPY script/. /gateway-root/
RUN chmod +x /gateway-root/hello.js

CMD ["node" "/gateway-root/hello.js"]