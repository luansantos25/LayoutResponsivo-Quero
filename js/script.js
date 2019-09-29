'use strict';

/*=======
    RECEBENDO DADOS SERVIDOR
 ======*/

const URL_TO_FETCH = 'https://testapi.io/api/redealumni/scholarships';
var COURSES_DATA;

fetch(URL_TO_FETCH, {
        method: 'get'
    })
    .then(response => response.json())
    .then(result => {

        // definindo ID para as bolsas
        result.forEach(function(item, i) {
            item.id = i;
        })

        // atribuindo resultados em variável global
        COURSES_DATA = result;
        console.log(result);

        initializeCityFilter(COURSES_DATA);
        initializeCoursesFilter(COURSES_DATA);
        populateCoursesList(COURSES_DATA);
    })
    .catch(err => {
        console.error('Erro ao buscar informações', err);
    });


/* RETORNA A LISTA GLOBAL DE BOLSAS RECEBIDAS POR API */
function getGlobalCouseList() {
    return COURSES_DATA;
}

/*=======
    FIM RECEBENDO DADOS SERVIDOR
 ======*/

/*=======
    INICIALIZANDO CAPTURA DE EVENTOS
 ======*/
// captura de evento filtro cidade
var city_filter = document.getElementById("filter-city");
city_filter.addEventListener("change", function(evt) {
    filter(evt, "city")
}, false);

// captura de evento filtro de curso
var course_filter = document.getElementById("filter-course");
course_filter.addEventListener("change", function(evt) {
    filter(evt, "course")
}, false);

// captura de evento filtro opção presencial
var presential_filter = document.getElementById("filter-presential");
presential_filter.addEventListener("change", function(evt) {
    filter(evt, "presential")
}, false);

// captura de evento filtro opção EaD
var distance_filter = document.getElementById("filter-distance");
distance_filter.addEventListener("change", function(evt) {
    filter(evt, "distance")
}, false);

// captura de evento btn adicionar bolsa
var btn_add_bolsas = document.getElementById("btn-add-bolsas");
btn_add_bolsas.addEventListener("click", function(evt) {
    confirmAddBolsas()
}, false);

// captura de evento ordenar por nome de curso
var order_filter = document.getElementById("filter-order");
order_filter.addEventListener("click", function(evt) {
    orderByUniversityName()
}, false);

// captura de evento abrir Modal
var btn_delete_modal = document.getElementById("btn-delete-modal");
btn_delete_modal.addEventListener("click", function(evt) {
    btn_modal_close.click()
}, false);

/*=======
    FIM INICIALIZANDO CAPTURA DE EVENTOS
 ======*/

/*=======
    CONTROLANDO FILTROS
 ======*/

// inicializando slider
var slider = document.getElementById("filter-price");
var slider_output = document.getElementById("slider-display");
var order_by_university_name = false;
var slider_value = slider.value;

slider_output.innerHTML = slider_value;

/* CAPTURANDO EVENTO SLIDER */
slider.oninput = function() {
    slider_value = this.value;
    slider_output.innerHTML = slider_value;
    filter();
}

/* ADICIONANDO LISTENER PARA OS BOTÕES DE FILTRAGEM DE SEMESTRE */
document.querySelectorAll("ul.semester-list li")
    .forEach(function(elm) {
        console.log(elm.dataset.additionalSem);
        let semester = elm.dataset.additionalSem;
        elm.addEventListener("click", function(evt) {
            filterSemester(semester)
        }, false);
    })

/* DEFINIÇÕES DE FILTRO NA BUSCA POR BOLSAS MODAL*/
function filter() {
    console.log('filter go go');
    selected_courses = [];

    // cidade selecionada
    let selected_city = city_filter.options[city_filter.selectedIndex].value;
    // cursos selecionado
    let selected_course = course_filter.options[course_filter.selectedIndex].value;
    // array de bolsas filtradas sendo inicializado com todos as bolsas disponíveis
    let courses_filtered = getGlobalCouseList();

    // filtrando por cidade
    if (selected_city != "") {
        courses_filtered = courses_filtered.filter(
            (course) => course.campus.city == selected_city
        );
    }

    // filtrando por curso
    if (selected_course != "") {
        courses_filtered = courses_filtered.filter(
            (course) => course.course.name == selected_course
        );
    }

    // filtrando por cursos presenciais / EaD
    if (presential_filter.checked && !distance_filter.checked) {
        courses_filtered = courses_filtered.filter(
            (course) => course.course.kind == "Presencial"
        );
    } else if (distance_filter.checked && !presential_filter.checked) {
        courses_filtered = courses_filtered.filter(
            (course) => course.course.kind == "EaD"
        );
    }

    // filtrando por preço com base no slider
    courses_filtered = courses_filtered.filter(function(course) {
        return course.price_with_discount <= slider_value;
    });

    console.log(courses_filtered);

    // atualizando listagem de bolsas com base nos filtros
    populateCoursesList(courses_filtered);
}

