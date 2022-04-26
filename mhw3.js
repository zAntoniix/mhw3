function onSpotifyJson(json) {
  console.log('JSON ricevuto');
  const songs = document.querySelector('#result-view');
  songs.innerHTML = '';
  const ricerca = json.tracks.items;
  let num_ricerca = ricerca.length;
  if (num_ricerca > 20) {
    num_ricerca = 20;
  }

  for(let i=0; i<num_ricerca; i++) {
    const track_data = ricerca[i];
    const track = track_data.name;
    const artist = track_data.artists[0].name;
    const imm_album = track_data.album.images[1].url;
    const song = document.createElement('div');
    song.classList.add('song');
    const img = document.createElement('img');
    img.src = imm_album;
    const titolo = document.createElement('span');
    titolo.textContent = track;
    const artista = document.createElement('span');
    artista.textContent = artist;
    song.appendChild(img);
    song.appendChild(titolo);
    song.appendChild(artista);
    songs.appendChild(song);
  }
}

function onLyricsJson(json) {
  console.log('JSON ricevuto');
  const space = document.querySelector('#result-view');
  space.innerHTML = '';
  const testo = json.lyrics;

  const paragrafo = document.createElement('p');
  paragrafo.classList.add('testo');
  const testo_mod = testo.replace(/(\r\n|\r|\n)/g, '<br>');
  paragrafo.innerHTML = testo_mod;
  space.appendChild(paragrafo);
}

function onTokenJson(json) {
  token = json.access_token;
}

function onTokenReponse(response) {
  return response.json();
}

function onResponse(response) {
  return response.json();
}

function spotifyRicerca(event) {
  event.preventDefault();

  const track_input = document.querySelector('#song');
  const track_value = encodeURIComponent(track_input.value);
  console.log('Ricerca brano: ' + track_value);

  fetch('https://api.spotify.com/v1/search?type=track&q=' + track_value,
  {
    method: "GET",
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }).then(onResponse).then(onSpotifyJson);
}

function cercaTesto(event) {
  event.preventDefault();
  
  const artist_input = document.querySelector('#artist')
  const artist_value = encodeURIComponent(artist_input.value);
  const title_input = document.querySelector('#title');
  const title_value = encodeURIComponent(title_input.value);
  console.log('Ricerco testo: ' + artist_value + ' - ' + title_value);

  lyrics_url = 'https://api.lyrics.ovh/v1/' + artist_value + '/' + title_value;
  console.log('URL: ' + lyrics_url);

  fetch(lyrics_url).then(onResponse).then(onLyricsJson);
}

const client_id = 'b94de17de53f451a896dc613ba40dd50';
const client_secret = '8b966d397c8f425abd99a20d40b046c9';
let token;
fetch('https://accounts.spotify.com/api/token',
{
  method:"post",
  body: 'grant_type=client_credentials',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
  }
}).then(onTokenReponse).then(onTokenJson);

const form = document.querySelector('#spotify');
form.addEventListener('submit', spotifyRicerca);
const form2 = document.querySelector('#lyrics');
form2.addEventListener('submit', cercaTesto);