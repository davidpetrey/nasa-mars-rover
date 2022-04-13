import {marsRoverApiKey} from '../api-key.js';
console.log(marsRoverApiKey);


document.addEventListener('DOMContentLoaded', () => {
/* https://api.nasa.gov/ */

	let maxSol;
	let manifest;
	let solsWithPics;


	let getManifest = (rover) => {
		$.ajax({
			method: "GET",
			url: `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${marsRoverApiKey}`,
		})
		.done(function(data, textStatus, jqXHR) {
			console.log(jqXHR.status, textStatus);
			console.log(data);
			console.log(data.photo_manifest.max_sol);
			// console.log(jqXHR);
			manifest = data.photo_manifest;
			maxSol = data.photo_manifest.max_sol;
			console.log(manifest);


			solsWithPics = manifest.photos.map(arr => arr.sol);

			console.log(solsWithPics);


			solDescript.innerText = "Please enter a number from day 1 to day " + maxSol;

			selectCamera.innerHTML = "";
			selectCamera.disabled = true;
			selectSolarDay.value = "";
			selectSolarDay.disabled = false;



			// processData(data.photos);

		}).fail(function(jqXHR, textStatus, errorThrown){
			console.log(textStatus, jqXHR.status, jqXHR.statusText);
		});
	}









	let selectedRover;
	let selectedSol;
	let selectedCamera;







	const selectRover = document.getElementById("inputRover");
	const selectSolarDay = document.getElementById("inputSol");
	let selectCamera = document.getElementById("inputCamera");
	let solDescript = document.getElementById("solDescript");

	selectRover.addEventListener('change', (e) => {
		if (e.target.value) {
			selectedRover = e.target.value;
			getManifest(selectedRover);
		}
	});

	selectSolarDay.addEventListener('keyup', (e) => {
		if(/^[0-9]+$/.test(e.target.value)){
			console.log('keyup', e.target.value);

			debounceInput(e.target.value);
			// addCameras(e.target.value);


		}
	});

	/* disable */
	selectSolarDay.addEventListener('keydown', (e) => {
		selectCamera.disabled = true;
		console.log('disable');

	});


	selectCamera.addEventListener('change', (e) => {
		console.log('camera input change');
		selectedCamera = e.target.value;
		console.log(selectedCamera);

	});


	// selectSolarDay.addEventListener('keyup', (e) => { });

	function solarDayError(found) {
		solDescript.innerText = "No photos for this day. Next day with photos is " + found;
	}



	let debounceTimer;
	let cameraTemplate;

	function debounceInput(sol){
		cameraTemplate = "";
		window.clearTimeout(debounceTimer);
		debounceTimer = window.setTimeout(() => {
			let solNumber = +sol;

			let index;
			let found = solsWithPics.find(function(item, i) {
				index = i;
				console.log(item, solNumber);
				if (item == solNumber) return true;
				return item > solNumber;
			});
			console.log('found', found);

			if (solNumber != found) {
				solarDayError(found);
			}

			if (solNumber == found) {
				solDescript.innerText = "Please enter a number from day 1 to day " + maxSol;
				selectedSol = sol;

				// (function(){
					cameraTemplate = `<option value=""></option>`;
				console.log(index);

					manifest.photos[index].cameras.forEach(camera => {
						console.log("camera", camera);

					cameraTemplate += `<option value="${camera}">${camera}</option>`;
				});

				selectCamera.disabled = false;
				selectCamera.innerHTML = cameraTemplate;
				// }());
			}

		}, 1000);
	}



	// set submit function here
	let getPhotosButton = document.getElementById("getPhotos");

	getPhotosButton.addEventListener("click", (e) => {
		getImages(selectedRover, selectedSol, selectedCamera)
	})




















	function getImages(roverNameQsValue, solDayQSValue, cameraQsValue) {
		console.log(roverNameQsValue, solDayQSValue, cameraQsValue);

		// let requestUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverNameQsValue}/photos?sol=${solDayQSValue}&page=1&api_key=${marsRoverApiKey}`;
		let requestUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverNameQsValue}/photos?sol=${solDayQSValue}&page=1&camera=${cameraQsValue}&api_key=${marsRoverApiKey}`;


		$.ajax({
			method: "GET",
			url: requestUrl,
		})
		.done(function(data, textStatus, jqXHR) {
			console.log(jqXHR.status, textStatus);
			console.log(data);
			// console.log(jqXHR);

			processData(data.photos);

		}).fail(function(jqXHR, textStatus, errorThrown){
			console.log(textStatus, jqXHR.status, jqXHR.statusText);
		});
	}



	// getImages('Curiosity', 22, 'CHEMCAM')
	// getImages('curiosity', 22, 'navcam')
	// getImages('curiosity', 33, 'FHAZ')
	// getImages('curiosity', 33, 'RHAZ')



	//
		// let headersList = {
		// 	"Accept": "*/*",
		// 	"User-Agent": "Thunder Client (https://www.thunderclient.com)"
		// }
	//
	/*
		fetch("https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=100&page=1&api_key=${marsRoverApiKey}", {
			method: "GET",
			headers: headersList
		}).then(function(response) {
			console.log(response);
			return response.text();
		}).then(function(data) {
			processData(JSON.parse(data).photos)
		});
	*/


	let myTemplate;

	function processData(photos) {
		console.log('photos', photos);

		myTemplate = '';

		// let rover, camera, imgSrc;

		photos.forEach(row => {
			makeTemplate(row.rover.name, row.camera.name, row.img_src, row.earth_date);
			console.log(row.camera.name);

		});

		function makeTemplate(rover, camera, imgSrc, earthDate) {
			let tempTemplate = `<div class="col-12 col-md-6 col-lg-4 col-xl-3"><img src="${imgSrc}" alt=""> <div class="text-end">Date: ${earthDate} </div></div>`;

			myTemplate += tempTemplate;

			let longName = getCameraName(camera.toLowerCase())
			let properRoverName = rover.charAt(0).toUpperCase() + rover.slice(1);

			document.getElementById("roverName").innerHTML = properRoverName;
			document.getElementById("cameraName").innerHTML = longName;
			document.getElementById("test").innerHTML = myTemplate;
		}



	}











	const cameraNameLookup = {
		"fhaz":		"Front Hazard Avoidance Camera",
		"rhaz":		"Rear Hazard Avoidance Camera",
		"mast":		"Mast Camera",
		"chemcam":		"Chemistry and Camera Complex",
		"mahli":		"Mars Hand Lens Imager",
		"mardi":		"Mars Descent Imager",
		"navcam":		"Navigation Camera",
		"pancam":		"Panoramic Camera",
		"minites":		"Miniature Thermal Emission Spectrometer (Mini-TES)"
	}
	const getCameraName = (shortName) => cameraNameLookup[shortName] || 'unknown';



});

