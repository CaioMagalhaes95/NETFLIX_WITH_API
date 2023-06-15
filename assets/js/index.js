const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYWY1M2VlM2U5MmVlMjVhZTgyMjFlOTJiODIwNDEyOSIsInN1YiI6IjY0ODllNTI1YmYzMWYyNTA1NWEzNTM4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.C-6Z_6_7ll5rzYOw5sGUxGPRpUwSUUiHLIrlk0VMISY';
const tmbd_id = [677179, 713704, 447277, 569094, 298618, 976573, 76600, 493529];




var reproduction;



function mainVideo(video) {
  var reproductionContainer = document.getElementById('trailer');
  var playtrailer = document.createElement('iframe');
  playtrailer.setAttribute('src', 'https://www.youtube.com/embed/' 
  + video + '?autoplay=1&controls=0&showinfo=0&autohide=1&loop=1&mute=1');


  playtrailer.setAttribute('frameborder', '0');
  playtrailer.setAttribute('allowfullscreen', '1');


  reproductionContainer.appendChild(playtrailer);
  playtrailer.addEventListener('click', function() {
    roleplay();
  })
}

window.addEventListener('load', function() {
  var video = 'DlsMWz4QAvM';
  mainVideo(video);
});


function youTubeFrame() {

  reproduction = new YT.reproduction('trailer', {

    video: 'DlsMWz4QAvM',
    reproductionVars: {

      autoplay: 0,
      controls: 0,
      showinfo: 0,
      autohide: 1,
      loop: 1,
      mute: 1


    }
  });
}

function roleplay() {
  if (reproduction) {
    reproduction.playVideo();
  }
}



function getCode(movie) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      var url = 'https://api.themoviedb.org/3/movie/' +
       movie + 
       '/videos';
  
      xhr.open('GET', url);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
  
      xhr.onload = function() {
        if (xhr.status === 200) {
          var response = JSON.parse(xhr.responseText);
          var videoCode = null;
  
          for (var i = 0; i < response.results.length; i++) {
            var data = response.results[i];
            if (data.type === 'Trailer') {
              videoCode = data.key;
              break;
            }
          }
  
          resolve(videoCode);
        } else {
          reject(Error(xhr.statusText));
        }
      };
  
      xhr.onerror = function() {
        reject(Error('Network Error'));
      };
  
      xhr.send();
    });
  }
  

function exibirVideoModal(videoCode, divImg) {

  if (isVideoOpen) {
    return;
  }


  const img = divImg.querySelector('img');
  img.style.display = 'none';

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoCode}?autoplay=1&mute=1`;
  iframe.allowFullscreen = true;
  iframe.setAttribute('id', 'yt');
  iframe.setAttribute('width', '300');
  iframe.setAttribute('height', '200');
  iframe.setAttribute('title', 'YouTube video reproduction');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
  iframe.setAttribute('allowfullscreen', '');

  divImg.appendChild(iframe);
  isVideoOpen = true;

}

function fecharVideoModal(divImg) {
  const img = divImg.querySelector('img');
  img.style.display = 'block';

  const iframe = divImg.querySelector('iframe');
  iframe.parentNode.removeChild(iframe);
  isVideoOpen = false;
}

async function fetchAndLoadImages() {
    var promises = tmbd_id.map(function(id) {
      var url = 'https://api.themoviedb.org/3/movie/' + id;

      return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
  
        xhr.onload = function() {
          if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            resolve(response);
          } else {
            reject(Error(xhr.statusText));
          }
        };
  
        xhr.onerror = function() {
          reject(Error('Network Error'));
        };
  
        xhr.send();
      });
    });
  
    try {

      var results = await Promise.all(promises);
  
      next.forEach(function(slide) {
        var slideContainer = document.querySelector('.' + slide.id);
        slideContainer.removeAttribute('id');
        results.forEach(function(data) {
          var divImg = document.createElement('div');
          var img = document.createElement('img');
          img.src = 'https://image.tmdb.org/t/p/w300' + data.poster_path;
          img.alt = data.title;
          img.id = data.id;
          img.classList.add('slider__imagem');
  
          img.addEventListener('load', function() {
            img.addEventListener('mouseenter', function() {
              getCode(img.id)
                .then(function(videoCode) {
                  exibirVideoModal(videoCode, divImg);
                })
                .catch(function(error) {
                  console.error('Video Code went bad', error);
                });
            });
          });
  
          divImg.addEventListener('mouseleave', function() {
            fecharVideoModal(divImg);
          });
  
          divImg.appendChild(img);
          slideContainer.appendChild(divImg);
        });

        

        var slider = tns({
            container: '.' + slide.id,
            speed: 700,
            slideBy: 4,
            items: 5,
            prevButton: slide.prevButton,
            nextButton: slide.nextButton,
          });
        });
      } 
      
      catch (error) {
        console.error('404:', error);
      }
    }

    
let isVideoOpen = false;
const next = [
  {
    id: 'slide1',
    prevButton: '.previous1',
    nextButton: '.next1'
  },
  {
    id: 'slide2',
    prevButton: '.previous2',
    nextButton: '.next2'
  }
];
    
  
  

document.addEventListener('DOMContentLoaded', fetchAndLoadImages);
