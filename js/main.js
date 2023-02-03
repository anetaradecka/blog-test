const hamburgerButton = document.querySelector('.hamburger');
const navElements = document.querySelector('.nav-main .nav-ul');

hamburgerButton.addEventListener('click', () => {
    navElements.classList.toggle('show');
});

function checkIfNumbersAreDigits(number) {
    const numberToBeChecked = number.toString();
    if(numberToBeChecked[0] === '0') {
        number = numberToBeChecked.slice(1,2);
    }
    return number;
}

function convertDate(date) {
    const year = date.slice(0, 4);

    let day = date.slice(8, 10);
    day = checkIfNumbersAreDigits(day);

    let month = date.slice(5, 7);
    month = checkIfNumbersAreDigits(month);
    const months = {
        '1': 'stycznia', 
        '2': 'lutego', 
        '3': 'marca', 
        '4': 'kwietnia', 
        '5': 'maja', 
        '6': 'czerwca',
        '7': 'lipca', 
        '8': 'sierpnia', 
        '9': 'września', 
        '10': 'października', 
        '11': 'listopada', 
        '12': 'grudnia'
    };

    for(let key in months) {
        if (key === month) {
            monthName = months[key];
        }
    }

    const dateConverted = day + ' ' + monthName + ' ' + year;
    return dateConverted;
};

function convertContent(fullContent) {
    fullContent.toString();
    let shortContent = fullContent.substring(0, 600);
    return shortContent + ' (...)';
}

// function createTags(tagList) {
//     console.log(tagList);
//     console.log(tagList.length);
//     let tags = [];
//         const tag = tagList[i].category[0];
//         tags.push(tag);
//     for(let i = 0; i <= tagList.length-1; i++) {
//     }
//     return tags;
// }

function getPosts() {
    const query = `
        {
            posts {
              title
              coverPhoto {
                url
              }
              datePublished
              content {
                html
              }
              tags
            }
        }
    `;

    fetch('https://api-eu-central-1.hygraph.com/v2/cl4p3qsmt1u9a01w74bl3ghpr/master', {
        method: "POST",
        headers: {
            "Content-Type": 'application/json',
            "Accept": "application/json",
        },
        body: JSON.stringify({
            query,  
            variables: {},
        })
    }).then((response) => {
        return response.json();
    })
    .then(data => {
        console.log(data);
        const articlesSection = document.getElementById('articles-content');
        console.log(articlesSection);
        data.data.posts.forEach((post) => { 
            // create a new article          
            const article = document.createElement('article');
            article.classList.add('article-wrapper');
            // create an image for the article
            const image = document.createElement('div');
            image.classList.add('article-img');
            // image.innerHTML = post.coverPhoto.url;
            image.style.backgroundImage = `url(${post.coverPhoto.url})`;
            article.appendChild(image);
            // // create a box for the article's content 
            const item = document.createElement('div');
            item.classList.add('article-item');
            article.appendChild(item);
            //create tags' section
            const tags = document.createElement('section');
            tags.classList.add('tags');
            item.appendChild(tags);
            // // create single tags 
            const tagList = post.tags;
            //console.log(tagList);
            //const tagElements = createTags(tagList);
            tagList.forEach(tag => {
                const tagItem = document.createElement('div');
                tagItem.classList.add('tag');
                tagItem.innerHTML = tag;
                if(tagItem.innerHTML === 'tag-1') {
                    tagItem.classList.add('tag-orange');
                } else if (tagItem.innerHTML === 'tag-3') {
                    tagItem.classList.add('tag-blue');
                }
                tags.appendChild(tagItem);
            });

            // create article's body 
            const title = document.createElement('h2');
            title.innerHTML = post.title;
            const date = document.createElement('h3');
            date.classList.add('meta-info');
            const dateToBeConverted = post.datePublished;
            const dateConverted = convertDate(dateToBeConverted);
            date.innerHTML = dateConverted;
            const content = document.createElement('p');
            const fullContent = post.content.html;
            const shortContent = convertContent(fullContent);
            content.innerHTML = shortContent;

            content.classList.add('article-teaser');

            item.appendChild(title);
            item.appendChild(date);
            item.appendChild(content);
            // append the whole article to the articles section
            articlesSection.appendChild(article);
        })
    })
}

getPosts();