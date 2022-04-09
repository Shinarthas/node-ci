fetch('/api/blogs',{
    method: "POST",
    credentials: "same-origin",
    headers:{
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title:'my title',
        content:'my content'
    })
})


fetch('/api/blogs',{
    method: "GET",
    credentials: "same-origin",
    headers:{
        'Content-Type': 'application/json'
    },
})