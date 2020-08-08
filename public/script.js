
const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myVideoEL = document.createElement('video')
myVideoEL.muted = true


var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
}); 


 let myVideoStream
 let newUserId
 let as = navigator.mediaDevices.getUserMedia({
     video:true,
     audio:true
 }).then(stream => {
    myVideoStream = stream
    addVideoStream(myVideoEL, stream)

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream)
     })

    peer.on('call', call => {
         call.answer(stream)
         const video = document.createElement('video')
         call.on('stream', userVideoStreem => {
             addVideoStream(video, userVideoStreem)
         })
    })
  }).catch(err =>{
        if(err.message == 'Requested device not found') {
            videoGrid.innerHTML = "Your video camera is not found"
        }
 })
 

 peer.on('open', id => {
    
    socket.emit('join-room', ROOM_ID, id)
 
 })
 
 const connectToNewUser = (userId, stream) =>{
    newUserId = userId
    const call = peer.call(userId, streem)
    const video =document.createElement('video')
    call.on('stream', userVideoStreem =>{
        addVideoStream(video, userVideoStreem)
    })
   
 }

 const addVideoStream = ( video, stream ) => {
     video.srcObject = stream
     video.addEventListner('loadmetadata', () =>{
         video.play()
     })
   
     videoGrid.append(video)
 }
 

let text = $('input')


$('html').keydown( (e) => { 
    if(e.which == 13 && text.val().length !==0){
       
        socket.emit('message', text.val())
        text.val('')
    }
});

socket.on('createMessage', message => {
   $('ul.messages').append(`<li class="message"><b>User : ${newUserId}</b><br>${message}</li>`)
   scrollToBottom()
})

const scrollToBottom = () => {
    let d = $('.main__chat_window')
    d.scrollTop(d.prop("scrollHeight"))
}

/**
 * Mute Our Video
 */
 const muteUnmute = () => {
   
         
        const enabled = myVideoStream.getAudioTracks()[0].enabled
        if(enabled){
            myVideoStream.getAudioTracks()[0].enabled = false
            setUnmuteButton()
        }else{
            setMuteButton()
            myVideoStream.getAudioTracks()[0].enabled = true
        }
  
 }

 const setMuteButton = () => {
     const html = `
        <i class="fas fa-microphone"></i>
        <span>Mute</span>
     `
     document.querySelector('.main__mute_button').innerHTML = html
 }

 const setUnmuteButton = () => {
     const html = `
        <i class="unmute fas fa-microphone-slash"></i>
        <span>Unmute</span>
     `
     document.querySelector('.main__mute_button').innerHTML= html
 }


 /**
  * Play and Stop Video
  */

  const playStop = () => {
   
      let enabled = myVideoStream.getVideoTracks()[0].enabled
      if(enabled){
            myVideoStream.getVideoTracks()[0].enabled = false
            setPlayVideo()
      }else{
            setStopVideo()
            myVideoStream.getVideoTracks()[0].enabled = true
      }
 
  }


  const setPlayVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
      `
      document.querySelector('.main__video_button').innerHTML = html
  }

  const setStopVideo = () => {
      
      const html = `
      <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
   `
   document.querySelector('.main__video_button').innerHTML = html
  }