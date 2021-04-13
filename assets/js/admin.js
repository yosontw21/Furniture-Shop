// 串接API資訊
const api_path = 'yosontw';
const token = 'QMfXRUIXEth2UZXtzGC5QuCIiYt2';

// 綁定 DOM
const jsUserOrderInfo = document.querySelector('.jsUserOrderInfo');

//資料初始化
let orderData = [];

// 取得訂單表
const getOrderList = () => {
  axios
    .get(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((res) => {
      orderData = res.data.orders;
      render(orderData);
      renderOrderC3(orderData);
    })
    .catch((error) => {
      console.log(error);
    });
};

// 渲染資料
const render = (orderData) => {
  let str = '';
  orderData.forEach((items) => {
    let userOrder = `<tbody class="jsUserOrderInfo">
    <tr>
      <td>${items.createdAt}</td>
      <td>
        <p>${items.user.name}</p>
        <p>${items.user.tel}</p>
      </td>
      <td>${items.user.address}</td>
      <td>${items.user.email}</td>
      <td>${items.products[0].title}</td>
      <td>2021/03/08</td>
      <td>
        <a href="" class="">未處理</a>
      </td>
      <td><input type="button" class="btn btn-danger border-radius-0" value="刪除" data-id="${items.id}"></td>
    </tr>
  </tbody>`;
    str += userOrder;
  });
  jsUserOrderInfo.innerHTML = str;
};

// C3.js
const renderOrderC3 = () => {
  let totalObj = {};
  orderData.forEach((items) => {
    items.products.forEach((productItems) => {
      if (totalObj[productItems.category] == undefined) {
        totalObj[productItems.category] = productItems.price;
      } else {
        totalObj[productItems.category] += productItems.price;
      }
    });
  });
  console.log(totalObj);
  // [[床架: xx, ]]
  let category = Object.keys(totalObj);
  let newData = [];
  console.log(category);
  category.forEach((items) => {
    let ary = [];
    ary.push(items);
    ary.push(totalObj[items]);
    newData.push(ary);
  });
  console.log(newData);
  let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
      type: 'pie',
      columns: newData,
      colors: {
        收納: '#DACBFF',
        窗簾: '#9D7FEA',
        床架: '#5434A7',
        其他: '#301E5F',
      },
    },
  });
};

//刪除特定訂單
jsUserOrderInfo.addEventListener('click', (e) => {
  let orderId = e.target.getAttribute('data-id');
  if (orderId == null) {
    return;
  }
  deleteSingleOrder(orderId);
});
const deleteSingleOrder = (orderId) => {
  axios
    .delete(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((res) => {
      alert('刪除單筆資料成功');
      getOrderList();
    });
};

// 刪除全部訂單
const delOrderAllBtn = document.querySelector('.delOrderAllBtn');
delOrderAllBtn.addEventListener('click', (e) => {
  e.preventDefault();
  axios
    .delete(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((res) => {
      alert('刪除所有訂單成功');
      getOrderList();
    })
    .catch((error) => {
      console.log(error);
      alert('目前你尚未加入購物車品項');
    });
});

// 資料初始化
function init() {
  getOrderList();
}
init();

// 修改訂單狀態
// const editOrderInfo = (orderId) => {
//   axios
//     .put(
//       `https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders`,
//       {
//         headers: {
//           Authorization: token,
//         },
//         data: {
//           id: orderId,
//           paid: true,
//         },
//       }
//     )
//     .then((res) => {
//       console.log(res);
//     });
// };
// editOrderInfo();
