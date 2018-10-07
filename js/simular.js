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

function simular(){

    inicializarVariables();

    procesarInformacion();

    function procesarInformacion(){

        var minTPS = getMinTPS();
        tps = minTPS['tpsMesa'];
        if(tpll <= tps){
            tiempo = tpll;
            stll += tpll;
            nroTotalGenteEnElSistema+=1;
            totalArribos += 1;
            if(nroTotalGenteEnElSistema>=nroMesas*capMesas) {
                var randomDecicion = Math.random();
                if(randomDecicion > 0.1){
                    arrepentidos += 1;
                    intervaloArribos = generateIA();
                    tpll = tiempo + intervaloArribos;
                }else{
                    seQueda();
                }
            }else{
                seQueda();
            }
        }else{
            tiempo = tps;
            sts += tps;
            if(nroTotalGenteEnElSistema>0) {
                nroTotalGenteEnElSistema -= 1;
            }
            var mesa = arrMesas[minTPS['nroMesa']];
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
        if(tiempo<tiempoFinal && tpll < tiempoFinal){
            procesarInformacion();
            return false;
        }else{
            if(nroTotalGenteEnElSistema==0){
                calcularResultados();
                return false;
            }else{
                tpll = 100000000000000000000000;
                procesarInformacion();
            }
        }
    }


    function seQueda(){
        intervaloArribos = generateIA();
        tpll = tiempo + intervaloArribos;
        var mesaWithMNP = getMesaWithASlot();
        var mesa = arrMesas[mesaWithMNP['nroMesa']];
        if(mesaWithMNP['nroPersonasEnLaMesa'] <= capMesas){
            addTEaUnaMesa(mesa, mesaWithMNP['nroMesa']);
        }else{
            //TODO
        }
    }

    function addTEaUnaMesa(mesa, nroMesa){
        if( mesa['personas'].length<capMesas){
            var tiempoEstadia = generateTE();
            mesa['personas'].push(tiempo + tiempoEstadia);
            mesa['personas'].sort(function(a, b){return a - b});
            mesa['nroPersonasEnLaMesa']+=1;
            mesa['totalPersonas']+=1;
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
        var random = getRandomValueForMesa();
        if(arrMesas[random]['nroPersonasEnLaMesa'] < capMesas){
            responseMesa = {'nroPersonasEnLaMesa':arrMesas[random]['nroPersonasEnLaMesa'], 'nroMesa':random};
        }else{
            responseMesa = getMesaWithASlot();
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
        $('#content').hide();

        $('#spanNroMesas').text(nroMesas);
        $('#spanCapMesas').text(capMesas);
        $('#spanTiempoFinalizacion').text(tiempo);
        $('#spanTiempoEsperadoFinalizacion').text(tiempoFinal);
        $('#spanCantArrepentidos').text(arrepentidos);
        $('#spanTotArribos').text(totalArribos);
        $('#spanPPS').text(parseInt((sts-stll)/totalArribos));
        for(var i=0; i<arrMesas.length;i++){
            var promedioUso = parseInt((arrMesas[i]['totalPersonas']/totalArribos)*100);

            var itemMesa = '<div class="progress"><label style="margin-right: 10px">Mesa '+(i+1)+':</label>'+
                            '<div class="progress-bar progress-bar-striped bg-info" role="progressbar" aria-valuenow="'+promedioUso+'" aria-valuemin="0" aria-valuemax="100" style="width:'+promedioUso+'%">'+
                            promedioUso+'% '+
                            '</div>'+
                            '</div><br>';

            //var itemMesa = '<li class="list-group-item">Mesa '+(i+1)+':   <strong>'+promedioUso+'%</strong></li>';
            $('#toMesas').append(itemMesa);
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
        arrMesas = new Array(nroMesas);
        totalArribos = 0;
        $('#toMesas').empty();
        for(var i=0; i<arrMesas.length ;i++){
            arrMesas[i] = {'personas':[],'nroPersonasEnLaMesa':0, 'totalPersonas': 0};
        }
    }

    function getRandomValueForMesa(){
        return (Math.floor(Math.random() * nroMesas));
    }

}

function nuevaSimulacion(){
    $('#content').show();
    $('#content2').hide();
}