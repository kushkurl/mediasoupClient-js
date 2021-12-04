const mediasoup = require('mediasoup-client');
const { v4: uuidV4} = require('uuid');

let btnSub;
let btnCam;
let btnScreen;
let textPublish;
let textWebcam;
let textScreen;
let textSubscribe;
let localVideo;
let remoteVideo;
let remoteStream;
let device;
let producer;
let consumeTransport;
let userId;
let isWebcam;
let produceCallback, produceErrback;
let consumerCallback, CnsumerErrback;
const websocketURL = 'ws://localhost:8000/ws'

let socket, device;

document.addEventListener('DOMContentLoaded', function(){
    btnCam = document.getElementById('btn_webcam'); 
    btnScreen = document.getElementById('btn_screen');
    btnSub = document.getElementById('btn_subscribe');
    textWebcam = document.getElementById('webcam_status');
    textScreen = document.getElementById('screen_status');
    textSubscribe = document.getElementById('subscribe_status');
    localVideo = document.getElementById('localVideo');
    remoteVideo = document.getElementById('remoteVideo');

    btnCam.addEventListener('click', console.log('cam btn'));
    btnScreen.addEventListener('click', console.log('screen btn'));
    btnSub.addEventListener('click', console.log('subscribe btn'));
});

const connect = () => {
    socket = new WebSocket(websocketURL);
    socket.onopen = () => {
        const msg = {
            type: "getRouterRtpCapabilities"
        }
        const rep = JSON.stringify(msg);
        socket.send(rep);
    }

    socket.onmessage = (event) => {
        const jsonValidation = isJsonString(message);
        if(!jsonValidation){
            console.log("json error");
            return;
        }
        let resp = JSON.parse(event.data);
        switch(resp.type){
            case 'routerCapabilities':
                onRouterCapabilities(resp);
                break;
            default:
                break;
        }
    }

    const onRouterCapabilities = (resp) =>{
        loadDevice(resp.data);
        btnCam.disabled = false;
        btnScreen.disabled = false;
    }

    const isJsonString = (str) => {
        try{
            JSON.parse(str);
        }
        catch (error){
            return false;
        }
        return true;
    }

    const loadDevice = async (routerRtpCapabilities) => {
        try {
            device = new mediasoup.Device();
        } catch (error) {
            if(error.name == "UnsupportedError"){
                console.log("browser not supproted");
            }
        }
    }

    await device.load({routerRtpCapabilities});

}