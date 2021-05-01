import {fnDelCustInfo} from './module.js';
import {fnProcessCustInfo} from './module.js';
import {fnDelCustAllCust} from './module.js';

// 綁定 DOM
const jsUserOrderInfo = document.querySelector('.jsUserOrderInfo');
const modal = document.querySelector('#modal');
const modalBody = document.querySelector('.js-modalBody');

// header
const headers = {
  headers: {
    Authorization: token,
  },
};

// 資料初始化
let orderData = [];

// 取得訂單表 API
const getOrderList = () => {
  axios
    .get(`${apiAdmin}/${api_path}/orders`, headers)
    .then((res) => {
      orderData = res.data.orders;
      renderOrderList();
      renderOrderC3();
      renderOrderSort();
    })
    .catch((error) => {
      console.log(error);
    });
};

// 渲染資料
const renderOrderList = () => {
  let str = '';
  orderData.forEach((items, index) => {
    // 組時間字串
    const timeStamp = new Date(items.createdAt * 1000);
    const thisTime = `${timeStamp.getFullYear()}/${
      timeStamp.getMonth() + 1
    }/${timeStamp.getDate()}`;

    // 判斷訂單處理狀態
    let orderStatus = '';
    if (items.paid == true) {
      orderStatus = `<p class="text-success">已處理</p>`;
    } else {
      orderStatus = '未處理';
    }
    let userOrder = `<tbody class="jsUserOrderInfo">
    <tr>
      <td>${items.id}</td>
      <td>
        <p>${items.user.name}</p>
        <p>${items.user.tel}</p>
      </td>
      <td>${items.user.address}</td>
      <td>${items.user.email}</td>
      <td><a href="#" class="js-orderInfo text-secondary" data-toggle="modal" data-target="#modal${index}">查看訂單</a></td>
      <td>${thisTime}</td>
      <td class="js-orderStatus">
        <a href="" class="orderStatus" data-status="${items.paid}" data-id="${items.id}">${orderStatus}</a>
      </td>
      <td><input type="button" class="btn btn-danger border-radius-0" value="刪除" data-id="${items.id}"></td>
    </tr>
  </tbody>`;
    str += userOrder;
  });
  jsUserOrderInfo.innerHTML = str;
  // 綁訂定單DOM
  const singleOrderList = document.querySelectorAll('.js-orderInfo');
  singleOrderList.forEach((items) => {
    items.addEventListener('click', checkOrderList, false);
  });
};

// 點擊訂單
const checkOrderList = (e) => {
  let index = e.target.dataset.target.slice(-1);

  modal.id = `modal${index}`;
  let strModalBody = '';
  let strModalFooter = '';

  orderData[index].products.forEach((items) => {
    strModalBody += `<li class="row align-items-center mb-3">
  <span class="col-9 col-md-7">${items.title}</span>
  <span class="col-3 col-md-2">x ${items.quantity}</span>
  <span class="col-md-3 d-none d-md-block">NT$${toThousand(
    items.price * items.quantity
  )}</span>
  </li>`;
    strModalFooter = `<div class="border-top border-secondary-light text-right pt-3 mt-4 font-sm">總金額<span class="ml-3">NT$${toThousand(
      orderData[index].total
    )}</span></div>`;
  });

  modalBody.innerHTML = strModalBody + strModalFooter;
};

// 顯示 C3 圖表
const renderOrderC3 = () => {
  let totalObj = {};
  orderData.forEach((items) => {
    items.products.forEach((productItems) => {
      if (totalObj[productItems.category] == undefined) {
        totalObj[productItems.category] =
          productItems.quantity * productItems.price;
      } else {
        totalObj[productItems.category] +=
          productItems.quantity * productItems.price;
      }
    });
  });
  console.log(totalObj);
  let category = Object.keys(totalObj);
  let newData = [];
  category.forEach((items) => {
    let ary = [];
    ary.push(items);
    ary.push(totalObj[items]);
    newData.push(ary);
  });
  c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
      type: 'pie',
      columns: newData,
    },
    color: {
      pattern: ['#b67900', '#ecab2a', '#ffd788', '#b1a389'],
    },
  });
};

