FROM php:8.3-apache

WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    nodejs \
    npm \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application files
COPY . .

# Set environment to production by default (override in compose)
ENV APP_ENV=local
ENV APP_DEBUG=true

# Install PHP dependencies
RUN composer install --no-interaction --no-progress --no-suggest 2>/dev/null || composer install --no-interaction --no-progress

# Install and build frontend assets
RUN npm install --ignore-scripts && npm run build 2>/dev/null || true

# Generate app key, run migrations and seeders (for local dev)
RUN php artisan key:generate 2>/dev/null || true

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Configure Apache to serve from public/
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

EXPOSE 8000

# Use PHP's built-in dev server for local dev, override for production
CMD php artisan serve --host=0.0.0.0 --port=8000
