// console.log("executing");

// const socket = io(`/`) 
// let videoGrid = document.getElementById('video-grid');

// let username = prompt("enter your name: ")

// const myPeer = new Peer(undefined//,{
// //   path: '/peerjs',
// //   host: '/',
// //   port: '5000'
// // }
// );

// //video rendering code
// let myVideoStream;
// let myVideo = document.createElement('video');
// myVideo.muted = true;
// //let peers ={}
// navigator.mediaDevices.getUserMedia({
//     video:true,
//     audio:true
// }).then(stream => {
//   myVideoStream = stream;
// addVideoStream(myVideo, stream);
// console.log("playing my stream")

// myPeer.on('call', call => {
//     call.answer(stream)
//     const video = document.createElement('video')
//     myVideo.id= "my_video"
//     call.on('stream', userVideoStream => {     
//         addVideoStream(video, userVideoStream)
//         console.log("added guest stream")
//     })
// })

// socket.on('user-connected',userId =>{
//  console.log("user conneced:" + userId)
//     connectToNewUser(userId,stream);
// })

// })

// // setting up peer to peer connection and getting random ids to be printed on connection

// myPeer.on('open', id => {
//     socket.emit('join-room', ROOM_ID, id);
// })

// //functions to getting the stream from media devices and putting into our video object on  the screen

// function connectToNewUser(userId, stream) {
//     let call = myPeer.call(userId, stream)
//     let video = document.createElement('video')
//     myVideo.id = "my_video";
//     call.on('stream', userVideoStream => {
//       addVideoStream(video, userVideoStream)
//     })
//     call.on('close', () => {
//       video.remove()
//     })
  
//   }
  
//   function addVideoStream(video, stream) {
//     video.srcObject = stream
//     video.addEventListener('loadedmetadata', () => {
//       video.play()
//     })
//     videoGrid.append(video)
//   }


//   // socket.on('user-disconnected', userId => {
// //   if (peers[userId]) peers[userId].close()
// // })

// // socket.on('user-connected', userId => {
// //     console.log('User connected :'+ userId)
// // })

//new code

let call_list = [];

const socket = io('/')
const videoGrid = document.getElementById('video-grid')

let username = prompt("Enter your name: ")

const myPeer = new Peer(undefined // , {
//   path: '/peerjs',
//   host: '/',
//   port: '443'
// }
)
let myVideoStream;
//const myVideo = document.createElement('video')
//myVideo.id = "my_video";

//myVideo.muted = true;
let peers = {}
// navigator.mediaDevices.getUserMedia({
//   video: true,
//   audio: true
// }).then(stream => {
//   myVideoStream = stream;
//   addVideoStream(myVideo, stream)
 
// })

myPeer.on('call', call => {
  call.answer(myVideoStream)
  const video = document.createElement('video')
  //myVideo.id = "my_video";
  call.on('stream', userVideoStream => {
    //console.log("incoming call")

    if(!call_list[call.peer]){
      console.log("incoming");
      addVideoStream( userVideoStream)
    }
    call_list[call.peer] = call;
    
  })
})

socket.on('user-connected', userId => {
  connectToNewUser(userId) //, stream))\
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
    $("ul").append(`<li class="message"><b>${username}</b><br/>${message}</li>`);
    scrollToBottom()
  })


socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close();
})

myPeer.on('open', id => {

  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {
    myVideoStream = stream;
    addVideoStream( stream) 
    socket.emit('join-room', ROOM_ID, id)
  })

 
})

function connectToNewUser(userId) {
  const call = myPeer.call(userId, myVideoStream)
  const video = document.createElement('video')
 // myVideo.id = "my_video";
  call.on('stream', userVideoStream => {

    if(!call_list[call.peer]){
      console.log("user");
      addVideoStream( userVideoStream)
    }
    call_list[call.peer] = call;
    
  })

  peers[userId] = call
  
  // call.on('close', () => {
  //   video.remove()
  // })

  
}

