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

    /* Add fancybox to product img */
    if (jQuery(".catalog--products").length > 0) {
        jQuery(".catalog--products-ul .product img.attachment-woocommerce_thumbnail").on('click', function () {
            jQuery.fancybox.open({
                src: jQuery(this).attr('src'),
                type: 'image',
                toolbar: false,
                beforeShow: function (instance, current) {
                    jQuery(".fancybox-toolbar").css("display", "none");
                },
                afterShow: function (instance, current) {
                    jQuery(".fancybox-content").prepend("<div class='fancy_close'><svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1\" viewBox=\"0 0 24 24\"><path d=\"M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z\"></path></svg></div>");
                    jQuery(".fancy_close").on('click', function () {
                        instance.close();
                    })
                },
                clickContent: 'close',
                clickSlide: "close",
                buttons: ['close'],
                touch: false
                //fancybox-content
            });
        });

        //Высчитываем цену товара, данные для цены выводим с помощью php и ACF
        jQuery(".catalog--products-ul .product").each(function () {
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
                    jQuery(this).find(".title").text("Цена договорная");
                    jQuery(this).find(".price").css("display", "none");
                    jQuery(this).find(".btn-put-to-storage").css("display", "none");
                    jQuery(this).find(".product--input-w").css("display", "none");
                } else {
                    jQuery(this).find(".price .price_value").text(item_fixprice);
                    jQuery(this).find(".row-total span").text(item_fixprice);
                }
            } else {
                // З -40%, С -30%, Пл -30%, Пал -30%
                item_price = (item_gold * GOLD * GOLD_DISCOUNT + item_silver * SILVER * SILVER_DISCOUNT + item_platinum * PLATINUM * PLATINUM_DISCOUNT + item_palladium * PALLADIUM * PALLADIUM_DISCOUNT) * USD;
                // З -50%, С -35%, Пл -30%, Пал -35% (ост города)
                jQuery(this).find(".price .price_value").text((Math.round(item_price + Number.EPSILON) * 1));
                jQuery(this).find(".row-total span").text((Math.round(item_price + Number.EPSILON) * 1));
            }
            jQuery(this).find(".itemcount").text(TYPES[item_typecount - 1]);
        })
    }



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
                jQuery(this).find(".price .price_value").text(Math.round((item_price + Number.EPSILON) * 1));
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

    if (jQuery(".calculator").length) {
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
    };

    //run function on dynamic els
    $parentEl.on('change', '.el-type', function () {
        let id = jQuery(this).parent().parent().attr("data-id");
        fillChildSelect(id);
    });

    $parentEl.on('change', '.el-name', function () {
        let id = jQuery(this).parent().parent().attr("data-id");
        getPrice(id);
    });

    $parentEl.on('input', '.inputCount', function () {
        let id = jQuery(this).parent().parent().parent().parent().attr("data-id");
        let $errorInput = jQuery('.inputCount-' + id);
        harddelete_notify($errorInput);
        getPrice(id);
    });


    // calculate total price
    const getTotalPrice = function () {
        totalPrice = 0;
        $parentEl.find('.row-total').each(function () {
            let temp = parseFloat(jQuery(this).find('span').text());
            totalPrice += temp;
        });
        if (totalPrice > 0) {
            jQuery(".els-total-price-num span").text(totalPrice.toFixed(0));
        } else {
            jQuery(".els-total-price-num span").text("0");
        }

        saveToLS();
    };

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

    };

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
    });

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
    });


    //Добавление в калькулятор данных с карточки товара
    jQuery(".btn-put-to-storage a").on("click", function (e) {
        /*if ($(this).hasClass("added")) {
            e.preventDefault();
            return false;
        } else {*/
            e.preventDefault();
            let curSS = JSON.parse(sessionStorage.getItem('order'));
            let temp = [];

            let lsType = jQuery('.category--header h1').text(); //Название категории
            let lsName = jQuery(this).parent().parent().parent().find('.woocommerce-loop-product__title').text(); //Название самой радиодетали
            let lsId = jQuery(this).parent().parent().parent().parent().find('.item--id').text(); //ID самой радиодетали
            let lsCount = jQuery(this).parent().parent().parent().find('.inputCount').val(); //Кол-во радиодеталей
            let lsTypeOf = jQuery(this).parent().parent().parent().find('.itemcount').text(); //Мера исчисления (1 - кг, 2 - штуки)
            let lsRowSum = jQuery(this).parent().parent().parent().parent().find('.row-total span').text(); //Сумма

            if (curSS) {
                temp = [lsId, lsType, lsName, lsCount, lsTypeOf, lsRowSum];

                curSS.forEach((element, index) => {
                    if(element[0] === lsId){
                        console.log(element);
                        curSS.splice(index,1);

                    }
                });

                curSS.push(temp);
                sessionStorage.setItem('order', JSON.stringify(curSS));
                jQuery(this).parent().parent().parent().parent().find(".alertwindow").addClass("active");
            } else {
                temp[0] = [lsId, lsType, lsName, lsCount, lsTypeOf, lsRowSum];
                sessionStorage.setItem('order', JSON.stringify(temp));
                jQuery(this).parent().parent().parent().parent().find(".alertwindow").addClass("active");
            }
            setTimeout(function () {
                jQuery(".alertwindow").removeClass("active");
            }, 2000);
            updateList();

            //saveToLS();

            /* ToDo
                Показать алерт, что товар добавлен в список
            */

            //$(this).addClass("added").text("Добавлено!");
       /* }*/
    });

    jQuery("body").on("click", ".alertwindow", function () {
        jQuery(this).removeClass("active");
    });

    /*подсчет суммы для карточки товара*/
    jQuery(".catalog--products-ul .product").on('input', '.inputCount', function () {
        let itemCol = jQuery(this).val();
        let itemPrice = jQuery(this).parent().parent().parent().parent().parent().find(".price_value").text();
        jQuery(this).parent().parent().parent().parent().find(".row-total span").text(itemPrice * itemCol);
    });


    jQuery(".alertwindow .btn-close").click(function () {
        jQuery(".alertwindow").removeClass("active");
    });

    //Заполняем скрытые поля в форме ContactForm7 данными из локального хранилища
    jQuery('.send-btn-wrapper a.btn-black, .block_list a.btn-black').on('click', function (e) {
        e.preventDefault();
        let lsArr = JSON.parse(sessionStorage.getItem('order'));
        if (lsArr) {
            jQuery.fancybox.open({
                src: '#popupform',
                type: 'inline',
                opts: {
                    beforeShow: function (instance, current) {
                        let totalSum = 0;
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
                            totalSum += Math.round(arr[5]);
                        }
                        jQuery("#restable table").append("<tr><td colspan='4' class='totalsum'><div><span class='yellow-rounded'>Итого</span> " + totalSum + " ₽</div></td></tr>");
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
        //let arr_pribor =  JSON.parse(jQuery('.opt2').attr('data-vals'));
        let $curElsRow = jQuery('.els-row-' + rowsCount);

        if (arr_lom.indexOf(dataval) !== -1) {
            jQuery(".opt").removeClass("active");
            jQuery(".opt1").addClass("active");

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
    });



    /*степпер для калькулятора*/
    jQuery("body").on('click', ".stepper-step", function (e) {
      let curval = parseFloat(jQuery(this).parent().find("input").val());
      console.log(curval);
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
       // console.log(rowsCount);
        if(($curElsRow.find(".el-name option:selected").attr('value')) && ($curElsRow.find(".el-name option:selected").attr('value').toString() != '9999')){
            jQuery(".el-add-row-btn").trigger('click');
        } else {
            CheckProjects();
        }
    });

    function CheckProjects(selectVal=null) {
        //console.log(rowsCount);
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
    }


    /*categories popup on menu click*/
    jQuery(".mob-catalog").on("click", function () {
        jQuery("#cat_popup_menu").css("display","block");
        jQuery(".popup_layout").addClass("active");
    });

    jQuery("#cat_popup_menu .close_btn").on("click", function () {
        jQuery("#cat_popup_menu").css("display","none");
        jQuery(".popup_layout").removeClass("active");
    });

    jQuery(".popup_layout").on("click", function () {
        jQuery("#cat_popup_menu").css("display","none");
        jQuery(".popup_layout").removeClass("active");
    });

    function updateList(){
        let lsArr = [];
        let totalCount = 0;
        let totalPrice = 0;
        if (sessionStorage.getItem('order') !== null) {
            lsArr = JSON.parse(sessionStorage.getItem('order'));
            for (const [i, arr] of lsArr.entries()) {
                totalCount += 1;
                totalPrice += Math.round(arr[5]);
            }
        }
        jQuery(".list_total_count").text(totalCount);
        jQuery(".list_total_sum").text(totalPrice);
    }

    if(jQuery(".block_list").length){
        jQuery(".left_menu ul li").each(function () {
            if(jQuery(this).find("a").attr("href") === window.location.pathname){
                jQuery(this).addClass("active");
            }
        });
        updateList();
    }


    jQuery('.block_list').portamento({wrapper: jQuery('#portamento_wrapper')});


    jQuery(".sellnow").click(function () {
        jQuery("textarea#mytext").text("Здравствуйте! Я хочу продать: " + jQuery(this).parent().parent().parent().find(".woocommerce-loop-product__title").text());
    });

    jQuery('.send-btn-wrapper a.btn-secondary').on('click', function (e) {
        e.preventDefault();
        let lsArr = JSON.parse(sessionStorage.getItem('order'));
        if (lsArr) {
            jQuery.fancybox.open({
                src: '#sendMSG',
                type: 'inline',
                opts: {
                    beforeShow: function (instance, current) {

                    }
                }
            });
        } else {
            return false;
        }
        /*
    */
    });


/*
* Todo
* Если в калькулятор добавить сначала приборы, то потом он глючит и не выводит категорию для приборов
* */




});


/*
main.js
main.css
imgs/
archive-product
woocommerce/
header.php
footer.php
*/


/*!
 *
 * Portamento  v1.1.1 - 2011-09-02
 * http://simianstudios.com/portamento
 *
 * Copyright 2011 Kris Noble except where noted.
 *
 * Dual-licensed under the GPLv3 and Apache 2.0 licenses:
 * http://www.gnu.org/licenses/gpl-3.0.html
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
/**
 *
 * Creates a sliding panel that respects the boundaries of
 * a given wrapper, and also has sensible behaviour if the
 * viewport is too small to display the whole panel.
 *
 * Full documentation at http://simianstudios.com/portamento
 *
 * ----
 *
 * Uses the viewportOffset plugin by Ben Alman aka Cowboy:
 * http://benalman.com/projects/jquery-misc-plugins/#viewportoffset
 *
 * Uses a portion of CFT by Juriy Zaytsev aka Kangax:
 * http://kangax.github.com/cft/#IS_POSITION_FIXED_SUPPORTED
 *
 * Uses code by Matthew Eernisse:
 * http://www.fleegix.org/articles/2006-05-30-getting-the-scrollbar-width-in-pixels
 *
 * Builds on work by Remy Sharp:
 * http://jqueryfordesigners.com/fixed-floating-elements/
 *
 */
(function($){

    $.fn.portamento = function(options) {

        // we'll use the window and document objects a lot, so
        // saving them as variables now saves a lot of function calls
        var thisWindow = $(window);
        var thisDocument = $(document);

        /**
         * NOTE by Kris - included here so as to avoid namespace clashes.
         *
         * jQuery viewportOffset - v0.3 - 2/3/2010
         * http://benalman.com/projects/jquery-misc-plugins/
         *
         * Copyright (c) 2010 "Cowboy" Ben Alman
         * Dual licensed under the MIT and GPL licenses.
         * http://benalman.com/about/license/
         */
        $.fn.viewportOffset = function() {
            var win = $(window);
            var offset = $(this).offset();

            return {
                left: offset.left - win.scrollLeft(),
                top: offset.top - win.scrollTop()
            };
        };

        /**
         *
         * A test to see if position:fixed is supported.
         * Taken from CFT by Kangax - http://kangax.github.com/cft/#IS_POSITION_FIXED_SUPPORTED
         * Included here so as to avoid namespace clashes.
         *
         */
        function positionFixedSupported () {
            var container = document.body;
            if (document.createElement && container && container.appendChild && container.removeChild) {
                var el = document.createElement("div");
                if (!el.getBoundingClientRect) {
                    return null;
                }
                el.innerHTML = "x";
                el.style.cssText = "position:fixed;top:100px;";
                container.appendChild(el);
                var originalHeight = container.style.height, originalScrollTop = container.scrollTop;
                container.style.height = "3000px";
                container.scrollTop = 500;
                var elementTop = el.getBoundingClientRect().top;
                container.style.height = originalHeight;
                var isSupported = elementTop === 100;
                container.removeChild(el);
                container.scrollTop = originalScrollTop;
                return isSupported;
            }
            return null;
        }

        /**
         *
         * Get the scrollbar width by Matthew Eernisse.
         * http://www.fleegix.org/articles/2006-05-30-getting-the-scrollbar-width-in-pixels
         * Included here so as to avoid namespace clashes.
         *
         */
        function getScrollerWidth() {
            var scr = null;
            var inn = null;
            var wNoScroll = 0;
            var wScroll = 0;

            // Outer scrolling div
            scr = document.createElement('div');
            scr.style.position = 'absolute';
            scr.style.top = '-1000px';
            scr.style.left = '-1000px';
            scr.style.width = '100px';
            scr.style.height = '50px';
            // Start with no scrollbar
            scr.style.overflow = 'hidden';

            // Inner content div
            inn = document.createElement('div');
            inn.style.width = '100%';
            inn.style.height = '200px';

            // Put the inner div in the scrolling div
            scr.appendChild(inn);
            // Append the scrolling div to the doc
            document.body.appendChild(scr);

            // Width of the inner div sans scrollbar
            wNoScroll = inn.offsetWidth;
            // Add the scrollbar
            scr.style.overflow = 'auto';
            // Width of the inner div width scrollbar
            wScroll = inn.offsetWidth;

            // Remove the scrolling div from the doc
            document.body.removeChild(document.body.lastChild);

            // Pixel width of the scroller
            return (wNoScroll - wScroll);
        }

        // ---------------------------------------------------------------------------------------------------

        // get the definitive options
        var opts = $.extend({}, $.fn.portamento.defaults, options);

        // setup the vars accordingly
        var panel = this;
        var wrapper = opts.wrapper;
        var gap = opts.gap;
        var disableWorkaround = opts.disableWorkaround;
        var fullyCapableBrowser = positionFixedSupported();

        if(panel.length != 1) {
            // die gracefully if the user has tried to pass multiple elements
            // (multiple element support is on the TODO list!) or no elements...
            return this;
        }

        if(!fullyCapableBrowser && disableWorkaround) {
            // just stop here, as the dev doesn't want to use the workaround
            return this;
        }

        // wrap the floating panel in a div, then set a sensible min-height and width
        panel.wrap('<div id="portamento_container" />');
        var float_container = $('#portamento_container');
        float_container.css({
            'min-height': panel.outerHeight(),
            'width': panel.outerWidth()
        });

        // calculate the upper scrolling boundary
        var panelOffset = panel.offset().top;
        var panelMargin = parseFloat(panel.css('marginTop').replace(/auto/, 0));
        var realPanelOffset = panelOffset - panelMargin;
        var topScrollBoundary = realPanelOffset - gap;

        // a couple of numbers to account for margins and padding on the relevant elements
        var wrapperPaddingFix = parseFloat(wrapper.css('paddingTop').replace(/auto/, 0));
        var containerMarginFix = parseFloat(float_container.css('marginTop').replace(/auto/, 0));

        // do some work to fix IE misreporting the document width
        var ieFix = 0;

        var isMSIE = /*@cc_on!@*/0;

        if (isMSIE) {
            ieFix = getScrollerWidth() + 4;
        }

        // ---------------------------------------------------------------------------------------------------

        thisWindow.bind("scroll.portamento", function () {

            if(thisWindow.height() > panel.outerHeight() && thisWindow.width() >= (thisDocument.width() - ieFix)) { // don't scroll if the window isn't big enough

                var y = thisDocument.scrollTop(); // current scroll position of the document

                if (y >= (topScrollBoundary)) { // if we're at or past the upper scrolling boundary
                    if((panel.innerHeight() - wrapper.viewportOffset().top) - wrapperPaddingFix + gap >= wrapper.height()) { // if we're at or past the bottom scrolling boundary
                        if(panel.hasClass('fixed') || thisWindow.height() >= panel.outerHeight()) { // check that there's work to do
                            panel.removeClass('fixed');
                            panel.css('top', (wrapper.height() - panel.innerHeight()) + 'px');
                        }
                    } else { // if we're somewhere in the middle
                        panel.addClass('fixed');

                        if(fullyCapableBrowser) { // supports position:fixed
                            panel.css('top', gap + 'px'); // to keep the gap
                        } else {
                            panel.clearQueue();
                            panel.css('position', 'absolute').animate({top: (0 - float_container.viewportOffset().top + gap)});
                        }
                    }
                } else {
                    // if we're above the top scroll boundary
                    panel.removeClass('fixed');
                    panel.css('top', '0'); // remove any added gap
                }
            } else {
                panel.removeClass('fixed');
            }
        });

        // ---------------------------------------------------------------------------------------------------

        thisWindow.bind("resize.portamento", function () {
            // stop users getting undesirable behaviour if they resize the window too small
            if(thisWindow.height() <= panel.outerHeight() || thisWindow.width() < thisDocument.width()) {
                if(panel.hasClass('fixed')) {
                    panel.removeClass('fixed');
                    panel.css('top', '0');
                }
            } else {
                thisWindow.trigger('scroll.portamento'); // trigger the scroll event to place the panel correctly
            }
        });

        // ---------------------------------------------------------------------------------------------------

        thisWindow.bind("orientationchange.portamento", function () {
            // if device orientation changes, trigger the resize event
            thisWindow.trigger('resize.portamento');
        });

        // ---------------------------------------------------------------------------------------------------

        // trigger the scroll event immediately so that the panel is positioned correctly if the page loads anywhere other than the top.
        thisWindow.trigger('scroll.portamento');

        // return this to maintain chainability
        return this;
    };

    // set some sensible defaults
    $.fn.portamento.defaults = {
        'wrapper'				: $('body'), // the element that will act as the sliding panel's boundaries
        'gap'					: 10, // the gap (in pixels) left between the top of the viewport and the top of the panel
        'disableWorkaround' 	: false // option to disable the workaround for not-quite capable browsers
    };

})(jQuery);