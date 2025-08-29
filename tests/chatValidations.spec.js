const { test, expect } = require('@playwright/test');
const path = require('path');
const{ChatBotPage}=require('../pages/chatbotpage')


test('Single File Upload',async({page})=>
{

    const chatBotPageInstance = new ChatBotPage(page,path,expect);
    await chatBotPageInstance.performSingleFileUploadFunctionality('Human_Evolution.pdf');
}
)


const filesToUpload= [

    'Human_Evolution.pdf','Three_Body_Problem.pdf'
]

test('Multiple Files Upload Validations', async ({page})=>
{
  const chatBotPageInstance = new ChatBotPage(page,path,expect);
  await chatBotPageInstance.performMultipleFilesUpload(filesToUpload);
}

)



test.describe('Chat Response Validations',()=>
{
    test.beforeEach(async ({page})=>
    {
        const chatBotPageInstance = new ChatBotPage(page,path,expect);
        await chatBotPageInstance.navigateToPage();

    });
    test.afterEach(async ({page})=>
    {
        const chatBotPageInstance = new ChatBotPage(page,path,expect);
        await chatBotPageInstance.deleteFiles();

    });

       const qaList = [
    {
        question: "Name the earliest known hominins.",
        expectedKeywords: ["Sahelanthropus tchadensis", "Ardipithecus ramidus"]
    },
    {
        question: "Which hominin does 'Lucy' belong to?",
        expectedKeywords: ["Australopithecus afarensis", "Lucy", "bipedal"]
    },
    {
        question: "When and where did modern humans appear?",
        expectedKeywords: ["300,000 years ago", "Africa"]
    },
    {
        question: "With which species did Homo sapiens interbreed?",
        expectedKeywords: ["Neanderthals", "Denisovans"]
    },
    {
        question: "What is cultural evolution?",
        expectedKeywords: ["cultural evolution", "learning", "agriculture", "writing"]
    }
    ];




    test('Positive Chat Response Check',async({page})=>
    {
        const chatInstance = new ChatBotPage(page,path,expect);
        await chatInstance.happyPathValidation('Human_Evolution.pdf',qaList);

    });


    test('Wrong File Type',async({page})=>
    {
        const chatInstance = new ChatBotPage(page,path,expect);
        await chatInstance.validateWrongFileType('Google_Image.png');

    })

    test('Wrong Prompt Validation', async ({page})=>    
    {
        const chatInstance = new ChatBotPage(page,path,expect);
        await chatInstance.validateWrongPrompt('Three_Body_Problem.pdf','What is top speed of MIG-21?','Sorry, Question is not applicable to the documents submitted.');

    })

})