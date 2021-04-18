// 綁定 DOM
const jsUserOrderInfo = document.querySelector('.jsUserOrderInfo');

// header
const headers = {
  headers: {
    Authorization: token,
  },
};

//資料初始化
let orderData = [];

// 取得訂單表 API
const getOrderList = () => {
  axios
    .get(`${apiAdmin}/${api_path}/orders`, headers)
    .then((res) => {
      orderData = res.data.orders;
      renderOrderList();
      // renderOrderC3();
      renderOrderSort();
    })
    .catch((error) => {
      console.log(error);
    });
};

// 渲染資料
const renderOrderList = () => {
  let str = '';
  orderData.forEach((items) => {
    // 組時間字串
    const timeStamp = new Date(items.createdAt * 1000);
    const thisTime = `${timeStamp.getFullYear()}/${
      timeStamp.getMonth() + 1
    }/${timeStamp.getDate()}`;

    // 組產品字串
    let productStr = '';
    items.products.forEach((productItems) => {
      productStr += `<p class="mb-2">${productItems.title}x${productItems.quantity}</p>`;
    });

    // 判斷訂單處理狀態
    let orderStatus = '';
    if (items.paid == true) {
      orderStatus = '已處理';
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
      <td>${productStr}</td>
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
  let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
      type: 'pie',
      columns: newData,
    },
    color: {
      pattern: ['#301E5F', '#5434A7', '#9D7FEA', '#DACBFF'],
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

  // 拉出資料關聯
  let originAry = Object.keys(totalObj);

  let sortAry = [];
  originAry.forEach((items) => {
    let ary = [];
    ary.push(items);
    ary.push(totalObj[items]);
    sortAry.push(ary);
  });
  // 比大小
  sortAry.sort((a, b) => {
    return b[1] - a[1];
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
  let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
      type: 'pie',
      columns: sortAry,
    },
    color: {
      pattern: ['#301E5F', '#5434A7', '#9D7FEA', '#DACBFF'],
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
      alert('修改訂單狀態成功');
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
      alert('刪除單筆資料成功');
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
    if (checkDelCustInfo() == true) {
      delSingleOrder(orderId);
      return;
    } else {
      return;
    }
  }
  // 修改訂單狀態
  if (orderClass == 'orderStatus') {
    let orderId = e.target.getAttribute('data-id');
    let status = e.target.getAttribute('data-status');
    // 是否已處理完客戶訂單資料
    if (checkCustStatus() == true) {
      editOrderInfo(orderId, status);
      return;
    } else {
      return;
    }
  }
});

// 刪除全部訂單
const delOrderAllBtn = document.querySelector('.delOrderAllBtn');
delOrderAllBtn.addEventListener('click', (e) => {
  e.preventDefault();
  // 是否要刪除所有客戶訂單資料確認
  if (checkDelCustAllInfo() == true) {
    axios
      .delete(`${apiAdmin}/${api_path}/orders`, headers)
      .then((res) => {
        alert('刪除所有訂單成功');
        getOrderList();
      })
      .catch((error) => {
        console.log(error);
        alert('目前沒有客戶訂單資料');
      });
  }
});

// 資料初始化
function init() {
  getOrderList();
}
init();
