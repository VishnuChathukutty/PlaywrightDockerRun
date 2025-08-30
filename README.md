# Playwright RAG Automation


# 1. Install dependencies

npm install


# 2. Run all tests

npx playwright test


- This would run in headless mode currently, if you prefer running in headed mode , please change it from the playwright.config.js.

# 3. Open the report

npx allure serve

- Please check for the chromium part, as I have configured the browser as well as the project as chromium, hoping for best test run in chromium that the defualt webkit in docker run.

## Running in Docker Pipeline

# 1. Prerequirement 

- Make sure to run the RAG chat bot before going for the docker run. Make sure that the container is up and running.
- Change the url in page.goto() to await this.page.goto('http://host.docker.internal:8000'); in chatbotpage.js

# 2. Run the test in the docker container

 docker-compose up --build test-runner

# 3. Copy the Allure report generated

docker cp playwright-test-runner-1:/tests/allure-results ./allure-results

# 4. Open the report

 npx allure serve



##  Advantages &  Disadvantages

### Automation Setup

**Advantages:**

* Since the playwright is integrated with javascript, user can utilize all the features of the playwright.
* Fast and repeatable testing
* Reduces manual effort
* Enables parallel execution
* Catch regressions early

**Disadvantages:**

* Unable to use funcitonal automation frameworks like Nunit. These proven frameworks comes with lots of functionalities which reduces the work of automation testers, such as annotations like [Setup] [TestCaseSource]. Yes we can implement the same here, which I done it in the test, yet NUnit gives a leverage in functional testing perspective.
* Debugging is a challemge, yes there is Playwright Test for VSCode for easy test run and debug. There are some features like **HotReload** and **SetAsNextStatement**  which helps to reload the test from the failure and move the code (arrow) control to anywhere in the scope respectively.

### Pipeline Setup

**Advantages:**

* No need to worry on the playwright browser installation issue.
* Quick response

**Disadvantages:**

* Its really hard to find the real cause of an error, espacially Network related error. 
* Headed mode runs need some additional settings.


### Test Reporting

**Advantages:**

* Easy visibility of test health
* Traceability with screenshots/videos/logs
* Helps in root cause analysis

**Disadvantages:**

* None

---

# Found Bugs / Observation

* Need proper error display :
    Desription : I am running this RAG chat bot using my OPENAI API KEY, since the provided one was not working. My API usage has reached a limit on request per day. In Docker Desktop its showing the real reason . But in the RAG chat bot it just shows 'Internal Server Error'.
    It would good to display the real reason behind the issue.

    Expected result : Error message should contain 'Reached the limit per day'

    Actual result : Internal Server Error

* File name is staying the Choose File (input element) even after user clicked the 'Upload Button'
    Description : The file name will persist in the Choose File element even after Upload button is clicked. Once the upload button is clicked the file name should ne removed the Choose File element. This might end in a confusion for the user whether Choose File element allows further actions or not.

    Expected result : The file name should be removed from the Choose File element after the upload button click.

    Actual result : File name is persisting on the Choose File element.



---


