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

test('The header has correct text', async ()=>{

    const text=await customPage.getText('a.brand-logo')

    expect(text).toEqual('Blogster');
})

test('Auth is ok', async ()=>{
    await customPage.waitForSelector('ul.right a')
    await customPage.click('ul.right a');

    const googleAuthPageText=await customPage.url();
    expect(googleAuthPageText).toContain('https://accounts.google.com/o/oauth2/')
})

test('When sign in shows logout buttion', async ()=>{
    await customPage.login();
    await customPage.waitFor('ul.right li:nth-child(2) a')

    const text=await customPage.getText('ul.right li:nth-child(2) a')
    expect(text).toEqual('Logout');
})



