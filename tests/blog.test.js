Number.prototype._called = {};
const CustomPage=require('./helpers/page')
let customPage;
beforeEach(async ()=>{
    customPage=await CustomPage.build();
    await customPage.goto('http://localhost:3000')

})

afterEach(async ()=>{
    await customPage.close()
})

describe('when logged in', async ()=>{
    beforeEach(async ()=>{
        await customPage.login('http://localhost:3000/blogs');
        await customPage.waitFor('a.btn-floating.btn-large.red i')
    })
    test('+ button is there', async ()=>{
        await customPage.login('http://localhost:3000/blogs');
        const text=await customPage.getText('a.btn-floating.btn-large.red i')

        expect(text).toEqual('add');
    })

    describe('icon clocked', async ()=>{
        beforeEach(async ()=>{
            await customPage.click('a.btn-floating.btn-large.red i');
        })
        test('create blog', async ()=>{
            const label=await customPage.getText('form label')
            expect(label).toEqual('Blog Title')
        })

        describe('invalid form sent', async ()=>{
            beforeEach(async ()=>{
                await customPage.click('form button');
            })
            test('we see error message',async ()=>{
                const contentText=await customPage.getText('.content .red-text')
                const titleText=await customPage.getText('.title .red-text')

                expect(contentText).toEqual('You must provide a value')
                expect(titleText).toEqual('You must provide a value')
            })
        })
        describe('valid inputs sent', async ()=>{
            const titleText='my test case';
            const contentText='form button';
            beforeEach(async ()=>{
                await customPage.type('.title input','my test case');
                await customPage.type('.content input','form button');
                await customPage.click('form button');
            })
            test('submitting takes you to review screen', async ()=>{
                const h5text=await customPage.getText('h5');
                expect(h5text).toEqual('Please confirm your entries');
            })
            test('submitting adds blogs to a page', async ()=>{
                await customPage.click('button.green');
                await customPage.waitFor('.card-title')
                const titleTextOnPage=await customPage.getText('.card-title');
                expect(titleTextOnPage).toEqual(titleText);
            })
        })
    })

})

describe('not authorized', async ()=>{
    const options=[
        {
            method:"get",
            path:"/api/blogs"
        },
        {
            method:"post",
            path:"/api/blogs",
            body:{
                title:'my title',
                content:'my content'
            }
        }
    ];
    const errorText='You must log in!';

    test('Blog related action are prohibited', async ()=>{
        const results=await customPage.execRequest(options)
        for (let result of results){
            expect(result.error).toEqual(errorText)
        }
    });
})