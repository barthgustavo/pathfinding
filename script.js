//inicializa as divs
var linha = 0;
var coluna = 0;
var classe = '';
for(var i = 0; i < 400; ++i)
{
    linha = Math.floor(i/20)+1;
    coluna = (i-(Math.floor(i/20))*20)+1;
    $('#inicial').html($('#inicial').html()+'<div class="'+classe+'" id="' + linha + '_' + coluna + '"></div>');
}

//adiciona e retira classe de parede
$('#inicial').on('click', 'div', function(){
    $(this).removeClass('caminho');
    if(!$(this).hasClass('inicial') && !$(this).hasClass('final'))
        $(this).toggleClass('parede');
});

$('#linha_inicial, #linha_final, #coluna_inicial, #coluna_final').on('keyup', function(){
    if($('#linha_inicial').val() && $('#coluna_inicial').val())
    {
        $('div').removeClass('inicial');
        $('#' + $('#linha_inicial').val() + '_' + $('#coluna_inicial').val()).removeClass('parede');
        $('#' + $('#linha_inicial').val() + '_' + $('#coluna_inicial').val()).addClass('inicial');
    }

    if($('#linha_final').val() && $('#coluna_final').val())
    {
        $('div').removeClass('final');
        $('#' + $('#linha_final').val() + '_' + $('#coluna_final').val()).removeClass('parede');
        $('#' + $('#linha_final').val() + '_' + $('#coluna_final').val()).addClass('final');
    }
});
$('#linha_inicial, #linha_final, #coluna_inicial, #coluna_final').trigger('keyup');

//agora o coro vai comer
var campo = new Object();
var inicial = new Object();
var final = new Object();
var abertos = new Object();
var caminhos = new Object();
var contador = 0;
$('#iniciar').click(function(){
    campo = new Object();
    inicial = new Object();
    final = new Object();
    abertos = new Object();
    caminhos = new Object();
    $('.caminho').removeClass('caminho');
    contador = 0;
    $('div').not('.painel, #inicial').each(function(){
        var temp = this.id.split('_');
        campo[temp[0]] = campo[temp[0]] ? campo[temp[0]] : new Object();
        campo[temp[0]][temp[1]] = $(this).hasClass('parede') ? 'parede' : ($(this).hasClass('final') ? 'final' : '');
    });

    if(!$('.inicial').length || !$('.final').length)
        return false;
    var temp = $('.inicial').get(0).id.split('_');
    inicial['linha'] = parseInt(temp[0]);
    inicial['coluna'] = parseInt(temp[1]);
    inicial['div'] = '#'+$('.inicial').get(0).id;
    inicial['g'] = 0;
    campo[inicial['linha']][inicial['coluna']] = 'visitado';

    var temp = $('.final').get(0).id.split('_');
    final['linha'] = parseInt(temp[0]);
    final['coluna'] = parseInt(temp[1]);
    final['div'] = '#'+$('.final').get(0).id;

    verificaVolta(inicial);
});

