#!/bin/sh
set -eu

cd /var/www/html

if [ ! -f .env ]; then
    if [ ! -f .env.example ]; then
        echo "Laravel .env.example is missing; cannot initialize environment." >&2
        exit 1
    fi
    cp .env.example .env
fi

mkdir -p storage/framework/cache/data storage/framework/sessions \
    storage/framework/views storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
chmod -R ug+rwx storage bootstrap/cache

if [ -z "${APP_KEY:-}" ] && ! grep -Eq '^APP_KEY=.+$' .env; then
    unset APP_KEY
    php artisan key:generate --force
fi

if [ -z "${APP_KEY:-}" ]; then
    unset APP_KEY
fi

attempt=0
until php -r '$dsn = sprintf("mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4", getenv("DB_HOST") ?: "mysql", getenv("DB_PORT") ?: "3306", getenv("DB_DATABASE") ?: "ecommerce"); try { new PDO($dsn, getenv("DB_USERNAME") ?: "", getenv("DB_PASSWORD") ?: ""); exit(0); } catch (Throwable $exception) { exit(1); }'; do
    attempt=$((attempt + 1))
    if [ "$attempt" -ge 60 ]; then
        echo "MySQL did not become available within 120 seconds." >&2
        exit 1
    fi
    sleep 2
done

php artisan migrate --force
php artisan config:cache
php artisan view:cache

exec /usr/bin/supervisord -c /etc/supervisord.conf