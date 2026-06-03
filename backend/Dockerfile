FROM php:8.3-fpm-alpine

WORKDIR /var/www/html

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    bash

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy composer files first (layer cache optimisation)
COPY composer.json composer.lock ./

# Install PHP dependencies (no dev, no scripts for production)
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --optimize-autoloader \
    --no-scripts

# Copy the rest of the application
COPY . .

# Set default env values (overridden by docker-compose or CI)
ENV APP_ENV=production
ENV APP_DEBUG=false

# Generate key and set storage permissions
RUN php artisan key:generate --force 2>/dev/null || true \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 8000

# Use PHP built-in server (suitable for staging/dev containers)
# For production, replace with php-fpm + nginx sidecar
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