function verificaVolta(atual){
    contador++;
    var linhaAtual = parseInt(atual['linha']);
    var colunaAtual = parseInt(atual['coluna']);
    //cima
    if(verificaExistencia('cima', campo, atual))
    {
        if(campo[linhaAtual-1][colunaAtual] !== 'parede' && campo[linhaAtual-1][colunaAtual] !== 'visitado')
        {
            var temp = new Object();
            temp['linha'] = linhaAtual-1;
            temp['coluna'] = colunaAtual;
            temp['g'] = atual['g']+1;
            temp['h'] = calculaCustoFinal(temp);
            temp['divDebug'] = $('#' + (linhaAtual-1) + '_' + colunaAtual).get(0);
            temp['div'] = '#' + (linhaAtual-1) + '_' + colunaAtual;
            temp['divPai'] = atual['div'];
            temp['pai'] = new Object();
            temp['pai'] = push(atual, temp['pai']);
            abertos = push(temp, abertos);
        }
    }

    //baixo
    if(verificaExistencia('baixo', campo, atual))
    {
        if(campo[linhaAtual+1][colunaAtual] !== 'parede' && campo[linhaAtual+1][colunaAtual] !== 'visitado')
        {
            var temp = new Object();
            temp['linha'] = linhaAtual+1;
            temp['coluna'] = colunaAtual;
            temp['g'] = atual['g']+1;
            temp['h'] = calculaCustoFinal(temp);
            temp['divDebug'] = $('#' + (linhaAtual+1) + '_' + colunaAtual).get(0);
            temp['div'] = '#' + (linhaAtual+1) + '_' + colunaAtual;
            temp['divPai'] = atual['div'];
            temp['pai'] = new Object();
            temp['pai'] = push(atual, temp['pai']);
            abertos = push(temp, abertos);
        }
    }

    //esquerda
    if(verificaExistencia('esquerda', campo, atual))
    {
        if(campo[linhaAtual][colunaAtual-1] !== 'parede' && campo[linhaAtual][colunaAtual-1] !== 'visitado')
        {
            var temp = new Object();
            temp['linha'] = linhaAtual;
            temp['coluna'] = colunaAtual-1;
            temp['g'] = atual['g']+1;
            temp['h'] = calculaCustoFinal(temp);
            temp['divDebug'] = $('#' + linhaAtual + '_' + (colunaAtual-1)).get(0);
            temp['div'] = '#' + linhaAtual + '_' + (colunaAtual-1);
            temp['divPai'] = atual['div'];
            temp['pai'] = new Object();
            temp['pai'] = push(atual, temp['pai']);
            abertos = push(temp, abertos);
        }
    }

    //direita
    if(verificaExistencia('direita', campo, atual))
    {
        if(campo[linhaAtual][colunaAtual+1] !== 'parede' && campo[linhaAtual][colunaAtual+1] !== 'visitado')
        {
            var temp = new Object();
            temp['linha'] = linhaAtual;
            temp['coluna'] = colunaAtual+1;
            temp['g'] = atual['g']+1;
            temp['h'] = calculaCustoFinal(temp);
            temp['divDebug'] = $('#' + linhaAtual + '_' + (colunaAtual+1)).get(0);
            temp['div'] = '#' + linhaAtual + '_' + (colunaAtual+1);
            temp['divPai'] = atual['div'];
            temp['pai'] = new Object();
            temp['pai'] = push(atual, temp['pai']);
            abertos = push(temp, abertos);
        }
    }


    //verifica melhor
    var melhor = new Object();
    var melhorN = 0;
    for(var i in abertos)
    {
        if(campo[abertos[i]['linha']][abertos[i]['coluna']] !== 'visitado')
        {
            var score = abertos[i]['g']+abertos[i]['h'];
            if(melhorN === 0 || score <= melhorN)
            {
                melhorN = score;
                melhor = abertos[i];
            }
        }
    }

    caminhos[melhor['div']] = melhor['divPai'];
    if(melhor['linha'] === final['linha'] && melhor['coluna'] === final['coluna'])
    {
        montaCaminho();
        return false;
    }

    campo[melhor['linha']][melhor['coluna']] = 'visitado';
    verificaVolta(melhor);
}

function calculaCustoFinal(atual){
    var linha = Math.sqrt(Math.pow(atual['linha']-final['linha'], 2));
    var coluna = Math.sqrt(Math.pow(atual['coluna']-final['coluna'], 2));
    return linha+coluna;
}

function push(valor, obj){
    var posicao = Object.keys(obj).length;
    obj[posicao] = valor;
    return obj;
}

function verificaExistencia(valor, array, atual){
    switch(valor)
    {
        case 'cima':
            return typeof array[atual['linha']-1] !== typeof undefined;
            break;
        case 'baixo':
            return typeof array[atual['linha']+1] !== typeof undefined;
            break;
        case 'esquerda':
            return typeof array[1][atual['coluna']-1] !== typeof undefined;
            break;
        case 'direita':
            return typeof array[1][atual['coluna']+1] !== typeof undefined;
            break;
    }
}

function montaCaminho(){
    var atual = '';
    atual = caminhos[final['div']];
    if(atual === inicial['div'])
        return false;
    $(atual).addClass('caminho');
    atual = caminhos[atual];
    while(atual !== inicial['div'])
    {
        $(atual).addClass('caminho');
        atual = caminhos[atual];
    }
}