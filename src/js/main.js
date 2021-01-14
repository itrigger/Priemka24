jQuery(document).ready(function () {
    var cardsSwiper = new Swiper('.swiper-cards', {
        // Optional parameters
        slidesPerView: 4,
        spaceBetween: 20,
        autoplay: {
            delay: 4000,
        },
        // Responsive breakpoints
        breakpoints: {
            // when window width is >= 320px
            320: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            // when window width is >= 480px
            480: {
                slidesPerView: 3,
                spaceBetween: 20
            },
            // when window width is >= 640px
            640: {
                slidesPerView: 3,
                spaceBetween: 20
            },
            1120: {
                slidesPerView: 4,
                spaceBetween: 20
            }
        },
        loop: false,

        // Navigation arrows
        navigation: {
            nextEl: '.cards-line2 .swiper-button-next',
            prevEl: '.cards-line2 .swiper-button-prev',
        },
    });

    var bannersSwiper = new Swiper('.top-slider_wrapper .swiper-container', {
        // Optional parameters
        slidesPerView: 1,
        spaceBetween: 0,
        // Responsive breakpoints
        loop: true,
        breakpoints: {
            // when window width is >= 320px
            320: {
                autoHeight: true,
            },
            1180: {
                autoHeight: false,
            }
        },
        autoplay: {
            delay: 5000,
        },
        // Navigation arrows
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
        },
    });


    jQuery('.map_bubble').on('click', '.close', function () {
        jQuery(this).parent().removeClass("open").find(".wrapper").html("");
    })

    jQuery('.btn-burger').on('click', function () {
        if (jQuery(this).hasClass('active')) {
            jQuery(this).removeClass('active');
            jQuery('#mobile_menu').removeClass('active');
        } else {
            jQuery(this).addClass('active');
            jQuery('#mobile_menu').addClass('active');
        }
    });

    jQuery(".btn-buy-wrapper").click(function () {
        jQuery("textarea#mytext").text("Здравствуйте! Я хочу продать деталь: " + jQuery(this).parent().parent().find(".woocommerce-loop-product__title").text());
    });


    var GOLD_DISCOUNT = 0.6;
    var SILVER_DISCOUNT = 0.7;
    var PLATINUM_DISCOUNT = 0.7;
    var PALLADIUM_DISCOUNT = 0.7;

    let categoriesAPI = {}; // объект где храним список категорий
    let categoriesName = [];
    let productsAPI = {}; // объект где храним список продуктов
    let rowsCount = 1; // изначальное кол-во строк
    let $parentEl = jQuery('.calculator'); // ссылка на родительскую обертку
    let totalPrice = 0; // начальное значение итоговой цены

    let GOLD = stock_gold / 31.1; // здесь будут курсы драгметаллов и доллара делим на 31,1 для перевода из унций в кг
    let SILVER = stock_silver / 31.1;
    let PLATINUM = stock_platinum / 31.1;
    let PALLADIUM = stock_palladium / 31.1;
    let USD = stock_rub;
    let EUR = 1 / stock_eur * stock_rub;
    let STOCK_DATE = stock_date.toString();
    const TYPES = ["кг", "шт", "г", "кольцо", "секция", "2 секции", "контакт", "гр"];
    const CONST_HOST = "https://priemkm.ru";
   // const CONST_HOST = window.location.origin;
    console.log(CONST_HOST);
    const CONST_CK = 'ck_1a2af9ee2ad6e3ac6a0f9237cebfcc62ad4a88a5';
    const CONST_CS = 'cs_fc757c4e40772bd4cb6b5f36c8a81bf33504395f';
    const $dropdown = jQuery(".el-type-1"); // начальные ссылки на селекты
    const $dropdownChild = jQuery(".el-name-1");


    let lsArr = JSON.parse(sessionStorage.getItem('order'));
    if (lsArr) {
        jQuery("#print").addClass("active");
    }

    //Заполняем данные блока Биржевые котировки (данные получены с помощью php и сохраняются в кэше WP)

    function updateStocksHTML() {
        if (jQuery(".stocks--items").length > 0) {
            jQuery('.stocks').addClass('updating');
            jQuery(".stocks_usd").text(Math.round((USD + Number.EPSILON) * 100) / 100 + " ₽");
            jQuery(".stocks_eur").text(Math.round((EUR + Number.EPSILON) * 100) / 100 + " ₽");
            jQuery(".stocks_gold").text(Math.round((GOLD * USD + Number.EPSILON) * 100) / 100 + " ₽");
            jQuery(".stocks_silver").text(Math.round((SILVER * USD + Number.EPSILON) * 100) / 100 + " ₽");
            jQuery(".stocks_platinum").text(Math.round((PLATINUM * USD + Number.EPSILON) * 100) / 100 + " ₽");
            jQuery(".stocks_palladium").text(Math.round((PALLADIUM * USD + Number.EPSILON) * 100) / 100 + " ₽");
            jQuery(".stocks .date").text(STOCK_DATE.slice(6, 8) + "." + STOCK_DATE.slice(4, 6) + "." + STOCK_DATE.slice(0, 4));

            if (old_stock_rub) {
                if (stock_rub > old_stock_rub) {
                    jQuery(".stocks_usd").addClass("stock-up");
                } else if (stock_rub < old_stock_rub) {
                    jQuery(".stocks_usd").addClass("stock-down");
                } else {
                    jQuery(".stocks_usd").removeClass("stock-down");
                    jQuery(".stocks_usd").removeClass("stock-up");
                }
                if (stock_eur > old_stock_eur) {
                    jQuery(".stocks_eur").addClass("stock-up");
                } else if (stock_eur < old_stock_eur) {
                    jQuery(".stocks_eur").addClass("stock-down");
                } else {
                    jQuery(".stocks_eur").removeClass("stock-down");
                    jQuery(".stocks_eur").removeClass("stock-up");
                }
                if (stock_gold > old_stock_gold) {
                    jQuery(".stocks_gold").addClass("stock-up");
                } else if (stock_gold < old_stock_gold) {
                    jQuery(".stocks_gold").addClass("stock-down");
                } else {
                    jQuery(".stocks_gold").removeClass("stock-down");
                    jQuery(".stocks_gold").removeClass("stock-up");
                }
                if (stock_silver > old_stock_silver) {
                    jQuery(".stocks_silver").addClass("stock-up");
                } else if (stock_silver < old_stock_silver) {
                    jQuery(".stocks_silver").addClass("stock-down");
                } else {
                    jQuery(".stocks_silver").removeClass("stock-down");
                    jQuery(".stocks_silver").removeClass("stock-up");
                }
                if (stock_platinum > old_stock_platinum) {
                    jQuery(".stocks_platinum").addClass("stock-up");
                } else if (stock_platinum < old_stock_platinum) {
                    jQuery(".stocks_platinum").addClass("stock-down");
                } else {
                    jQuery(".stocks_platinum").removeClass("stock-down");
                    jQuery(".stocks_platinum").removeClass("stock-up");
                }
                if (stock_palladium > old_stock_palladium) {
                    jQuery(".stocks_palladium").addClass("stock-up");
                } else if (stock_palladium < old_stock_palladium) {
                    jQuery(".stocks_palladium").addClass("stock-down");
                } else {
                    jQuery(".stocks_palladium").removeClass("stock-down");
                    jQuery(".stocks_palladium").removeClass("stock-up");
                }
            }
            jQuery('.stocks').removeClass('updating');
            jQuery('.stocks').addClass('renew');
        }
    }

    updateStocksHTML();

    if (jQuery(".print--ul").length > 0) {
        jQuery(".print--ul").each(function () {
            let item_gold = jQuery(this).find(".item--gold").text();
            let item_silver = jQuery(this).find(".item--silver").text();
            let item_platinum = jQuery(this).find(".item--platinum").text();
            let item_palladium = jQuery(this).find(".item--palladium").text();
            let item_typecount = jQuery(this).find(".item--typeofcount").text();
            let item_fixprice = jQuery(this).find(".item--fixprice").text();
            let item_price;
            // Основная формула для каждого города и металла есть поправочный кэф
            if (item_fixprice > 0) {
                if (item_fixprice == "999999") {
                    jQuery(this).find(".price").text("договорная");
                } else {
                    jQuery(this).find(".price .price_value").text(item_fixprice);
                }
            } else {
                // З -40%, С -30%, Пл -30%, Пал -30%
                item_price = (item_gold * GOLD * GOLD_DISCOUNT + item_silver * SILVER * SILVER_DISCOUNT + item_platinum * PLATINUM * PLATINUM_DISCOUNT + item_palladium * PALLADIUM * PALLADIUM_DISCOUNT) * USD;
                // З -50%, С -35%, Пл -30%, Пал -35% (ост города)
                jQuery(this).find(".price .price_value").text(Math.round((item_price + Number.EPSILON) * 100) / 100);
            }
            jQuery(this).find(".itemcount").text(TYPES[item_typecount - 1]);

        })
    }
    /**/

    $dropdown.prop('disabled', 'disabled'); // отключаем селекты, пока в них не подгрузятся данные
    $dropdownChild.prop('disabled', 'disabled');

    /*******************/
    /*****Notifier*******/
    /*******************/
    //Собственный модуль уведомлений
    const notify = function (message, type = "success") { // type может быть success (по умолчанию) или error
        $parentEl.append(`<div class='flex alert ${type}'>${message} <span class="closebtn">×</span></div>`) // вставляем алерт в дом
        if (type === "success") { // если алерт об успешной операции, то автоматически прячем через 3 секунды
            setTimeout(function () {
                $parentEl.find(".alert").remove();
            }, 3000);
        }
    }
    jQuery(document).on('click', '.closebtn', function () { // кнопка закрытия алерта
        let $alert = jQuery(this).parent();
        $alert.css({"opacity": "0", "height": "1px"});
        setTimeout(function () {
            $alert.css("display", "none")
        }, 600);
    })
    const delete_notify = function (input) { // функция "мягкого" скрытия алертов (с анимацией). В качестве input передаем ссылку на элемент, у которого надо убрать класс input-error
        jQuery('.alert').each(function () {
            let $alert = jQuery(this);
            $alert.css({"opacity": "0", "height": "1px"});
            setTimeout(function () {
                $alert.remove();
            }, 600);
        })
        if (input) {
            input.removeClass("input-error");
        }
    }
    const harddelete_notify = function (input) { // тоже самое, только скрытие всех алертов без анимации (например, сркыть все алерты перед проверкой и в случае необходимости отобразить новый)
        jQuery('.alert').each(function () {
            jQuery(this).remove();
        })
        if (input) {
            input.removeClass("input-error");
        }
    }
    /****************/
    /****************/
    /****************/

// небольшая функция скрывающая или показывающая анимированный лоадер
    const isLoading = (cond) => {
        if (cond === 1) {
            jQuery(".loader").css("opacity", "1");
            jQuery(".els-body").addClass("disabled");
        } else {
            jQuery(".loader").css("opacity", "0");
            jQuery(".els-body").removeClass("disabled");
        }
    }

    if (jQuery("body").hasClass("home")) {
        // первоначальный запрос при загрузке страницы, чтобы заполнить первый селект данными
        fetch(`${CONST_HOST}/wp-json/wc/v3/products/categories?consumer_key=${CONST_CK}&consumer_secret=${CONST_CS}&exclude=15&per_page=100`)
            .then(
                function (response) {
                    isLoading(1);
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        notify("Возникла ошибка при получении данных! Попробуйте перезагрузить страницу или зайти позже.", "error");
                        return;
                    }

                    // Examine the text in the response
                    response.json().then(function (data) {
                        categoriesAPI = data;
                        $dropdown.empty();

                        jQuery.each(categoriesAPI, function () {
                            $dropdown.append(jQuery("<option />").val(this.id).text(this.name));
                        });
                        $dropdown.append(jQuery("<option disabled hidden selected value='9999'></option>").text("Выберите тип элемента"));
                        $dropdown.prop('disabled', false);
                        //fillChildSelect(1);
                        CheckProjects();
                        isLoading(0);
                    });

                    /*Fill fields from localstorage*/
                    let lsArr = [];
                    if (sessionStorage.getItem('order') !== null) {
                        lsArr = JSON.parse(sessionStorage.getItem('order'));
                        getFromLs(lsArr).then(r => console.log('Data loaded from local storage!'));
                    }


                }
            )
            .catch(function (err) {
                console.log('Fetch Error :-S', err);
                notify("Возникла ошибка при получении данных! Попробуйте перезагрузить страницу или зайти позже.", "error");
            });
    } else {
        isLoading(0);
    }

    /*ToDO
        вызвать функцию определение цены для первого элемента во втором селекте
     */
