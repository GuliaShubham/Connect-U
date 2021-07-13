let call_list = [];

const socket = io('/')
const videoGrid = document.getElementById('video-grid')

let username = prompt("Enter your name: ")

const myPeer = new Peer();
let myVideoStream;

myPeer.on('call', call => {
  
  call.answer(myVideoStream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
  
    if(!call_list[call.peer]){
      console.log("incoming");
      addVideoStream( userVideoStream,call.peer, "otherVideo")
    }
    call_list[call.peer] = call;
    
  })
})

socket.on('user-connected', userId => {
  connectToNewUser(userId);
})

  // input value
  let text = $("input");
  // when press enter send message
  $('html').keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {
      socket.emit('message', text.val(),username);
      text.val('')
    }
  });
  socket.on("createMessage", (message,username) => {
    var d =new Date();    
    var s= String(d); 
    $("ul").append(`<li class="message"><div id="message"><span id="username"><b>${username}</b></span> <span class='time'> on ${s.substring(0,21)}</span><br/>${message}</div></li>`);
    scrollToBottom()
  })


socket.on('user-disconnected', userId => {
  for(let i =0; i<videoGrid.childNodes.length ; i++){
    const tempId = videoGrid.childNodes[i].id;

    if(tempId === userId){
      videoGrid.removeChild(videoGrid.childNodes[i]);
      break;
    }
  }
})

myPeer.on('open', id => {

  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {
    myVideoStream = stream;
    addVideoStream( stream, id, "myVideo") 
    socket.emit('join-room', ROOM_ID, id)
  }) 
})

function connectToNewUser(userId) {
  const call = myPeer.call(userId, myVideoStream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {

    if(!call_list[call.peer]){
      console.log("user");
      addVideoStream( userVideoStream, call.peer, "otherVideo")
    }
    call_list[call.peer] = call;
    
  })
}

function addVideoStream( stream, userId, status) {
  const video = document.createElement('video')
 
  if(status === "myVideo")
  video.muted=true; // mute self video

  video.setAttribute('id',userId);
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })

  videoGrid.append(video)
}

const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

document.getElementById('leave_meeting').onclick = function (){
  console.log("left meering");
  location.href = "/";
}


const copy = () => {
  var inputc = document.body.appendChild(document.createElement("input"));
  inputc.value = window.location.href;
  inputc.focus();
  inputc.select();
  document.execCommand('copy');
  inputc.parentNode.removeChild(inputc);
  alert("URL Copied.");
}

