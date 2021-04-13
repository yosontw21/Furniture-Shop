// 串接API資訊
const api_path = 'yosontw';
const token = 'QMfXRUIXEth2UZXtzGC5QuCIiYt2';

// 綁定DOM
const productList = document.querySelector('.productList');
const productCategory = document.querySelector('.productCategory');
const cartList = document.querySelector('.cartList');
const jsCartSum = document.querySelector('.jsCartSum');

// 產品資訊
let productData = [];
// 購物車資訊
let cartData = [];

// 取得產品列表
const getProductList = () => {
  axios
    .get(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/products`
    )
    .then((res) => {
      productData = res.data.products;
      renderProductList(productData);
    })
    .catch((error) => {
      console.log(error);
    });
};

// 渲染資料
const renderProductList = (productData) => {
  let str = '';
  productData.forEach((items) => {
    str += `<li class="col-md-3 position-relative mb-7 ">

      <img src="${items.images}" alt="" class="bg-cover w-100" style="height: 302px;">

    <div class="card-product">新品</div>
    <input type="button" class="addCartProduct w-100 py-3 text-white text-center mb-2" data-id="${items.id}" value="加入購物車">
    <div>
      <h3 class="font-md">${items.title}</h3>
      <del class="font-md">NT$${items.origin_price}</del>
      <p class="font-xl">NT$${items.price}</p>
    </div>
  </li>`;
  });
  productList.innerHTML = str;
};

// 篩選產品
productCategory.addEventListener(
  'change',
  (selectProduct = (e) => {
    let singleData = [];
    let category = e.target.value;
    productData.forEach((items) => {
      if (category == '全部') {
        renderProductList(productData);
      }
      if (category == items.category) {
        singleData.push(items);
        renderProductList(singleData);
      }
    });
  })
);

// 取得購物車列表
const getCartList = () => {
  axios
    .get(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`
    )
    .then((res) => {
      cartData = res.data.carts;
      let str = '';
      let productSum = 0; // 單筆商品購物車初始化
      let cartAllSum = 0; // 所有購物車初始化
      cartData.forEach((items) => {
        productSum = parseInt(`${items.product.price}` * `${items.quantity}`); // 單筆商品購物車加總
        cartAllSum += productSum; // 所有購物車加總
        let cartDataInfo = `<tbody>
        <tr>
          <td>
            <div class="d-flex align-items-center">
              <img src="${items.product.images}" alt="" class="mr-4" style="width: 80px; height: 80px;">
              <p>${items.product.title}</p>
            </div>
          </td>
          <td>NT$${items.product.price}</td>
          <td>
          <div class="d-flex align-items-center">
            <a href="" class="icon-edit material-icons mr-2 font-weight-bold"  data-id="${items.id}">remove<a>
                ${items.quantity}
                <a href="" class="icon-edit material-icons ml-2 font-weight-bold" data-id="${items.id}">add</a>
          </div>
        </td>
          <td>NT$${productSum}</td>
          <td class="delcardBtn text-center">

            <a href="" class="material-icons" data-id="${items.id}">clear</a>
          </td>
        </tr>
      </tbody>`;
        str += cartDataInfo;
      });
      cartList.innerHTML = str;
      jsCartSum.textContent = `NT$${cartAllSum}`;
    })
    .catch((error) => {
      console.log(error);
    });
};

// 加入購物車
productList.addEventListener('click', (e) => {
  let addCartClass = e.target.nodeName;
  if (addCartClass !== 'INPUT') {
    return;
  }
  let productId = e.target.getAttribute('data-id');
  addCartItem(productId);
});
const addCartItem = (id) => {
  let numCheck = 1;

  cartData.forEach((items) => {
    if (items.product.id === id) {
      numCheck = items.quantity += 1;
    }
  });

  axios
    .post(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`,
      {
        data: {
          productId: id,
          quantity: numCheck,
        },
      }
    )
    .then((res) => {
      alert('加入購物車成功');
      console.log(res);
      getCartList();
    })
    .catch((error) => {
      console.log(error);
    });
};

// 刪除、修改數量購物車內的特定產品
cartList.addEventListener('click', (e) => {
  // 刪除購物車單筆數量
  e.preventDefault();
  let cartId = e.target.getAttribute('data-id');
  console.log(e.target.textContent);
  if (e.target.textContent === 'clear') {
    deleteSingleCart(cartId);
  }
  // 增加購物車數量
  if (e.target.textContent === 'add') {
    let numCart = 1;
    cartData.forEach((items) => {
      if (items.id === cartId) {
        numCart = items.quantity += 1;
      }
    });
    deitCartItemQty(cartId, numCart);
  }
  // 減少購物車數量
  if (e.target.textContent === 'remove') {
    let numCart = 1;
    cartData.forEach((items) => {
      if (items.id === cartId) {
        numCart = items.quantity -= 1;
      }
    });
    if (numCart < 1) {
      alert('商品數量不能少於1');
      return;
    }
    deitCartItemQty(cartId, numCart);
  }
});
// 編輯購物車產品數量
const deitCartItemQty = (cartId, numCart) => {
  axios
    .patch(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`,
      {
        headers: {
          Authorization: token,
        },
        data: {
          id: cartId,
          quantity: numCart,
        },
      }
    )
    .then((res) => {
      cartData = res.data.carts;
      getCartList(cartData);
    })
    .catch((error) => {
      console.log(error);
    });
};

// 刪除購物車單筆資料
const deleteSingleCart = (cartId) =>
  axios
    .delete(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts/${cartId}`
    )
    .then((res) => {
      alert('刪除資料成功');
      getCartList();
    })
    .catch((error) => {
      console.log(error);
    });

// 清除購物車內全部產品
const delOrderAllBtn = document.querySelector('.delOrderAllBtn');
delOrderAllBtn.addEventListener('click', (e) => {
  e.preventDefault();
  axios
    .delete(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`,
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((res) => {
      alert('刪除全部購物車成功');
      getCartList();
    })
    .catch((error) => {
      console.log(error);
      alert('目前你尚未加入購物車品項');
    });
});

// 綁定表單 DOM
const orderName = document.querySelector('.orderName');
const orderTel = document.querySelector('.orderTel');
const orderEmail = document.querySelector('.orderEmail');
const orderAddress = document.querySelector('.orderAddress');
const orderPayment = document.querySelector('.orderPayment');
const form = document.querySelector('form');

// 送出購買訂單
const orderListInfo = document.querySelector('.orderListInfo');
orderListInfo.addEventListener('click', (e) => {
  let cartLength = document.querySelectorAll('.cartList tr').length;
  if (cartLength == 0) {
    alert('請加入至少一個購物車商品');
    return;
  }
  if (
    orderName.value == '' ||
    orderTel.value == '' ||
    orderEmail.value == '' ||
    orderAddress.value == ''
  ) {
    alert('請輸入訂單資訊！');
    return;
  }
  let data = {
    name: orderName.value,
    tel: orderTel.value,
    email: orderEmail.value,
    address: orderAddress.value,
    payment: orderPayment.value,
  };
  createOrder(data);
});
const createOrder = (items) => {
  axios
    .post(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/orders`,
      {
        data: {
          user: {
            name: items.name,
            tel: items.tel,
            email: items.email,
            address: items.address,
            payment: items.payment,
          },
        },
      }
    )
    .then((res) => {
      alert('訂單建立成功!');
      getCartList();
      form.reset();
    })
    .catch((error) => {
      console.log(error);
    });
};

// 網頁初始化
const init = () => {
  getProductList();
  getCartList();
};
init();
