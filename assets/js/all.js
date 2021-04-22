import {fnAddCart} from './module.js';
import {fnDelSingleCart} from './module.js';
import {fnDelAllCart} from './module.js';
import {fnOrderList} from './module.js';

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
    .get(`${api}/${api_path}/products`)
    .then((res) => {
      productData = res.data.products;
      console.log(productData);
      renderProductData(productData);
    })
    .catch((error) => {
      console.log(error);
    });
};

// 渲染資料
const renderProductData = (productData) => {
  let str = '';
  productData.forEach((items) => {
    let productInfo = `<li class="col-md-3 position-relative mb-7 ">
    <img src="${
      items.images
    }" alt="" class="bg-cover w-100" style="height: 302px;">
  <div class="card-product">新品</div>
  <input type="button" class="addCartProduct checkCartAdd w-100 py-3 text-white text-center mb-2" data-id="${
    items.id
  }" value="加入購物車">
  <div>
    <h3 class="font-md">${items.title}</h3>
    <del class="font-md">NT$${toThousand(items.origin_price)}</del>
    <p class="font-xl">NT$${toThousand(items.price)}</p>
  </div>
</li>`;
    str += productInfo;
  });
  productList.innerHTML = str;
};

// 篩選產品
productCategory.addEventListener('change', (e) => {
  let productSingle = [];
  productData.forEach((items) => {
    if (e.target.value == items.category) {
      productSingle.push(items);
      renderProductData(productSingle);
    }
    if (e.target.value == '全部') {
      renderProductData(productData);
    }
  });
});

// 購物車渲染資料
const renderCartList = () => {
  let str = '';
  let cartSum = 0;
  cartData.forEach((items) => {
    let productSum = items.product.price * items.quantity;
    let cartListInfo = `<tbody>
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
            }" >add</a>
      </div>
    </td>
      <td>NT$${toThousand(productSum)}</td>
      <td class="delcardBtn text-center">
  
        <a href="" class="material-icons" data-id="${items.id}">clear</a>
      </td>
    </tr>
  </tbody>`;
    str += cartListInfo;
    cartSum += productSum;
  });
  cartList.innerHTML = str;
  jsCartSum.textContent = `NT$${toThousand(cartSum)}`;
};

// 取得購物車列表 API
const getCartList = () => {
  axios.get(`${api}/${api_path}/carts`).then((res) => {
    cartData = res.data.carts;
    renderCartList();
  });
};

// 加入購物車
productList.addEventListener('click', (e) => {
  let addCartClass = e.target.nodeName;
  if (addCartClass !== 'INPUT') {
    return;
  }

  let productId = e.target.getAttribute('data-id');
  let checkNum = 1;

  cartData.forEach((items) => {
    if (productId == items.product.id) {
      checkNum += items.quantity;
    }
  });
  const checkAddCart = () => {
    fnAddCart(addCartProduct, productId, checkNum);
  };
  checkAddCart();
});

// 加入購物車 AIP 請求
const addCartProduct = (productId, checkNum) => {
  axios
    .post(`${api}/${api_path}/carts`, {
      data: {
        productId: productId,
        quantity: checkNum,
      },
    })
    .then((res) => {
      console.log(res);
      getCartList();
    })
    .catch((error) => {
      console.log(error);
    });
};

// 編輯購物車產品數量 API 請求
const editCartNum = (cartId, editNum) => {
  axios
    .patch(`${api}/${api_path}/carts`, {
      data: {
        id: cartId,
        quantity: editNum,
      },
    })
    .then((res) => {
      console.log(res);
      getCartList();
    })
    .catch((error) => {
      console.log(error);
    });
};

// 刪除 API 請求
const deleteSingleCart = (cartId) => {
  axios
    .delete(`${api}/${api_path}/carts/${cartId}`)
    .then((res) => {
      console.log(res);
      getCartList();
    })
    .catch((error) => {
      console.log(error);
    });
};

// 刪除、修改數量購物車內的特定產品
cartList.addEventListener('click', (e) => {
  e.preventDefault();
  let cartId = e.target.getAttribute('data-id');
  let textTarget = e.target.textContent;

  // 刪除購物車單筆資料
  if (textTarget === 'clear') {
    // 是否要刪除單筆購物車資料確認
    const checkDelSingleCart = () => {
      fnDelSingleCart(deleteSingleCart, cartId);
    };
    checkDelSingleCart();
  }

  // 增加購物車數量
  if (textTarget === 'add') {
    let editNum = 1; // 初始化購物車數輛
    cartData.forEach((items) => {
      if (items.id === cartId) {
        editNum = items.quantity += 1;
      }
    });
    editCartNum(cartId, editNum);
  }

  // 減少購物車數量
  if (textTarget === 'remove') {
    let editNum = 1; // 初始化購物車數輛
    cartData.forEach((items) => {
      if (items.id === cartId) {
        editNum = items.quantity -= 1;
      }
    });
    if (editNum < 1) {
      Swal.fire('商品數量不得少於1', '', 'warning');
      return;
    }
    editCartNum(cartId, editNum);
  }
});

// 清除購物車內全部產品 API
const delOrderProduct = () => {
  if (cartData.length == 0) {
    Swal.fire('您尚未加入購物車品項');
  }
  axios
    .delete(`${api}/${api_path}/carts/`)
    .then((res) => {
      console.log(res);
      getCartList();
    })
    .catch((error) => {
      console.log(error);
    });
};
// 清除購物車內全部產品
const delOrderAllBtn = document.querySelector('.delOrderAllBtn');
delOrderAllBtn.addEventListener('click', (e) => {
  e.preventDefault();
  //　是否要刪除全部購物車確認
  const checkDelAllCart = () => {
    fnDelAllCart(delOrderProduct);
  };
  checkDelAllCart();
});

// 送出購買訂單
const orderListInfo = document.querySelector('.orderListInfo');
orderListInfo.addEventListener('click', (e) => {
  e.preventDefault();
  // 綁定表單 DOM
  const userName = document.querySelector('.userName').value;
  const userTel = document.querySelector('.userTel').value;
  const userEmail = document.querySelector('.userEmail').value;
  const userAddress = document.querySelector('.userAddress').value;
  const userPayment = document.querySelector('.userPayment').value;

  let cartLength = document.querySelectorAll('.cartList tr').length;
  if (cartLength == 0) {
    Swal.fire('請輸入至少一個購物車商品', '', 'warning');
    return;
  }
  if (
    userName == '' ||
    userTel == '' ||
    userEmail == '' ||
    userAddress == '' ||
    userPayment == '請選擇'
  ) {
    Swal.fire('請輸入訂單資訊！', '', 'warning');
    return;
  }
  let data = {
    name: userName,
    tel: userTel,
    email: userEmail,
    address: userAddress,
    payment: userPayment,
  };
  //是否送出訂單確認
  const checkOrderList = () => {
    fnOrderList(createOrder, data);
  };
  checkOrderList();
});

// 送出訂單 API 請求
const createOrder = (items) => {
  axios
    .post(`${api}/${api_path}/orders`, {
      data: {
        user: {
          name: items.name,
          tel: items.tel,
          email: items.email,
          address: items.address,
          payment: items.payment,
        },
      },
    })
    .then((res) => {
      form.reset();
      getCartList();
      console.log(res);
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
