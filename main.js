d3.dsv(',', 'stop_information.csv', function(d) {
    return {
        lat: +d.lat,
        long: +d.long,
        count: +d.count
    }
}).then(function(stops) {
    var animateEnabled = false;
    var aniButton = document.getElementById("animate");
    var resetButton = document.getElementById("reset");

    console.log(stops);

    var min = { lat: d3.min(stops, function(d) { return d.lat; }),
                long: d3.min(stops, function(d) { return d.long; }),
                count: d3.min(stops, function(d) { return d.count; })};

    var max = { lat: d3.max(stops, function(d) { return d.lat; }),
                long: d3.max(stops, function(d) { return d.long; }),
                count: d3.max(stops, function(d) { return d.count; })};

    var colors = ["#1a0fdb", "#ed0739","#ed07ca", "#76ff45"];

    var colorScale = d3.scaleQuantile()
        .domain([0, d3.max(stops, function(d) { return d.count; })])
        .range(colors);

    console.log(colorScale);

    console.log("Minimum latitude: " + min["lat"]);
    console.log("Minimum longitude: " + min["long"]);
    console.log("Maximum latitude: " + max["lat"]);
    console.log("Maximum longitude: " + max["long"]);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight, 0.1, 10000 );
    camera.position.set(40,2900,400);
    camera.rotation.set(THREE.Math.degToRad(-65), 0, 0);
    var light = new THREE.PointLight(0xffffff,0.75,0);
    light.position.set(40,4000,300);
    scene.add(light);
    var light = new THREE.PointLight(0xffffff,0.5,0);
    light.position.set(0,2900,400);
    scene.add(light);
    var light = new THREE.PointLight(0xffffff,0.5,0);
    light.position.set(40,2900,600);
    scene.add(light);
    var light = new THREE.PointLight(0xffffff,0.5,0);
    light.position.set(20,2900,600);
    scene.add(light);
    var light = new THREE.PointLight(0xffffff,0.5,0);
    light.position.set(80,2900,300);
    scene.add(light);
    var light = new THREE.PointLight(0xffffff,0.5,0);
    light.position.set(100,2900,400);
    scene.add(light);
    var light = new THREE.AmbientLight(0xff0000, 0.75);
    scene.add( light );

    var planeGeometry = new THREE.PlaneBufferGeometry(10000000, 10000000);
    var mat = new THREE.MeshPhongMaterial( {color: 0xffffff, emissive: 0xffffff, side: THREE.DoubleSide, flatShading: true} );
    var plane = new THREE.Mesh( planeGeometry, mat );
    plane.position.set(0, 0, 0);
    plane.rotation.x = Math.PI / 2;

    scene.add( plane );

    function addCylinders(stops) {
        function scale(value, dimension, a, b) {
            return ((value-min[dimension]) / (max[dimension] - min[dimension])) * (b - a) + a;
        }

        for (var i = 0; i < stops.length; i++) {
            var c = colorScale(stops[i].count);
            var geometry = new THREE.CylinderBufferGeometry(7, 7, 120, 132);
            var mesh_params = {color:c, emissive:c,
                side:THREE.DoubleSide, flatShading:true};
            var material = new THREE.MeshPhongMaterial(mesh_params);
            var cylinder = new THREE.Mesh(geometry,material);

            cylinder.position.set(
                scale(stops[i].long, 'long', -1500, 1500),
                scale(stops[i].count,'count', 0, 3000),
                scale(stops[i].lat, 'lat', 0, 700)
            );

            scene.add(cylinder);
        }
    }

    addCylinders(stops);

    var renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.render(scene,camera);
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize',onWindowResize,false);
    document.addEventListener('keydown', setupControl, false);
    function onWindowResize(){
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth,window.innerHeight);
    }

    function animate() {
        if (animateEnabled) {
            requestAnimationFrame(animate);
            camera.position.z += 5;
            camera.position.y += 5;

            if (camera.position.z >= 2000)
                camera.position.z = 400;

            if (camera.position.y >= 4500)
                camera.position.y = 2900;

            renderer.render(scene, camera);
        }
    }

    aniButton.onclick = function() {
        if (animateEnabled) {
            animateEnabled = false;
            animate();
        }
        else {
            animateEnabled = true;
            animate();
        }
    };

    resetButton.onclick = function() {
        animateEnabled = false;
        camera.position.set(40,2900,400);
        camera.rotation.set(THREE.Math.degToRad(-65), 0, 0);
        renderer.render(scene, camera);
    };

    function setupControl() {
        document.onkeydown = function(e) {
            e.preventDefault();

            switch (e.keyCode) {
                case 37:
                    camera.position.x -= 10;
                    renderer.render(scene, camera);
                    break;
                case 38:
                    camera.position.y -= 10;
                    renderer.render(scene, camera);
                    break;
                case 39:
                    camera.position.x += 10;
                    renderer.render(scene, camera);
                    break;
                case 40:
                    camera.position.y += 10;
                    renderer.render(scene, camera);
                    break;
            }
        }
    }
});