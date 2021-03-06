ctrlApp.controller('CardapioCtrl', ['$scope','EmpresaFactory', '$state', 'ngNotify', '$http', '$stateParams', 'CONFIG', 'Upload',
    function ($scope, EmpresaFactory, $state, ngNotify, $http, $stateParams, CONFIG, Upload) {

        $scope.info = EmpresaFactory.get({id: $stateParams.id});
        $scope.novosItens = [];
        $scope.variacoes = [];
        $scope.tamanhos = [];
        $scope.tipos = [];
        $scope.sabores = [];
        $scope.categorias = {1: 'Comum', 2: 'Pizza'};

        $scope.store = function(){
            $http.post(CONFIG.API+'empresacardapio/store', {rotulo: $scope.cardapio.rotulo, empresa: $stateParams.id}).then(function(r){
                ngNotify.set('Novo cardápio cadastrado!', 'success');
                $state.go('empresaCardapio', {id: $stateParams.id});
            }, function(e){
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
            });
        };

        $scope.show = function () {
            $http.get(CONFIG.API+'empresacardapio/showcardapio/'+$stateParams.cardapio).then(function(r) {
                $scope.cardapio = r.data;
            }, function (e) {
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
                console.log(e);
            });
        };
        $scope.update = function () {
            var data = $scope.cardapio;
            $http.put(CONFIG.API+'empresacardapio/updatecardapio', {data: data, id: $stateParams.cardapio}).then(function(r) {
                $state.go('empresaCardapio', {id: $stateParams.id});
                ngNotify.set('Cardápio atualizado com sucesso!', 'info');
            }, function (e) {
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
                console.log(e);
            });
        };

        $scope.delete = function(item) {
            $http.delete(CONFIG.API+'empresacardapio/delete/'+item).then(function(r){
                $state.go('empresaCardapio', {id: $stateParams.id}, {reload: true});
                ngNotify.set('Cardápio removido!', 'success');
            }, function(e){
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
            });
        };
        $scope.list = function() {
            $http.get(CONFIG.API+'empresacardapio/list/'+$stateParams.id).then(function (r) {
                $scope.cardapios = r.data;
            }, function (e) {
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
            });
        };

        $scope.itens = function() {
            $http.get(CONFIG.API+'empresacardapio/itens/'+$stateParams.id).then(function (r) {
                $scope.data = r.data;
            }, function (e) {
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
            });
        };

        $scope.pushItem = function() {
            var item = $scope.item;
            console.log(item);
            $scope.novosItens.push(item);
            $scope.item = null;
        };

        $scope.pushSubItem = function() {
            var subItem = $scope.subitem;
            if(!$scope.item.variacoes) {
                $scope.variacoes.push(subItem);
                $scope.item.variacoes = $scope.variacoes;
            } else {
                $scope.item.variacoes.push(subItem);
            }
            $scope.subitem = null;
            $('#myModal').modal('hide');
        };

        $scope.pushTamanho = function() {
            var tamanho = $scope.tamanho;
            if(!$scope.item.tamanhos) {
                $scope.tamanhos.push(tamanho);
                $scope.item.tamanhos = $scope.tamanhos;
            } else {
                $scope.item.tamanhos.push(tamanho);
            }
            $scope.tamanho = null;
            $('#modalTamanho').modal('hide');
        };

        $scope.pushTipo = function() {
            var tipo = $scope.tipo;
            if(!$scope.item.tipos) {
                $scope.tipos.push(tipo);
                $scope.item.tipos = $scope.tipos;
            } else {
                $scope.item.tipos.push(tipo);
            }
            $scope.tipo = null;
            $('#modalTipo').modal('hide');

        };

        $scope.pushSabor = function() {
            var sabor = $scope.sabor;
            if(!$scope.item.sabores) {
                $scope.sabores.push(sabor);
                $scope.item.sabores = $scope.sabores;
            } else {
                $scope.item.sabores.push(sabor);
            }
            $scope.sabor = null;
            $('#modalSabor').modal('hide');
        };

        $scope.removeSectionPizza = function(section,item){
            var sectionItem = 'item.'+section;
            $scope.$eval(sectionItem).splice(item, 1);
            ngNotify.set('Item removido', 'success');
        };

        $scope.removeItem = function(item) {
            $scope.novosItens.splice(item, 1);
            ngNotify.set('Item removido', 'success');

        };

        $scope.removeSubItem = function(subItem) {
            if($scope.variacoes.length == 1) {
                ngNotify.set('Deve haver pelo menos uma variação no item', 'error');
            } else {
                $scope.variacoes.splice(subItem, 1);
                ngNotify.set('Variação removida', 'success');
            }
        };

        $scope.removeVariacao = function(subItem) {
            if($scope.item.variacoes.length == 1) {
                ngNotify.set('Deve haver pelo menos uma variação no item', 'error');
            } else {
                $scope.item.variacoes.splice(subItem, 1);
                ngNotify.set('Variação removida', 'success');
            }
        };

        $scope.storeItens = function(){
            $http.post(CONFIG.API+'empresacardapio/storeitens/'+$stateParams.id, {itens: $scope.novosItens}).then(function (r) {
                //console.log(r.data);
                ngNotify.set('Todos os itens adicionados ao cardápio com sucesso!', 'success');
                $state.go('itensCardapio', {id: r.data});
            }, function (e) {
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
            });
        };

        $scope.updateItem = function(){
            $http.post(CONFIG.API+'empresacardapio/updateitem/'+$stateParams.item, {item: $scope.item, cardapio: $stateParams.cardapio}).then(function (r) {
                //console.log(r.data);
                ngNotify.set('Item atualizado!', 'success');
                $state.go('itensCardapio', {id: r.data});
            }, function (e) {
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
            });
        };

        $scope.deleteItem = function(id) {
            $http.delete(CONFIG.API+'empresacardapio/deleteitens/'+id).then(function (r) {
                ngNotify.set('Item excluído do cardápio com sucesso!', 'success');
                $state.go('itensCardapio', {id: $stateParams.id}, {reload: true});
            }, function (e) {
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
            });
        };

        $scope.openModal = function() {
            if($scope.item == null || $scope.item.preco != "0") {
                return ngNotify.set('Informe um rótulo válido e preço 0 (zero) para adicionar variação', 'error');
            } else {
                $('#myModal').modal('show');
            }
        };

        /**
         * editar item do cardápio
         */
        $scope.editItem = function() {
            $http.get(CONFIG.API+'empresacardapio/show/'+$stateParams.item).then(function (r) {
                $scope.item = angular.fromJson(r.data);
                if($scope.item.categoria == 'Pizza') {
                    var composicao = angular.fromJson(r.data.composicao);
                    $scope.item.tamanhos = angular.fromJson(composicao.tamanhos);
                    $scope.item.tipos = composicao.tipos;
                    $scope.item.sabores = composicao.sabores;
                } else {
                    $scope.item.variacoes = r.data.variacao;
                }
            }, function (e) {
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
            });
        };
    }
]);
