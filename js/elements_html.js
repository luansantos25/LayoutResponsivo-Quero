// item da lista de bolsas do modal
var curso_list =
    `<div class="result d-flex align-items-center">
        <div class="option d-flex flex-1 align-items-center">
            <label class="cbx-container">
                <input class="bolsa-check-list" type="checkbox" name="" data-additional-id="">
                <span class="checkmark"></span>
            </label>
            <img class="bolsa-img-list" src="img/quero-bolsa.png">
        </div>
        <div class="description flex-3">
            <div class="d-flex justify-content-space-between">
                <div class="info">
                    <h4 class="bolsa-title-list"></h4>
                    <p class="bolsa-level-list"></p>
                </div>
                <div class="values">
                    <p>Bolsa de <span class="bolsa-disc-list"></span></p>
                    <p class="bolsa-value-all">R$ <span class="bolsa-value-list"></span> /mês</p>
                </div>
            </div>
        </div>
    </div>`;

// item da listagem de favoritos
var curso =
    `<div class="col-12 col-xs-4 col-lg-3 col-md-2 col-sm-12 bolsa-item">
        <div class="bolsa flex-item">
            <div class="curso-img">
                <img class="bolsa-img" src="https://www.tryimg.com/u/2019/04/16/unip.png">
            </div>
            <div class="text">
                <h3 class="bolsa-title">Anhanguera</h3>
                <h3 class="bolsa-description">Engenharia da Computação</h3>
                <p class="bolsa-score">
                    <span class="number">5</span>
                    <span class="stars">
                    </span>
                </p>
            </div>
            <div class="box-type">
                <h3 class="bolsa-tipo">Presencial - Noite</h3>
                <p>Início das aulas em: <span class="bolsa-inicio">10/10/2010</span></p>
            </div>
            <div class="box-monthly">
                <h4>Mensalidade com o Quero Bolsa:</h4>
                <p class="bolsa-preco-total"></p>
                <span class="bolsa-preco"></span>
                <span>/mês</span>
            </div>
            <div class="options">
                <button class="btn-delete btn-delete-bolsa" data-additional-id="">Excluir</button>
                <button class="btn-see-offer">Ver Oferta</button>
            </div>
        </div>
        </div>`;

// itens para composição da avaliação
var star = '<i class="fas fa-star bolsa-score"></i>';
var half_star = '<i class="fas fa-star-half-alt bolsa-score"></i>';
var blank_star = '<i class="far fa-star"></i>';
