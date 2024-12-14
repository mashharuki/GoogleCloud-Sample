# pull official base image
FROM node:16.18.0

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Add Bun to PATH
ENV PATH="/root/.bun/bin:$PATH"


ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
COPY src ./src 

RUN npm install --production

COPY . .

LABEL "tee.launch_policy.allow_cmd_override"="true"
LABEL "tee.launch_policy.allow_env_override"="NODE_URL,RESULTS_BUCKET,KEY_BUCKET,MPC_PROJECT_NUMBER,MPC_PROJECT_ID"

CMD [ "bun", "run", "start" ]