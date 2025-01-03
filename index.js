let photoLinks = [];

const API_KEY = '24d9f7d7aec0277bc9f41ed2ced464dd';
const USER_ID = '201168900@N04';

const BASE_URL = 'https://api.flickr.com/services/rest/';

async function getPhotos() {
    try {
        const retrievedLinks = JSON.parse(sessionStorage.getItem('photoLinks'));
        if (!retrievedLinks) {
            response = await axios.get(BASE_URL, {
            params: {
                method: 'flickr.people.getPhotos',
                api_key: API_KEY,
                user_id: USER_ID,
                format: 'json',
                nojsoncallback: 1,
                per_page: 500,
            }
            });

            const data = response.data;
            console.log(data);

            const photos = data.photos.photo;

            for (let p of photos) {
                let title = p.title;
                const link = `https://live.staticflickr.com/${p.server}/${p.id}_${p.secret}_b.jpg`;
                const flickerLink = `https://www.flickr.com/photos/${USER_ID}/${p.id}/`;
                photoLinks.push({title, link, flickerLink});
            }
            if (data.stat !== 'ok') {
                throw new Error(`API Error: ${data.message}`);
            }

            sessionStorage.setItem('photoLinks', JSON.stringify(photoLinks));
            console.log('used api')
        } else {
            photoLinks = retrievedLinks;
        }

        const gridSelection = ['one', 'two', 'three', 'four']

        const hoverOverlay = "opacity-0 hover:opacity-100 duration-300 absolute inset-0 z-10 flex justify-center items-center sm:text-2xl md:text-3xl lg:text-6xl text-white font-semibold";
        let startingDiv = 0;
        photoLinks.forEach((photo, index) => {

            //const pickDiv = gridSelection[Math.floor(index/3 - (Math.floor(index/12) * 4))];
            const pickDiv = gridSelection[startingDiv];
            if (startingDiv >= 3) {
                startingDiv = 0;
            } else {
                startingDiv++;
            }

            const mainDiv = document.querySelector(`#${pickDiv}`);

            const anchor = document.createElement('a');
            anchor.href = photo.flickerLink;

            const img = document.createElement('img');
            const div = document.createElement('div');
            div.className = 'relative';
            div.classList.add('grid', 'gap-4');

            const textDiv = document.createElement('div');
            textDiv.className = hoverOverlay;
            textDiv.textContent = photo.title;
            anchor.append(textDiv);

            img.src = photo.link;
            img.classList.add('h-auto', 'rounded-lg','max-w-full');

            div.append(img);
            div.append(anchor);
            mainDiv.setAttribute('style', 'height:100%')
            mainDiv.append(div);
        })
    } catch (e) {
        console.log(e);
    }
}

getPhotos();