// заполняем дочерний селект при выборе опции в родительском
    const fillChildSelect = function (id, catId = 0) {
        isLoading(1); //Отображаем лоадер
        jQuery("#print").addClass("active");
        let thiscatID = 0;
        let $row = jQuery('.els-row-' + id);

        if (catId > 0) {
            thiscatID = catId;
            $row.find('.el-type').val(catId);
        } else {
            thiscatID = $row.find('.el-type').val(); // получаем ID категории
        }

        let $childDD = $row.find('.el-name'); // получаем ссылку на дочерний селект
        $childDD.prop('disabled', 'disabled'); // блокируем дочерний селект пока идет загрузка
        delete_notify($childDD); // удаляем все сообщения об ошибках и красную обводку с поля


        if (sessionStorage.getItem('category' + thiscatID) !== null) {

            let lsArr = [];
            lsArr = JSON.parse(sessionStorage.getItem('category' + thiscatID));

            $childDD.empty(); // очищаем селект
            $childDD.append(jQuery("<option hidden disabled selected value='9999'></option>").text("Выберите наименование"));
            for (const [i, arr] of lsArr.entries()) {
                if (arr[8] !== '999999') {
                    $childDD.append(jQuery("<option />")
                        .val(arr[0])
                        .text(arr[2])
                        .attr({
                            'data-g': arr[3],
                            'data-s': arr[4],
                            'data-pt': arr[5],
                            'data-pd': arr[6],
                            'data-counttype': arr[7],
                            'data-fixprice': arr[8],
                            //}).prop('selected', true));
                        }));
                }
            }

            $childDD.prop('disabled', false);
            getPrice(id);
            isLoading(0);
        } else {
            // запрос на АПИ
            fetch(`${CONST_HOST}/wp-json/wc/v3/products?consumer_key=${CONST_CK}&consumer_secret=${CONST_CS}&category=${thiscatID}&per_page=100&status=publish`)
                .then(
                    function (response) {
                        if (response.status !== 200) {
                            console.log('Looks like there was a problem. Status Code: ' +
                                response.status);
                            notify("Возникла ошибка при получении данных! Попробуйте перезагрузить страницу или зайти позже.", "error");
                            return;
                        }

                        /**/
                        response.json().then(function (data) {
                            productsAPI = data;
                            let temp = [];
                            if (data.length) {
                                $childDD.empty(); // очищаем селект
                                $childDD.append(jQuery("<option hidden disabled selected value='9999'></option>").text("Выберите наименование"));
                                let i = 0;
                                for (let key in productsAPI) {
                                    // заполняем селект данными
                                    if (productsAPI.hasOwnProperty(key)) {
                                        if (productsAPI[key].meta_data[10].value !== '999999') {
                                            $childDD.append(jQuery("<option />")
                                                .val(productsAPI[key].id)
                                                .text(productsAPI[key].name)
                                                .attr({
                                                    'data-g': productsAPI[key].meta_data[0].value,
                                                    'data-s': productsAPI[key].meta_data[2].value,
                                                    'data-pt': productsAPI[key].meta_data[4].value,
                                                    'data-pd': productsAPI[key].meta_data[6].value,
                                                    'data-counttype': productsAPI[key].meta_data[8].value,
                                                    'data-fixprice': productsAPI[key].meta_data[10].value,
                                                    //}).prop('selected', true));
                                                }));

                                            //заполняем локальное хранилище

                                            let lsId = productsAPI[key].id; //ID самой радиодетали
                                            let lsCatId = productsAPI[key].categories[0].id; //Id категории
                                            let lsName = productsAPI[key].name; //Имя детали
                                            let lsMeta0 = productsAPI[key].meta_data[0].value; //Gold
                                            let lsMeta2 = productsAPI[key].meta_data[2].value; //Silver
                                            let lsMeta4 = productsAPI[key].meta_data[4].value; //Platinum
                                            let lsMeta6 = productsAPI[key].meta_data[6].value; //Palladium
                                            let lsMeta8 = productsAPI[key].meta_data[8].value; //Мера измерения (кг,  шт и т.д.)
                                            let lsMeta10 = productsAPI[key].meta_data[10].value; //Мера измерения (кг,  шт и т.д.)
                                            temp[i] = [lsId, lsCatId, lsName, lsMeta0, lsMeta2, lsMeta4, lsMeta6, lsMeta8, lsMeta10];
                                            i++;
                                        }
                                    }
                                }

                                if (sessionStorage.getItem('category' + thiscatID) === null) {
                                    sessionStorage.setItem('category' + thiscatID, JSON.stringify(temp));
                                }

                                $childDD.prop('disabled', false);
                                if ($childDD.find('option:selected').attr('value').toString() !== '9999') {
                                    getPrice(id);
                                }

                            } else {
                                $childDD.empty(); // очищаем селект
                                $childDD.append(jQuery("<option />")
                                    .val('')
                                    .text('Нет данных!')
                                );
                            }

                            isLoading(0);
                        });
                        /**/

                    }
                )
                .catch(function (err) {
                    console.log('Fetch Error :-S', err);
                    notify("Возникла ошибка при получении данных! Попробуйте перезагрузить страницу или зайти позже.", "error");
                });
        }
    }

    //run function on dynamic els
    $parentEl.on('change', '.el-type', function () {
        let id = jQuery(this).parent().parent().attr("data-id");
        fillChildSelect(id);
    })

    $parentEl.on('change', '.el-name', function () {
        let id = jQuery(this).parent().parent().attr("data-id");
        getPrice(id);
    })

    $parentEl.on('input', '.inputCount', function () {
        let id = jQuery(this).parent().parent().parent().parent().attr("data-id");
        let $errorInput = jQuery('.inputCount-' + id);
        harddelete_notify($errorInput);
        getPrice(id);
    })


    // calculate total price
    const getTotalPrice = function () {
        totalPrice = 0;
        $parentEl.find('.row-total').each(function () {
            let temp = parseFloat(jQuery(this).find('span').text());
            totalPrice += temp;
        })
        if (totalPrice > 0) {
            jQuery(".els-total-price-num span").text(totalPrice.toFixed(0));
        } else {
            jQuery(".els-total-price-num span").text("0");
        }

        saveToLS();
    }

    // сохраняем данные в локальное хранилище
    const saveToLS = function () {

        let temp = [];
        let rowsLength = jQuery(".els-row").length;

        for (let i = 1; i <= rowsLength; i++) {
            let $row = jQuery('.els-row-' + i);
            let lsType = $row.find('.el-type option:selected').text(); //Название категории
            let lsName = $row.find('.el-name option:selected').text(); //Название самой радиодетали
            let lsId = $row.find('.el-name option:selected').attr('value').toString(); //ID самой радиодетали
            let lsCount = $row.find('.inputCount').val().toString(); //Кол-во радиодеталей
            let lsTypeOf = $row.find('.typeOfCount').text(); //Мера исчисления (1 - кг, 2 - штуки)
            let lsRowSum = $row.find('.row-total span').text(); //Сумма как (кол-во * меру исчесления)
            if (lsId !== '9999') {
                temp[i - 1] = [lsId, lsType, lsName, lsCount, lsTypeOf, lsRowSum];
            }
        }

        sessionStorage.setItem('order', JSON.stringify(temp)); //превращаем все данные в строку и сохраняем в локальное хранилище

    }

    //Удаление строки из локального хранилища
    const removeFromLS = function (rowID) {
        let items = JSON.parse(sessionStorage.getItem('order'));
        const filteredItems = items.slice(0, rowID - 1).concat(items.slice(rowID, items.length))
        sessionStorage.setItem('order', JSON.stringify(filteredItems));
    }


    //в эту функцию передаем объект из локального хранилища, где из него создаются и заполняются данными строки
    async function getFromLs(lsArr) {
        isLoading(1);
        jQuery(".els-body").addClass("disabled");
        for (const [i, arr] of lsArr.entries()) {
            //вызываем асинхронную функцию создания строки
            jQuery(".loading_text").text("Загружено " + (i + 1) + " из " + lsArr.length);
            await buildRow(arr[0], i + 1, arr[3]);
        }
        //пересчитываем итоговую цену
        await getTotalPrice();
        jQuery(".loading_text").text('');
        jQuery(".els-body").removeClass("disabled");
        isLoading(0);
    }

    //Кнопка ОФОРМИТЬ ЗАЯВКУ. Отсылает все данные на почту (через форму CF7)
    jQuery(".send-btn-wrapper a").on('click', function (e) {
        e.stopPropagation();
    })

    /*Построение строки с данными из локального хранилища*/
    async function buildRow(id, rowCol, col) { //id элемента, rowCol порядковый номер создаваемой строки, col кол-во элементов данного типа
        isLoading(1);
        let $row;
        let catId = 0;
        rowsCount = rowCol

        if (rowCol) {

            if (rowCol > 1) {
                await createRow(rowCol);
                $row = jQuery(".els-row-" + rowCol);
            } else {
                $row = jQuery(".els-row-1");
            }

            await getItemById(id).then(item => {
                $row.find(".el-type").val(item.categories[0].id);
                catId = item.categories[0].id;
            });

            //тут await заполнения второго селекта
            // Проверяем, был ли такой запрос, есть ли объект с данными уже в локальном хранилище
            if (sessionStorage.getItem('category' + catId) !== null) {
                let lsArr = [];

                lsArr = JSON.parse(sessionStorage.getItem('category' + catId));
                $row.find('.el-name').empty();
                for (const [i, arr] of lsArr.entries()) {
                    if (arr[8] !== '999999') {
                        $row.find('.el-name').append(jQuery("<option />")
                            .val(arr[0])
                            .text(arr[2])
                            .attr({
                                'data-g': arr[3],
                                'data-s': arr[4],
                                'data-pt': arr[5],
                                'data-pd': arr[6],
                                'data-counttype': arr[7],
                                'data-fixprice': arr[8],
                            }));
                    }
                }
                $row.find('.el-type').val(catId);
                $row.find('.el-name').val(id).prop('disabled', false).prop('selected', true);
                $row.find('.inputCount').val(col);
            } else {
                await fillChildSelectById(rowCol, catId).then(res => {
                    $row.find('.el-name').val(id).prop('selected', true);
                    $row.find('.inputCount').val(col);
                });
            }

            await getPrice(rowCol);
        }
    }

    async function getItemById(id) {
        try {
            let response = await fetch(`${CONST_HOST}/wp-json/wc/v3/products/${id}?consumer_key=${CONST_CK}&consumer_secret=${CONST_CS}`);
            let item = await response.json();
            isLoading(0);
            return item;
        } catch (err) {
            // перехватит любую ошибку в блоке try: и в fetch, и в response.json
            notify("При получении данных возникла ошибка! (" + err + ")", "error")
        }
    }

    async function fillChildSelectById(rowCol, catId = 0) {
        isLoading(1); //Отображаем лоадер
        let thiscatID = 0;
        let $row = jQuery('.els-row-' + rowCol);
        if (catId > 0) {
            thiscatID = catId;
            $row.find('.el-type').val(catId);
        } else {
            thiscatID = $row.find('.el-type').val(); // получаем ID категории
        }

        let $childDD = $row.find('.el-name'); // получаем ссылку на дочерний селект
        $childDD.prop('disabled', 'disabled'); // блокируем дочерний селект пока идет загрузка
        delete_notify($childDD); // удаляем все сообщения об ошибках и красную обводку с поля

        // запрос на АПИ
        try {
            let response = await fetch(`${CONST_HOST}/wp-json/wc/v3/products?consumer_key=${CONST_CK}&consumer_secret=${CONST_CS}&category=${thiscatID}&per_page=100&status=publish`);
            let item = await response.json();

            isLoading(0);
            $childDD.empty(); // очищаем селект
            for (let key in item) {
                // заполняем селект данными
                if (item.hasOwnProperty(key)) {
                    if (item[key].meta_data[10].value !== '999999') {
                        $childDD.append(jQuery("<option />")
                            .val(item[key].id)
                            .text(item[key].name)
                            .attr({
                                'data-g': item[key].meta_data[0].value,
                                'data-s': item[key].meta_data[2].value,
                                'data-pt': item[key].meta_data[4].value,
                                'data-pd': item[key].meta_data[6].value,
                                'data-counttype': item[key].meta_data[8].value, // 1 это килограммы, 2 это штуки
                                'data-fixprice': item[key].meta_data[10].value,
                            }));
                    }
                }
            }
            $childDD.prop('disabled', false);
            // getPrice(id);
        } catch (err) {
            notify("При получении данных возникла ошибка! (" + err + ")", "error")
        }

    }

    //простая функция добавления строки и заполнения первого селекта
    async function createRow(rowId) {
        delete_notify();

        jQuery(".els-body").append('<div class="els-row els-row-' + rowId + ' collapsed" data-id="' + rowId + '">\n' +
            '        <div class="els-del"></div><div class="el-wrap ew1 sel-wrap">\n' +
            '          <select class="el-type" name="el-type" disabled>\n' +
            '            <option disabled hidden selected value="">Выберите тип элемента</option>\n' +
            '          </select>\n' +
            '        </div>\n' +
            '        <div class="el-wrap ew2 sel-wrap">\n' +
            '          <select class="el-name" name="el-name" disabled>\n' +
            '            <option disabled hidden selected value="">Наименование</option>\n' +
            '          </select>\n' +
            '        </div>\n' +
            '        <div class="el-wrap labeled-input ew3">\n' +
            '          <label>Кол.\n' +
            '            <div class="inputCountWrap"><input  type="number" min="1" value="1" class="inputCount"/><span class="stepper-step up"></span>\n' +
            '<span class="stepper-step down"></span>\n' +
            '</div> <span class="typeOfCount">кг.</span>\n' +
            '          </label>\n' +
            '        </div>\n' +
            '        <div class="el-wrap ew4 labeled-input input-dark to-right">\n' +
            '          <label>Сумма</label>\n' +
            '          <div class="row-total"><span>0</span> ₽</div>\n' +
            '        </div>\n' +
            '      </div>');
        // заполнение родительского селекта уже полученными данными о категориях
        let currentDD = jQuery(".els-row-" + rowId).find(".el-type");
        isLoading(1);
        jQuery.each(categoriesAPI, function () {
            currentDD.append(jQuery("<option />").val(this.id).text(this.name));
        });
        currentDD.prop('disabled', false);

        isLoading(0);
        setTimeout(function () {
            jQuery('.els-row-' + rowId).removeClass("collapsed");
        }, 100);

    }

    //Высчитывание цены
    const getPrice = function (id, countTotal) { //id - номер строки
        let item_price = 0;
        let $row = jQuery('.els-row-' + id);
        let $inputText = $row.find('.inputCount');
        let $childDD = $row.find('.el-name');
        let item_gold = jQuery('option:selected', $childDD).data('g');
        let item_silver = jQuery('option:selected', $childDD).data('s');
        let item_platinum = jQuery('option:selected', $childDD).data('pt');
        let item_palladium = jQuery('option:selected', $childDD).data('pd');
        let ItemTypeOf = jQuery('option:selected', $childDD).data('counttype');
        let FixPrice = jQuery('option:selected', $childDD).data('fixprice');
        let $childTypeOf = $row.find('.typeOfCount'); // получаем ссылку на дочерний селект
        let weight;

        $childTypeOf.text(TYPES[ItemTypeOf - 1]);

        if ($inputText.val()) {
            let tempVal = $inputText.val()
            weight = tempVal.replace(/,/g, '.');
        } else {
            notify("Не указано количество!", "error");
            $inputText.addClass('input-error');
        }
        if (FixPrice > 0) {
            item_price = FixPrice * weight;
        } else {
            item_price = Math.round((item_gold * GOLD * GOLD_DISCOUNT + item_silver * SILVER * SILVER_DISCOUNT + item_platinum * PLATINUM * PLATINUM_DISCOUNT + item_palladium * PALLADIUM * PALLADIUM_DISCOUNT) * USD) * weight;
        }

        if (item_price > 0) {
           //$row.find('.row-total span').text(Math.round((item_price + Number.EPSILON) * 100) / 100);
           $row.find('.row-total span').text(Math.round(item_price));
        } else {
            $row.find('.row-total span').text("0");
        }

        getTotalPrice();

    }

