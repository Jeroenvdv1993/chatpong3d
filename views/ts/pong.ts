import {Pong} from '../../src/pong/pong';
import * as THREE from 'three';

var socket = io();
socket.emit('pong_player');

// THREE JS
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(256, 256);
let pong3DElement = document.getElementById('pong3D');
if(pong3DElement !== null){
    pong3DElement.appendChild(renderer.domElement);
}
    
let geometry = new THREE.BoxGeometry();
let sphereGeometry = new THREE.SphereGeometry();
let material = new THREE.MeshBasicMaterial({ color: 0x00FF00});
let fieldMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF})
let cube1 = new THREE.Mesh( geometry, material);
let cube2 = new THREE.Mesh(geometry, material);
let field = new THREE.Mesh(geometry, fieldMaterial);
let sphere = new THREE.Mesh(sphereGeometry, material);
cube1.scale.x = 8;
cube1.scale.y = 8;
cube1.scale.z = 64;
cube2.scale.x = 8;
cube2.scale.y = 8;
cube2.scale.z = 64;
sphere.scale.x = 8;
sphere.scale.y = 8;
sphere.scale.z = 8;
field.scale.x = 256;
field.scale.y = 8;
field.scale.z = 256;
field.position.x = 128;
field.position.y = -4;
field.position.z = 128;
scene.add(cube1);
scene.add(cube2);
scene.add(sphere);
scene.add(field);
camera.position.x = 128;
camera.position.y = 256;
camera.position.z = 256;
camera.lookAt(new THREE.Vector3(128, 0, 128));
function animate(){
    requestAnimationFrame(animate);
    //console.log(cube.position);
    renderer.render(scene, camera);
}
animate();

// canvas
const canvas = <HTMLCanvasElement | null> document.getElementById('pong');
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
if(player1 !== null && player2 !== null){
    socket.on('score', function(player1Score: number, player2Score: number){
        player1.innerHTML = `${player1Score}`;
        player2.innerHTML = `${player2Score}`;
    })
}
if(pong3DElement !== null){
    socket.on('update', function(pong: Pong){
        // Draw 3D
        //console.log(pong.player1.position);
        cube1.position.x = pong.player1.position.x;
        cube1.position.z = pong.player1.position.y;
        cube2.position.x = pong.player2.position.x;
        cube2.position.z = pong.player2.position.y;
        sphere.position.x = pong.ball.circle.point.x;
        sphere.position.z = pong.ball.circle.point.y;
    });
}
if(canvas !== null){
    const context = canvas.getContext('2d');
    
    if(context !== null){
        socket.on('update', function(pong: Pong){
            // Draw 2D
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.lineWidth = 2;
            context.strokeStyle = "#000000";
            context.strokeRect(0,0, canvas.width, canvas.height);
            context.beginPath();
            context.arc(pong.ball.circle.point.x, pong.ball.circle.point.y, pong.ball.circle.radius, 0, 2* Math.PI, false);
            context.fillStyle = 'black';
            context.fill();
            context.beginPath();
            context.rect(
                pong.player1.position.x - pong.player1.size.x / 2, 
                pong.player1.position.y - pong.player1.size.y / 2, 
                pong.player1.size.x, 
                pong.player1.size.y);
            context.fillStyle = 'black';
            context.fill();
            context.beginPath();
            context.rect(
                pong.player2.position.x - pong.player2.size.x / 2, 
                pong.player2.position.y - pong.player2.size.y / 2, 
                pong.player2.size.x, 
                pong.player2.size.y);
            context.fillStyle = 'black';
            context.fill();
        });
    }
}

// move
let map: any[] = [];
document.onkeydown = document.onkeyup = function(e){
    e = e ||event; // to deal with IE
    map[e.keyCode] = e.type === 'keydown';
    if(map[90]){
        socket.emit('move_up');
    }
    else if(map[83]){
        socket.emit('move_down');
    }
    else{
        socket.emit('move_stop');
    }
}