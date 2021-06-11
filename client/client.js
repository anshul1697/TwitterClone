const form = document.querySelector('form'); // to grab the form 
const loadingElement = document.querySelector('.loading-img')
const API_URL = window.location.hostname == 'localhost' ? 'http://localhost:5400/tweets':'http://localhost:5400/tweets'; //later specify the url of backend 
const tweetElement = document.querySelector('.tweets')
//loadingElement.style.display = 'none';

listAllTweet(); // it is called when page is reloaded 

form.addEventListener('submit', (event) => {
    event.preventDefault(); //to prevent the actual action of submit 
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');

    const tweets = {
        name,
        content
    };
    console.log('Input data from the client side:');
    console.log(tweets);
    //form.style.display = 'none'
    //  loadingElement.style.display = ''

    //sending data to dynamic server 
    fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(tweets), //the req which we are sending is object which is converted to JSON
            headers: {
                'content-type': 'application/json' //it tells in the body of my req is JSON 
            }
        }).then(response => response.json()) //response from the DB 
        .then(createdTweet => {
            form.reset(),
            console.log('Data stored in DB:')
            console.log(createdTweet)
            //NOT WORKING: show form after 30 sec of submitting the tweet 
            // setTimeout(()=>{
            //     form.style.display = '';    
            // },100000);  
            
            listAllTweet(); // so that after submitting the funtion is called again to show to the lastest tweet
        });

});

//fetching all the stored data from DB
function listAllTweet() {
    tweetElement.innerHTML = ''; //blank out everything before and add something new
    fetch(API_URL)
        .then(response => response.json())
        .then(tweets => {
            console.log('All the data retrieved from DB to client side are listed below:')
            console.log(tweets)
            tweets.reverse();
            tweets.forEach(tweet => {
                const div = document.createElement('div');

                const header = document.createElement('h3');
                header.textContent = tweet.name;

                const contents = document.createElement('p');
                contents.textContent = tweet.content;

                const date = document.createElement('small');
                date.textContent = new Date(tweet.created);

                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);

                tweetElement.appendChild(div);
            })
        });
}