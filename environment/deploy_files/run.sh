#!/bin/bash

#aplica as envs
sed "s|ENV_API_GATEWAY|${API_GATEWAY}|g" -i /app/*.js
sed "s|ENV_NIXFEEQA|${NIXFEEQA}|g" -i /app/*.js
sed "s|ENV_BRASIL_API|${BRASILAPI}|g" -i /app/*.js
sed "s|ENV_VIRTUAL_ACCOUNT_CARD_API|${VIRTUAL_ACCOUNT_CARD}|g" -i /app/*.js
sed "s|KEY_APP_NAME|${KEY_APP_NAME}|g" -i /app/*.js
sed "s|KEY_GROUP_ID|${KEY_GROUP_ID}|g" -i /app/*.js
sed "s|KEY_SELF_HIRING_CODE|${KEY_SELF_HIRING_CODE}|g" -i /app/*.js
sed "s|KEY_SESSION_TIMEOUT|${KEY_SESSION_TIMEOUT}|g" -i /app/*.js
sed "s|ENV_SUPPORT_EMAIL|${SUPPORT_EMAIL}|g" -i /app/*.js
sed "s|ENV_NO_REPLY_EMAIL|${NO_REPLY_EMAIL}|g" -i /app/*.js

exec nginx -g "daemon off;"



