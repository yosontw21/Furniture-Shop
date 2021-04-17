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
      console.log(productData);
    })
    .catch((error) => {
      console.log(error);
    });
};

// 渲染資料
const renderProductList = (productData) => {
  let str = '';
  productData.forEach((items) => {
    let productListInfo = `<li class="col-md-3 position-relative mb-7 ">

    <img src="${
      items.images
    }" alt="" class="bg-cover w-100" style="height: 302px;">

  <div class="card-product">新品</div>
  <input type="button" class="addCartProduct w-100 py-3 text-white text-center mb-2" data-id="${
    items.id
  }" value="加入購物車">
  <div>
    <h3 class="font-md">${items.title}</h3>
    <del class="font-md">NT$${toThousand(items.origin_price)}</del>
    <p class="font-xl">NT$${toThousand(items.price)}</p>
  </div>
</li>`;
    str += productListInfo;
  });
  productList.innerHTML = str;
};

// 篩選產品
productCategory.addEventListener('change', (e) => {
  let singleData = [];
  productData.forEach((items) => {
    if (e.target.value == items.category) {
      singleData.push(items);
      renderProductList(singleData);
    }
    if (e.target.value == '全部') {
      renderProductList(productData);
    }
  });
});

// 取得購物車列表
const getCartList = () => {
  axios
    .get(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`
    )
    .then((res) => {
      cartData = res.data.carts;
      let str = '';
      let cartAllSum = 0;
      cartData.forEach((items) => {
        let productSum = `${items.product.price}` * `${items.quantity}`;
        cartAllSum += productSum;
        let cartDataInfo = `<tbody>
        <tr>
          <td>
            <div class="d-flex align-items-center">
              <img src="${
                items.product.images
              }" alt="" class="mr-4" style="width: 80px; height: 80px;">
              <p>${items.product.title}</p>
            </div>
          </td>
          <td>NT$${toThousand(items.product.price)}</td>
          <td>
          <div class="d-flex align-items-center">
            <a href="" class="icon-edit material-icons mr-2 font-weight-bold"  data-id="${
              items.id
            }">remove<a>
                ${items.quantity}
                <a href="" class="icon-edit material-icons ml-2 font-weight-bold" data-id="${
                  items.id
                }">add</a>
          </div>
        </td>
          <td>NT$${toThousand(productSum)}</td>
          <td class="delcardBtn text-center">
      
            <a href="" class="material-icons" data-id="${items.id}">clear</a>
          </td>
        </tr>
      </tbody> 
      `;
        str += cartDataInfo;
      });
      cartList.innerHTML = str;
      jsCartSum.textContent = `NT$${toThousand(cartAllSum)}`;
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
  let numCheck = 1;

  cartData.forEach((items) => {
    if (items.product.id === productId) {
      numCheck = items.quantity += 1;
    }
  });

  addCartProduct(productId, numCheck);
});
// 加入購物車 AIP 請求
const addCartProduct = (productId, numCheck) => {
  axios
    .post(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`,
      {
        data: {
          productId: productId,
          quantity: numCheck,
        },
      }
    )
    .then((res) => {
      alert('加入購物車成功');
      getCartList();
    })
    .catch((error) => {
      console.log(error);
    });
};

// 刪除 API 請求
const deleteSingleCartData = (cartId) => {
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
};
// 編輯購物車產品數量 API 請求
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

// 刪除、修改數量購物車內的特定產品
cartList.addEventListener('click', (e) => {
  e.preventDefault();
  let cartId = e.target.getAttribute('data-id');
  // 刪除購物車單筆資料
  if (e.target.textContent === 'clear') {
    deleteSingleCartData(cartId);
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
      alert('刪除所有購物車商品成功');
      getCartList();
    })
    .catch((error) => {
      console.log(error);
      alert('目前你尚未加入購物車品項');
    });
});
const deleteAllCartProduct = () => {};

// 訂單驗證欄位
const form = document.querySelector('.myForm');
const inputs = document.querySelectorAll('input[name]');

const constraints = {
  姓名: {
    presence: {
      message: '必填',
    },
  },

  電話: {
    presence: {
      message: '必填',
    },

    length: {
      minimum: 8,
      message: '需要超過 8 碼',
    },
  },
  信箱: {
    presence: {
      message: '必填',
    },
    email: {
      message: '請填寫 Email 格式',
    },
  },
  寄送地址: {
    presence: {
      message: '必填',
    },
  },
  交易方式: {
    presence: {
      message: '必填',
    },
  },
};

inputs.forEach((item) => {
  item.addEventListener('blur', function () {
    item.nextElementSibling.textContent = '';
    let errors = validate(form, constraints) || '';

    if (errors) {
      Object.keys(errors).forEach(function (keys) {
        // console.log(document.querySelector(`[data-message=${keys}]`))
        document.querySelector(`[data-message="${keys}"]`).textContent =
          errors[keys];
      });
    }
  });
});

// 送出購買訂單
const orderListInfo = document.querySelector('.orderListInfo');
orderListInfo.addEventListener('click', (e) => {
  // 綁定表單 DOM
  const userName = document.querySelector('.userName').value;
  const userTel = document.querySelector('.userTel').value;
  const userEmail = document.querySelector('.userEmail').value;
  const userAddress = document.querySelector('.userAddress').value;
  const userPayment = document.querySelector('.userPayment').value;

  console.log(userName, userTel, userEmail, userAddress, userPayment);

  let cartLenght = document.querySelectorAll('.cartList tr').length;
  if (cartLenght == 0) {
    alert('請加入至少一個購物車商品');
    return;
  }
  if (
    userName == '' ||
    userTel == '' ||
    userEmail == '' ||
    userAddress == '' ||
    userPayment == ''
  ) {
    alert('請輸入訂單資訊！');
    return;
  }
  let data = {
    name: userName,
    tel: userTel,
    email: userEmail,
    address: userAddress,
    payment: userPayment,
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
      alert('訂單建立成功');
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
