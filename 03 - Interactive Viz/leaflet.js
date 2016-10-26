var mymap = L.map('mapid').setView([46.73, 8.29], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 	{
	maxZoom: 18,
	minZoom: 1,
	attribution: 'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
	detectRetina: false
}).addTo(mymap);