// Добавление новой строки (тут проверка, заполнена ли предыдущая строка)
    const addNewRow = function (selectVal = null) {
        if ((jQuery('.els-row-' + rowsCount).find(".el-name").attr("disabled")) || (jQuery('.els-row-' + rowsCount).find(".el-name option:selected").attr('value').toString() == '9999')) {
            harddelete_notify();
            notify("Заполните все поля!", "error");
            jQuery('.els-row-' + rowsCount).find(".el-name").addClass('input-error');

        } else {
            if (!(jQuery('.els-row-' + rowsCount).find('.inputCount').val())) {
                harddelete_notify();
                notify("Заполните все поля!", "error");
                jQuery('.inputCount-' + rowsCount).find(".el-name").addClass('input-error');
            } else {
                let $errorInput = jQuery('.els-row-' + rowsCount).find(".el-name");
                delete_notify($errorInput);
                rowsCount += 1;
                jQuery(".els-body").append('<div class="els-row els-row-' + rowsCount + ' collapsed" data-id="' + rowsCount + '">\n' +
                    '        <div class="els-del"></div><div class="el-wrap ew1 sel-wrap">\n' +
                    '          <select class="el-type" name="el-type" disabled>\n' +
                    '            <option disabled hidden selected value="">Выберите тип элемента</option>\n' +
                    '          </select>\n' +
                    '        </div>\n' +
                    '        <div class="el-wrap ew2 sel-wrap">\n' +
                    '          <select class="el-name" name="el-name" disabled>\n' +
                    '            <option disabled hidden selected value="">Наименование</option>\n' +
                    '          </select>\n' +
                    '        </div>\n' +
                    '        <div class="el-wrap ew3 labeled-input">\n' +
                    '          <label>Кол.\n' +
                    '            <div class="inputCountWrap"><input  type="number" min="1" value="1" class="inputCount"/><span class="stepper-step up"></span>\n' +
                    '<span class="stepper-step down"></span>\n' +
                    '</div> <span class="typeOfCount">кг.</span>\n' +
                    '          </label>\n' +
                    '        </div>\n' +
                    '        <div class="el-wrap ew4 labeled-input input-dark to-right">\n' +
                    '          <label>Сумма</label>\n' +
                    '          <div class="row-total"><span>0</span> ₽</div>\n' +
                    '        </div>\n' +
                    '      </div>');
                // заполнение родительского селекта уже полученными данными о категориях
                let currentDD = jQuery('.els-row-' + rowsCount).find('.el-type');
                isLoading(1);
                jQuery.each(categoriesAPI, function () {
                    currentDD.append(jQuery("<option />").val(this.id).text(this.name));
                });
                if(selectVal){
                    CheckProjects(selectVal);
                    jQuery('.els-row-' + rowsCount).find("select.el-name").addClass("glow");
                    function sayHi() {
                        jQuery('.els-row-' + rowsCount).find("select.el-name").removeClass("glow");
                    }
                    setTimeout(sayHi, 4000);
                } else {
                    CheckProjects();
                }

                currentDD.prop('disabled', false);
                isLoading(0);
                setTimeout(function () {
                    jQuery('.els-row-' + rowsCount).removeClass("collapsed");
                }, 100);

            }
        }
    }

    jQuery(".el-add-row-btn").on('click', function () {
        addNewRow();
    })

    // Удаление строки
    $parentEl.on('click', '.els-del', function () {
        delete_notify();
        let rowId = jQuery(this).parent().attr("data-id");
        let visibleRowsCount = jQuery('.els-body .els-row').length;

        // Удаление строки
        jQuery(this).parent().remove();

        //Переписывание классов els-row-N, чтобы шли по порядку
        jQuery('.els-body .els-row').each(function (index) {
            jQuery(this).removeClass();
            jQuery(this).addClass("els-row els-row-" + (index + 1));
            jQuery(this).attr('data-id', index + 1);
        })

        removeFromLS(rowId);

        if (visibleRowsCount > 1) {
            jQuery('.els-row:last-child').prepend('<div class="els-del"></div>');
        }
        rowsCount = rowsCount - 1;

        getTotalPrice(); // пересчет итоговой цены
    })


    jQuery(".alertwindow .btn-close").click(function () {
        jQuery(".alertwindow").removeClass("active");
    });

    //Заполняем скрытые поля в форме ContactForm7 данными из локального хранилища
    jQuery('.send-btn-wrapper a.btn-black').on('click', function (e) {
        e.preventDefault();
        let lsArr = JSON.parse(sessionStorage.getItem('order'));
        if (lsArr) {
            jQuery.fancybox.open({
                src: '#popupform',
                type: 'inline',
                opts: {
                    beforeShow: function (instance, current) {
                        jQuery("#restable table").html("");
                        jQuery("#z1").val("");
                        jQuery("#z2").val("");
                        jQuery("#z3").val("");
                        jQuery("#z4").val("");
                        jQuery("#z5").val("");
                        for (const [i, arr] of lsArr.entries()) {
                            jQuery("#z1").val(jQuery("#z1").val() + "_" + arr[1]);
                            jQuery("#z2").val(jQuery("#z2").val() + "_" + arr[2]);
                            jQuery("#z3").val(jQuery("#z3").val() + "_" + arr[3]);
                            jQuery("#z4").val(jQuery("#z4").val() + "_" + arr[4]);
                            jQuery("#z5").val(jQuery("#z5").val() + "_" + arr[5]);
                            jQuery("#restable table").append("<tr><td class='col1'>" + arr[1] + "</td><td class='col2'>" + arr[2] + "</td><td class='col3'>" + arr[3] + " <span class='izm'>" + arr[4] + "</span></td><td class='col4'><span class='sum'>Сумма </span>" + arr[5] + " ₽</td></tr>");
                        }
                        jQuery("#restable table").append("<tr><td colspan='4' class='totalsum'><div><span class='yellow-rounded'>Итого</span> " + jQuery('#els-total-price-num span').text() + " ₽</div></td></tr>");

                    }
                }
            });
        } else {
            return false;
        }
    });


    jQuery(".card a").on('click touch', function () {
        let dataval = parseInt(jQuery(this).attr("data-val"));
        let arr_lom = JSON.parse(jQuery('.opt1').attr('data-vals'));
        let arr_pribor =  JSON.parse(jQuery('.opt2').attr('data-vals'));

        if (arr_lom.indexOf(dataval) !== -1) {
            jQuery(".opt").removeClass("active");
            jQuery(".opt1").addClass("active");
            let $curElsRow = jQuery('.els-row-' + rowsCount);

            if(($curElsRow.find(".el-name option:selected").attr('value')) && ($curElsRow.find(".el-name option:selected").attr('value').toString() != '9999')){
                addNewRow(dataval);
            } else {
                CheckProjects(dataval);
                $curElsRow.find("select.el-name").addClass("glow");
                function sayHi() {
                    $curElsRow.find("select.el-name").removeClass("glow");
                }
                setTimeout(sayHi, 4000);
            }
        } else {
            jQuery(".opt").removeClass("active");
            jQuery(".opt2").addClass("active");
            let $curElsRow = jQuery('.els-row-' + rowsCount);

            if(($curElsRow.find(".el-name option:selected").attr('value')) && ($curElsRow.find(".el-name option:selected").attr('value').toString() != '9999')){
                addNewRow(dataval);
            } else {
                CheckProjects(dataval);
                $curElsRow.find("select.el-name").addClass("glow");
                function sayHi() {
                    $curElsRow.find("select.el-name").removeClass("glow");
                }
                setTimeout(sayHi, 4000);
            }
        }
    });

    jQuery(".btn-uniq-cat-desc").on('click touch', function () {
        jQuery(".calculator").addClass("yellow-glow");
        function sayHi() {
            jQuery(".calculator").removeClass("yellow-glow");
        }
        setTimeout(sayHi, 5000);
    });


    var rellax = new Rellax('.rellax', {
        breakpoints: [320, 1024, 1600]
    });


    /*Прокрутка к блоку*/

        jQuery('a[href^="#"]').bind('click.smoothscroll',function (e) {
            e.preventDefault();
            var target = this.hash,
                $target = jQuery(target);

            if(target === "#main-page--calculator"){
                jQuery(".calculator").addClass("yellow-glow");
                function sayHi() {
                    jQuery(".calculator").removeClass("yellow-glow");
                }
                setTimeout(sayHi, 5000);
            }

            jQuery('html, body').stop().animate( {
                'scrollTop': $target.offset().top-100
            }, 900, 'swing', function () {/*callback*/} );
        } );

        /*степпер для калькулятора*/
        jQuery(".calculator").on('click', '.stepper-step', function (e) {
            let curval = parseFloat(jQuery(this).parent().find("input").val());
          if(e.target.classList[1] === "up"){
                jQuery(this).parent().find("input").val(curval + 1).trigger("input");
          } else {
              if(curval > 1) {
                  jQuery(this).parent().find("input").val(curval - 1).trigger("input");
              }
           }
        });


     /*фильтр селекта*/
    jQuery(".els-filter .opt").on('click', function () {
       jQuery(this).parent().find(".opt").removeClass("active");
        jQuery(this).addClass("active");
        let $curElsRow = jQuery('.els-row-' + rowsCount);
        console.log(rowsCount);
        if(($curElsRow.find(".el-name option:selected").attr('value')) && ($curElsRow.find(".el-name option:selected").attr('value').toString() != '9999')){
            jQuery(".el-add-row-btn").trigger('click');
        } else {
            CheckProjects();
        }
    });

    function CheckProjects(selectVal=null) {
        console.log(rowsCount);
        let $curElsRow = jQuery('.els-row-' + rowsCount);
        let arrVals = JSON.parse(jQuery('.opt.active').attr('data-vals'));

        $curElsRow.find("select.el-type").empty();
        let lastId = 0;
        jQuery.each(categoriesAPI, function (index) {
            if (jQuery.inArray(categoriesAPI[index].id, arrVals) > -1) { //If current project ID is in array of projects
                $curElsRow.find("select.el-type").append(jQuery("<option />").val(categoriesAPI[index].id).text(categoriesAPI[index].name));
                lastId = categoriesAPI[index].id;
            }
        });
        $curElsRow.find("select.el-type").val(lastId).trigger('change');
        console.log(selectVal);
        if(selectVal){

            $curElsRow.find("select.el-type").val(selectVal).prop('selected', true).trigger('change');
        }
    };


    /*categories popup on menu click*/
    $(".ico-mob-catalog").on("click", function () {
        $("#cat_popup_menu").css("display","block");
    });

    $("#cat_popup_menu .close_btn").on("click", function () {
        $("#cat_popup_menu").css("display","none");
    });

});