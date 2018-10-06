//T.E.F.
var tpll = 0;
var tps = 0;

//Control
var nroMesas = 0;
var capMesas = 0;

//Var. de Estado
var arrMesas = [];
var nroTotalGenteEnElSistema = 0;

//Datos
var intervaloArribos = 0;
var tiempoEstadia = 0;

//Otras
var tiempo = 0; //Tiempos en segundos
var tiempoFinal = 50;

function simular(){

    inicializarVariables();

    procesarInformacion();

    function procesarInformacion(){
        ///VALOR RANDOM DE ASIGNACION DE MESAS?
        var minTPS = getMinTPS();
        tps = minTPS['tpsMesa'];
        if(tpll <= tps){
            tiempo = tpll;
            nroTotalGenteEnElSistema+=1;
            intervaloArribos = generateIA();
            tpll = tiempo + intervaloArribos;
            var mesaWithMNP = getMesaWithMinNroPersonas();
            var mesa = arrMesas[mesaWithMNP['nroMesa']];
            if(mesaWithMNP['nroPersonasEnLaMesa'] <= capMesas){
                addTEaUnaMesa(mesa, mesaWithMNP['nroMesa']);
            }else{
                //TODO
            }
        }else{
            tiempo = tps;
            if(nroTotalGenteEnElSistema>0) {
                nroTotalGenteEnElSistema -= 1;
            }
            mesa = arrMesas[minTPS['nroMesa']];
            if(mesa['nroPersonasEnLaMesa']>0 && mesa['personas'].length>0) {
                mesa['nroPersonasEnLaMesa'] -= 1;
                mesa['personas'].shift();
            }
            if(nroTotalGenteEnElSistema >= (nroMesas*capMesas)){
                addTEaUnaMesa(mesa, minTPS['nroMesa']);
            }else{
                //TODO
            }
        }

        if(tiempo>tiempoFinal){
            calcularResultados();
        }else{
            procesarInformacion();
        }

    }

    function addTEaUnaMesa(mesa, nroMesa){
        if( mesa['personas'].length<capMesas){
            var tiempoEstadia = generateTE();
            mesa['personas'].push(tiempo + tiempoEstadia);
            mesa['personas'].sort(function(a, b){return a - b});
            mesa['nroPersonasEnLaMesa']+=1;
            arrMesas[nroMesa] = mesa;
        }
    }

    function generateIA(){
        return (Math.floor(Math.random() * 10) + 1);
    }

    function generateTE(){
        return (Math.floor(Math.random() * 60) + 1);
    }

    function getMesaWithMinNroPersonas(){
        var minNroPersonas = 10000000000000000000000000;
        var responseMesa={};
        for(var i=0; i<arrMesas.length;i++){
            if(minNroPersonas > arrMesas[i]['nroPersonasEnLaMesa'] && arrMesas[i]['nroPersonasEnLaMesa'] < capMesas){
                minNroPersonas = arrMesas[i]['nroPersonasEnLaMesa'];
                responseMesa = {'nroPersonasEnLaMesa':arrMesas[i]['nroPersonasEnLaMesa'], 'nroMesa':i};
            }
        }
        return responseMesa;
    }

    function getMinTPS(){
        var minTPS = 10000000000000000000000000;
        var responseTPS={'tpsMesa':minTPS, 'nroMesa':0};
        for(var i=0; i<arrMesas.length;i++){
            if((minTPS > arrMesas[i]['personas'][0]) && arrMesas[i]['personas'].length > 0){
                minTPS = arrMesas[i]['personas'][0];
                responseTPS = {'tpsMesa':minTPS, 'nroMesa':i};
                }
        }
        return responseTPS;
    }

    function calcularResultados(){
        //TODO: MOSTRAR RESULTADOS
        console.log(arrMesas);
    }

    function inicializarVariables(){
        tpll = 0;
        tps = 0;
        nroTotalGenteEnElSistema = 0;
        intervaloArribos = 0;
        tiempoEstadia = 0;
        tiempo = 0; //Tiempos en segundos
        tiempoFinal = 100;
        nroMesas= parseInt($('#nroMesas').val());
        capMesas = parseInt($('#capMesas').val());
        arrMesas = new Array(nroMesas);
        for(var i=0; i<arrMesas.length ;i++){
            arrMesas[i] = {'personas':[],'nroPersonasEnLaMesa':0};
        }
    }

}

