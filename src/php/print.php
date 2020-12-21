<?php
/*
Template Name: Скачать каталог
*/
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
get_header(); ?>

    <div class="in">

        <div style="position: fixed; opacity: 0.0; pointer-events: none;">
            <div  id="tabletext">

                <?php

                $args = array(
                    'orderby'   => 'title',
                    'order'     => 'ASC',
                );

                $product_categories = get_terms( 'product_cat', $args );

                $count = count($product_categories);
                echo "<table id='table' data-pdfmake='{&quot;widths&quot;:[&quot;auto&quot;,100,70]}'>";
                echo "<tr class='heading'><td style='text-align: left; border: none !important; padding-bottom: 20px;' bordercolor='white'><span style='font-size:32px; font-weight:bold;'>СХЕМАТИКА</span><br/>Внимание! Цены действительны на: ".date('d-m-Y')." </td><td class='heading-right' colspan='2' bordercolor='white' style='text-align: right !important; border: none !important;' align='right'>Москва, Маршала Бирюзова,&nbsp;8 корпус&nbsp;1. Метро Октябрьское поле<br/>8 985 470 88 00<br/>moscow@sxematika.ru</td></tr>";

                //echo "<tr><th style='text-align:center;'>".date('d-m-Y')."</th></tr>";
                if ( $count > 0 ){
                    foreach ( $product_categories as $product_category ) {
                        if($product_category->name != "Uncategorized" ){
                            echo '<tr><th colspan="3">' . $product_category->name . '</th></tr>';
                            $args = array(
                                'posts_per_page' => -1,
                                'tax_query' => array(
                                    'relation' => 'AND',
                                    array(
                                        'taxonomy' => 'product_cat',
                                        'field' => 'slug',
                                        'terms' => $product_category->slug
                                    )
                                ),
                                'post_type' => 'product',
                                'orderby' => 'title,'
                            );

                            $products = new WP_Query( $args );
                            // echo "<tr><td><table class='print--ul'>";
                            while ( $products->have_posts() ) {
                                $products->the_post();
                                ?>
                                <tr class="print--ul">
                                    <?php// echo get_the_post_thumbnail($id, 'thumbnail'); ?>
                                    <td width="100%">
                                        <?php the_title(); ?>
                                    </td>
                                    <td class="td--price">
                                        <em class="hidden_params">
                                            <span class="item--gold"><?php the_field('gold'); ?></span>
                                            <span class="item--silver"><?php the_field('silver'); ?></span>
                                            <span class="item--platinum"><?php the_field('platinum'); ?></span>
                                            <span class="item--palladium"><?php the_field('palladium'); ?></span>
                                            <span class="item--fixprice"><?php the_field('fixprice'); ?></span>
                                            <span class="item--typeofcount"><?php the_field('typecount'); ?></span>
                                        </em>
                                        <span class="price"><b class="price_value"></b> руб.</span>
                                    </td>
                                    <td class="td--typeof">за <span class="itemcount"></span></td>
                                </tr>
                                <?php
                            }
                            // echo "</table></td></tr>";
                        }
                    }
                }
                echo "</table>";
                ?>
            </div>
        </div>
        <h1>Прайс-лист на <?php echo date('d.m.Y');?></h1>

        <div class="hintbox">
            <div class="hintbox-text"><span class="ico-alert">!</span>Обращаем Ваше внимание, что цены, представленные на сайте не являются публичной офертой. Цены на драгоценные металлы обновляются ежедневно и будут применяться актуальные на день заключения сделки.</div>
        </div>

        <div class="alert--wrapper"></div>
        <div id="printtable"><table></table></div>
        <div class="price_btn_wrapper"><button class="savetojpg btn btn-secondary btn-big" id="btn-Convert-Html2Image" style="cursor:pointer;" onclick="ym(66624295,'reachGoal','price'); return true;">Скачать прайс</button><a href="#" onclick="ym(66624295,'reachGoal','print1'); return true;" class="btn btn-primary btn-big" id="print_all">Распечатать</a></div>

        <div class="separator"></div>
    </div>

    <script>

        /********/
        /*https://pdfmake.github.io/docs/0.1/document-definition-object/tables/*/
        /*https://github.com/Aymkdn/html-to-pdfmake#default-styles*/


        $(document).ready(function () {
            $("#btn-Convert-Html2Image").on('click', function () {

                $(this).prop('disabled', true);
                $(".alert--wrapper").html("<div class='alert process'><span>Подготовка прайс листа...</span></div>")
                setTimeout(function () {
                    let element = document.getElementById("tabletext").innerHTML;
                    let today = new Date();
                    let date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();

                    var val = htmlToPdfmake(element);
                    var dd = {
                        content: val,
                        styles: {
                            'html-em': {
                                color: 'white', // it will add a yellow background to all <STRONG> elements
                                fontSize: 0
                            },
                            'td--typeof': {
                                width: 100
                            },
                            'td--price': {
                                width: 200,
                                textAlign: 'right',
                                whiteSpace: 'nowrap'
                            },
                            'heading-right': {
                                width: 300,
                                whiteSpace: 'nowrap',
                                textAlign: 'right',
                                marginBottom: 15
                            }
                        },
                        tableAutoSize: true,
                        watermark: {text: 'sxematika.ru', color: '#0bbc93', opacity: 0.2, bold: true, italics: false}
                    };
                    pdfMake.createPdf(dd).download('price(' + date + ').pdf', function () {
                        $(this).prop('disabled', false);
                        $(".alert--wrapper").html("");
                    });
                }, 200)

            });



        });
    </script>


<?php
get_footer();




