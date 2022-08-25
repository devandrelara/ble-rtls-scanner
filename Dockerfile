FROM node:9.7.1-stretch
# install base dependencies 
RUN apt-get update && apt-get install -y bluetooth \
	bluez \
	libbluetooth-dev  \
	libudev-dev \
	&& rm -rf /var/lib/apt/lists/*


RUN npm install noble \
	node-beacon-scanner\
	mqtt

# copy script files
COPY src/. /scanner/
RUN chmod +x /scanner/main.js

CMD [ "node", "/scanner/main.js" ]