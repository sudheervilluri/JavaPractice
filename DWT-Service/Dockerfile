# pulling the node image having a version 10.16.0 from docker-integration repository from artifactory
FROM docker-integration.cernerrepos.net/dwt/node:10.16.0
# creating a workdirectory named as service
WORKDIR /service
# copy package.json file in workdir service
COPY package.json /service
# copy package-lock.json in workdir service
COPY package-lock.json /service
# copy .npmrc in workdir service because all modules it should pick from cernerrepos
COPY .npmrc /service
# running npm ci for installing node-modules
RUN npm ci --production
# copy dist folder inside service(dist folder contains development build)
COPY dist /service/dist
# copy .env file inside service
COPY .env /service
# copy schema folder contains schema.graphql inside service
COPY schema /service/schema
# running the command npm run start
CMD ["C:\\node\\npm.cmd", "run", "start"]
