import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';


// =====================================================
// CONFIG
// =====================================================

const isMobile = window.innerWidth < 768;

const ORBIT_TILT = 0;
const BLACK_HOLE_RADIUS = 22;

const scene = new THREE.Scene();

const loader = new THREE.TextureLoader();

scene.background = loader.load('Espacio.jpg');


// =====================================================
// CAMERA
// =====================================================

const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
);

if(isMobile){
    camera.position.set(0,30,220);
}else{
    camera.position.set(0,40,165);
}


// =====================================================
// RENDERER
// =====================================================

const renderer = new THREE.WebGLRenderer({
    antialias:true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio,2)
);

document
.getElementById('canvas-container')
.appendChild(renderer.domElement);


// =====================================================
// CONTROLS
// =====================================================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.enablePan = false;

controls.minDistance = 100;
controls.maxDistance = 300;

controls.autoRotate = true;
controls.autoRotateSpeed = 0.15;


// =====================================================
// POST FX
// =====================================================

const composer = new EffectComposer(renderer);

composer.addPass(
    new RenderPass(scene,camera)
);

const bloom = new UnrealBloomPass(
    new THREE.Vector2(
        window.innerWidth,
        window.innerHeight
    ),
    0.42,
    0.22,
    0.34
);

composer.addPass(bloom);


// =====================================================
// BLACK HOLE
// =====================================================

const blackHole = new THREE.Mesh(

    new THREE.SphereGeometry(
        BLACK_HOLE_RADIUS,
        128,
        128
    ),

    new THREE.MeshBasicMaterial({
        color:0x000000
    })

);

blackHole.renderOrder = 20;

scene.add(blackHole);


// =====================================================
// DISK
// =====================================================

function createDisk(){

    const count =
    isMobile ? 80000 : 200000;

    const positions =
    new Float32Array(count * 3);

    const colors =
    new Float32Array(count * 3);

    for(let i=0;i<count;i++){

        const radius =
        24 +
        Math.pow(Math.random(),1.65)
        *105;

        const angle =
        Math.random()
        * Math.PI
        * 2
        + radius * .35;

       const thickness = 0.02;

        positions[i*3] =
        Math.cos(angle)*radius;

        positions[i*3+1] =
        (Math.random()-.5)
        * thickness;

        positions[i*3+2] =
        Math.sin(angle)*radius;

        const c =
        new THREE.Color();

        if(radius<38){

            c.setRGB(
                1,
                .95,
                .8
            );

        }else if(radius<70){

            c.setRGB(
                1,
                .65,
                .35
            );

        }else{

            c.setRGB(
                .95,
                .18,
                .06
            );
        }

        colors[i*3] = c.r;
        colors[i*3+1] = c.g;
        colors[i*3+2] = c.b;
    }

    const geo =
    new THREE.BufferGeometry();

    geo.setAttribute(
        'position',
        new THREE.BufferAttribute(
            positions,
            3
        )
    );

    geo.setAttribute(
        'color',
        new THREE.BufferAttribute(
            colors,
            3
        )
    );

    return new THREE.Points(

        geo,

        new THREE.PointsMaterial({

            size:.11,

            vertexColors:true,

            transparent:true,

            opacity:.68,

            blending:
            THREE.AdditiveBlending,

            depthWrite:false

        })

    );
}

const lowerDisk =
createDisk();

lowerDisk.rotation.x =
ORBIT_TILT;

scene.add(lowerDisk);

const upperDisk =
createDisk();

upperDisk.rotation.x =
ORBIT_TILT;

upperDisk.scale.y = -0.05;

upperDisk.position.y = 5.2;

scene.add(upperDisk);


// =====================================================
// PHOTON RING
// =====================================================

const photonRing =
new THREE.Mesh(

    new THREE.RingGeometry(
        23,
        26.5,
        200
    ),

    new THREE.MeshBasicMaterial({

        color:0xffffff,

        transparent:true,

        opacity:.035,

        side:
        THREE.DoubleSide

    })

);

photonRing.rotation.x =
ORBIT_TILT;

scene.add(photonRing);


// =====================================================
// STARS
// =====================================================

const starCount =
isMobile ? 4000 : 10000;

const starPos =
new Float32Array(
    starCount*3
);

for(let i=0;i<starCount;i++){

    starPos[i*3] =
    (Math.random()-.5)*4000;

    starPos[i*3+1] =
    (Math.random()-.5)*4000;

    starPos[i*3+2] =
    (Math.random()-.5)*4000;
}

const stars =
new THREE.Points(

    new THREE.BufferGeometry(),

    new THREE.PointsMaterial({

        size:.8,

        color:0xffffff

    })

);

stars.geometry.setAttribute(

    'position',

    new THREE.BufferAttribute(
        starPos,
        3
    )

);

scene.add(stars);

