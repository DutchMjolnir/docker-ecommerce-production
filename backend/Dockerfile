FROM composer:2 AS composer-bin

FROM php:8.4-fpm-alpine AS php-base
RUN apk add --no-cache libcurl libxml2 oniguruma \
    && apk add --no-cache --virtual .php-build-deps $PHPIZE_DEPS curl-dev libxml2-dev oniguruma-dev \
    && docker-php-ext-install -j"$(nproc)" curl pdo_mysql mbstring xml opcache \
    && apk del .php-build-deps

FROM php-base AS dependencies
COPY --from=composer-bin /usr/bin/composer /usr/bin/composer
RUN apk add --no-cache unzip
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-progress --no-scripts
COPY . .
RUN composer dump-autoload --no-dev --optimize --no-interaction

FROM php-base AS runtime
RUN apk add --no-cache nginx supervisor curl
WORKDIR /var/www/html
COPY --from=dependencies --chown=root:root /app /var/www/html
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY docker/php-production.ini /usr/local/etc/php/conf.d/zz-production.ini
RUN mkdir -p /run/nginx /var/lib/nginx/tmp/client_body /var/lib/nginx/tmp/proxy \
    /var/lib/nginx/tmp/fastcgi /var/lib/nginx/tmp/uwsgi /var/lib/nginx/tmp/scgi \
    && chown -R nginx:nginx /run/nginx /var/lib/nginx \
    && mkdir -p storage/framework/cache/data storage/framework/sessions \
    storage/framework/views storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R ug+rwx storage bootstrap/cache

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD curl --fail --silent http://127.0.0.1/up || exit 1
ENTRYPOINT ["sh", "/usr/local/bin/entrypoint.sh"]