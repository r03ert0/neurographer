var    A=40;           // action potential
var    vthr=A*0.6;     // firing threshold
var    W=20;           // Connection weight
var    N=0.46;          // noise amplitude
var    G=0.2;          // leak constant
var    Tlearning=0.01; // learning speed constant
var    idealW=-1;
var    totalW;         // total synaptic weight
var    flagForce=0;    // force pre to predict post

function lapicque() {
    var    i,j;

    // integrate input from other neurones
    for(i=0;i<neurones.length;i++)
    for(j=0;j<neurones[i].neighbours.length;j++)
        neurones[i].state+=(neurones[i].weights[j]/2000)*neurones[i].neighbours[j].output;

    // integrate noise from the same neurone
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

    // learn
    for(i=0;i<neurones.length;i++)
    if(neurones[i].output>0)
        for(j=0;j<neurones[i].neighbours.length;j++)
        {
            s=neurones[i].neighbours[j].state;
            if(s>vthr) s=vthr;
            if(s<0)    s=0;
            neurones[i].weights[j]+=(vthr-s)*Tlearning;
        }

    // synaptic weight scaling (homeostasis)
    totalW=0;
    n=0;
    for(i=0;i<neurones.length;i++)
    for(j=0;j<neurones[i].neighbours.length;j++)
    {
        totalW+=neurones[i].weights[j];
        n++;
    }
    if(idealW>0)
        for(i=0;i<neurones.length;i++)
        for(j=0;j<neurones[i].neighbours.length;j++)
            neurones[i].weights[j]*=idealW/totalW;
    
    // test: force pre to predict post
    /*
    if(flagForce && pre.state<post.state && pre.state>vthr/2.0)
        pre.state=post.state+5;
    */
    
    // update color
    for(i=0;i<neurones.length;i++) {
        neurones[i].material.color.r=
        neurones[i].material.color.g=
        neurones[i].material.color.b=neurones[i].state/A;
        
        if(neurones[i]==post)
            neurones[i].material.color.g=
            neurones[i].material.color.b=0;
        if(neurones[i]==pre)
            neurones[i].material.color.r=
            neurones[i].material.color.b=0;
    }
}

function addNeuroneRandom() {
    pre=post;
    post=addNeurone(Math.random()*1000-500,Math.random()*600-300,0);
}
function addNeuroneGrid() {
    var    D=60,S=0;// S=500;
    var    n=24,m=16;

    for(i=0;i<n;i++)
    for(j=0;j<m;j++)
    {
        pre=post;
        post=addNeurone((i-n/2.0)*D-S,(j-m/2.0)*D+200,0);
    }

    /*
    for(i=0;i<n;i++)
    for(j=0;j<m;j++)
    {
        pre=post;
        post=addNeurone((i-n/2.0)*D+S,(j-m/2.0)*D,0);
    }
    */

}
function autoWire() {
    var    D=100;
    for(i=0;i<neurones.length;i++)
    for(j=i+1;j<neurones.length;j++) {
        d=  Math.pow(neurones[i].position.x-neurones[j].position.x,2)+
            Math.pow(neurones[i].position.y-neurones[j].position.y,2)+
            Math.pow(neurones[i].position.z-neurones[j].position.z,2);
        if(d<Math.pow(D,2)) {
            n1=neurones[i];
            n2=neurones[j];
            wireNeurones(n1,n2,W);
            n1.neighbours.push(n2);
            n2.neighbours.push(n1);
        }
    }
}
function wire() {
    wireNeurones(pre,post,W);
    pre.neighbours.push(post);
    post.neighbours.push(pre);
}

function force() {
    flagForce=!flagForce;
}

function reset() {
    var    i;
    idealW=0;
    for(i=0;i<neurones.length;i++) {
        neurones[i].state=A*Math.random();
        neurones[i].output=0;
        idealW+=W*neurones[i].neighbours.length;
    }
    console.log(idealW);
}

