FROM gitlab-dreg.nexxera.com/devops/dockerimages/nginx:1.12.0-alpine3.6

COPY ./dist/ /app/
COPY environment/deploy_files/requirements.env /app/
COPY environment/deploy_files/run.sh /run.sh
COPY environment/deploy_files/nginx.vh.default.conf /etc/nginx/conf.d/default.conf

RUN chmod -R 777 /app && chmod +x /run.sh

CMD ["/run.sh"]