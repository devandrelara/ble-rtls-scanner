FROM node:9.7.1-stretch
# install base dependencies 
RUN apt-get update && apt-get install -y bluetooth \
	bluez \
	libbluetooth-dev  \
	libudev-dev \
	&& rm -rf /var/lib/apt/lists/*


RUN npm install noble \
	node-beacon-scanner\
	serialport \
	mqtt

# copy script files
COPY src/. /gateway-root/
RUN chmod +x /gateway-root/main.js

CMD ["nodejs" "/gateway-root/main.js"]