// 排序 C3 圖表 3比以上統整為 其他
const renderOrderSort = () => {
  // 資料收集
  let totalObj = {};
  orderData.forEach((items) => {
    items.products.forEach((productItems) => {
      if (totalObj[productItems.title] == undefined) {
        totalObj[productItems.title] =
          productItems.quantity * productItems.price;
      } else {
        totalObj[productItems.title] +=
          productItems.quantity * productItems.price;
      }
    });
  });

  // C3資料關聯
  let originAry = Object.keys(totalObj);

  let sortAry = [];
  originAry.forEach((items) => {
    let ary = [];
    ary.push(items);
    ary.push(totalObj[items]);
    sortAry.push(ary);
  });
  // 比大小，由大到小，前三高的品項當作主要色塊，把其餘品項加總到一個色塊
  sortAry.sort((low, high) => {
    return high[1] - low[1];
  });
  // 超過 4 筆以上，顯示其他
  if (sortAry.length > 3) {
    let otherTotal = 0;
    let deleteSortLen = sortAry.length - 1;
    sortAry.forEach((items, index) => {
      if (index > 2) {
        otherTotal += sortAry[index][1];
      }
    });
    sortAry.splice(3, deleteSortLen);
    sortAry.push(['其他', otherTotal]);
  }
  c3.generate({
    bindto: '#chartSum', // HTML 元素綁定
    data: {
      type: 'pie',
      columns: sortAry,
    },
    color: {
      pattern: ['#b67900', '#ecab2a', '#ffd788', '#b1a389'],
    },
  });
};

// 修改訂單狀態 API
const editOrderInfo = (orderId, status) => {
  let newStatus;
  if (status == true) {
    newStatus = false;
  } else {
    newStatus = true;
  }
  axios
    .put(
      `${apiAdmin}/${api_path}/orders`,
      {
        data: {
          id: orderId,
          paid: newStatus,
        },
      },
      headers
    )
    .then((res) => {
      getOrderList();
    })
    .catch((error) => {
      console.log(error);
    });
};

//刪除特定訂單 API
const delSingleOrder = (orderId) => {
  axios
    .delete(`${apiAdmin}/${api_path}/orders/${orderId}`, headers)
    .then((res) => {
      getOrderList();
    })
    .catch((error) => {
      console.log(error);
    });
};
// 刪除修改訂單資料
jsUserOrderInfo.addEventListener('click', (e) => {
  e.preventDefault();
  let orderClass = e.target.getAttribute('class');
  let orderValue = e.target.value;
  // 刪除訂單
  if (orderValue == '刪除') {
    let orderId = e.target.getAttribute('data-id');
    // 是否要刪除客戶訂單資料確認
    const checkDelCustInfo = () => {
      fnDelCustInfo(delSingleOrder, orderId);
    };
    checkDelCustInfo();
  }
  // 修改訂單狀態
  if (orderClass == 'orderStatus') {
    let orderId = e.target.getAttribute('data-id');
    let status = e.target.getAttribute('data-status');
    // 是否已處理完客戶訂單資料
    const checkProcessCustInfo = () => {
      fnProcessCustInfo(editOrderInfo, orderId, status);
    };
    checkProcessCustInfo();
  }
});

// 刪除全部客戶訂單 API
const delOrderAllApi = () => {
  if (orderData.length == 0) {
    Swal.fire('目前沒有客戶訂單資料');
  }
  axios
    .delete(`${apiAdmin}/${api_path}/orders`, headers)
    .then((res) => {
      getOrderList();
    })
    .catch((error) => {
      console.log(error);
    });
};

// 刪除全部客戶訂單
const delOrderAllBtn = document.querySelector('.delOrderAllBtn');
delOrderAllBtn.addEventListener('click', (e) => {
  e.preventDefault();
  // 是否要刪除所有客戶訂單資料確認
  const checkDelAllCust = () => {
    fnDelCustAllCust(delOrderAllApi);
  };
  checkDelAllCust();
});

// 資料初始化
function init() {
  getOrderList();
}
init();
