ctrlApp.controller('EmpresaCtrl', ['$scope', '$state', 'EmpresaFactory', 'BairroFactory', 'PagamentoFactory', 'CategoriaFactory', 'PlanoFactory', 'ngNotify', '$http', '$stateParams', 'CONFIG', 'Upload',
    function ($scope, $state, EmpresaFactory, BairroFactory, PagamentoFactory, CategoriaFactory, PlanoFactory, ngNotify, $http, $stateParams, CONFIG, Upload) {
        $scope.empresas = EmpresaFactory.query();
        $scope.categorias = CategoriaFactory.query();
        if($stateParams.id) {
            $scope.info = EmpresaFactory.get({id: $stateParams.id});
        }
        $scope.store = function () {
            var data = $scope.empresa;
            var categorias = [];
            angular.forEach($scope.empresa.categoria, function(val, key){
                if(val === true){
                    categorias.push(key);
                }
            });
            data.categorias = categorias;
            EmpresaFactory.save(data, function (r) {
                //console.log(r.id);
                $state.go('empresaAdicional', {id: r.id});
                ngNotify.set('Empresa registrada com sucesso!', 'success');
            }, function (e) {
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
                console.log(e);
            });
        };
        $scope.show = function () {
            EmpresaFactory.get({id: $stateParams.id}, function (r) {
                $scope.empresa = r;
            }, function (e) {
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
                console.log(e);
            });
        };
        $scope.update = function () {
            var data = $scope.empresa;
            EmpresaFactory.update({data: data, id: $stateParams.id}, function (r) {
                $state.go('empresas');
                ngNotify.set('Empresa atualizada com sucesso!', 'info');
            }, function (e) {
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
                console.log(e);
            });
        };
        $scope.delete = function (id) {
            EmpresaFactory.delete({id: id}, function () {
                $state.go('empresas', {}, {reload: true});
                ngNotify.set('Empresa excluída!', 'success');
            }, function (e) {
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
            });
        };
        $scope.createInfos = function() {
            $scope.planos = PlanoFactory.query();
        };
        $scope.storeInfos = function() {
            var data = {
                plano:      $scope.plano.plano.id,
                endereco:   $scope.endereco,
                social:     $scope.social,
                contato:    $scope.contato

            };
            $http.post(CONFIG.API+'empresainfos/saveinfos/'+$stateParams.id, data).then(function(r){
                $state.go('infosEmpresa', {id: r.data});
                ngNotify.set('Dados adicionais da empresa registrados com sucesso!', 'success');
            }, function(e){
                console.log(e);
            });
        };
        $scope.infos = function () {
            $http.get(CONFIG.API+'empresainfos/allinfos/'+$stateParams.id).then(function(r){
                $scope.planos = PlanoFactory.query();
                $scope.planoSelected = r.data.empresaplano.plano;
                $scope.endereco = r.data.endereco;
                $scope.social = r.data.social;
                $scope.contato = r.data.contato;
            }, function(e){
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
            });
        };
        $scope.updateInfos = function() {
            if($scope.changePlan === undefined || $scope.changePlan === 0) {
                var plano = null;
            } else {
                var plano = $scope.plano.plano.id;
            }
            var data = {
                plano:      plano,
                endereco:   $scope.endereco,
                social:     $scope.social,
                contato:    $scope.contato
            };
            $http.post(CONFIG.API+'empresainfos/updateinfos/'+$stateParams.id, data).then(function(r){
                $state.go('infosEmpresa', {id: r.data}, {reload: true});
                ngNotify.set('Dados adicionais da empresa atualizados com sucesso!', 'success');
                //console.log(r.data);
            }, function(e){
                console.log(e);
            });
        };
        $scope.listImgs = function(){
            $http.get(CONFIG.API+'empresainfos/listimgs/'+$stateParams.id).then(function(r){
                $scope.images = r.data;
            }, function (e) {
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
            });
        };
        $scope.storeImgs = function(){
            $scope.file.upload = Upload.upload({
                url: CONFIG.API+'empresainfos/upimgs/'+$stateParams.id,
                data: {file: $scope.file}
            }).then(function (r) {
                ngNotify.set('Imagens da empresa atualizadas com sucesso!', 'success');
                //console.log(r.data);
                $state.go('empresas');
            }, function (e) {
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
            });
        };
        $scope.loadBairros = function() {
            $scope.allBairros = BairroFactory.query();
            $scope.empresaBairros = [];
            $http.get(CONFIG.API+'empresainfos/empresabairros/'+$stateParams.id).then(function(r){
                angular.forEach(angular.fromJson(r.data), function(obj){
                    $scope.empresaBairros.push(obj['id']);
                });
            }, function(e){
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
            });
        };
        $scope.defineBairros = function() {
            $http.post(CONFIG.API+'empresainfos/definebairros/'+$stateParams.id, {bairros: $scope.empresaBairros}).then(function(r){
                ngNotify.set('Bairros de entrega denifinos com sucesso!', 'success');
                $state.go('empresas');
            }, function(e){
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
            });
        };
        $scope.loadPagamentos = function() {
            $scope.allPagamentos = PagamentoFactory.query();
            $scope.empresaPagamentos = [];
            $http.get(CONFIG.API+'empresainfos/empresapagamentos/'+$stateParams.id).then(function(r){
                angular.forEach(angular.fromJson(r.data), function(obj){
                    $scope.empresaPagamentos.push(obj['id']);
                });
            }, function(e){
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
            });
        };
        $scope.definePagamentos = function() {
            $http.post(CONFIG.API+'empresainfos/definepagamentos/'+$stateParams.id, {pagamentos: $scope.empresaPagamentos}).then(function(r){
                ngNotify.set('Forma de pagamento definidas com sucesso!', 'success');
                $state.go('empresas');
            }, function(e){
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
            });
        };
        $scope.loadHorarios = function() {
            $scope.empresaHorarios = {};
            $http.get(CONFIG.API+'empresainfos/empresahorarios/'+$stateParams.id).then(function(r){
                angular.forEach(angular.fromJson(r.data), function(obj){
                    $scope.empresaHorarios[obj['dia']] = obj;
                });
            }, function(e){
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
            });
        };
        $scope.defineHorarios = function() {
            $http.post(CONFIG.API+'empresainfos/definehorarios/'+$stateParams.id, {horarios: $scope.empresaHorarios}).then(function(r){
                ngNotify.set('Horários de funcionamento definidos com sucesso!', 'success');
                $state.go('empresas');
            }, function(e){
                ngNotify.set('Ocorreu um erro na operação. Código: ' + e.status, 'error');
            });
        };
    }
]);