/* ORDENANDO LISTAGEM DE BOLSAS POR UNIVERSIDADE */
function orderByUniversityName() {

    var order_icon = order_filter.childNodes[1].classList;

    if (!order_by_university_name) {
        courses_filtered = courses_filtered.sort(function(a, b) {
            return a.university.name.localeCompare(b.university.name);
        })

        order_icon.remove("fa-caret-down");
        order_icon.add("fa-caret-up");
        order_by_university_name = true;
    } else {
        courses_filtered = courses_filtered.sort(function(a, b) {
            return b.university.name.localeCompare(a.university.name);
        })
        order_icon.remove("fa-caret-up");
        order_icon.add("fa-caret-down");
        order_by_university_name = false;
    }

    populateCoursesList(courses_filtered);
}

/* FILTRANDO SEMESTRES */
var current_semester;

function filterSemester(semester, refresh = false) {

    if ((semester != current_semester) || refresh) {
        let courses = initializeMyCourses();

        if (semester == 0) {
            populateCourses(courses);
        } else {
            courses = courses.filter(function(el) {
                return el.enrollment_semester.split(".")[1] == semester;
            });
            populateCourses(courses);
        }

        document.querySelectorAll("ul.semester-list li").forEach(function(elm) {
            elm.classList.remove("semester-active");
        });

        document.querySelector("#sem" + semester).classList.add("semester-active");

        current_semester = semester;
        console.log("SEMESTER", courses);
        console.log("SEMESTER NUM", semester);
    }
}

/*=======
    FIM CONTROLANDO FILTROS
 ======*/

/*=======
    CONTROLANDO BOLSAS
 ======*/

/* CONFIRMANDO A ADIÇÃO DA BOLSA SELECIONADA */
function confirmAddBolsas() {
    console.log("CONFIRMANDO", selected_courses);
    localStorageData(selected_courses, "my-courses");
    selected_courses = [];
    filterSemester(0, true);

    document.querySelectorAll("input.bolsa-check-list").forEach(function(elm) {
        elm.checked = false;
    })

    document.getElementById("btn-add-bolsas").disabled = true;

    // Fechando modal
    btn_modal_close.click();
}

/* REMOVENDO BOLSA */
function rmBolsa(evt) {
    console.log(evt.target.dataset.additionalId);
    var id = evt.target.dataset.additionalId;

    current_courses = localStorageRemove(id, "my-courses");
    evt.target.parentElement.parentElement.parentElement.hidden = true;
}

/* POPULANDO LISTA DE FAVORITOS */
function populateCourses(courses) {

    // capturando div pai de bolsas favoritas
    var coursesElm = document.getElementById("bolsas");

    // removendo elementos para atualização
    coursesElm.querySelectorAll(".bolsa-item").forEach(function(elm) {
        elm.remove()
    })

    // adicionando bolsas favoritas no container pai
    courses.forEach(function(course) {
        // convertento texto para elemento HTML
        var elm = htmlToElement(curso);

        // inicializando variáveis
        elm.getElementsByClassName('bolsa-title')[0].textContent = course.university.name;
        elm.getElementsByClassName('bolsa-description')[0].textContent = course.course.name;
        elm.getElementsByClassName('bolsa-img')[0].src = course.university.logo_url;
        elm.getElementsByClassName('bolsa-inicio')[0].textContent = course.start_date;
        elm.getElementsByClassName('bolsa-preco-total')[0].textContent = "R$ " + course.full_price;
        elm.getElementsByClassName('bolsa-preco')[0].textContent = "R$ " + course.price_with_discount;
        elm.getElementsByClassName('btn-delete-bolsa')[0].dataset.additionalId = course.id;
        elm.getElementsByClassName('number')[0].textContent = course.university.score;
        setScoreElm(elm.getElementsByClassName('stars')[0], course.university.score);

        // desabilitando cursos
        if (!course.enabled) {
            _elm = elm.getElementsByClassName('btn-see-offer')[0];
            _elm.textContent = "Indisponível";
            _elm.disabled = true;
        }

        // adicionando evento para ação Remover
        elm.getElementsByClassName('btn-delete-bolsa')[0].addEventListener("click", function(evt) {
            rmBolsa(evt);
            console.log("CALL REMOVE BOlsa");
        });

        // adicionando bolsas favoritas na view
        coursesElm.append(elm);
    });
}

/* POPULANDO LISTA DE BOLSAS NO MODAL */
function populateCoursesList(courses) {

    // capturando div pai da listagem de bolsas
    var coursesListElm = document.getElementById("course-list");

    // limpando lista para atualização
    coursesListElm.innerHTML = "";

    // adicionando ofertas de bolsas no container
    courses.forEach(function(course, i) {
        // convertendo texto para elemento HTML
        var elm = htmlToElement(curso_list);

        // inicializando variáveis
        elm.getElementsByClassName('bolsa-title-list')[0].textContent = course.course.name;
        elm.getElementsByClassName('bolsa-check-list')[0].dataset.additionalId = course.id;
        elm.getElementsByClassName('bolsa-level-list')[0].textContent = course.course.level;
        elm.getElementsByClassName('bolsa-disc-list')[0].textContent = course.discount_percentage + "%";
        elm.getElementsByClassName('bolsa-value-list')[0].textContent = Math.floor(course.price_with_discount);
        elm.getElementsByClassName('bolsa-img-list')[0].src = course.university.logo_url;

        // adicionando evento de click para selecionar bolsas
        elm.querySelector("input").addEventListener("click", function(evt) {
            addBolsas(evt);
        });

        // adicionando bolsas na listagem do modal
        coursesListElm.append(elm);
    });
}

