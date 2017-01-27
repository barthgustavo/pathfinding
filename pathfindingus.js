/**
 * Created by Gustavo on 23/06/2016.
 */

var Pathfinding = function(arrGrid){
    this.arrGrid = arrGrid;
    this.inicial = {};
    this.final = {};
    this.abertos = {};
    this.caminhos = {};
    this.contador = 0;
    this.achou = false;
    this.atual  = {};
};

Pathfinding.prototype.setInicial = function(linha, coluna){
    this.inicial['linha'] = linha;
    this.inicial['coluna'] = coluna;
    this.inicial['div'] = linha + '_' + coluna;
};

Pathfinding.prototype.setFinal = function(linha, coluna){
    this.final['linha'] = linha;
    this.final['coluna'] = coluna;
    this.final['div'] = linha + '_' + coluna;
};

Pathfinding.prototype.pesquisar = function(){
    this.atual = this.inicial;
    while(!this.achou)
        this.verificaVolta(this.atual);
};

Pathfinding.prototype.verificaVolta = function(atual){
    this.contador++;
    var linhaAtual = parseInt(atual['linha']);
    var colunaAtual = parseInt(atual['coluna']);
    //cima
    if(this.verificaExistencia('cima', atual))
    {
        if(this.arrGrid[linhaAtual-1][colunaAtual] !== 'parede' && this.arrGrid[linhaAtual-1][colunaAtual] !== 'visitado')
        {
            var temp = new Object();
            temp['linha'] = linhaAtual-1;
            temp['coluna'] = colunaAtual;
            temp['g'] = atual['g']+1;
            temp['h'] = this.calculaCustoFinal(temp);
            temp['divDebug'] = $('#' + (linhaAtual-1) + '_' + colunaAtual).get(0);
            temp['div'] = '#' + (linhaAtual-1) + '_' + colunaAtual;
            temp['divPai'] = atual['div'];
            temp['pai'] = new Object();
            temp['pai'] = this.push(atual, temp['pai']);
            this.abertos = this.push(temp, this.abertos);
        }
    }
    //baixo
    if(this.verificaExistencia('baixo', atual))
    {
        if(this.arrGrid[linhaAtual+1][colunaAtual] !== 'parede' && this.arrGrid[linhaAtual+1][colunaAtual] !== 'visitado')
        {
            var temp = new Object();
            temp['linha'] = linhaAtual+1;
            temp['coluna'] = colunaAtual;
            temp['g'] = atual['g']+1;
            temp['h'] = this.calculaCustoFinal(temp);
            temp['divDebug'] = $('#' + (linhaAtual+1) + '_' + colunaAtual).get(0);
            temp['div'] = '#' + (linhaAtual+1) + '_' + colunaAtual;
            temp['divPai'] = atual['div'];
            temp['pai'] = new Object();
            temp['pai'] = this.push(atual, temp['pai']);
            this.abertos = this.push(temp, this.abertos);
        }
    }
    //esquerda
    if(this.verificaExistencia('esquerda', atual))
    {
        if(this.arrGrid[linhaAtual][colunaAtual-1] !== 'parede' && this.arrGrid[linhaAtual][colunaAtual-1] !== 'visitado')
        {
            var temp = new Object();
            temp['linha'] = linhaAtual;
            temp['coluna'] = colunaAtual-1;
            temp['g'] = atual['g']+1;
            temp['h'] = this.calculaCustoFinal(temp);
            temp['divDebug'] = $('#' + linhaAtual + '_' + (colunaAtual-1)).get(0);
            temp['div'] = '#' + linhaAtual + '_' + (colunaAtual-1);
            temp['divPai'] = atual['div'];
            temp['pai'] = new Object();
            temp['pai'] = this.push(atual, temp['pai']);
            this.abertos = this.push(temp, this.abertos);
        }
    }
    //direita
    if(this.verificaExistencia('direita', atual))
    {
        if(this.arrGrid[linhaAtual][colunaAtual+1] !== 'parede' && this.arrGrid[linhaAtual][colunaAtual+1] !== 'visitado')
        {
            var temp = new Object();
            temp['linha'] = linhaAtual;
            temp['coluna'] = colunaAtual+1;
            temp['g'] = atual['g']+1;
            temp['h'] = this.calculaCustoFinal(temp);
            temp['divDebug'] = $('#' + linhaAtual + '_' + (colunaAtual+1)).get(0);
            temp['div'] = '#' + linhaAtual + '_' + (colunaAtual+1);
            temp['divPai'] = atual['div'];
            temp['pai'] = new Object();
            temp['pai'] = this.push(atual, temp['pai']);
            this.abertos = this.push(temp, this.abertos);
        }
    }
    //verifica melhor
    var melhor = new Object();
    var melhorN = 0;
    for(var i in this.abertos)
    {
        if(this.arrGrid[this.abertos[i]['linha']][this.abertos[i]['coluna']] !== 'visitado')
        {
            var score = this.abertos[i]['g']+this.abertos[i]['h'];
            if(melhorN === 0 || score <= melhorN)
            {
                melhorN = score;
                melhor = this.abertos[i];
            }
        }
    }
    this.caminhos[melhor['div']] = melhor['divPai'];
    if(melhor['linha'] === this.final['linha'] && melhor['coluna'] === this.final['coluna'])
    {
        this.achou = true;
        this.montaCaminho();
        return false;
    }
    this.arrGrid[melhor['linha']][melhor['coluna']] = 'visitado';
    this.atual = melhor;
}

Pathfinding.prototype.verificaExistencia = function(valor, atual){
    switch(valor)
    {
        case 'cima':
            return typeof this.arrGrid[atual['linha']-1] != "undefined";
            break;
        case 'baixo':
            return typeof this.arrGrid[atual['linha']+1] != "undefined";
            break;
        case 'esquerda':
            return typeof this.arrGrid[1][atual['coluna']-1] != "undefined";
            break;
        case 'direita':
            return typeof this.arrGrid[1][atual['coluna']+1] != "undefined";
            break;
    }
};

Pathfinding.prototype.calculaCustoFinal = function(atual){
    var linha = Math.sqrt(Math.pow(atual['linha']-this.final['linha'], 2));
    var coluna = Math.sqrt(Math.pow(atual['coluna']-this.final['coluna'], 2));
    return linha+coluna;
};

Pathfinding.prototype.push = function(valor, obj){
    var posicao = Object.keys(obj).length;
    obj[posicao] = valor;
    return obj;
};

Pathfinding.prototype.montaCaminho = function(){
     var atual = '';
     atual = this.caminhos[final['div']];
     if(atual === inicial['div'])
         return false;
     $(atual).addClass('caminho');
     atual = caminhos[atual];
     while(atual !== inicial['div'])
     {
         console.log(atual);
         atual = caminhos[atual];
     }
};