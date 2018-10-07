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

//Var Auxiliares
var stll = 0;
var sts = 0;
var tiempoOsciosoTotal = 0;
var totalArribos = 0;

var tiempo = 0; //Tiempos en segundos
var tiempoFinal = 0;
var arrepentidos = 0;
var tiempoOsciosoMesas = [];

var controlRandomMesas =[];
var mesaProxASalir = 0;

function simular(){

    inicializarVariables();

    procesarInformacion();

    function procesarInformacion(){
        if(tpll <= tps){
            tiempo = tpll;
            totalArribos += 1;
            intervaloArribos = generateIA();
            tpll = tiempo + intervaloArribos;
            if(nroTotalGenteEnElSistema>=nroMesas*capMesas) {
                var randomDecicion = Math.random();
                if(randomDecicion > 0.3){
                    arrepentidos += 1;
                }else{
                    seQueda();
                }
            }else{
                seQueda();
            }
        }else{
            tiempo = tps;
            var mesa = arrMesas[mesaProxASalir];
            if(mesa['nroPersonasEnLaMesa']>0 && mesa['personas'].length>0) {
                mesa['nroPersonasEnLaMesa'] -= 1;
                nroTotalGenteEnElSistema -= 1;
                sts += tps;
                mesa['personas'].shift();
                if(mesa['personas'].length<capMesas && tiempoOsciosoMesas[mesaProxASalir]['inicioOscio']===0){
                    tiempoOsciosoMesas[mesaProxASalir]['inicioOscio']=tiempo;
                }
            }
            if(nroTotalGenteEnElSistema >= (nroMesas*capMesas)){
                addTEaUnaMesa(mesa, mesaProxASalir);
            }else{
                if(nroTotalGenteEnElSistema === 0){
                    tps = 100000000000000000000000000;
                }
            }
        }

        if(tiempo<tiempoFinal && tpll<tiempoFinal){
            var minTPS = getMinTPS();
            tps = minTPS['tpsMesa'];
            mesaProxASalir = minTPS['nroMesa'];
            procesarInformacion();
        }else{
            if(nroTotalGenteEnElSistema==0){
                calcularResultados();
            }else{
                tpll = 10000000000000000000000000000000000000000;
                minTPS = getMinTPS();
                tps = minTPS['tpsMesa'];
                mesaProxASalir = minTPS['nroMesa'];
                procesarInformacion();
            }
        }
    }

    function seQueda(){
        if(tpll<tiempoFinal){
            stll += tpll;
        }
        controlRandomMesas =new Array(nroMesas);
        var mesaWithMNP = getMesaWithASlot();
        nroTotalGenteEnElSistema += 1;
        if(Object.keys(mesaWithMNP).length !== 0 ){
            var mesa = arrMesas[mesaWithMNP['nroMesa']];
            //if(mesaWithMNP['nroPersonasEnLaMesa'] <= capMesas){
                addTEaUnaMesa(mesa, mesaWithMNP['nroMesa']);

            //}
        }
    }

    function addTEaUnaMesa(mesa, nroMesa){
        if(mesa['personas'].length<capMesas){
            var tiempoEstadia = generateTE();
            mesa['personas'].push(tiempo + tiempoEstadia);
            mesa['personas'].sort(function(a, b){return a - b});
            mesa['nroPersonasEnLaMesa']+=1;
            mesa['totalPersonas']+=1;
            if(mesa['nroPersonasEnLaMesa']===capMesas){
                tiempoOsciosoMesas[nroMesa]['tiempoTotalOscio']+=tiempo - tiempoOsciosoMesas[nroMesa]['inicioOscio'];
                tiempoOsciosoMesas[nroMesa]['inicioOscio']=0;
                console.log('asdasdasdasd'+tiempoOsciosoMesas[nroMesa]['tiempoTotalOscio']);
            }
            arrMesas[nroMesa] = mesa;
        }
    }

    function generateIA(){
        var alfa = 0.47576;
        var beta = 1.752;
        var random = Math.random();
        return parseInt(((beta/(Math.pow(1-random, (1/alfa)))))-beta);

    }

    function generateTE(){
        var alfa = 2.8588;
        var beta = 11683;
        var k =87.364;
        var random = Math.random();
        return parseInt((Math.pow((Math.pow(1-random, (-(1/k))))-1, 1/alfa))*beta);
    }

    function getMesaWithASlot(){
        var responseMesa={};
        var random = getRandomValueForMesa(controlRandomMesas.length);
        controlRandomMesas.splice(random, 1);
        if(arrMesas[random]['nroPersonasEnLaMesa'] < capMesas){
            responseMesa = {'nroPersonasEnLaMesa':arrMesas[random]['nroPersonasEnLaMesa'], 'nroMesa':random};
        }else{
            if(controlRandomMesas.length>0){
                responseMesa = getMesaWithASlot();
            }
        }
        return responseMesa;
    }

    function getMinTPS(){
        var minTPS = 10000000000000000000000000000000000;
        var responseTPS={'tpsMesa':minTPS, 'nroMesa':0};
        for(var i=0; i<arrMesas.length;i++){
            if((arrMesas[i]['personas'].length > 0) && (minTPS > arrMesas[i]['personas'][0])){
                minTPS = arrMesas[i]['personas'][0];
                responseTPS = {'tpsMesa':minTPS, 'nroMesa':i};
                }
        }
        return responseTPS;
    }

    function calcularResultados(){
        $('#content').hide();

        $('#spanNroMesas').text(nroMesas);
        $('#spanCapMesas').text(capMesas);
        $('#spanTiempoFinalizacion').text(tiempo);
        $('#spanTiempoEsperadoFinalizacion').text(tiempoFinal);
        $('#spanCantArrepentidos').text(arrepentidos);
        $('#spanTotArribos').text(totalArribos);
        $('#spanPorcArrepentidos').text(parseInt((arrepentidos/totalArribos)*100));
        $('#spanPPS').text(parseInt((sts-stll)/(totalArribos-arrepentidos)));
        for(var i=0; i<arrMesas.length;i++){
            var promedioUso = parseInt((arrMesas[i]['totalPersonas']/totalArribos)*100);

            var ito = tiempoOsciosoMesas[i]['inicioOscio'];
            if(ito===-1 || ito!==0){
                tiempoOsciosoMesas[i]['tiempoTotalOscio']+=tiempo - tiempoOsciosoMesas[i]['inicioOscio'];
            }
            var promedioOscioMesas = parseInt(100-((tiempoOsciosoMesas[i]['tiempoTotalOscio']/tiempo)*100));
            console.log('tiempo de oscio mesa: '+i+' - '+promedioOscioMesas);
            var itemMesa =  '<label style="margin: 0 10px 10px 0">Mesa '+(i+1)+' - Total: '+arrMesas[i]["totalPersonas"]+'</label>'+
                            '<div class="progress">'+'<label style="margin: 0 10px 10px 0">Uso:</label>'+
                            '<div class="progress-bar progress-bar-striped bg-info" role="progressbar" aria-valuenow="'+promedioUso+'" aria-valuemin="0" aria-valuemax="100" style="width:'+promedioUso+'%">'+
                            promedioUso+'% '+
                            '</div>'+
                            '</div><br>';

            var porcOscioso = '<div class="progress">'+'<label style="margin: 0 10px 10px 0">Ocupada:</label>'+
                              '<div class="progress-bar progress-bar-striped bg-warning" role="progressbar" aria-valuenow="'+promedioOscioMesas+'" aria-valuemin="0" aria-valuemax="100" style="width:'+promedioOscioMesas+'%">'+
                              promedioOscioMesas+'% '+
                              '</div></div><br>';
            toMesas = $('#toMesas');

            toMesas.append(itemMesa);
            toMesas.append(porcOscioso);
        }
        $('#content2').show();
    }

    function inicializarVariables(){
        tpll = 0;
        tps = 0;
        stll = 0;
        sts = 0;
        nroTotalGenteEnElSistema = 0;
        intervaloArribos = 0;
        tiempoEstadia = 0;
        tiempo = 0; //Tiempos en segundos
        tiempoFinal = 7200;
        arrepentidos = 0;
        tiempoOsciosoTotal = 0;
        nroMesas= parseInt($('#nroMesas').val());
        capMesas = parseInt($('#capMesas').val());
        controlRandomMesas =new Array(nroMesas);
        tiempoOsciosoMesas =new Array(nroMesas);
        arrMesas = new Array(nroMesas);
        totalArribos = 0;
        mesaProxASalir = 0;
        $('#toMesas').empty();
        //Cargo mesas
        for(var i=0; i<arrMesas.length ;i++){
            arrMesas[i] = {'personas':[],'nroPersonasEnLaMesa':0, 'totalPersonas': 0};
        }
        //Cargo oscioso
        for(i=0; i<arrMesas.length ;i++){
            tiempoOsciosoMesas[i] = {'inicioOscio':-1,'tiempoTotalOscio':0, 'lugaresLibres': 0};
        }
    }

    function getRandomValueForMesa(nroDeMesas){
        return (Math.floor(Math.random() * nroDeMesas));
    }


    //function restartVariables(){
    //    tpll = 0;
    //    tps = 0;
    //    intervaloArribos = 0;
    //    tiempoEstadia = 0;
    //    tiempo = 0; //Tiempos en segundos
    //    tiempoFinal = 7200;
    //    controlRandomMesas =new Array(nroMesas);
    //    arrMesas = new Array(nroMesas);
    //    for(var i=0; i<arrMesas.length ;i++){
    //        arrMesas[i] = {'personas':[],'nroPersonasEnLaMesa':0, 'totalPersonas': 0};
    //    }
    //    mesaProxASalir = 0;
    //}

}

function nuevaSimulacion(){
    $('#content').show();
    $('#content2').hide();
}