// =====================================================
// GALERÍA ORBITAL
// =====================================================

const galleryItems = [];
let imagesCompleted = 0;

function createGalleryImage(
    image,
    angle,
    radius,
    title,
    description
){

    const texture = loader.load(image);

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
    });

    const sprite = new THREE.Sprite(material);

    sprite.scale.set(18, 18, 1);

    sprite.userData = {

    angle,
    radius,

    title,
    description,

    baseScale:18,

    absorbed:false,
    absorbing:false

};

    scene.add(sprite);

    galleryItems.push(sprite);

    return sprite;
}


// =====================================================
// TUS IMÁGENES
// =====================================================

createGalleryImage(
    "mylove1.png",
    0,
    120,
    "Las conversaciones que nos unen",
    "Son esos dias sencillos donde solo hablamos, pero dentro de esa sencillez se esconden momentos unicos donde compartimos nustros gustos, nuestra historia y nuestras preocupaciones."
);

createGalleryImage(
    "mylove2.png",
    Math.PI * 0.5,
    135,
    "Los momentos unicos",
    "son estos momentos donde pasar tiempo contigo me genera mucho mas amor y deseo por ti, y apesar de que no llevamos mucho siendo parejas en este corto periodo de dos meses haz logrado que mi amor crezca mas y cada dia crece mas"
);

createGalleryImage(
    "mylove3.png",
    Math.PI,
    150,
    "",
    ""
);

createGalleryImage(
    "mylove4.png",
    Math.PI * 1.5,
    165,
    "Mi vida a tu lado",
    "eres esa persona que sin poder verte, sin poder tocarte y sin poder besarte he logrado amar mas que a nadie, tu amor es tan grande que no solo logro llegar a mi corazon, tambien logro tocar mi alma, eres esa persona por la que lo daria todo por estar a tu lado, y como Meliodas hizo con Elizabeth te amare, luchare y por ti no me importa ser maldecido pero cumplire todas mis promesas aunque eso me tome 3.000 años"
);


// =====================================================
// FUTURAS IMÁGENES
// =====================================================

/*

createGalleryImage(
    "mylove5.png",
    2,
    180,
    "Título",
    "Texto"
);

*/


// =====================================================
// MODAL
// =====================================================

const imageModal =
document.getElementById("imageModal");

const modalImage =
document.getElementById("modalImage");

const modalTitle =
document.getElementById("modalTitle");

const modalDescription =
document.getElementById("modalDescription");

const continueBtn =
document.getElementById("continueBtn");

const closeModal =
document.getElementById("closeModal");

let currentOpenedImage = null;


closeModal.addEventListener(
    "click",
    ()=>{

        imageModal.style.display =
        "none";

    }
);


imageModal.addEventListener(
    "click",
    e=>{

        if(e.target === imageModal){

            imageModal.style.display =
            "none";
        }

    }
);

continueBtn.addEventListener(
    "click",
    ()=>{

        if(!currentOpenedImage)
        return;

        currentOpenedImage.userData.absorbing =
        true;

        imageModal.style.display =
        "none";
    }
);


// =====================================================
// RAYCASTER
// =====================================================

const raycaster =
new THREE.Raycaster();

const mouse =
new THREE.Vector2();

window.addEventListener(
    "click",
    event=>{

        mouse.x =
        (event.clientX /
        window.innerWidth)
        *2 -1;

        mouse.y =
        -(event.clientY /
        window.innerHeight)
        *2 +1;

        raycaster.setFromCamera(
            mouse,
            camera
        );

        const intersects =
        raycaster.intersectObjects(
            galleryItems
        );

        if(intersects.length){

            const obj =
            intersects[0].object;

            currentOpenedImage = obj;

            modalImage.src =
            obj.material.map.image.src;

            modalTitle.textContent =
            obj.userData.title;

            modalDescription.textContent =
            obj.userData.description;

            imageModal.style.display =
            "flex";
        }
    }
);


// =====================================================
// HOVER EFFECT
// =====================================================

window.addEventListener(
    "mousemove",
    event=>{

        mouse.x =
        (event.clientX /
        window.innerWidth)
        *2 -1;

        mouse.y =
        -(event.clientY /
        window.innerHeight)
        *2 +1;
    }
);


// =====================================================
// FALLING PARTICLES
// =====================================================

const fallCount =
isMobile ? 800 : 1800;

const fallPos =
new Float32Array(
    fallCount * 3
);

const fallData = [];

for(let i=0;i<fallCount;i++){

    const radius =
    150 + Math.random()*120;

    const angle =
    Math.random()
    * Math.PI * 2;

    const x =
    Math.cos(angle)
    * radius;

    const z =
    Math.sin(angle)
    * radius;

    const y =
    (Math.random()-.5)*15;

    fallPos[i*3] = x;

    fallPos[i*3+1] =
    y*Math.cos(ORBIT_TILT)
    - z*Math.sin(ORBIT_TILT);

    fallPos[i*3+2] =
    y*Math.sin(ORBIT_TILT)
    + z*Math.cos(ORBIT_TILT);

    fallData.push({

        radius,
        angle,

        speed:
        .003 +
        Math.random()*.004

    });
}


