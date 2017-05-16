var	A=40;		// action potential
var	vres=0;	
var	vthr=A*0.6;	// firing threshold
var	W=10/1000.0; // Connection weight
var	N=0.5;		// noise amplitude
var	G=0.2;		// leak constant

function lapicque() {
	var	i,j;

	// integrate
	for(i=0;i<neurones.length;i++)
	for(j=0;j<neurones[i].neighbours.length;j++)
		neurones[i].state+=W*neurones[i].neighbours[j].output;

	// noise
	for(i=0;i<neurones.length;i++)
		neurones[i].state+=N*(14-2*Math.random());

	// leak
	for(i=0;i<neurones.length;i++)
		neurones[i].state+=-neurones[i].state*G;

	// fire
	for(i=0;i<neurones.length;i++)
		if(neurones[i].state>vthr) {
			neurones[i].state=-10;
			neurones[i].output=A;
		}
		else
			neurones[i].output=0;

	// update color
	for(i=0;i<neurones.length;i++) {
		neurones[i].material.color.r=
		neurones[i].material.color.g=
		neurones[i].material.color.b=neurones[i].state/A;
		
		if(neurones[i]==lastSelected)
			neurones[i].material.color.g=
			neurones[i].material.color.b=0;
	}
}

function addNeuroneRandom() {
	lastSelected=addNeurone(Math.random()*1000-500,Math.random()*600-300,0);
}
function addNeuroneGrid() {
	var	D=70;
	var	n=24,m=16;
	for(i=0;i<n;i++)
	for(j=0;j<m;j++)
		lastSelected=addNeurone((i-n/2.0)*D,(j-m/2.0)*D,0);
}
function autoWire() {
	var	D=100;
	for(i=0;i<neurones.length;i++)
	for(j=i+1;j<neurones.length;j++) {
		d=  Math.pow(neurones[i].position.x-neurones[j].position.x,2)+
			Math.pow(neurones[i].position.y-neurones[j].position.y,2)+
			Math.pow(neurones[i].position.z-neurones[j].position.z,2);
		if(d<Math.pow(D,2)) {
			n1=neurones[i];
			n2=neurones[j];
			wireNeurones(n1,n2);
			n1.neighbours.push(n2);
			n2.neighbours.push(n1);
		}
	}
}

function reset() {
	var	i;
	for(i=0;i<neurones.length;i++) {
		neurones[i].state=A*Math.random();
		neurones[i].output=0;
	}
}

