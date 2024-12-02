$(function () {
    particlesJS.load('particles-js', "./js/particlesjs-config.json");

    function createproductcard(key, value) {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        // 创建图片元素
        const img = document.createElement("img");
        img.src = `img/${value[2]}`;

        // 创建商品名称
        const productName = document.createElement("p");
        productName.classList.add("product-name");
        productName.textContent = `${key}${value[0]}${value[3]}`;

        // 创建价格信息
        const productPrice = document.createElement("p");
        productPrice.classList.add("product-price");
        productPrice.textContent = `NT$${value[1]}`;

        // 创建活动时间
        const eventTime = document.createElement("p");
        eventTime.classList.add("During-the-event");
        eventTime.textContent = `活動時間: ${value[4]}`;

        // 将元素添加到 product-card 中
        productCard.appendChild(img);
        productCard.appendChild(productName);
        productCard.appendChild(productPrice);
        productCard.appendChild(eventTime);

        return productCard;
    }

    function init() {
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:15236",
            data: {
                action: "getproductfromgrouped",
                grouped: "美式咖啡"
            },
            dataType: "json",
            success: function (response) {
                const productContainer = document.querySelector("#info .product-grid");
                productContainer.innerHTML = "";
                Object.keys(response["product_info"]).forEach(key => {
                    const value = response["product_info"][key];
                    let html = createproductcard(key, value);
                    productContainer.appendChild(html);
                });
            }, error: function (err) {
                alert("伺服器發生問題請稍後在試");
            }
        });
    }

    // $("#product-grid").on("click", ".product-card", function () {
    //     const product = $(this).find('.product-name').text().trim();
    //     const current_grouped = $("#info .navbar .current").text();
    //     $.ajax({
    //         type: "POST",
    //         url: "http://127.0.0.1:15236",
    //         data: {
    //             action: "payforproduct",
    //             product: product,
    //             current_grouped: current_grouped,
    //         },
    //         dataType: "json",
    //         success: function (response) {
    //             console.log('Product purchased successfully:', response);
    //             window.open(response.paylink, "_self");
    //         }, error: function (err) {
    //             alert("伺服器發生問題請稍後在試");
    //         }
    //     });
    // });

    $(window).scroll(function () {
        let st = $(this).scrollTop();
        if (st >= 1000) {
            $("#info .navbar").css("position", "fixed");
            $("#info .navbar").addClass("ani");
        } else if (st < 1000) {
            $("#info .navbar").css("position", "absolute");
            $("#info .navbar").removeClass("ani");
        }
    });


    $("#info .navbar ul li").click(function () {
        const text = $(this).text();
        $("#info .navbar ul li").removeClass("current");
        $(this).addClass("current");

        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:15236",
            data: {
                action: "getproductfromgrouped",
                grouped: text
            },
            dataType: "json",
            success: function (response) {
                const productContainer = document.querySelector("#info .product-grid");
                productContainer.innerHTML = "";
                Object.keys(response["product_info"]).forEach(key => {
                    const value = response["product_info"][key];
                    let html = createproductcard(key, value);
                    productContainer.appendChild(html);
                });
            }, error: function (err) {
                alert("伺服器發生問題請稍後在試");
            }
        });
    });

    $('#product-grid .product-card').on('click', ".product-card", function () {
        let selectedMethod = null; // 当前选择状态

        // 弹出 SweetAlert2
        Swal.fire({
            title: '選擇付款方式',
            html: `
            <div id="payment-options">
              <button id="counter-payment" class="payment-method">臨櫃付款</button>
              <button id="line-pay" class="payment-method">Line Pay</button>
            </div>
            <style>
              #payment-options {
                display: flex;
                justify-content: space-around;
                margin: 20px 0;
              }
              .payment-method {
                padding: 10px 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
                cursor: pointer;
                background-color: #f9f9f9;
                transition: background-color 0.3s, color 0.3s;
              }
              .payment-method.selected {
                background-color: #007bff;
                color: #fff;
                border-color: #007bff;
              }
            </style>
          `,
            showCancelButton: true,
            confirmButtonText: '確認',
            cancelButtonText: '取消',
            didOpen: () => {
                // 添加点击事件监听器
                $('#counter-payment').on('click', function () {
                    $('.payment-method').removeClass('selected'); // 移除所有选择状态
                    $(this).addClass('selected'); // 为当前按钮添加选择状态
                    selectedMethod = '臨櫃付款';
                });

                $('#line-pay').on('click', function () {
                    $('.payment-method').removeClass('selected'); // 移除所有选择状态
                    $(this).addClass('selected'); // 为当前按钮添加选择状态
                    selectedMethod = 'Line Pay';
                });
            }
        }).then((result) => {
            if (result.isConfirmed) {
                if (selectedMethod) {
                    Swal.fire(`您選擇了: ${selectedMethod}`);
                } else {
                    Swal.fire('請選擇付款方式');
                }
            }
        });
    });

    init();
});