const falling =
new THREE.Points(

    new THREE.BufferGeometry(),

    new THREE.PointsMaterial({

        size:.42,

        color:0xffffff,

        transparent:true,

        opacity:.34

    })

);

falling.geometry.setAttribute(

    "position",

    new THREE.BufferAttribute(
        fallPos,
        3
    )

);

scene.add(falling);

// =====================================================
// MUSIC PLAYER
// =====================================================

const songs = [

{
    title:"Voyaging Star's Farewell",
    file:"music/Voyaging Star's Farewell.mp3",
    lrc:"Voyaging Star's Farewell.lrc",
    translation:"Voyaging Star's Farewell_es.lrc"
},

{
    title:"Isamar Mc - Dardos (cover en Japonés)",
    file:"music/Isamar Mc - Dardos (cover en Japonés).mp3"
},

{
    title:"Until I Found You",
    file:"music/Until I Found You.mp3"
},

{
    title:"Perfect",
    file:"music/Perfect.mp3"
},

{
    title:"All of Me",
    file:"music/All of Me.mp3"
}

];

let currentSong = 0;

const audio = new Audio();

audio.src = songs[0].file;

const playBtn =
document.getElementById("playBtn");

const nextBtn =
document.getElementById("nextBtn");

const prevBtn =
document.getElementById("prevBtn");

const playlistBtn =
document.getElementById("playlistBtn");

const playlistDiv =
document.getElementById("playlist");

const songTitle =
document.getElementById("songTitle");

const songTime =
document.getElementById("songTime");

const progressBar =
document.getElementById("progressBar");

const progressContainer =
document.getElementById("progressContainer");

const volumeSlider =
document.getElementById("volumeSlider");

const currentLyric =
document.getElementById("currentLyric");

const currentTranslation =
document.getElementById("currentTranslation");


// =====================================================
// PLAYLIST UI
// =====================================================

songs.forEach((song,index)=>{

    const item =
    document.createElement("div");

    item.className =
    "songItem";

    item.textContent =
    song.title;

    item.addEventListener(
        "click",
        ()=>{

            loadSong(index);
            audio.play();

            playBtn.textContent =
            "⏸";

        }
    );

    playlistDiv.appendChild(item);

});

playlistBtn.addEventListener(
    "click",
    ()=>{

        playlistDiv.classList.toggle(
            "open"
        );

    }
);


// =====================================================
// LOAD SONG
// =====================================================

let lyrics = [];
let translations = [];

async function loadSong(index){

    currentSong = index;

    audio.src =
    songs[index].file;

    songTitle.textContent =
    songs[index].title;

    document
    .querySelectorAll(".songItem")
    .forEach((e,i)=>{

        e.classList.toggle(
            "active",
            i===index
        );

    });

    lyrics = [];
    translations = [];

    if(songs[index].lrc){

        try{

            const lrcText =
            await fetch(
                songs[index].lrc
            ).then(r=>r.text());

            lyrics =
            parseLRC(lrcText);

        }catch(e){}

    }

    if(songs[index].translation){

        try{

            const lrcText =
            await fetch(
                songs[index].translation
            ).then(r=>r.text());

            translations =
            parseLRC(lrcText);

        }catch(e){}

    }

}

loadSong(0);


// =====================================================
// LRC PARSER
// =====================================================

function parseLRC(text){

    const lines =
    text.split("\n");

    const result = [];

    lines.forEach(line=>{

        const match =
        line.match(
        /\[(\d+):(\d+\.\d+)\](.*)/
        );

        if(match){

            const minutes =
            parseInt(match[1]);

            const seconds =
            parseFloat(match[2]);

            result.push({

                time:
                minutes*60+seconds,

                text:
                match[3]

            });

        }

    });

    return result;
}


// =====================================================
// CONTROLS
// =====================================================

playBtn.addEventListener(
    "click",
    ()=>{

        if(audio.paused){

            audio.play();

            playBtn.textContent =
            "⏸";

        }else{

            audio.pause();

            playBtn.textContent =
            "▶";

        }

    }
);

nextBtn.addEventListener(
    "click",
    ()=>{

        currentSong++;

        if(currentSong>=songs.length)
        currentSong=0;

        loadSong(currentSong);

        audio.play();

    }
);

prevBtn.addEventListener(
    "click",
    ()=>{

        currentSong--;

        if(currentSong<0)
        currentSong=songs.length-1;

        loadSong(currentSong);

        audio.play();

    }
);