/* ADICIONAR BOLSAS - CLICK CHECKBOX NO MODAL */
var selected_courses = [];

function addBolsas(evt) {
    console.log("ADD BOLSAS CALL");

    // capturando estado do checkbox
    var operation = evt.target.checked;
    // capturando id da bolsa
    var bolsa_id = evt.target.dataset.additionalId;

    console.log(evt.target.dataset.additionalId);
    console.log(evt.target.checked);

    // checando se a bolsa será adicionada ou removida
    if (operation) {
        console.log(COURSES_DATA[bolsa_id]);

        // adicionando bolsa no array de selecionados
        selected_courses.push(COURSES_DATA[bolsa_id]);
    } else {
        // removendo bolsa do array de selecionados
        selected_courses = selected_courses.filter(function(el) {
            return el.id != bolsa_id;
        })
    }

    // habilitando botão para add bolsa se houverem itens selecionados
    let _elm = document.getElementById("btn-add-bolsas");
    if (!selected_courses.length > 0)
        _elm.disabled = true;
    else
        _elm.disabled = false;

    console.log("SELECTED ", selected_courses);
}

/*=======
    FIM CONTROLANDO BOLSAS
 ======*/

/*=======
    PERSISTÊNCIA LOCAL
 ======*/

/* VERIFICANDO E PERSISTINDO DADOS NO BROWSER */
function localStorageData(data, name) {
    if (!localStorage.getItem(name)) {
        localStorage.setItem(name, JSON.stringify(data));
    } else {
        var course_obj = JSON.parse(localStorage.getItem(name));
        course_obj = course_obj.concat(data);
        localStorage.setItem(name, JSON.stringify(course_obj));
    }
}

/* REMOVENDO DADOS DO BROWSER */
function localStorageRemove(id, name) {
    var courses_obj = JSON.parse(localStorage.getItem(name));
    courses_obj = courses_obj.filter(function(el) {
        return el.id != id;
    })

    localStorage.removeItem(name);
    localStorageData(courses_obj, name);

    return courses_obj;
}

/*=======
    FIM PERSISTÊNCIA LOCAL
 ======*/

/*=======
    INICIALIZAÇÕES
 ======*/

/* INICIALIZANDO FILTRO DE CIDADES COM BASE NOS DADOS DA API */
function initializeCityFilter(itens) {
    var x = document.getElementById("filter-city");

    var cities = itens.map(function(elm) {
        return elm.campus.city;
    })

    var distinctCities = [...new Set(cities)];
    console.log(distinctCities);

    // adicionando cidades no SELECT de filtro
    distinctCities.forEach(function(item) {
        var option = document.createElement("option");

        option.text = item;
        option.value = item;
        x.add(option);
    })
}

/* INICIALIZANDO FILTRO DE CURSOS COM BASE NOS DADOS DA API */
function initializeCoursesFilter(itens) {
    let x = document.getElementById("filter-course");

    // capturando e agrupando cursos
    var courses = itens.map(function(elm) {
        return elm.course.name;
    })

    // capturando cursos distintos
    var distinctCourses = [...new Set(courses)];
    console.log(distinctCourses);

    // adicionando cursos no SELECT de filtro
    distinctCourses.forEach(function(item) {
        let option = document.createElement("option");

        option.text = item;
        option.value = item;
        x.add(option);
    })
}

/* INICIALIZANDO CURSOS FAVORITOS DO USUÁRIO
    Existindo dados locais, os mesmos são retornados.
    Caso contrário, um array vazio é retornado.
*/
function initializeMyCourses() {
    let courses_local;

    if (courses_local = localStorage.getItem("my-courses")) {
        return JSON.parse(courses_local).reverse();
    } else {
        return [];
    }
};

/*=======
    FIM INICIALIZAÇÕES
 ======*/

/*=======
    HELPERS
 ======*/
/* CONVERTENDO STRING PARA HTML */
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

/* INICIALIZANDO SCORE STARS DE CADA ITEM FAVORITO */
function setScoreElm(elm, score) {
    let i;
    for (i = 1; i < 6; i++) {

        if (Math.floor(score) > i - 1) {
            elm.append(htmlToElement(star));
        } else if (Math.floor(score) == i - 1) {
            console.log("score == score");
            if (score - Math.floor(score) > .5) {
                elm.append(htmlToElement(half_star));
            } else {
                elm.append(htmlToElement(blank_star));
            }
        } else {
            elm.append(htmlToElement(blank_star));
        }

    }
}

/*=======
    FIM HELPERS
 ======*/

/*=======
    iNICIALIZANDO SISTEMA
 ======*/
(function initSystem() {
    // inicializando favoritos com dados de todos os semestres
    filterSemester(0);
})();
/*=======
    FIM iNICIALIZANDO SISTEMA
 ======*/
