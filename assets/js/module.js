// 是否要加入購物車商品確認
export function fnAddCart(addCartProduct, productId, checkNum) {
  Swal.fire({
    title: '要把這筆商品加入購物車嗎 ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '確定',
    cancelButtonText: '取消',
  }).then((result) => {
    if (result.value) {
      Swal.fire('加入購物車成功', '', 'success');
      addCartProduct(productId, checkNum);
    }
  });
}

// 是否要刪除單筆購物車資料確認
export function fnDelSingleCart(deleteSingleCart, cartId) {
  Swal.fire({
    title: '要把這筆商品從購物車刪除嗎 ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '確定',
    cancelButtonText: '取消',
  }).then((result) => {
    if (result.value) {
      Swal.fire('您已刪除購物車單筆商品', '', 'success');
      deleteSingleCart(cartId);
    }
  });
}

//　是否要刪除全部購物車確認
export function fnDelAllCart(delOrderProduct) {
  Swal.fire({
    title: '請注意!! 要把所有購物車商品全部刪除嗎 ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '確定',
    cancelButtonText: '取消',
  }).then((result) => {
    if (result.value) {
      Swal.fire('您已清除購物車所有商品', '', 'success');
      delOrderProduct();
    }
  });
}

// 是否送出訂單確認
export function fnOrderList(createOrder, data) {
  Swal.fire({
    title: '確定要送出這筆訂單資訊嗎 ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '確定',
    cancelButtonText: '取消',
  }).then((result) => {
    if (result.value) {
      Swal.fire('您已成功送出定單', '', 'success');
      createOrder(data);
    }
  });
}

// 是否要刪除客戶訂單資料確認
export function fnDelCustInfo(delSingleOrder, orderId) {
  Swal.fire({
    title: '確定要刪除這筆客戶訂單資料嗎 ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '確定',
    cancelButtonText: '取消',
  }).then((result) => {
    if (result.value) {
      Swal.fire('刪除客戶訂單成功', '', 'success');
      delSingleOrder(orderId);
    }
  });
}

// 是否已處理完客戶訂單資料
export function fnProcessCustInfo(editOrderInfo, orderId, status) {
  Swal.fire({
    title: '確定已處理完客戶訂單資料了嗎 ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '確定',
    cancelButtonText: '取消',
  }).then((result) => {
    if (result.value) {
      Swal.fire('修改客戶訂單狀態成功', '', 'success');
      editOrderInfo(orderId, status);
    }
  });
}

// 是否要刪除所有客戶訂單資料確認
export function fnDelCustAllCust(delOrderAllApi) {
  Swal.fire({
    title: '請注意!! 要把所有客戶訂單資料全部刪除嗎 ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '確定',
    cancelButtonText: '取消',
  }).then((result) => {
    if (result.value) {
      Swal.fire('您已清除所有客戶訂單資料', '', 'success');
      delOrderAllApi();
    }
  });
}