volumeSlider.addEventListener(
    "input",
    ()=>{

        audio.volume =
        volumeSlider.value;

    }
);


// =====================================================
// PROGRESS BAR
// =====================================================

progressContainer.addEventListener(
    "click",
    e=>{

        const rect =
        progressContainer
        .getBoundingClientRect();

        const percent =
        (e.clientX-rect.left)
        / rect.width;

        audio.currentTime =
        percent *
        audio.duration;

    }
);


// =====================================================
// UPDATE LYRICS
// =====================================================

const LYRIC_OFFSET = 24;

function updateLyrics(){

    if(!lyrics.length)
    return;

    let current = "";
    let translated = "";

    for(let i=0;i<lyrics.length;i++){

        if(
            audio.currentTime >=
            lyrics[i].time + LYRIC_OFFSET
        ){

            current =
            lyrics[i].text;

            if(translations[i]){

                translated =
                translations[i].text;
            }
        }
    }

    currentLyric.textContent =
    current;

    currentTranslation.textContent =
    translated;
}

// =====================================================
// TIME FORMAT
// =====================================================

function formatTime(seconds){

    if(isNaN(seconds))
    return "00:00";

    const mins =
    Math.floor(seconds / 60);

    const secs =
    Math.floor(seconds % 60);

    return (
        String(mins).padStart(2,"0")
        + ":" +
        String(secs).padStart(2,"0")
    );
}


// =====================================================
// AUTO NEXT SONG
// =====================================================

audio.addEventListener(
    "ended",
    ()=>{

        currentSong++;

        if(currentSong >= songs.length){

            currentSong = 0;

        }

        loadSong(currentSong);

        audio.play();

    }
);


// =====================================================
// ANIMATE
// =====================================================

function animate(){

    requestAnimationFrame(animate);

    lowerDisk.rotation.y += 0.0015;
    upperDisk.rotation.y += 0.0016;
    photonRing.rotation.y += 0.0007;

    const arr =
    falling.geometry.attributes.position.array;

    for(let i=0;i<fallCount;i++){

        const p = fallData[i];

        p.angle += p.speed;

        p.radius *= 0.9984;

        const idx = i * 3;

        const x =
        Math.cos(p.angle) *
        p.radius;

        const z =
        Math.sin(p.angle) *
        p.radius;

        arr[idx] = x;

        arr[idx+1] =
        -z *
        Math.sin(ORBIT_TILT);

        arr[idx+2] =
        z *
        Math.cos(ORBIT_TILT);

        if(p.radius < BLACK_HOLE_RADIUS){

            p.radius =
            170 +
            Math.random() * 100;

            p.angle =
            Math.random() *
            Math.PI * 2;
        }
    }

    falling.geometry
    .attributes.position
    .needsUpdate = true;


    galleryItems.forEach(item=>{

      if(item.userData.absorbing){

    item.position.lerp(

        new THREE.Vector3(0,0,0),

        0.03

    );

    item.scale.multiplyScalar(
        0.98
    );

    if(item.scale.x < 0.5){

        item.visible = false;

        item.userData.absorbing = false;

        item.userData.absorbed = true;

        imagesCompleted++;
    }

    return;
}

        item.userData.angle += 0.002;

        const z =

Math.sin(
    item.userData.angle
)

*

item.userData.radius;

item.position.x =

Math.cos(
    item.userData.angle
)

*

item.userData.radius;

item.position.y =

-z *
Math.sin(ORBIT_TILT);

item.position.z =

z *
Math.cos(ORBIT_TILT);

    });


    raycaster.setFromCamera(
        mouse,
        camera
    );

    const hoverHits =

    raycaster.intersectObjects(
        galleryItems
    );

    galleryItems.forEach(sprite=>{

        sprite.scale.set(
            sprite.userData.baseScale,
            sprite.userData.baseScale,
            1
        );

    });

    if(hoverHits.length){

        hoverHits[0]
        .object
        .scale
        .set(
            22,
            22,
            1
        );
    }


    if(audio.duration){

        const percent =

        (audio.currentTime /
        audio.duration)

        *100;

        progressBar.style.width =
        percent + "%";

        songTime.textContent =

        formatTime(
            audio.currentTime
        )

        +

        " / "

        +

        formatTime(
            audio.duration
        );
    }

    updateLyrics();

    blackHole.lookAt(
        camera.position
    );

    if(imagesCompleted === galleryItems.length){

    document
    .getElementById("secretMessage")
    .style.display = "flex";
}

    controls.update();

    composer.render();
}

animate();


// =====================================================
// RESIZE
// =====================================================

window.addEventListener(
    "resize",
    ()=>{

        camera.aspect =

        window.innerWidth
        /

        window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(

            window.innerWidth,

            window.innerHeight

        );

        composer.setSize(

            window.innerWidth,

            window.innerHeight

        );

    }
);

