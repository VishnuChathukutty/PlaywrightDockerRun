const { TIMEOUT } = require("dns");

class ChatBotPage{
   

    constructor(page,path,expect)
    {
        this.chooseFileInput = 'input[type="file"]';
        this.chooseFileLoc = page.getByRole('button',{name:'Choose File'});
        this.uploadButton = page.locator('button:has(svg.lucide-upload)');
        this.playButton = page.locator('button:has(svg.lucide-play)');
        this.deleteButton = page.locator('button:has(svg.lucide-trash2)');
        this.genericUploadedFileName=page.locator('span.text-sm.truncate');
        this.qTextBox=page.getByRole('textbox');
        this.statusLabel=page.locator('div.text-xs');
        this.askQuestionButton=page.getByRole('button',{name:'Ask Question'})
        this.promptResponse= page.getByRole('paragraph');
        this.processing=page.getByRole('button',{name:'Processing...'})


        this.path=path;
        this.page=page;
        this.expect=expect;

    }


    async performSingleFileUploadFunctionality(fileName)
    {

        await this.page.route('http://localhost:8000/documents/upload/',async (route,request)=>
        {
        const data= request.postData();
        console.log('Upload API: ',data);
        const flag= data.includes(fileName);
        this.expect(flag).toBe(true);
        await route.continue();
        });

        //await this.page.goto('http://localhost:8000');
        await this.page.goto('http://host.docker.internal:8000');

        await this.expect(this.page).toHaveTitle('Vite + React + TS');
        const filePath= this.path.resolve(__dirname,'..', 'tests','files_for_upload',fileName);
        await this.page.setInputFiles(this.chooseFileInput,filePath);
        await this.uploadButton.click();
        await this.expect(this.genericUploadedFileName).toBeVisible();
        await this.expect(this.genericUploadedFileName).toContainText('Human_Evolution.pdf');

        await this.expect(this.deleteButton).toBeVisible();
        await this.deleteButton.click();


    }

    async navigateToPage()
    {
       // await this.page.goto('http://localhost:8000');
       await this.page.goto('http://host.docker.internal:8000');
    }

    async performMultipleFilesUpload(fileNames)
    {
    await this.navigateToPage();

    for (const fileName of fileNames) {
        const filePath = this.path.resolve(__dirname, '..', 'tests', 'files_for_upload', fileName);
        console.log(fileName);
        await this.page.setInputFiles('input[type="file"]', filePath);
        await this.uploadButton.click();
        await this.page.reload();
        
    }

    await this.expect(this.genericUploadedFileName.nth(0)).toBeVisible();

    const count = await this.genericUploadedFileName.count();
    await this.expect(count).toBe(2);

    for(let i=0;i<count;i++)
    {
        const locator = this.genericUploadedFileName.nth(i);
        await locator.click();
    }

    const playButtonCount = await this.playButton.count();
    for(let i=0;i<playButtonCount;i++)
    {
        const locator = this.playButton.nth(i);
        await locator.click();
    }

    await this.qTextBox.clear();
    await this.qTextBox.fill('Who is Homo sapiens?');
    await this.expect(this.askQuestionButton).toBeEnabled();
    await this.askQuestionButton.hover();
    await this.askQuestionButton.click();
    await this.expect(this.processing).toBeHidden();
    await this.expect(this.promptResponse).toBeVisible()


    await this.deleteFiles();

    
    }



    async happyPathValidation(fileName,qaList)
    {

        const filePath= this.path.resolve(__dirname,'..', 'tests','files_for_upload',fileName);
        await this.page.setInputFiles(this.chooseFileInput,filePath);
        await this.uploadButton.click();
        await this.expect(this.genericUploadedFileName).toBeVisible();
        const value= await this.statusLabel.textContent();
        await this.expect(value.toLowerCase()).toBe('unprocessed')
        await this.playButton.click();
        await this.expect(this.statusLabel).toHaveText('Processed');
        
        for(const qa of qaList)
        {
            await this.qTextBox.clear();
            await this.qTextBox.fill(qa.question);
            await this.expect(this.askQuestionButton).toBeEnabled();
            await this.askQuestionButton.hover();
            await this.askQuestionButton.click();
            await this.expect(this.processing).toBeHidden();
            await this.expect(this.promptResponse).toBeVisible()
            const responseMessage= this.promptResponse.textContent();


            for( const responseKeyword of qa.expectedKeywords)
            {
                await this.expect(this.promptResponse).toContainText(responseKeyword);
            }
            

        }

        
    }
    async deleteFiles()
    {
        const count = await this.deleteButton.count();
        for(let i=0;i<count;i++)
        {
            const locator = this.deleteButton.nth(i);
            await locator.click();
        }
    }

    async validateWrongFileType(fileName)
    {
        //this.page.on('dialog', dialog => dialog.accept());

          await this.page.route('http://localhost:8000/documents/upload/',async (route,request)=>
        {
        const data=await route.continue();
        if(data)
        {
            const responseBody = await data.text();
            console.log('Response Message:', responseBody);
            const isInvalidFormat = responseBody.includes('Invalid file format');
            this.expect(isInvalidFormat).toBe(true);
        }
        });


        const filePath= this.path.resolve(__dirname,'..', 'tests','files_for_upload',fileName);
        await this.page.setInputFiles(this.chooseFileInput,filePath);
        
        await this.uploadButton.click();

    }

    async validateWrongPrompt(fileName,prompt,message)
    {
        const filePath= this.path.resolve(__dirname,'..', 'tests','files_for_upload',fileName);
        await this.page.setInputFiles(this.chooseFileInput,filePath);
        await this.uploadButton.click();
        await this.expect(this.genericUploadedFileName).toBeVisible();
        const value= await this.statusLabel.textContent();
        await this.expect(value.toLowerCase()).toBe('unprocessed')
        await this.playButton.click();
        await this.expect(this.statusLabel).toHaveText('Processed');
        await this.qTextBox.clear();
        
        await this.qTextBox.fill(prompt);
        await this.expect(this.askQuestionButton).toBeEnabled();
        await this.askQuestionButton.hover();
        await this.askQuestionButton.click();
        await this.expect(this.processing).toBeHidden();
        await this.expect(this.promptResponse).toBeVisible()
        this.expect(this.promptResponse).toHaveText(message);
    }
}

module.exports={ChatBotPage};