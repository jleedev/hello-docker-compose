FROM node:alpine
RUN corepack enable \
	&& corepack prepare --activate yarn@stable

WORKDIR /app
COPY .yarnrc.yml package.json yarn.lock ./
RUN yarn --immutable
COPY main.mjs ./

EXPOSE ${PORT}
CMD yarn start
