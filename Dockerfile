# Use official Playwright image with all browsers pre-installed
FROM mcr.microsoft.com/playwright:v1.55.0-jammy

# Set working directory inside the container
WORKDIR /tests

# Copy all project files (tests, pages, configs, etc.)
COPY . .

# Install dependencies
RUN npm install

# Install Allure CLI globally
RUN npm install -g allure-commandline --save-dev

# Run Playwright tests with Allure reporter
CMD ["npx", "playwright", "test", "--reporter=allure-playwright"]