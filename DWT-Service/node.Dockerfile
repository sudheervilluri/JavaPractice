# This dockerfile will create a windows container dockerimage of node with version 10.16.0
FROM mcr.microsoft.com/windows/nanoserver:10.0.14393.953
ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 10.16.0

ADD https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-win-x64.zip C:\\build\\node-v${NODE_VERSION}-win-x64.zip

RUN powershell -Command Expand-Archive C:\build\node-v%NODE_VERSION%-win-x64.zip C:\; Rename-Item C:\node-v%NODE_VERSION%-win-x64 node
RUN SETX PATH C:\node

CMD ["C:\\node\\node.exe"]