function addVideoStream( stream) {
  const video = document.createElement('video')
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
 // console.log('object')
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
  location.href = "/connect";
}





// const socket = io('/')
// const videoGrid = document.getElementById('video-grid')
// const myPeer = new Peer(undefined // , {
// //   path: '/peerjs',
// //   host: '/',
// //   port: '443'
// // }
// )
// let myVideoStream;
// const myVideo = document.createElement('video')
// myVideo.id = "my_video";

// myVideo.muted = true;
// let peers = {}
// navigator.mediaDevices.getUserMedia({
//   video: true,
//   audio: true
// }).then(stream => {
//   myVideoStream = stream;
//   addVideoStream(myVideo, stream)
//   myPeer.on('call', call => {
//     call.answer(stream)
//     const video = document.createElement('video')
//     myVideo.id = "my_video";
//     call.on('stream', userVideoStream => {
//       addVideoStream(video, userVideoStream)
//     })
//   })

//   socket.on('user-connected', userId => {
//     connectToNewUser(userId, stream)
//   })
//   // input value
//   let text = $("input");
//   // when press enter send message
//   $('html').keydown(function (e) {
//     if (e.which == 13 && text.val().length !== 0) {
//       socket.emit('message', text.val(),username);
//       text.val('')
//     }
//   });
//   socket.on("createMessage", (message,username) => {
//     $("ul").append(`<li class="message"><b>${username}</b><br/>${message}</li>`);
//     scrollToBottom()
//   })
// })

// socket.on('user-disconnected', userId => {
//   if (peers[userId]) peers[userId].close();
// })

// myPeer.on('open', id => {
//   socket.emit('join-room', ROOM_ID, id)
// })

// function connectToNewUser(userId, stream) {
//   const call = myPeer.call(userId, stream)
//   const video = document.createElement('video')
//   myVideo.id = "my_video";
//   call.on('stream', userVideoStream => {
//     addVideoStream(video, userVideoStream)
//   })
//   call.on('close', () => {
//     video.remove()
//   })

//   peers[userId] = call
// }

// function addVideoStream(video, stream) {
//   video.srcObject = stream
//   video.addEventListener('loadedmetadata', () => {
//     video.play()
//   })
//   videoGrid.append(video)
// }



// const scrollToBottom = () => {
//   var d = $('.main__chat_window');
//   d.scrollTop(d.prop("scrollHeight"));
// }


// const muteUnmute = () => {
//   const enabled = myVideoStream.getAudioTracks()[0].enabled;
//   if (enabled) {
//     myVideoStream.getAudioTracks()[0].enabled = false;
//     setUnmuteButton();
//   } else {
//     setMuteButton();
//     myVideoStream.getAudioTracks()[0].enabled = true;
//   }
// }

// const playStop = () => {
//  // console.log('object')
//   let enabled = myVideoStream.getVideoTracks()[0].enabled;
//   if (enabled) {
//     myVideoStream.getVideoTracks()[0].enabled = false;
//     setPlayVideo()
//   } else {
//     setStopVideo()
//     myVideoStream.getVideoTracks()[0].enabled = true;
//   }
// }

// const setMuteButton = () => {
//   const html = `
//     <i class="fas fa-microphone"></i>
//     <span>Mute</span>
//   `
//   document.querySelector('.main__mute_button').innerHTML = html;
// }

// const setUnmuteButton = () => {
//   const html = `
//     <i class="unmute fas fa-microphone-slash"></i>
//     <span>Unmute</span>
//   `
//   document.querySelector('.main__mute_button').innerHTML = html;
// }

// const setStopVideo = () => {
//   const html = `
//     <i class="fas fa-video"></i>
//     <span>Stop Video</span>
//   `
//   document.querySelector('.main__video_button').innerHTML = html;
// }

// const setPlayVideo = () => {
//   const html = `
//   <i class="stop fas fa-video-slash"></i>
//     <span>Play Video</span>
//   `
//   document.querySelector('.main__video_button').innerHTML = html;
// }