const puppeteer=require('puppeteer')
const sessionFactory=require('../factories/sessionFactory');
const userFactory=require('../factories/userFactory');

class CustomPage {
    static async build(){
        const browser=await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
        const page=await browser.newPage();
        const customPage = new CustomPage(page)

        return new Proxy(customPage,{
            get: function (target,property) {
                return customPage[property] ||  browser[property] || page[property];
            }
        });
    }
    constructor(page) {
        this.page=page;
    }
    async login(url){
        const user=await userFactory();
        const {session,sig}=sessionFactory(user);
        await this.page.setCookie({name:'session',value:session})
        await this.page.setCookie({name:'session.sig',value:sig})

        await this.page.goto(url || 'http://localhost:3000')
    }

    async getText(selector){
        return await this.page.$eval(selector, el=>el.innerHTML)
    }

    async get(path){
        const result=await this.page.evaluate( async (_path)=>{
            const _result=await fetch(_path,{
                method: "GET",
                credentials: "same-origin",
                headers:{
                    'Content-Type': 'application/json'
                },
            }).then(res=>res.json())
            return _result;
        },path );
        return result;
    }

    async post(post,body){
        const result=await this.page.evaluate( async (_post,_body)=>{
            const _result=await fetch(_post,{
                method: "POST",
                credentials: "same-origin",
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(_body)
            }).then(res=>res.json())
            return _result;
        },post,body );
        return result;
    }

    execRequest(actions){
        return Promise.all(
            actions.map(({method,path,body})=>{
                return this[method](path,body)
            })
        )
    }
}

module.exports=CustomPage