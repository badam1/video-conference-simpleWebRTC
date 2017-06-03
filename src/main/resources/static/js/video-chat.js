/*
 * Created by Adam Bodansky on 2017.06.02..
 */

$(function () {

    var room = $("#room").val();

    if (room) {
        $("form").remove();
        $("#urlAndForm").append(
            "<h4>Access url for : " + room + "</h4> " +
            "<input readonly='readonly' class='input form-control input-block' type='text' value='" + window.location + "'/>");
    }

    $("#createRoomBtn").on("click", function () {
        var roomName = $("#roomName").val();
    });

    var webrtc = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video
        localVideoEl: 'localVideo',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: '',
        // immediately ask for camera access
        autoRequestMedia: true,
        detectSpeakingEvents: true
    });

    var signalingUrl = $("#signalingServerUrl").val();

    if (signalingUrl !== "no") {
        webrtc.url = signalingUrl;
    }

// we have to wait until it's ready
    webrtc.on('readyToCall', function () {
        // you can name it anything
        if (room) webrtc.joinRoom(room);
    });

    // a peer video has been added
    webrtc.on('videoAdded', function (video, peer) {
        console.log('video added', peer);
        var remotes = document.getElementById('remotes');
        if (remotes) {
            var container = document.createElement('div');
            container.className = 'col-lg-3';
            container.id = 'container_' + webrtc.getDomId(peer);
            container.appendChild(video);

            // suppress contextmenu
            video.oncontextmenu = function () {
                return false;
            };
            video.className += "videoStream img img-rounded";

            remotes.appendChild(container);

            // show the remote volume
            var vol = document.createElement('meter');
            vol.id = 'volume_' + peer.id;
            vol.className = 'volume';
            vol.min = -45;
            vol.max = -20;
            vol.low = -40;
            vol.high = -25;
            container.appendChild(vol);
        }
    });

    webrtc.on('videoRemoved', function (video, peer) {
        console.log('video removed ', peer);
        var remotes = document.getElementById('remotes');
        var el = document.getElementById(peer ? 'container_' + webrtc.getDomId(peer) : 'localScreenContainer');
        if (remotes && el) {
            remotes.removeChild(el);
        }
    });

    // local p2p/ice failure
    webrtc.on('iceFailed', function (peer) {
        var connstate = document.querySelector('#container_' + webrtc.getDomId(peer) + ' .connectionstate');
        console.log('local fail', connstate);
        if (connstate) {
            connstate.innerText = 'Connection failed.';
            fileinput.disabled = 'disabled';
        }
    });

// remote p2p/ice failure
    webrtc.on('connectivityError', function (peer) {
        var connstate = document.querySelector('#container_' + webrtc.getDomId(peer) + ' .connectionstate');
        console.log('remote fail', connstate);
        if (connstate) {
            connstate.innerText = 'Connection failed.';
            fileinput.disabled = 'disabled';
        }
    });

    // helper function to show the volume
    function showVolume(el, volume) {
        if (!el) return;
        if (volume < -45) volume = -45; // -45 to -20 is
        if (volume > -20) volume = -20; // a good range
        el.value = volume;
    }

    // local volume has changed
    webrtc.on('volumeChange', function (volume, treshold) {
        showVolume(document.getElementById('localVolume'), volume);
    });

    // remote volume has changed
    webrtc.on('remoteVolumeChange', function (peer, volume) {
        showVolume(document.getElementById('volume_' + peer.id), volume);
    });
});
